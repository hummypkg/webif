var handle;
var currentpart = 0;
var stime = 0;

function xprogress()
{
	var file = $('#params').attr('file');
	var bpm = $('#params').attr('bpm');

	if (currentpart > 0)
		$.get('progress.jim?part=' + currentpart + '&file=' + file,
		    function(data) {
			if (currentpart > 0)
			{
				perc = (data / bpm) * 100 / 45;
				$('#progresspart' + currentpart)
				    .reportprogress(perc);
			}
		    });
}

function xpart(part)
{
	var parts = $('#params').attr('parts');
	var file = $('#params').attr('file');

	if (part++ < parts)
	{
		currentpart = part;
		$('#progressstat' + part)
		    .text('extracting...')
		    .addClass('blood');
		stime = new Date().getTime();
		$.get('extract.jim?parts=' + parts +
		    '&part=' + part +
		    '&file=' + file,
		    function(data) {
			var taken = (new Date().getTime() - stime) / 1000;
			$('#progressstat' + part)
			    .text('done... (' + taken + ' seconds)')
			    .removeClass('blood');
			currentpart = 0;
			$('#progresspart' + part)
			    .reportprogress(100);
			xpart(part);
		});
	}
	else
	{
		clearInterval(handle);
		$('#findiv').show('slow');
	}
}

$(function() {

$('div.progressbar').reportprogress(0);

$('#chunkit').button().click(function(e) {
	e.preventDefault();
	$('#chunkdiv').hide('slow');
	$('tr.part').show('slow');

	handle = setInterval("xprogress()", 1000);
	xpart(0);
});

$('#back').button().click(function(e) {
	e.preventDefault();
	var dir = $(this).attr('dir');

	window.location = '/cgi-bin/browse.jim?dir=' + dir;
});

});

