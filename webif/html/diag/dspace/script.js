
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

$('button').button();

String.prototype.toNum = function() {
	return parseInt(this, 10);
}

function alphasort(a, b)
{
	return $(a).attr('sind').toNum() > $(b).attr('sind').toNum() ? 1 : -1;
}

function sizesort(a, b)
{
	return $(a).attr('size').toNum() < $(b).attr('size').toNum() ? 1 : -1;
}

function dosort(el, fn)
{
	if ($(el).sortElements(fn).size())
		dosort(el + ' > div.dir', fn);
}

$('#sorts').on('click', function() {
	dosort('fieldset > div.dir', sizesort);
});

$('#sorta').on('click', function() {
	dosort('fieldset > div.dir', alphasort);
});


});

