
$(function() {

$('button').button();

$('#synopsis').iphoneStyle({
	checkedLabel: 'YES',
	uncheckedLabel: 'NO'
}).bind('change', function() {
	if ($(this).attr('checked'))
		$('.synopsis').show();
	else
		$('.synopsis').hide();
});

$('#listview').bind('click', function() {
	var service = $(this).attr('service');
	window.location.href = '/epg/xservice.jim?service=' + service;
});

$('table.weekview').freezeHeader();

});

