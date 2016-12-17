function page_refresh(msg)
{
        if (!msg)
                msg = 'Refreshing page...';
        $.blockUI({
                message: '<h1><img src=/img/loading.gif> ' + msg + '</h1>'
        });
        window.location.reload(true);
}

$(function() {

$('table')
    .tablesorter({
	sortList: [[0,1]],
	theme: 'webif',
	widthFixed: false,
	widgets: ['zebra', 'stickyHeaders']
    });


$('input.qid:checkbox').prop('checked', false).enable();

$('tr').each(function() {
	var status = $(this).find('td.status').text();

	if (status == 'RUNNING')
		$(this).find('input.qid:checkbox').disable();
});

$('input.qid:checkbox').on('change', function() {
	var num = $('input.qid:checked').size();
	if (num)
		$('#qdelete').enable();
	else
		$('#qdelete').disable();
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

$('#refresh').button({icons:{primary:"ui-icon-refresh"}})
    .on('click', function() {
	page_refresh();
});

$('#selall').on('change', function() {
	$('input.qid:checkbox').prop('checked', $(this).prop('checked'));
});

setInterval(function() { page_refresh() }, 60000);

});

