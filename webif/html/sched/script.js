
var spinner = '<div class=spinner><img border=0 src=/img/spin.gif>' +
    '&nbsp;Retrieving data... Please wait...</div>';

var LIST_INDEX = 0;
var VISUAL_INDEX = 1;
var BACKUP_INDEX = 2;

var list_reload_required = true;
var visual_reload_required = true;

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

function page_refresh(msg)
{
	if (!msg)
		msg = 'Refreshing page...';
	$.blockUI({
		message: '<h1><img src=/img/spin.gif> ' + msg + '</h1>'
	});
	window.location.reload(true);
}

$(function() {

// Retrieve the stored selected tab from the hash portion of the URL.
var curtab = ~~(window.location.hash.slice(1));
if (curtab < 0 || curtab > 2)
        curtab = 0;

$('#minimaltabbar').tabs({
	active: curtab,
	heightStyle: "auto",
        spinner: spinner,
	create: function(event, ui) {
		$(ui.panel).html(spinner);
	},
	activate: function(event, ui) {
		window.location.hash = ui.newTab.index();
	},
	beforeLoad: function (event, ui) {

		var content = $(ui.panel).html();

		switch (ui.tab.index())
		{
		    case LIST_INDEX:
			if (list_reload_required)
				content = false;
			break;
		    case VISUAL_INDEX:
			if (visual_reload_required)
				content = false;
			break;
		    case BACKUP_INDEX:
			break;
		    default:
			alert('Unknown tab just loaded.');
		}
		// Don't reload if content exists.
		if (content)
			event.preventDefault();
		else
		{
			list_reload_required = false;
			visual_reload_required = false;
			$(ui.panel).html(spinner);
		}
        },
	load: function(event, ui) {
		switch (ui.tab.index())
		{
		    case LIST_INDEX:
			list_loaded(ui.panel);
			break;
		    case VISUAL_INDEX:
			visual_loaded(ui.panel);
			break;
		    case BACKUP_INDEX:
			backup_loaded(ui.panel);
			break;
		    default:
			alert('Unknown tab just loaded.');
		}
	}
});

});

