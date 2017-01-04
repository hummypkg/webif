
$('#filelist li').hover(
    function() { $(this).css('cursor', 'pointer'); },
    function() { $(this).css('cursor', 'auto'); }
);

var handle = 0;

function update()
{
	$.get('progress.jim', {
		esize: $('#back').attr('esize'),
		file: $('#back').attr('dir') + '/' + $('#dest').val()
	    }, function(data) {
		if (handle)
			$('#progressbar').reportprogress(data);
	});
}

$(document).ready(function() {

$('#progressbar').reportprogress(0);

$('#back').button().click(function() {
	window.location = '/go/browse?dir=' +
	    encodeURIComponent($(this).attr('dir'));
});

$('#filelist').sortable().disableSelection();

$('#dojoin').button().attr('disabled', true).addClass('ui-state-disabled')
    .click(function() {
	var files = $('#filelist').sortable('toArray');
	var sfiles = new Array();
	for (x in files)
		sfiles.push(encodeURIComponent(files[x]));

	$('#joindiv').hide('slow');
	$('#progressdiv').show('slow');
	$('#back').hide();
	handle = setInterval("update()", 1000);

	$('#output').text('Please do not interrupt...')
	    .load('execute.jim?files=' +
	    sfiles.join() + '&dest=' + encodeURIComponent($('#dest').val()),
	    function() {
		clearInterval(handle);
		handle = 0;
		$('#back').show();
		$('#progressbar').reportprogress(100);
	});
});

$('#dest').val('').keyup(function() {
	if ($(this).val().length > 0)
		$('#dojoin')
		    .removeProp('disabled').removeClass('ui-state-disabled');
	else
		$('#dojoin')
		    .prop('disabled', true).addClass('ui-state-disabled');
});

});

