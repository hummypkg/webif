
$(function() {

$('#browse').button().click(function() {
	window.location = '/browse/index.jim?dir=' +
	    encodeURIComponent($('#dir').text());
});

$('#dedup').button().click(function() {
	window.location = window.location + '&doit=1';
});

});
