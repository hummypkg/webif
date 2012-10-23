
$(document).bind('pageinit', function() {
	$('div.status').last().load('/cgi-bin/status.jim', function() {
		$(this).slideDown('slow');
	});
});

