function page_refresh(msg)
{
        if (!msg)
                msg = 'Refreshing page...';
        $.blockUI({
                message: '<h1><img src=/img/loading.gif> ' + msg + '</h1>'
        });
        window.location.reload(true);
}

function load()
{
	$('#isloading').show('fast');
	$.getJSON('fetch.jim', function(data) {
		$('#queuetab > tbody').empty();

		$.each(data, function(k, v) {

	s = '<tr>' +
	'<td><input type=checkbox class=qid status=' + v.status +
	    ' value=' + v.qid + '>' +
	    v.qid + '</td>' +
	'<td>' + v.submitted + '</td>' +
	'<td>' + v.file + '</td>' +
	'<td>' + v.action + '</td>' +
	'<td class="status ' + v.status + '">' + v.status;
	if (v.status == 'RUNNING')
		s += ' &nbsp;<img class=va src=/img/loading.gif>';
	s += '</td><td>';
	if (v.runtime != '0')
		s += v.runtime;
	s += '</td>' +
	'<td>' + v.log + '</td>' +
	'</tr>';

			$('#queuetab > tbody').append(s);
		});
		var resort = true;
		$('#queuetab').trigger('update', [resort]);
		$('input.qid:checkbox').prop('checked', false).enable();

		$('tr').each(function() {
			var status = $(this).find('td.status').text();

			if (status == 'RUNNING')
				$(this).find('input.qid:checkbox').disable();
		});

		$('input.qid').first().trigger('change');
		$('#isloading').hide('slow');
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

$('#qdelete').button({icons:{primary:"ui-icon-trash"}})
    .on('click', function() {
	$(this).dojConfirmAction({
		question: 'Delete selected?',
		yesAnswer: 'Yes',
		cancelAnswer: 'No'
		}, function(el) {
			$.blockUI({
		message: '<h1><img src=/img/loading.gif> Deleting... </h1>'
			});

			var slots = $('input.qid:checked').map(function() {
				return this.value;
			}).get();
			$.get('delete.jim', {
				slot: slots.join(',')
			}, function() {
				page_refresh();
			});
    });

});

$('#qresubmit').button({icons:{primary:"ui-icon-refresh"}})
    .on('click', function() {
	$(this).dojConfirmAction({
		question: 'Re-submit selected?',
		yesAnswer: 'Yes',
		cancelAnswer: 'No'
		}, function(el) {
			$.blockUI({
		message: '<h1><img src=/img/loading.gif> Re-submitting... </h1>'
			});

			var slots = $('input.qid:checked').map(function() {
				return this.value;
			}).get();
			$.get('resubmit.jim', {
				slot: slots.join(',')
			}, function() {
				page_refresh();
			});
    });

});

$('#selnone').button({icons:{primary:"ui-icon-close"}})
    .on('click', function() {
	$('#queuetab input:checkbox').prop('checked', false).trigger('change');
});

$('#selall').button({icons:{primary:"ui-icon-check"}})
    .on('click', function() {
	$('#queuetab input:checkbox').prop('checked', true).trigger('change');
});

$('#selcomplete').button({icons:{primary:"ui-icon-stop"}})
    .on('click', function() {
	$('#queuetab input:checkbox[status="COMPLETE"]').prop('checked', true)
	    .trigger('change');
});

$('#refresh').button({icons:{primary:"ui-icon-refresh"}})
    .on('click', function() {
	load();
});

setInterval(load, 60000);

});

