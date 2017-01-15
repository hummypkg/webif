function page_refresh(msg)
{
        if (!msg)
                msg = 'Refreshing page...';
        $.blockUI({
                message: '<h1><img src=/img/spin.gif> ' + msg + '</h1>'
        });
        window.location.reload(true);
}

function dirname(path)
{
	return path.replace(/\/[^\/]*$/, '');
}

function load()
{
	$('#isloading').show();
	$.getJSON('fetch.jim', function(data) {
		$('#queuetab > tbody').empty();

		$('#autolast').html(data.autolast);
		$('#autofreq').html(data.autofreq);

		data = data.data;

		$.each(data, function(k, v) {

	s = '<tr>' +
	'<td><input type=checkbox class=qid status=' + v.status +
	    ' value=' + v.qid + '>' +
	    v.qid + '</td>' +
	'<td>' + v.submitted + '</td>' +
	'<td><a href=# class=file>' + v.file + '</a></td>' +
	'<td>' + v.action + ' ' + v.args + '</td>' +
	'<td class="status ' + v.status + '">' + v.status;
	if (v.status == 'RUNNING')
		s += ' &nbsp;<img class=va src=/img/spin.gif>';
	if ((v.status == 'DEFER' || v.status == 'PENDING') && v.start != '0')
		s += ' &nbsp;(' + v.start + 's)';
	s += '</td><td>';
	if (v.runtime != '0')
		s += v.runtime;
	s += '</td>' +
	'<td class=queuelog>' + v.log + '</td>' +
	'<td>' + v.last + '</td>' +
	'</tr>';

			$('#queuetab > tbody').append(s);
		});

		if (data.length > 0)
		{
			$('#nodata').hide();
			$('#queuetab').show();
			$('.needsdata').enable();
		}
		else
		{
			$('#nodata').show();
			$('#queuetab').hide();
			$('.needssel,.needsdata').disable();
		}

		var resort = true;
		$('#queuetab').trigger('update', [resort]);
		$('input.qid:checkbox').prop('checked', false).enable();

		$('tr').each(function() {
			var status = $(this).find('td.status').text();

			if (status == 'RUNNING')
				$(this).find('input.qid:checkbox').disable();
		});

		$('input.qid').first().trigger('change');
		$('#loading,#isloading').hide('slow');
	});
}

$(function() {

$('table')
    .tablesorter({
	sortList: [[0,1]],
	theme: 'webif',
	widthFixed: false,
	widgets: ['zebra', 'stickyHeaders']
    });

load();

$('#queuetab').on('change', 'input.qid', function() {
	var num = $('input.qid:checked').size();
	if (num)
		$('.needssel').enable();
	else
		$('.needssel').disable();
}).first().trigger('change');

$('#qdelete').button({icons:{primary:"ui-icon-trash"}});
$('#qresubmit').button({icons:{primary:"ui-icon-refresh"}});
$('#qhold').button({icons:{primary:"ui-icon-pause"}});

$('button.submit').on('click', function() {
	var name = $(this).text();
	var act = $(this).attr('act');

	$(this).dojConfirmAction({
		question: name + ' selected?',
		yesAnswer: 'Yes',
		cancelAnswer: 'No'
		}, function(el) {
			$.blockUI({
		message: '<h1><img src=/img/spin.gif> Processing... </h1>'
			});

			var slots = $('input.qid:checked').map(function() {
				return this.value;
			}).get();
			$.get('update.jim', {
				act: act,
				slot: slots.join(',')
			}, function() {
				$.unblockUI();
				load();
			});
    });
});


$('#selnone').button({icons:{primary:"ui-icon-close"}})
    .on('click', function() {
	$('#queuetab input:checkbox').prop('checked', false).trigger('change');
});

$('#selall').button({icons:{primary:"ui-icon-star"}})
    .on('click', function() {
	$('#queuetab input:checkbox').prop('checked', true).trigger('change');
});

$('#selcomplete').button({icons:{primary:"ui-icon-check"}})
    .on('click', function() {
	$('#queuetab input:checkbox[status="COMPLETE"]').prop('checked', true)
	    .trigger('change');
});

$('#refresh').button({icons:{primary:"ui-icon-refresh"}})
    .on('click', function() {
	load();
});

$('#queuetab').on('click', 'a.file', function(e) {
	e.preventDefault();
	file = $(this).html();
	window.location = '/go/browse?dir=' +
	    encodeURIComponent('{root}/' + dirname(file));
});

setInterval(load, 60000);

});

