
$.tablesorter.addParser({
	id: 'programme',
	is: function () { return false; },
	format: function(s) {
		return s.toLowerCase().replace(/---/, 'zzz');
	},
	type: 'text'
});

$.tablesorter.addParser({
	id: 'date',
	is: function () { return false; },
	format: function(s) {
		var d = new Date(s.substring(0, s.length - 4));
		return d.getTime();
	},
	type: 'numeric'
});

$(document).ready(function() {

$('table.tablesorter').tablesorter({
    headers: {
	1: { sorter: false },
	3: { sorter: 'programme' },
	4: { sorter: 'date' },
	5: { sorter: 'date' },
	5: { sorter: false },
	6: { sorter: false },
	7: { sorter: false }
    }
});

$('table.tablesorter thead th').filter('[class!=header]')
    .addClass('headerplain');

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

$('table.tablesorter tbody tr').hover(
	function() { $(this).addClass('hover'); },
	function() { $(this).removeClass('hover'); });

$('button').button();

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

	if ($(el).attr('table') != 'pending' && $(el).attr('reckind') == 4)
		$('#optmenu').enableContextMenuItems('#folder');
	else
		$('#optmenu').disableContextMenuItems('#folder');
}

function menuclick(action, el, pos)
{
	if (!$(el).is("tr"))
		el = $(el).closest('tr');
	var sid = $(el).attr('sid');
	//if (window.console)
	      //console.log("Got %s, el: %o, id: %d", action, el, sid);

	switch (action)
	{   
	    case 'delete':
		var table = $(el).attr('table');
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
		$('#fchange').dialog('open');
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

