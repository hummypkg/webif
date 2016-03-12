
$(function() {

$('#browse').button().click(function() {
	window.location = '/go/browse?dir=' +
	    encodeURIComponent($('#dir').text());
});

$('#dedup').button().click(function() {
	window.location = window.location + '&doit=1';
});

$('#reset').button().click(function() {
	window.location = window.location + '&reset=1';
});

});

