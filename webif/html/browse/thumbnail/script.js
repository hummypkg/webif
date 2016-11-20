
$(document).ready(function() {

var dir = $('#dir').text();
var file = $('#file').text();

$('button').button();

function go(pos)
{
	window.location.href = '/browse/thumbnail/?file=' +
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
	window.location.href = '/go/browse?dir=' +
	    encodeURIComponent(dir);
});

$('button.usethm').disable().on('click', function(e) {
	e.preventDefault();
	var pos = $(this).attr('pos');
	$('button,input').disable();
	$.get('/browse/thumbnail/set.jim',
	    {
		'file':	file,
		'pos':  pos
	    }, function() {
		window.location.href = '/go/browse?dir=' +
		    encodeURIComponent(dir);
	});;
});

$.get('/browse/thumbnail/mkrange.jim',
    {
	'file':	file,
	's':    $('#start').text(),
	'e':    $('#end').text()
    }, function() {
	$('img.bmp').each(function(i) {
		var pos = $(this).attr('pos');
		$(this).attr('src',
		    '/browse/thumbnail/fetch.jim?file=' +
		    encodeURIComponent(file) + '&pos=' + pos);
	});
	$('button').enable();
});

});

