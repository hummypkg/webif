var handle = 0;

function update()
{
	var file = $('#params').attr('file');

	$.get('progress.jim' + '?file=' + file,
	    function(data) {
		if (handle)
			$('#progressbar').reportprogress(data);
	});
}

$(document).ready(function() {

$('#analysis').load('analyse.jim?file=' + $('#params').attr('file'),
	function(t) {
		if ($.trim(t) == '0%')
		{
			$('#output').text('Recording is already stripped.');
			$('#back').slideDown();
		}
		else
			$('#stripdiv').slideDown();
	});

$('#progressbar').reportprogress(0);

$('#back').button().click(function() {
	window.location = '/cgi-bin/browse.jim?dir=' + $('#params').attr('dir');
});

$('#stripit').button().click(function() {
	$('#stripdiv').hide('slow');
	$('#progressdiv').show('slow');
	handle = setInterval("update()", 1000);
	$('#output').text('Please do not interrupt...')
	    .load('execute.jim?file=' + $('#params').attr('file'),
	    function() {
		clearInterval(handle);
		handle = 0;
		$('#back').show();
		$('#progressbar').reportprogress(100);
	});
});

});

