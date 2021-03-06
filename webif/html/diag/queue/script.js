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
	$('span.isloading').show();
	// Grey out the rows
	$('#queuetab > tbody tr').disable();
	$.getJSON('fetch.jim', function(data) {
		$('#queuetab > tbody').empty();

		$('#autolast').html(data.autolast);
		$('#autofreq').html(data.autofreq);

		data = data.data;

		$.each(data, function(k, v) {

			var $row = $('<tr>');

			$('<td>').append($('<input>', {
				'type': 'checkbox',
				'class': 'qid',
				status: v.status,
				value: v.qid
			})).append(v.qid).appendTo($row);
			$('<td>', { html: v.submitted }).appendTo($row);
			$('<td>').append($('<a>', {
				'class': 'file',
				href: '#',
				html: v.file
			})).appendTo($row);
			$('<td>', { html: v.action + ' ' + v.args })
			    .appendTo($row);

			var s = v.status;
			if (v.status == 'RUNNING')
				s += ' &nbsp;<img class=va src=/img/spin.gif>';
			if ((v.status == 'DEFER' || v.status == 'PENDING')
			    && v.start != '0')
				s += ' &nbsp;(' + v.start + 's)';

			$('<td>', {
				'class': 'status ' + v.status,
				html: s
			}).appendTo($row);

			$('<td>', {
				html: v.runtime != 0 ? v.runtime : ""
			}).appendTo($row);

			$('<td>', {
				'class': 'queuelog',
				html: v.log
			}).appendTo($row);

			$('<td>', { html: v.last }).appendTo($row);

			$('#queuetab > tbody').append($row);
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
		$('#loading,span.isloading').hide('slow');
	});
}

$(function() {

$('table')
    .tablesorter({
	sortList: [[0,1]],
	theme: 'webif',
	widthFixed: false,
	dateFormat: "ddmmyyyy",
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

$('button.refresh').button({icons:{primary:"ui-icon-refresh"}})
    .on('click', function() {
	load();
});

$('#queuetab').on('click', 'a.file', function(e) {
	e.preventDefault();
	file = $(this).html();
	if (file.includes('file://'))
		return;
	else if (file.includes('://'))
		window.location = file;
	else
		window.location = '/go/browse?dir=' +
		    encodeURIComponent('{root}/' + dirname(file));
});

setInterval(load, 60000);

});

