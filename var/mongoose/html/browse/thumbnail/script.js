
$(document).ready(function() {

var dir = $('#dir').text();
var file = $('#file').text();

$('button').button();

function go(pos)
{
	window.location.href = 'index.jim?file=' +
	    encodeURIComponent(file) + '&pos=' + pos;
}

$('button.mvpos').disable().on('click', function(e) {
	e.preventDefault();
	var pos = $(this).attr('pos');
	go(pos);
});

$('#repos').disable().on('click', function(e) {
	e.preventDefault();
	var pos = $('#pos').val();
	go(pos);
});

$('#back').on('click', function(e) {
	e.preventDefault();
	window.location.href = '/browse/index.jim?dir=' +
	    encodeURIComponent(dir);
});

$('button.usethm').disable().on('click', function(e) {
	e.preventDefault();
	var pos = $(this).attr('pos');
	$('button,input').disable();
	$.get('set.jim?file=' + encodeURIComponent(file) + '&pos=' + pos,
	    function() {
		window.location.href = '/browse/index.jim?dir=' +
		    encodeURIComponent(dir);
	});;
});

var start = $('#start').text();
var end = $('#end').text();
$.get('mkrange.jim?file=' + encodeURIComponent(file) +
    '&s=' + start + '&e=' + end, function() {
	$('img.bmp').each(function(i) {
		var pos = $(this).attr('pos');
		$(this).attr('src',
		    'fetch.jim?file=' + encodeURIComponent(file) +
		    '&pos=' + pos);
	});
	$('button').enable();
});

});

