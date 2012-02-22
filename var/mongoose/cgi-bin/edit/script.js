
$(function() {

var file = $('#filename').text();

function loadfile()
{
	$('button.afterload').disable();
	$('#editor')
	    .addClass('loading')
	    .val('Loading file...');
	$.get('get.jim?file=' + encodeURIComponent(file), function(data) {
		$('#editor')
			.removeClass('loading')
			.val(data);
		$('button.afterload').enable();
	});
}

$('#save')
	.button()
	.click(function() {
		$.post('put.jim', {
		    'file': file,
		    'data': $('#editor').val()
		}, function(data) {
			$('#result')
			    .html(data)
			    .slideDown('slow')
			    .delay(5000)
			    .slideUp('slow');
		});
	});

$('#revert')
	.button()
	.click(function() {
		loadfile();
	});

$('#back')
	.button()
	.click(function() {
		window.location = '/diag.shtml';
	});

$('#editor').tabsupport();
loadfile();

});

