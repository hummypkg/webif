
var handle = 0;

function update()
{
	$.get('progress.jim?file=' + $('#params').attr('rfile'),
	    function(data) {
		if (handle)
			$('#progressbar').reportprogress(data);
	});
}

$(document).ready(function() {

$('#progressbar').reportprogress(0);

$('#back').button().click(function() {
	window.location = '/cgi-bin/browse.jim?dir=' + $('#params').attr('dir');
});

$('#audioit').button().click(function() {
	$('#audiodiv').hide('slow');
	$('#progressdiv').show('slow');
	handle = setInterval("update()", 1000);
	$('#output').load('execute.jim?file=' + $('#params').attr('rfile'),
	    function() {
		clearInterval(handle);
		handle = 0;
		$('#back').show();
		$('#progressbar').reportprogress(100);
	});
});

});

