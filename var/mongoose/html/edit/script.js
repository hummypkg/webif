
$(function() {

var file = null;
var changed = false;

$('button').button();
$('button.editactive').disable();
$('#editor').tabsupport().disable();

function loadfile(f)
{
	if (!f)
		f = file;

	$('button.editactive').disable();
	$('#editor').disable().val('');
	$('#msg').text('Loading ' + f);
	$.get('get.jim?file=' + encodeURIComponent(f), function(data) {
		if (data.match('^>>>'))
		{
			$('#msg').text(data);
			file = null;
			changed = false;
		}
		else
		{
			$('#editor').val(data).enable();
			$('button.editactive').enable();
			$('#msg').html('Editing <i>' + f + '</i>');
			file = f;
			changed = false;
		}
	});
}

function result(msg)
{
	$('#result')
	    .html(msg)
	    .slideDown('slow')
	    .delay(5000)
	    .slideUp('slow');
}

$('#chooser').fileTree({
	root: '/',
	script: 'files.jim',
	multiFolder: false
}, function(file) {
	$('#chooserd').dialog('close');
	loadfile(file);
});

$('#chooserd').dialog({
	title: "Choose File to Edit",
	modal: true, autoOpen: false,
	height: '500', width: '600',
	draggable: true, resizable: true,
	closeOnEscape: true,
	buttons: {
		"Cancel" : function() {$(this).dialog('close');}
	}
});

$('#open').click(function() {
	$('#chooserd').dialog('open');
});

$('#editor').change(function() {
	changed = true;
});

$('#save').click(function() {
	if (!changed)
	{
		result('No changes to save.');
		return;
	}

	if (!confirm('Save file?'))
		return;
	$.post('put.jim', {
	    'file': file,
	    'data': $('#editor').val()
	}, function(data) {
		result(data);
	});
});

$('#revert').click(function() {
	if (!changed)
	{
		result('No changes to revert.');
		return;
	}
	if (!confirm('Discard changes and re-load file?'))
		return;
	loadfile();
});

$('#back').click(function() {
		window.location = '/diag/diag.jim';
	});

});

