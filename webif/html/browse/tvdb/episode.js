
$(function() {

var synopsis = $('.synopsis').text();
var words = synopsis.split(" ");
for (var i = 0;i < words.length - 1; i++)
{
	var word = words[i];
	if (word.length > 4)
		$('table.results').highlight(words[i]);
}

$('button.select').button().on('click', function() {
	$tr = $(this).closest('tr');
	$.get('select.jim', {
	    file: file,
	    episode: $tr.attr('sid'),
	    s: $tr.attr('s'),
	    e: $tr.attr('e')
	}, function() {
		window.location.href = '/go/browse/?dir=' + 
		    encodeURIComponent(dir);
	});
});

$('#tvdbepsearch').button({icons:{primary:"ui-icon-search"}})
    .on('click', function() {
	window.location.href = '/browse/tvdb/episode.jim?file=' +
	    encodeURIComponent(file) + '&search=' +
	    encodeURIComponent($('#searchterm').val());
});

$('table.results')
    .tablesorter({
	theme: 'webif',
	widthFixed: false,
	sortList: [[1,1]],
	widgets: ['zebra', 'stickyHeaders']
    });

});

