var handle = 0;

function update()
{
	var perc = $('#params').attr('perc');
	var file = $('#params').attr('file');

	$.get('progress.jim' + '?perc=' + perc + '&file=' + file,
	    function(data) {
		if (handle)
			$('#progressbar').reportprogress(data);
	});
}

$(document).ready(function() {

$('#progressbar').reportprogress(0);

$('#back').button().click(function() {
	window.location = '/go/browse?dir=' + $('#params').attr('dir');
});

$('#cropit').button().click(function() {
	$('#cropdiv').hide('slow');
	$('#progressdiv').show('slow');
	$('#back').hide();
	handle = setInterval("update()", 1000);
	$('#output').show().text('Please do not interrupt...')
	    .load('execute.jim?file=' + $('#params').attr('file') +
	    '&invert=' + $('#invert').attr('invert'),
	    function() {
		clearInterval(handle);
		handle = 0;
		$('#back').show();
		$('#progressbar').reportprogress(100);
	});
});

$('#invert').button().on('click', function() {
	window.location = 'crop.jim?file=' + $('#params').attr('file') +
	   '&invert=' + ($(this).attr('invert') == '1' ? '0' : '1');
});

});

