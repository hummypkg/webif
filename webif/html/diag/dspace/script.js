
$(function() {


$('img.tlink').hover(
    function() { $(this).css('cursor', 'pointer'); },
    function() { $(this).css('cursor', 'auto'); }
).on('click', function(e) {
        e.preventDefault();

	if ($(this).attr('src') == '/img/tree/plus.png')
	{
		$(this).attr('src', '/img/tree/minus.png');
		$(this).parent().children('div')
		    .slideDown('slow')
		    .addClass('open')
		    .removeClass('closed');
	}
	else
	{
		$(this).attr('src', '/img/tree/plus.png');
		$(this).parent().children('div')
		    .slideUp('slow')
		    .addClass('closed')
		    .removeClass('open');
	}

});

$('span.fileperc').easyPieChart({
	size: 20,
	barColor: '#00ff00',
	trackColor: '#A3A3C2',
	lineWidth: 4,
	scaleColor: false,
	lineCap: 'butt'
});

});

