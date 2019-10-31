var handle = 0;

function escapestring(str)
{
	str = JSON.stringify(String(str));
	str = str.substring(1, str.length - 1);
	return str;
}

function update()
{
	$.get('progress.jim', {
		'perc': $('#params').attr('perc'),
		'file': $('#params').attr('file')
	    }, function(data) {
		if (handle)
			$('#progressbar').reportprogress(data);
	});
}

$(function() {

$('[type="checkbox"]').iphoneStyle({
	checkedLabel: 'YES',
	uncheckedLabel: 'NO'
});

$('#progressbar').reportprogress(0);

$('#back').button().click(function() {
	window.location = '/go/browse?dir=' + $('#params').attr('dir');
});

$('#save').button({icons: {primary: "ui-icon-disk"}})
    .on('click', function() {
	$('#progressdiv,#output,#save').hide('slow');
	$.post('../bookmarks/save.jim', {
		'file': $('#fileparams').attr('file'),
		'bookmarks': $('#bookmarks').attr('val')
	}, function(data) {
		$('#results').html(data)
		    .slideDown('slow')
		    .delay(6000)
		    .slideUp('slow');
		$('#originalbookmarks')
		    .html($('#newbookmarks').clone());
	});
});

$('#cropit').button().click(function() {
	$('#cropdiv').hide('slow');
	$('#progressdiv').show('slow');
	$('#back').hide();
	handle = setInterval("update()", 1000);
	$('#output').show().text('Please do not interrupt...')
	    .load('execute.jim', {
		'file': $('#params').attr('file'),
		'invert': $('#invert').attr('invert')
	    }, function() {
		clearInterval(handle);
		handle = 0;
		$('#back,#save').show();
		$('#cutplan').html('File cropping complete');
		$('#originalbookmarks').empty();
		$('#progressbar').reportprogress(100);
		if ($('#saveit').prop('checked'))
		{
			$('#save').trigger('click');
			$('#progressdiv')
			    .delay(3000)
			    .text('Cropping complete.');
		}
	});
});

$('#invert').button().on('click', function() {
	window.location = 'crop.jim?file=' +
	    escapestring($('#params').attr('file')) +
	   '&invert=' + ($(this).attr('invert') == '1' ? '0' : '1');
});

});

