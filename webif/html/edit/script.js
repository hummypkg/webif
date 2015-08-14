
var forcefile = false;

$(function() {

var file = null;
var perms = 0;
var changed = false;

$('button').button();
$('button.editactive').disable();
$('#editor').tabsupport().disable();

$('#open').button({icons: {primary: "ui-icon-folder-open"}});
$('#revert').button({icons: {primary: "ui-icon-refresh"}});
$('#save').button({icons: {primary: "ui-icon-disk"}});
$('#create').button({icons: {primary: "ui-icon-plus"}});
$('#executable').button({icons: {primary: "ui-icon-gear"}});

function loadfile(f)
{
	if (!f)
		f = file;

	$('button.editactive').disable();
	$('#editor').disable().val('');
	$('#msg').text('Loading ' + f);
	$.get('get.jim', { file: f }, function(data) {
		if (data.match('>>>.*does not exist'))
		{
			$('#msg').text(data);
			$('#editor').val('').enable();
			$('button.editactive').enable();
			file = f;
			changed = false;
		}
		else if (data.match('^>>>'))
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

			$.get('perms.jim', { file: f }, function(data) {
				perms = data;
				if (data & 0x49)
				{
					$('#msg').append(' - Executable');
					$('#executable').disable();
				}
			});
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
	window.location = $(this).attr('dst');
});

function createf_submit()
{
	var f = $('#createf_name').val();
	console.log('Creating: ' + f);

	$('#createf').dialog('close');
	$.get('create.jim', { file: f }, function(data) {
		if (data.match('^>>>'))
		{
			$('#msg').text(data);
			file = null;
			changed = false;
		}
		else
		{
			$('#editor').val('').enable();
			$('button.editactive').enable();
			$('#msg').html('Editing new file <i>' + f + '</i>');
			file = f;
			changed = false;
		}
	});
}

$('#createf').dialog({
	autoOpen: false,
	height: 'auto', width: 'auto',
	modal: true,
	buttons: {
		"Create File": createf_submit,
		"Cancel": function() {
			$(this).dialog('close');
		}
	}
});

$('#create').click(function() {
	console.log('opening dialog');
	$('#createf').dialog('open');
});

$('a.qfile').on('click', function() {
	loadfile($(this).text());
});

$('#executable').on('click', function() {
	if (!confirm('Make ' + file + ' executable?'))
		return;
	$.get('perms.jim', { file: file, op: 'x' }, function(data) {
		perms = data;
		if (data & 0x49)
		{
			$('#executable').disable();
			$('#msg').append(' - Executable');
		}
	});
});

if (forcefile)
{
	loadfile(forcefile);
	$('#open,#create,#qedit').remove();
}

});
