var opkg = '/cgi-bin/opkg.jim';

$(document).ready(function() {

var busy = false;
var tswitch = false;
var stick = true;

// Retrieve the stored selected tab from the hash portion of the URL.
var curtab = ~~(window.location.hash.slice(1));
if (curtab < 0 || curtab > 2)
	curtab = 0;

$('#opkgupdate')
    .button()
    .click(function() { tswitch = 2; execopkg('update'); })
    .fadeIn('slow');

$('#opkgupgradeall')
    .button()
    .click(function() { tswitch = 2; execopkg('upgrade'); })
    .fadeIn('slow');

$('#pkgtabs').tabs({
	active: curtab,
	create: function(event, ui) {
		$(ui.panel).html("<img src=/img/loading.gif>" +
		    "Loading data... Please wait...");
		busy = true;
		$('#pkgtabs').tabs('disable');
	},
	activate: function(event, ui) {
		window.location.hash = ui.newTab.index();
		if (busy)
		{
			alert('Please wait until the current ' +
			    'operation completes.');
			return false;
		}
		$(ui.newPanel).html("<img src=/img/loading.gif>" +
		    "Loading data... Please wait...");
		busy = true;
		$('#pkgtabs').tabs('disable');
	},
	load: function() {
		busy = false;
		setup_buttons();
		$('#pkgtabs').tabs('enable');
	},
	spinner: '<img border=0 src=/img/loading.gif> ' +
	    '<em>Loading...</em>'
});

var $dialog = $('#dialogue').dialog({
	title: "Package Management Results",
	modal: false, autoOpen: false,
	height: 500, width: 700,
	show: 'scale', hide: 'fade',
	draggable: true, resizable: true,
	buttons: { "Close":
	    function() {$(this).dialog('close');}},
	close: function(e,u) {
		if (tswitch)
		{
			var curtab = $('#pkgtabs')
			    .tabs('option', 'active');
			if (curtab != tswitch)
				$('#pkgtabs').tabs('option',
				    'active', tswitch);
			else
			{
				$('.ui-tabs-panel')
				    .html("<img src=/img/loading.gif>" +
				    "Loading data... Please wait...");
				$('#pkgtabs').tabs('load', tswitch);
			}
			tswitch = false;
			$('button.va').enable();
		}
		else
		{
			var pkg = $('#dialogue').attr('pkg');
			$('tr[pkg="' + pkg + '"]')
			    .disable()
			    .find('button').removeClass('va');
			$('button.va').enable();
		}
	}
});

function loaddata(data, status)
{
	$('#dresults').text(data).wrapInner('<pre>');
	if (status) // Request completed
	{
		$('#dspinner').hide('slow');
		$('#complete').show('slow');
		if (status == 'success' && !stick)
			$('#dialogue').dialog('close');
		//stick = false;
	}
}

function execopkg(arg, pkg)
{
	if (busy)
	{
		alert('Please wait until the current ' +
		    'operation completes.');
		return;
	}
	busy = true;
	$('button.va').disable();
	$('#dspinner').show();
	$('#complete').hide();
	$('#dresults').empty();
	$('#dialogue').attr('pkg', pkg);
	$dialog.dialog('open');

	$.ajax({
		type: "GET",
		url: opkg,
		data: { cmd: arg },
		xhrFields: {
			onprogress: function(x) {
				if (x.target)
					loaddata(x.target.responseText);
			},
		},
		progressInterval: 500,
		success: function(data, status) {
			loaddata(data, status);
		},
		error: function(_, _, e) {
			if (window.console)
				console.log("ajax error");
			alert(e);
		}
	});
	busy = false;
}

function setup_buttons()
{
	$('button.remove, button.install, button.upgrade')
	    .button()
	    .click(function() {
		if ($(this).attr('action') == 'remove' &&
		    !confirm('Please confirm removal of the ' +
		    $(this).attr('id') + ' package.'))
			return;

		execopkg($(this).attr('action') + ' ' + $(this).attr('id'),
		    $(this).closest('tr').attr('pkg'));
	}).fadeIn('slow');

	$('a.depends').click(function(e) {
		e.preventDefault();
		var pkg = $(this).closest('tr').attr('pkg');
		stick = true;
		execopkg('whatdepends ' + pkg, false);
	});
}

});

