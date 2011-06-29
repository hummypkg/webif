
function epginfo_callback(data, status, xhr)
{
	var width = 85;

	if (status != 'success')
		return;

	//console.log(status);
	//console.dir(data);

	$('#titleorig').val(data.title);
	$('#renametitle').val(data.title);
	if (data.synopsis.length > width)
		data.synopsis = data.synopsis.substring(0, width) + '...';
	$('#synopsis').html(data.synopsis);
	$('tr.tstype').show('slow');
}

function insert_folder_size(folder, size)
{
	folder = folder.replace(/ /g, '');
	folder = folder.replace(/([ #;&,.+*~\':"!^$[\]()=>|\/@])/g, '\\$1');
	//console.log("Folder: (%s) = (%s)", folder, size);
	if (folder == "")
		$('#dirsize').text(' (' + size + 'iB)');
	else
		$('#' + folder).text(' (' + size + 'iB)');
}

function folder_size_callback(data, status, xhr)
{
	//console.log("Status: %s", status);
	//console.dir(data);
	$.each(data, insert_folder_size);
}

function set_folder_new(folder, cnt)
{
	folder = folder.replace(/ /g, '');
	folder = folder.replace(/([ #;&,.+*~\':"!^$[\]()=>|\/@])/g, '\\$1');
	console.log("Folder: (%s) = (%s)", folder, cnt);
	$('#img' + folder).attr('src', '/images/711_1_09_Media_Folder_C.png');
}

function new_folder_callback(data, status, xhr)
{
	//console.log("Status: %s", status);
	//console.dir(data);
	$.each(data, set_folder_new);
}

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
	var url = '/cgi-bin/browse/lock.jim?file=' + encodeURIComponent(file);
	$.get(url, function() { window.location.reload(true); });
}

function rename_submit()
{
	var s = $('#renameform_form').serialize();
	$.get('/cgi-bin/browse/rename.jim?' + s,
	    function() { window.location.reload(true); });
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
		$('#optmenu').enableContextMenuItems('#lock');
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


$(document).ready(function() {

var menuclick = function(action, el, pos)
{
	var file = $(el).parent().prevAll('a.bf').last().attr('file');
	var bfile = file.replace(/.*\/|\.[^.]*$/g, '');
	bfile = bfile.replace(/[\x00-\x1f]+/g, '');
	var type = $(el).attr('type');
	var id = $(el).attr('did');
	switch (action)
	{
	    case 'delete':
		confirm_action('delete', delete_callback, file,
		    type, id);
		break;

	    case 'lock':
		confirm_action('change the lock on', lock_callback,
		    file, type, id);
		break;

	    case 'rename':
		$('#rename').val(bfile);
		$('#renameorig').val(file);

		$('#titleorig').val('');
		$('#renametitle').val('');
		$('#synopsis').val('');
		$('tr.tstype').css('display', 'none');

		if (type == 'ts')
		{
			$.getJSON('/cgi-bin/browse/epgtitle.jim?file=' +
			    encodeURIComponent(file), epginfo_callback);
		}

		$('#renameform').dialog('open');
		break;

	    case 'download':
		window.location.href = file;
		break;

	    default:
		alert('Unhandled action: ' + action);
		break;
	}
};

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
	$('#optmenu').disableContextMenuItems('#title');

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

	$('#renameform').dialog({
		autoOpen: false,
		height: 'auto', width: 'auto',
		modal: true,
		buttons: {
			"Update": rename_submit,
			"Close": function() {
				$(this).dialog('close');
			}
		},
		close: function() { $('#rename').val(''); }
	});

	// Create re-usable confirmation dialogue.
	$confirm = $('#confirm').dialog({
		modal: true, autoOpen: false,
		height: 160, width: 500,
		show: 'fade', hide: 'fade',
		draggable: false, resizable: false
	});
	
	var dir = $('#dir').text();

	// Load folder sizes
	$.getJSON('/cgi-bin/browse/sizes.jim?dir=' + encodeURIComponent(dir),
		folder_size_callback);

	// Flag folders with unwatched items
	$.getJSON('/cgi-bin/browse/newdir.jim?dir=' + encodeURIComponent(dir),
		new_folder_callback);
});

