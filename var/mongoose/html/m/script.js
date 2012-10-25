
$(document).bind('pageinit', function() {
	$('div.status').last().load('/cgi-bin/status.jim', function() {
		$(this).slideDown('slow');
	});
});

//$(document).delegate('#channelpage', 'pageinit', function() {
	//console.log('pageinit for channelpage');
//});

