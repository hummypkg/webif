
$.tablesorter.addParser({
	id: 'programme',
	is: function () { return false; },
	format: function(s) {
		return s.toLowerCase().replace(/---/, 'zzz');
	},
	type: 'text'
});

$.tablesorter.addParser({
	id: 'xdate',
	is: function () { return false; },
	format: function(s, table, cell, cellIndex) {
		var dat = $(cell).find('span.ds').text();
		//console.log('Extracted: ' + dat)
		var d = new Date(dat);
		return d.getTime();
	},
	type: 'numeric'
});

$(function() {

$('table.tablesorter')
    .tablesorter({
        theme: 'webif',
	widthFixed: true,
	widgets: ['zebra', 'stickyHeaders']
    });

function docancel()
{
	var table = $('#sdialogue').attr('table');
	var slot = $('#sdialogue').attr('slot');

	if (confirm('Really remove scheduled event?'))
	{
		$.get('cancel.jim?slot=' + slot +
		    '&table=' + table, function() {
			window.location.reload(true);
		});
		$('#sdialogue').dialog('close');
	}
}

var $buttons1 = {
    "Close" : function() {$(this).dialog('close');}
};
var $buttons2 = $.extend(
    {"Cancel Event": function() { docancel() }},
    $buttons1);

var $dialog = $('#sdialogue').dialog({
	title: "Schedule Details",
	modal: false, autoOpen: false,
	height: 500, width: 700,
	show: 'scale', hide: 'fade',
	draggable: true, resizable: true,
	buttons: $buttons2,
	close: function(e,u) { $('#sdialogue').empty().html(
	    '<img src="/img/loading.gif" alt="loading">'); }
});

function schedpopup(e, o)
{
	e.preventDefault();
	var slot = o.attr('slot');
	var table = o.attr('table');
	$('#sdialogue').attr('slot', slot).attr('table', table);

	var url = 'info.jim?slot=' + slot +
	    '&table=' + table;
	$('#sdialogue').load(url);
	$dialog.dialog('open');
}
$('a.schedule').click(function(e) { schedpopup(e, $(this)) });


$('.schedselect:checked').prop('checked', false);

$('button.delselected').button({icons:{primary:"ui-icon-trash"}})
    .button('disable')
    .on('click', function() {
        $(this).dojConfirmAction({
                question: 'Delete selected?',
                yesAnswer: 'Yes',
                cancelAnswer: 'No'
                }, function(el) {
			$.blockUI({
		message: '<h1><img src=/img/loading.gif> Deleting... </h1>'
			});

			var els = $(el).parent().find('.schedselect:checked');
			var tab = $(els).first().closest('tr').attr('table');
			var slots = $.map(els, function(v) {
				return $(v).closest('tr').attr('sid');
			});
			$.get('cancel.jim?slot=' + slots.join(',') +
			    '&table=' + tab, function() {
				window.location.reload(true);
			});
    });
});

$('.schedselect').on('change', function() {
	var num = $(this).closest('table').find('.schedselect:checked').size();
	var but = $(this).closest('fieldset').find('button.delselected');
	if (num)
		$(but).button('enable').find('.delselcnt')
		    .text('(' + num + ')');
	else
		$(but).button('disable').find('.delselcnt').empty();
    });

$('button.selall').button({icons:{primary:"ui-icon-check"}})
    .on('click', function() {
	$(this).parent().find('table .schedselect').prop('checked', true)
	    .first().trigger('change');
    });

$('button.selnone').button({icons:{primary:"ui-icon-close"}})
    .on('click', function() {
	$(this).parent().find('table .schedselect').prop('checked', false)
	    .first().trigger('change');
    });

$('button.selended').button({icons:{primary:"ui-icon-stop"}})
    .on('click', function() {
	$(this).parent().find('table .schedselect').prop('checked', false);
	$(this).parent().find('table tr[ended="1"] .schedselect')
	    .prop('checked', true).first().trigger('change');

    });

$('button.rawview').button({icons:{primary:"ui-icon-wrench"}})
    .on('click', function() {
	window.location = '/cgi-bin/db.jim?' + $(this).attr('path');
    });

$('button.backup').button({icons:{primary:"ui-icon-disk"}})
    .on('click', function() {
	window.location = '/backup/index.jim';
    });


// Menu

var $paddialog = $('#padding').dialog({
	title: "Padding values",
	modal: true, autoOpen: false,
	height: 'auto', width: 'auto',
	show: 'scale', hide: 'fade',
	draggable: false, resizable: false,
	buttons: {
	    "Confirm": function() {
		$('#paddingf').ajaxSubmit({
			dataType: 'text',
			success: function(data) {
				window.location.reload(true);
			}
		});
	    },
	    "Cancel": function() { $(this).dialog('close'); }
	}
});

$('#fchange').dialog({
	autoOpen: false,
	height: 'auto', width: 'auto',
	modal: true,
	buttons: {
	    "Update": function() {
		var s = $('#fchangeform').serialize();
		$.get('folder.jim?' + s,
		    function() { window.location.reload(true); });
	    },
	    "Close": function() {
		$(this).dialog('close');
	    }
	},
	close: function() {
		$('#changeslot').val(0);
		$('#fchangename').val('');
	}
});

function preparemenu(el, menu)
{
	if (!$(el).is("tr"))
		el = $(el).closest('tr');

	if ($(el).attr('table') != 'pending' && $(el).attr('rsvtype') == 3)
	{
		if ($(el).attr('ar') == 1)
			$('#optmenu').changeContextMenuItem('#ar',
			    'Disable AR');
		else
			$('#optmenu').changeContextMenuItem('#ar',
			    'Enable AR');
		$('#optmenu').enableContextMenuItems('#ar');
	}
	else
		$('#optmenu').disableContextMenuItems('#ar');

	if ($(el).attr('reckind') == 4)
		$('#optmenu').enableContextMenuItems('#mkfolder');
	else
		$('#optmenu').disableContextMenuItems('#mkfolder');

//	if ($(el).attr('table') != 'pending' && $(el).attr('reckind') == 4)
	if ($(el).attr('reckind') == 4)
		$('#optmenu').enableContextMenuItems('#folder');
	else
		$('#optmenu').disableContextMenuItems('#folder');
}

function menuclick(action, el, pos)
{
	if (!$(el).is("tr"))
		el = $(el).closest('tr');
	var sid = $(el).attr('sid');
	var table = $(el).attr('table');
	//if (window.console)
	      //console.log("Got %s, el: %o, id: %d", action, el, sid);

	switch (action)
	{   
	    case 'delete':
		if (confirm('Are you sure you want to delete this entry?'))
			$.get('cancel.jim?slot=' + sid +
			    '&table=' + table,
			    function() {
				window.location.reload(true);
			});
		break;

	    case 'ar':
		if ($(el).attr('ar') == 1)
		{
			$('#paddingsid').val(sid);
			$paddialog.dialog('open');
		}
		else
			$.get('ar.jim?slot=' + sid,
			    function() {
				window.location.reload(true);
			});
		break;

	    case 'folder':
		$('#fchangeslot').val(sid);
		$('#fchangename').val($(el).find('a.schedule').text());
		$('#fchangetable').val($(el).attr('table'));
		$('#fchange').dialog('open');
		break;

	    case 'mkfolder':
		$('#output')
                    .empty()
                    .show('slow')
                    .load('mkdir.jim?slot=' + sid + '&table=' + table,
                        function() {
                                $(output)
                                    .css('font-style', 'italic')
                                    .delay(5000).fadeOut('slow');
                    });
		break;

	    default:
		alert('Unhandled menu event, ' + action);
	}
}

$('table.schedule tbody tr').hover(
	function() { $(this).addClass('hover'); },
	function() { $(this).removeClass('hover'); })
	.contextMenu({menu: 'optmenu', beforeShow: preparemenu}, menuclick);

$('a.smenu')
	.contextMenu({menu: 'optmenu', leftButton: true, beforeShow: preparemenu}, menuclick);

$('#schedule_cleanup').bind('click', function(e) {
	if (confirm('Are you sure you want to remove all finished recordings?'))
		$.get('cleanup.jim',
		    function() { window.location.reload(true);
		});
});

});

