var opkg = '/cgi-bin/opkg.jim';

$(function() {

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
		$(ui.panel).html("<img src=/img/spin.gif>" +
		    "Loading data... Please wait...");
		busy = true;
		$('#pkgtabs').tabs('disable');
		$('span.tabright').hide();
	},
	activate: function(event, ui) {
		window.location.hash = ui.newTab.index();
		if (busy)
		{
			alert('Please wait until the current ' +
			    'operation completes.');
			return false;
		}
		$(ui.newPanel).html("<img src=/img/spin.gif>" +
		    "Loading data... Please wait...");
		busy = true;
		$('#pkgtabs').tabs('disable');
		$('span.tabright').hide();
	},
	load: function(event, ui) {
		busy = false;
		setup_tab(ui.tab.index(), ui.panel);
		$('#pkgtabs').tabs('enable');
	},
	spinner: '<img border=0 src=/img/spin.gif> ' +
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
				    .html("<img src=/img/spin.gif>" +
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
	$('#dialogue').animate({
            scrollTop: $('#dialogue').prop('scrollHeight')
        }, 'slow');
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

function update_filter($table, change)
{
	if (change)
		pkgfilter = !pkgfilter;

	if (pkgfilter)
	{
		$table.find('tr.p_adv').hide();
		$('#filtertext').text('Not showing advanced packages');
		$('#b_filter').text('Show');
	}
	else
	{
		$table.find('tr.p_adv').show();
		$('#filtertext').text('Advanced packages are being shown');
		$('#b_filter').text('Hide');
	}

	$table.trigger('update', [true]);

	$('#b_filter').button().off('click').on('click', function() {
		update_filter($table, 1);
	});
}

function setup_tab(index, panel)
{
	var $tab = $(panel).find('table.tablesorter');
	if (index == 2)
		$('span.tabright').hide();
	else
	{
		update_filter($tab);
		$('span.tabright').show();
	}
	$tab.tablesorter({
		theme: 'webif',
		widthFixed: false,
		widgets: ['zebra', 'stickyHeaders']
	    });

	$(panel).find('button.remove, button.install, button.upgrade')
	    .button()
	    .click(function() {
		if ($(this).attr('action') == 'remove' &&
		    !confirm('Please confirm removal of the ' +
		    $(this).attr('id') + ' package.'))
			return;

		execopkg($(this).attr('action') + ' ' + $(this).attr('id'),
		    $(this).closest('tr').attr('pkg'));
	}).fadeIn('slow');

	$(panel).find('a.depends').click(function(e) {
		e.preventDefault();
		var pkg = $(this).closest('tr').attr('pkg');
		stick = true;
		execopkg('whatdepends ' + pkg, false);
	});

	$(panel).find('tr[pkg=webif]').find('button[action=remove]').disable();

	$(panel).find('img.norepo').qtip({content: 'Not in repository'});
	$(panel).find('img.adv').qtip({content: 'Advanced package'});
	$(panel).find('img.beta')
	    .qtip({content: 'Beta package, use at your own risk'});
}

});

