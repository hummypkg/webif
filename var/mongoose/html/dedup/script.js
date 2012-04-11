
$(function() {

$('#browse').button().click(function() {
	window.location = '/cgi-bin/browse.jim?dir=' +
	    encodeURIComponent($('#dir').text());
});

$('#dedup').button().click(function() {
	window.location = window.location + '&doit=1';
});

});

