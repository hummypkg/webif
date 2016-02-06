
var handle = 0;

function update()
{
	$.get('progress.jim?file=' + $('#params').attr('file'),
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

$('#decryptit').button().click(function() {
	$('#decryptdiv').hide('slow');
	$('#progressdiv').show('slow');
	$('#back').hide();
	handle = setInterval("update()", 1000);
	$('#output').load('execute.jim?file=' + $('#params').attr('file'),
	    function() {
		clearInterval(handle);
		handle = 0;
		$('#back').show();
		$('#progressbar').reportprogress(100);
	});
});

});

