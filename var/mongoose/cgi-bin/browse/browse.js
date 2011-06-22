
function delete_callback(file, type, id)
{
	var el = 'div.bf#' + id;
	var results = el + ' .results';
	var url = '/cgi-bin/browse/delete.jim?file=' +
	    encodeURIComponent(file) + '&type=' + type;
	$(results).load(url, function() {
		$(el).delay(3000).slideUp(300, function() {
			$(el).remove();
		});
	});
}

function lock_callback(file, type, id)
{
	var el = 'div.bf#' + id;
	var results = el + ' .results';
	var url = '/cgi-bin/browse/lock.jim?file=' +
	    encodeURIComponent(file);

	$(results).load(url, function() {
		$(results).delay(3000).slideUp(150);
	});
}

var $confirm;	// Populated after DOM is loaded.

function confirm_action(action, callback, file, type, id)
{
	var bfile = file.replace(/.*\/|\.[^.]*$/g, '');
	$confirm.dialog('option', 'buttons', {
		'Yes': function() { $(this).dialog('close');
			callback(file, type, id); },
		'No':  function() {$(this).dialog('close');}

	});
	$('#confirm').empty().html(
	    'Are you sure you wish to ' + action + '<br>' +
	    '<i>' + bfile + '</i> ?'
	);
	$confirm.dialog('open');
}

function preparemenu(el, menu)
{
	if (el.attr('type') == 'ts')
	{
		if (el.attr('locked') == 1)
		{
			$(menu).changeContextMenuItem('#lock', 'Unlock');
			$('#optmenu').disableContextMenuItems('#delete');
		}
		else
		{
			$(menu).changeContextMenuItem('#lock', 'Lock');
			$('#optmenu').enableContextMenuItems('#delete');
		}
	}
	else
	{
		$('#optmenu').enableContextMenuItems('#delete');
		$('#optmenu').disableContextMenuItems('#lock');
	}
}

function menuclick(action, el, pos)
{
	var file = $(el).parent().prevAll('a.bf').last().attr('file');
	var type = $(el).attr('type');
	var id = $(el).attr('did');
	switch (action)
	{
	    case 'delete':
		confirm_action('delete', delete_callback, file, type, id);
		break;

	    case 'lock':
		confirm_action('change the lock on', lock_callback,
		    file, type, id);
		break;

	    case 'download':
		window.location.href = file;
		break;

	    default:
		alert('Unhandled action: ' + action);
		break;
	}
}

$(document).ready(function() {

	// Bind context menu to opt+ image
	$('img.opt').contextMenu(
		{
			menu: 'optmenu',
			leftButton: true,
			beforeShow: preparemenu
		},
		menuclick
	);

	// Disable items which are not yet implemented.
	$('#optmenu').disableContextMenuItems('#rename,#title');

	// Create reusable dialogue.
	var $dialog = $('#dialogue').dialog({
		title: "Media Details",
		modal: false, autoOpen: false,
		height: 600, width: 700,
		show: 'scale', hide: 'fade',
		draggable: true, resizable: true,
		buttons: {
			"Close": function() {
				$(this).dialog('close');
			}
		},
		close: function(e,u) { $('#dialogue').empty().html(
		    '<img src="/img/loading.gif" alt="loading">'); }
	});

	// Bind dialogue open to filenames.
	$('a.bf').click(function(e) {
		e.preventDefault();
		var file = $(this).attr('file');
		var type = $(this).attr('type');
		var url = '/cgi-bin/browse/file.jim?file=' +
		    encodeURIComponent(file) + '&type=' + type;
		$('#dialogue').load(url);
		$dialog.dialog('open');
	});

	// Create re-usable confirmation dialogue.
	$confirm = $('#confirm').dialog({
		modal: true, autoOpen: false,
		height: 160, width: 500,
		show: 'fade', hide: 'fade',
		draggable: false, resizable: false
	});
});



