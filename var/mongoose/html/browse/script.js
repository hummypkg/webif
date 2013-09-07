
var dir;

function disableall()
{
	$('button,a,input').disable();
}

function pastedialogue()
{
	$('#pwdialogue').dialog({
		title: "Pasting from clipboard",
		modal: true, autoOpen: true,
		height: 'auto', width: 'auto',
		show: 'scale', hide: 'fade',
		draggable: false, resizable: false,
		closeOnEscape: false,
		open: function() {
		    $('.ui-dialog-titlebar-close').hide();
		}
	});
}

function reloadclipboard()
{
	$('#clipboard')
	    .empty()
	    .html('<img src=/img/loading.gif> <i>Loading...</i>')
	    .load('/browse/clipboard.jim', function() {

// Start Clipboard post-load actions

if ($('#clipclear').length)
{
	$('#paste').enable();
	$('#doptmenu,#dooptmenu').enableContextMenuItems('#paste');
}
else
{
	$('#paste').disable();
	$('#doptmenu,#dooptmenu').disableContextMenuItems('#paste');
}

$('#clipclear').button().click(function() {
	$.get('/browse/clipboard.jim?act=clear', function() {
		reloadclipboard();
	});
});

$('a.clipdel').click(function() {
	$.get('/browse/clipboard.jim?act=remove&path=' +
	    $(this).attr('path'), function() {
		reloadclipboard();
	});
});

$('#paste').button()
    .click(function() {
	disableall();
	pastedialogue();
	$('#pwfeedback').load(
	    '/browse/clipboard.jim?act=paste&dir='
	    + encodeURIComponent(dir), function() {
		$('#pwdialogue').dialog('close');
		window.location.reload(true);
	});
});


// End Clipboard post-load actions

	});
}

function epginfo_callback(data, status, xhr)
{
	//console.log(status);
	//console.dir(data);

	if (status != 'success')
		return;

	$('#rename_title').val(data.title);
	$('#rename_synopsis').val(data.synopsis);
	$('#rename_guidance').val(data.guidance);
	$('#rename_genre').val(data.genre);

	$('tr.tstype').show('slow');
}

function insert_folder_size(folder, size)
{
	folder = folder.replace(/ /g, '');
	folder = folder.replace(/([ #;&,.+*~\':"!^$[\]()=>|\/@])/g, '\\$1');
	//console.log("Folder: (%s) = (%s)", folder, size);
	if (size.search(/\d$/) == -1)
		size += 'iB';
	else
		size += ' bytes';
	if (folder == "")
		$('#dirsize').text(' (' + size + ')');
	else
		$('#' + folder).text(' (' + size + ')');
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
	left = cnt > 99 ? 11 : (cnt > 9 ? 14 : 17);
	$('#img' + folder)
	    .attr('src', '/img/Folder_New.png')
	    .next('span.foldernum')
	    .css('left', left + 'px')
	    .text(cnt)
	    .show();
}

function new_folder_callback(data, status, xhr)
{
	//console.log("Status: %s", status);
	//console.dir(data);
	$.each(data, set_folder_new);
}

//function insert_shrunk(file, perc)
//{
//	if (perc == 0)
//	{
//		file = file.replace(/[ ]/g, '');
//		file = file.replace(/([ #;&,.+*~\':"!^$[\]()=>|\/@])/g, '\\$1');
//		//console.log("File: (%s) = (%s)", file, perc);
//		$('#sp_' + file).show();
//	}
//}

//function shrunk_callback(data, status, xhr)
//{
//	//console.log("Status: %s", status);
//	//console.dir(data);
//	$.each(data, insert_shrunk);
//}

function delete_callback(file, dir, id)
{
	var el = 'div.bf#' + id;
	var results = el + ' .results';
	$(results)
	    .html('<img src=/img/loading.gif>Deleting, please wait...')
	    .slideDown('slow')
	    .load('/browse/delete.jim', {
		'dir': dir,
		'files': [decodeURIComponent(file)]
		}, function() {
		$(el).delay(3000).slideUp(300, function() {
			$(el).remove();
		});
	});
}

function lock_callback(file, type, id)
{
	var url = '/browse/lock.jim?file=' + file;
	$.get(url, function() { window.location.reload(true); });
}

function enc_callback(file, type, id)
{
	var url = '/browse/enc.jim?file=' + file;
	$.get(url, function() { window.location.reload(true); });
}

function new_callback(file, type, id)
{
	var url = '/browse/new.jim?file=' + file;
	$.get(url, function() { window.location.reload(true); });
}

function thumbnail_callback(file, type, id)
{
	var el = 'div.bf#' + id;
	var results = el + ' .results';
	$(results)
	    .html('<img src=/img/loading.gif>Generating thumbnail, ' +
		'please wait...')
	    .slideDown('slow')
	    .load('/browse/thumbnail.jim?file=' + file)
	    .delay(3000)
	    .slideUp('slow');
	$('div.bf#' + id + ' img.opt').attr('thmok', 1);
}

function rename_submit()
{
	var s = $('#renameform_form').serialize();
	$.post('/browse/rename.jim', s,
	    function() { window.location.reload(true); });
}

function drename_submit()
{
	var s = $('#drenameform_form').serialize();
	$.get('/browse/rename.jim?' + s,
	    function() { window.location.reload(true); });
}

function aexpiry_submit()
{
	$('#aexpiry_working').slideDown('slow');
	var s = $('#aexpiry_form').serialize();
	$.get('/browse/aexpiry.jim?' + s,
	    function() { window.location.reload(true); });
}

function newdir_submit()
{
	var s = $('#newdirform_form').serialize();
	$.get('/browse/mknewdir.jim?' + s,
	    function() { window.location.reload(true); });
}

function savestream_submit()
{
	var s = $('#savestream_form').serialize();
	var sf = $('#save_stream').attr('file');
	$('#savestream_spin').show();
	$.get('/browse/savestream.jim?sfile=' +
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
//		if (el.attr('def') == 'HD')
//		{
//			$(menu).enableContextMenuItems('#enc');
//			if (el.attr('encd') == 1)
//				$(menu).changeContextMenuItem('#enc',
//				    'Remove Enc');
//			else
//				$(menu).changeContextMenuItem('#enc',
//				    'Set Enc');
//		}

		if (el.attr('bx') > 0)
			$(menu).enableContextMenuItems('#crop');
		else
			$(menu).disableContextMenuItems('#crop');

		if (el.attr('odencd') == 0)
			$(menu).enableContextMenuItems('#thm');
		else
			$(menu).disableContextMenuItems('#thm');

		if (el.attr('thmok') == 1)
			$(menu).enableContextMenuItems('#vthm');
		else
			$(menu).disableContextMenuItems('#vthm');

		$(menu).enableContextMenuItems('#strip');

		if (el.attr('rsize') > 4294967296)
			$(menu).enableContextMenuItems('#chunk');
		else
			$(menu).disableContextMenuItems('#chunk');

		$(menu).enableContextMenuItems('#new');
		if (el.attr('new') == 1)
			$(menu).changeContextMenuItem('#new', 'Mark watched');
		else
			$(menu).changeContextMenuItem('#new', 'Mark new');


		$(menu).enableContextMenuItems('#lock');
		if (el.attr('locked') == 1)
		{
			$(menu).changeContextMenuItem('#lock', 'Unlock');
			$(menu).disableContextMenuItems('#delete');
		}
		else
		{
			$(menu).changeContextMenuItem('#lock', 'Lock');
			$(menu).enableContextMenuItems('#delete');
		}

		if (el.attr('odencd') == 1 && el.attr('dlna') == 1 &&
		    el.attr('encd') == 0)
			$(menu).enableContextMenuItems('#decrypt');
		else
			$(menu).disableContextMenuItems('#decrypt');

		if (el.attr('odencd') == 1)
		{
			$(menu).disableContextMenuItems('#audio');
			$(menu).disableContextMenuItems('#mpg');
		}
		else
		{
			$(menu).enableContextMenuItems('#audio');
			if (el.attr('def') == 'HD')
				$(menu).disableContextMenuItems('#mpg');
			else
				$(menu).enableContextMenuItems('#mpg');
		}
	}
	else
	{
		$(menu).enableContextMenuItems('#delete');
		$(menu).disableContextMenuItems('#lock');
		//$(menu).disableContextMenuItems('#enc');
		$(menu).disableContextMenuItems('#new');
	}

}

function fixdmenu(el, menu, flag, tag, descr, recurse)
{
	var a = el.attr(flag);
	var b = el.attr(flag + 'r');

	if (a == undefined) a = 0;
	if (b == undefined) b = 0;

	if (a > 0)
		$(menu).changeContextMenuItem(tag, 'Disable ' + descr);
	else
		$(menu).changeContextMenuItem(tag, 'Enable ' + descr);

	if (recurse)
	{
		if (b > 0)
		{
			$(menu).changeContextMenuItem(tag + 'r',
			    'Disable Recursive ' + descr);
			$(menu).disableContextMenuItems(tag);
		}
		else
		{
			$(menu).changeContextMenuItem(tag + 'r',
			    'Enable Recursive ' + descr);
			$(menu).enableContextMenuItems(tag);
		}
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

	fixdmenu(el, menu, 'autoshrink', '#shrink', 'Auto-shrink', 1);
	fixdmenu(el, menu, 'autodedup', '#dedup', 'Auto-dedup', 0);
	fixdmenu(el, menu, 'autodecrypt', '#decrypt', 'Auto-decrypt', 1);
	fixdmenu(el, menu, 'autompg', '#mpg', 'Auto-mpg', 0);
	fixdmenu(el, menu, 'automp3', '#mp3', 'Auto-audio', 0);
	fixdmenu(el, menu, 'autoexpire', '#expire', 'Auto-expire', 0);
}

$(document).ready(function() {

dir = $('#dir').text();

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
		    dir, id);
		break;

	    case 'copy':
		if (!confirm('Are you sure? Copying recordings takes a long time!'))
			break;
		// Fallthrough
	    case 'cut':
		$.get('/browse/clipboard.jim?act=add&mode=' + action +
		    '&path=' + file, function() {
			reloadclipboard();
		    });
		break;

	    case 'lock':
		confirm_action('change the lock on', lock_callback,
		    file, type, id);
		break;

//	    case 'enc':
//		confirm_action('change the ENC flag on', enc_callback,
//		    file, type, id);
//		break;

	    case 'new':
		confirm_action('change the New flag on', new_callback,
		    file, type, id);
		break;

	    case 'rename':
		$('#rename').val(decodeURIComponent(bfile));
		$('#renamefile').val(decodeURIComponent(file));

		$('#rename_title').val('');
		$('#rename_synopsis').val('');
		$('#rename_guidance').val('');
		$('tr.tstype').css('display', 'none');

		if (type == 'ts')
		{
			$.getJSON('/browse/epgtitle.jim?file=' +
			    file, epginfo_callback);
		}

		$('#renameform').dialog('open');
		break;

	    case 'thm':
		window.location.href = '/browse/thumbnail/index.jim?file=' +
		    file;
		break;

	    case 'vthm':
//		window.open('/browse/bmpw.jim?file=' + file, 'hxwebifbmp',
//		    'height=156,width=280,toolbar=no,' +
//		    'scrollbars=no,menubar=no,location=no,titlebar=no');
		$('#thmbmp').attr('src', 'bmp.jim?file=' + file);
		$('#bmpdialogue').dialog('open');
		break;

	    case 'download':
		window.location.href = '/browse/download.jim?file=' +
		    file + '&base=' +
		    encodeURIComponent(document.URL.match(/:\/\/(.[^/]+)/)[1]);
		break;

	    case 'crop':
		window.location.href = '/browse/crop/crop.jim?file=' +
		    file;
		break;

	    case 'strip':
		window.location.href = '/browse/strip/strip.jim?file=' +
		    file;
		break;

	    case 'chunk':
		window.location.href = '/browse/chunk/chunk.jim?file=' +
		    file;
		break;

	    case 'decrypt':
		window.location.href =
		    '/browse/decrypt/decrypt.jim?file=' + file;
		break;

	    case 'audio':
		window.location.href = '/browse/audio/audio.jim?file=' +
		    file;
		break;

	    case 'mpg':
		window.location.href = '/browse/mpg/mpg.jim?file=' +
		    file;
		break;

	    default:
		alert('Unhandled action: ' + action);
		break;
	}
};

function flagdir(file, flag, iconset, output, options)
{
	var url = '/browse/flagdir.jim?dir=' + file +
		    '&flag=' + flag;

	$(output).load(url, function() {
		$(iconset)
		    .empty()
		    .html('<img src=/img/loading.gif> Updating...')
		    .load('/browse/iconset.jim?file=' + file);
		if ($(options).attr(flag) == '1')
			$(options).attr(flag, 0);
		else
			$(options).attr(flag, 1);
	}).delay(3000).slideUp();
}

var dmenuclick = function(action, el, pos)
{
	var direl = $(el).parent().parent();
	var file = $(el).parent().prevAll('a.dbf').last().attr('file');
	var iconset = $(el).parent().prevAll('span.iconset').last();
	var bfile = file.replace(/.*\//g, '');
	bfile = bfile.replace(/[\x00-\x1f]+/g, '');
	var results = $(el).parent().next('div.results');

	switch (action)
	{
	    case 'paste':
		pastedialogue();
		$('#pwfeedback').load(
		    '/browse/clipboard.jim?act=paste&dir=' +
		    file, function() {
			$('#pwdialogue').dialog('close');
			reloadclipboard();
		});
		break;

	    case 'delete':

		if (confirm('Are you sure you wish to delete "' +
		    decodeURIComponent(file) +
		    '" and all files within it?'))
		{
			$(results)
			    .html('<img src=/img/loading.gif>' +
			    'Deleting, please wait...')
			    .slideDown('slow')
			    .load('/browse/delete.jim', {
				'dir': dir,
				'files': [decodeURIComponent(file)]
				}, function() {
				$(direl).delay(3000).slideUp(300, function() {
					$(direl).remove();
				});
			});
		}
		break;

	    case 'copy':
		if (!confirm('Are you sure? Copying directories can take a very long time!'))
			break;
		// Fallthrough
	    case 'cut':
		$.get('/browse/clipboard.jim?act=add&mode=' + action +
		    '&path=' + file, function() {
			reloadclipboard();
		    });
		break;

	    case 'rename':
		$('#drename').val(decodeURIComponent(bfile));
		$('#drenameorig').val(decodeURIComponent(file));
		$('#drenameform').dialog('open');
		break;

	    case 'expire':
		if ($(el).attr('autoexpire') == 1)
			flagdir(file, 'autoexpire', iconset, results, el);
		else
		{
			$('#aexpiry_ldir').val(decodeURIComponent(file));
			if ($(el).attr('autoexpiredays') > 0)
				$('#aexpiry_days')
				     .val($(el).attr('autoexpiredays'));
			else
				$('#aexpiry_days').val(7);
			$('#aexpiry_working').hide('fast');
			$('#aexpiry').dialog('open');
		}
		break;

	    case 'flat':
		flagdir(file, 'noflatten', iconset, results, el);
		break;

	    case 'dedup':
		flagdir(file, 'autodedup', iconset, results, el);
		break;

	    case 'mpg':
		flagdir(file, 'autompg', iconset, results, el);
		break;

	    case 'mp3':
		flagdir(file, 'automp3', iconset, results, el);
		break;

	    case 'shrink':
		flagdir(file, 'autoshrink', iconset, results, el);
		break;

	    case 'shrinkr':
		flagdir(file, 'autoshrinkr', iconset, results, el);
		break;

	    case 'decrypt':
		flagdir(file, 'autodecrypt', iconset, results, el);
		break;

	    case 'decryptr':
		flagdir(file, 'autodecryptr', iconset, results, el);
		break;

	    case 'resetnew':
		var url = '/browse/resetnew.jim?dir=' + file;
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

	// Bind context menu to opt+ image
	$('img.oopt').contextMenu(
		{
			menu: 'ooptmenu',
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

	$('img.doopt').contextMenu(
		{
			menu: 'dooptmenu',
			leftButton: true,
			beforeShow: preparedmenu
		},
		dmenuclick
	);

	// Disable items which are not yet implemented.
	$('#optmenu').disableContextMenuItems('#title');

	var $buttons = {
	    "Close" : function() {$(this).dialog('close');}
	};
	var $buttonsp = $.extend(
	    {"Play" : function() { doplay(); }},
	    $buttons);

	// Create reusable dialogue.
	var $dialog = $('#dialogue').dialog({
		title: "Media Details",
		modal: false, autoOpen: false,
		height: 600, width: 700,
		show: 'scale', hide: 'fade',
		draggable: true, resizable: true,
		buttons: $buttons,
		close: function(e,u) { $('#dialogue').empty().html(
		    '<img src="/img/loading.gif" alt="loading">'); }
	});

	function doplay()
	{
		var file = $dialog.attr('file');
		var type = $dialog.attr('type');

		disableall();

		window.location = '/play/play.jim?' +
		    'dir=' + encodeURIComponent(dir) +
		    '&file=' + file;
	}

	// Bind dialogue open to filenames.
	$('a.bf').click(function(e) {
		e.preventDefault();

		var file = $(this).attr('file');
		var type = $(this).attr('type');
		var opt = $(this).nextAll('a').find('img.opt');

		var url = '/browse/file.jim?file=' + file
		    + '&type=' + type;
		$dialog.load(url);

		$dialog.attr('file', file);
		$dialog.attr('type', type);

		if (type == 'ts' &&
		    (opt.attr('odencd') == 0 || opt.attr('dlna') == 1))
			$dialog.dialog("option", "buttons", $buttonsp);
		else
			$dialog.dialog("option", "buttons", $buttons);
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

	$('#aexpiry').dialog({
		autoOpen: false,
		height: 'auto', width: 'auto',
		modal: true,
		buttons: {
			"Update": aexpiry_submit,
			"Close": function() {
				$(this).dialog('close');
			}
		},
		close: function() { $('#aexpiry_days').val('0'); }
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

	$('#bmpdialogue').dialog({
		autoOpen: false,
		height: 'auto', width: 'auto',
		modal: true,
		buttons: {
			"Close": function() {
				$(this).dialog('close');
			}
		},
		close: function() { $('#thmbmp').attr('src', 'about:blank'); }
	});

	// Create re-usable confirmation dialogue.
	$confirm = $('#confirm').dialog({
		modal: true, autoOpen: false,
		height: 160, width: 500,
		show: 'fade', hide: 'fade',
		draggable: false, resizable: false
	});

	// Load folder sizes
	$.getJSON('/browse/sizes.jim?dir=' + encodeURIComponent(dir),
		folder_size_callback);

	// Flag shrunk recordings
//	$.getJSON('/browse/shrunk.jim?dir=' + encodeURIComponent(dir),
//		shrunk_callback);

	// Flag folders with unwatched items
	$.getJSON('/browse/newdir.jim?dir=' + encodeURIComponent(dir),
		new_folder_callback);

	// Load clipboard
	reloadclipboard();

	// Uncheck everything
	$('input.fs:checked').attr('checked', false);

	// Buttons

	$('#dedup').button().click(function() {
		window.location = '/dedup/dedup.jim?dir='
		    + encodeURIComponent(dir);
	});

	$('#save_stream').button().click(function() {
		$('#savestream_spin').hide();
		$('#savestreamform').dialog('open');
		$('#savestream_detail').load(
		    '/browse/ffmpeg.jim?file=' +
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
			files.push($(this).attr('file'));
		});
		//console.log("%o", files);
		window.location.href = '/browse/join/join.jim?files=' +
		    files.join();
	    });

	$('#delete').button().disable()
	    .click(function() {
		var files = new Array();
		var els = $('input.fs:checked + a').each(function() {
			files.push(decodeURIComponent($(this).attr('file')));
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

			$('#pwdialogue').dialog({
				title: "Deleting",
				modal: true, autoOpen: true,
				height: 'auto', width: 'auto',
				show: 'scale', hide: 'fade',
				draggable: false, resizable: false,
				closeOnEscape: false,
				open: function() {
				    $('.ui-dialog-titlebar-close').hide();
				}
			});
			$('#pwfeedback').load(
			    '/browse/delete.jim', {
				'dir': dir,
				'files': files
				}, function() {
				$('#pwdialogue').dialog('close');
				window.location.reload(true);
			});
		}
	    });

	$('#copy,#cut').button().disable()
	    .click(function() {
		var files = new Array();
		var els = $('input.fs:checked + a').each(function() {
			files.push(decodeURIComponent($(this).attr('file')));
		});
		//console.log("%o", files);
		var action = $(this).attr('id');
		if (action == 'copy' && !confirm('Are you sure? ' +
		    'Copying recordings can take a very long time!'))
			return;

		$.post('/browse/clipboard.jim', {
		    'act': 'add',
		    'dir': dir,
		    'mode': action,
		    'path': files
		    }, function() {
			reloadclipboard();
			$('input.fs:checked').attr('checked', false);
		    });
	    });

	$('#newdir').button().click(function() {
		$('#newdirform').dialog({
			autoOpen: true,
			height: 'auto', width: 'auto',
			modal: true,
			buttons: {
				"Create": newdir_submit,
				"Cancel": function() {
					$(this).dialog('close');
				}
			},
			close: function() { $('#newdirname').val(''); }
		});
	});

	$('input.fs').change(function() {
		var num = $('input.fs:checked').size();
		if (num > 0)
			$('#delete,#cut,#copy').enable();
		else
			$('#delete,#cut,#copy').disable();

		var num = $('input.fsts:checked').size();
		if (num > 1)
			$('#join').enable();
		else
			$('#join').disable();

	});

	var streamsize = 0;

	function checkstream()
	{
		$.get('/browse/streamsize.jim', function(size) {
			//console.log('Stream size: %o', size);
			var mb = size / (1024 * 1024);
			mb = mb|0;
			if (streamsize && size > streamsize)
			{
				rate = (size - streamsize) * 8.0 /
				    (3 * 1048576);
				$('#streamstatus').text(mb +
				    ' MiB (growing @' + rate.toFixed(2) +
				    ' Mib/s)');
			}
			else
				$('#streamstatus').text(mb + ' MiB');
			streamsize = size;
		});
	}

	if ($('#streamstatus').length)
		setInterval(checkstream, 3000);

});

