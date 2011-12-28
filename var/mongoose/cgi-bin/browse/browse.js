(function($)
{
	$.fn.enable = function()
	{
		return this.each(function() {
			$(this)
			    .removeClass('ui-state-disabled')
			    .removeProp('disabled');
		});
	};

	$.fn.disable = function()
	{
		return this.each(function() {
			$(this)
			    .addClass('ui-state-disabled')
			    .prop('disabled', true);
		});
	};
})(jQuery);

function disableall()
{
	$('button,a,input').disable();
}

function reloadclipboard()
{
	$('#clipboard')
	    .empty()
	    .html('<img src=/img/loading.gif> <i>Loading...</i>')
	    .load('/cgi-bin/browse/clipboard.jim', function() {

// Start Clipboard post-load actions

$('#clipclear').button().click(function() {
	$.get('/cgi-bin/browse/clipboard.jim?act=clear', function() {
		reloadclipboard();
	});
});

$('a.clipdel').click(function() {
	$.get('/cgi-bin/browse/clipboard.jim?act=remove&path=' +
	    $(this).attr('path'), function() {
		reloadclipboard();
	});
});

// End Clipboard post-load actions

	});
}

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
	//console.log("Folder: (%s) = (%s)", folder, cnt);
	$('#img' + folder).attr('src', '/img/Folder_New.png');
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
	var url = '/cgi-bin/browse/delete.jim?file=' + file +
	    '&type=' + type;
	$(results)
	    .html('<img src=/img/loading.gif>Deleting, please wait...')
	    .slideDown('slow')
	    .load(url, function() {
		$(el).delay(3000).slideUp(300, function() {
			$(el).remove();
		});
	});
}

function lock_callback(file, type, id)
{
	var url = '/cgi-bin/browse/lock.jim?file=' + file;
	$.get(url, function() { window.location.reload(true); });
}

function enc_callback(file, type, id)
{
	var url = '/cgi-bin/browse/enc.jim?file=' + file;
	$.get(url, function() { window.location.reload(true); });
}

function new_callback(file, type, id)
{
	var url = '/cgi-bin/browse/new.jim?file=' + file;
	$.get(url, function() { window.location.reload(true); });
}

function rename_submit()
{
	var s = $('#renameform_form').serialize();
	$.get('/cgi-bin/browse/rename.jim?' + s,
	    function() { window.location.reload(true); });
}

function drename_submit()
{
	var s = $('#drenameform_form').serialize();
	$.get('/cgi-bin/browse/rename.jim?' + s,
	    function() { window.location.reload(true); });
}

function savestream_submit()
{
	var s = $('#savestream_form').serialize();
	var sf = $('#save_stream').attr('file');
	$('#savestream_spin').show();
	$.get('/cgi-bin/browse/savestream.jim?sfile=' +
	    encodeURIComponent(sf) + '&' + s,
	    function() {
		window.location.reload(true);
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
	    '<i>' + decodeURIComponent(bfile) + '</i> ?'
	);
	$confirm.dialog('open');
}

function preparemenu(el, menu)
{
	if (el.attr('type') == 'ts')
	{
		if (el.attr('def') == 'HD')
		{
			$('#optmenu').enableContextMenuItems('#enc');
			if (el.attr('encd') == 1)
				$(menu).changeContextMenuItem('#enc',
				    'Remove Enc');
			else
				$(menu).changeContextMenuItem('#enc',
				    'Set Enc');
		}

		if (el.attr('bx') > 0)
			$('#optmenu').enableContextMenuItems('#crop');
		else
			$('#optmenu').disableContextMenuItems('#crop');

		$('#optmenu').enableContextMenuItems('#new');
		if (el.attr('new') == 1)
			$(menu).changeContextMenuItem('#new', 'Mark watched');
		else
			$(menu).changeContextMenuItem('#new', 'Mark new');


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

		if (el.attr('odencd') == 1)
		{
			$('#optmenu').enableContextMenuItems('#decrypt');
			$('#optmenu').disableContextMenuItems('#audio');
		}
		else
		{
			$('#optmenu').disableContextMenuItems('#decrypt');
			$('#optmenu').enableContextMenuItems('#audio');
		}
	
	}
	else
	{
		$('#optmenu').enableContextMenuItems('#delete');
		$('#optmenu').disableContextMenuItems('#lock');
		$('#optmenu').disableContextMenuItems('#enc');
		$('#optmenu').disableContextMenuItems('#new');
		$('#optmenu').disableContextMenuItems('#decrypt');
		$('#optmenu').disableContextMenuItems('#audio');
		$('#optmenu').disableContextMenuItems('#crop');
	}

}

function preparedmenu(el, menu)
{
	if (el.attr('noflat') != undefined)
	{
		if (el.attr('noflat') > 0)
			$(menu).changeContextMenuItem('#flat', 'Allow Flatten');
		else
			$(menu).changeContextMenuItem('#flat',
			    'Prevent Flatten');
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

	    case 'cut':
	    case 'copy':
		$.get('/cgi-bin/browse/clipboard.jim?act=add&mode=' + action +
		    '&path=' + file, function() {
			reloadclipboard();
		    });
		break;

	    case 'lock':
		confirm_action('change the lock on', lock_callback,
		    file, type, id);
		break;

	    case 'enc':
		confirm_action('change the ENC flag on', enc_callback,
		    file, type, id);
		break;

	    case 'new':
		confirm_action('change the New flag on', new_callback,
		    file, type, id);
		break;

	    case 'rename':
		$('#rename').val(decodeURIComponent(bfile));
		$('#renameorig').val(decodeURIComponent(file));

		$('#titleorig').val('');
		$('#renametitle').val('');
		$('#synopsis').val('');
		$('tr.tstype').css('display', 'none');

		if (type == 'ts')
		{
			$.getJSON('/cgi-bin/browse/epgtitle.jim?file=' +
			    file, epginfo_callback);
		}

		$('#renameform').dialog('open');
		break;

	    case 'download':
		window.location.href = '/cgi-bin/browse/download.jim?file=' +
		    file;
		break;

	    case 'crop':
		window.location.href = '/cgi-bin/browse/crop.jim?file=' +
		    file;
		break;

	    case 'decrypt':
		window.location.href = '/cgi-bin/browse/decrypt.jim?file=' +
		    file;
		break;

	    case 'audio':
		window.location.href = '/cgi-bin/browse/audio.jim?file=' +
		    file;
		break;

	    default:
		alert('Unhandled action: ' + action);
		break;
	}
};

var dmenuclick = function(action, el, pos)
{
	var direl = $(el).parent().parent();
	var file = $(el).parent().prevAll('a.dbf').last().attr('file');
	var bfile = file.replace(/.*\//g, '');
	bfile = bfile.replace(/[\x00-\x1f]+/g, '');
	var results = $(el).parent().next('div.results');

	switch (action)
	{
	    case 'delete':
		var url = '/cgi-bin/browse/delete.jim?file=' + file +
		    '&type=dir';

		if (confirm('Are you sure you wish to delete "' +
		    decodeURIComponent(file) +
		    '" and all files within it?'))
		{
			$(results)
			    .html('<img src=/img/loading.gif>' +
			    'Deleting, please wait...')
			    .slideDown('slow')
			    .load(url, function() {
				$(direl).delay(3000).slideUp(300, function() {
					$(direl).remove();
				});
			});
		}
		break;

	    case 'cut':
	    case 'copy':
		$.get('/cgi-bin/browse/clipboard.jim?act=add&mode=' + action +
		    '&path=' + file, function() {
			reloadclipboard();
		    });
		break;

	    case 'rename':
		$('#drename').val(decodeURIComponent(bfile));
		$('#drenameorig').val(decodeURIComponent(file));
		$('#drenameform').dialog('open');
		break;

	    case 'flat':
		var url = '/cgi-bin/browse/flat.jim?file=' + file;
		$.get(url, function() { window.location.reload(true); });
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

	$('img.dopt').contextMenu(
		{
			menu: 'doptmenu',
			leftButton: true,
			beforeShow: preparedmenu
		},
		dmenuclick
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
		var url = '/cgi-bin/browse/file.jim?file=' + file
		    + '&type=' + type;
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

	$('#drenameform').dialog({
		autoOpen: false,
		height: 'auto', width: 'auto',
		modal: true,
		buttons: {
			"Update": drename_submit,
			"Close": function() {
				$(this).dialog('close');
			}
		},
		close: function() { $('#drename').val(''); }
	});

	$('#savestreamform').dialog({
		autoOpen: false,
		height: 'auto', width: 'auto',
		modal: true,
		buttons: {
			"Save": savestream_submit,
			"Cancel": function() {
				$(this).dialog('close');
			}
		},
		close: function() { $('#savestream_name').val(''); }
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

	// Load clipboard
	reloadclipboard();

	// Uncheck everything
	$('input.fs:checked').attr('checked', false);

	// Buttons

	$('#dedup').button().click(function() {
		window.location = '/cgi-bin/dedup.jim?dir='
		    + encodeURIComponent(dir);
	});

	$('#save_stream').button().click(function() {
		$('#savestream_spin').hide();
		$('#savestreamform').dialog('open');
		$('#savestream_detail').load(
		    '/cgi-bin/browse/ffmpeg.jim?file=' +
		    encodeURIComponent($('#save_stream').attr('file')));
	});

	$('#selectall').click(function(e) {
		e.preventDefault();
		$('input.fs').attr('checked', true).trigger('change');
	});
	$('#deselectall').click(function(e) {
		e.preventDefault();
		$('input.fs:checked').attr('checked', false).trigger('change');
	});

	$('#join').button().disable()
	    .click(function() {
		var files = new Array();
		var els = $('input.fsts:checked + a').each(function() {
			files.push(encodeURIComponent($(this).attr('file')));
		});
		//console.log("%o", files);
		window.location.href = '/cgi-bin/browse/join.jim?files=' +
		    files.join();
	    });

	$('#delete').button().disable()
	    .click(function() {
		var files = new Array();
		var els = $('input.fs:checked + a').each(function() {
			files.push($(this).attr('file'));
		});
		//console.log("%o", files);
		var str = 'Are you sure you want to delete ' + files.length +
		    ' file';
		if (files.length != 1) str += 's';
		str += '?';
		if (confirm(str))
		{
			disableall();
			$('#deletewait').slideDown('slow');
			window.location.href =
			    '/cgi-bin/browse/mdelete.jim?dir=' +
			    encodeURIComponent(dir) + '&files=' +
		    	    files.join();
		}
	    });

	$('input.fs').change(function() {
		var num = $('input.fs:checked').size();
		if (num > 0)
			$('#delete').enable();
		else
			$('#delete').disable();
	
		var num = $('input.fsts:checked').size();
		if (num > 1)
			$('#join').enable();
		else
			$('#join').disable();

	});

});

