
$(function() {

$('button').button();

$('#synopsis').iphoneStyle({
	checkedLabel: 'YES',
	uncheckedLabel: 'NO'
}).bind('change', function() {
	if ($(this).attr('checked'))
		$('.synopsis').slideDown();
	else
		$('.synopsis').slideUp();
});

$('#listview').bind('click', function() {
	var service = $(this).attr('service');
	window.location.href = '/epg/xservice.jim?service=' + service;
});

$('table.weekview').freezeHeader();

});

