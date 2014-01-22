var opkg = '/cgi-bin/opkg.jim?cmd=';

$(document).ready(function() {

	var busy = false;
	var tswitch = false;

	$('#opkgupdate')
	    .button()
	    .click(function() { tswitch = 2; execopkg('update'); })
	    .fadeIn('slow');

	$('#opkgupgradeall')
	    .button()
	    .click(function() { tswitch = 2; execopkg('upgrade'); })
	    .fadeIn('slow');

	$('#pkgtabs').tabs({
		create: function(event, ui) {
			$(ui.panel).html("<img src=/img/loading.gif>" +
			    "Loading data... Please wait...");
			busy = true;
			$('#pkgtabs').tabs('disable');
		},
		activate: function(event, ui) {
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

	jQuery.ajaxSetup({progressInterval: 1});

	function loaddata(data, status)
	{
		if (window.console)
		{
			console.log('loaddata called, status=' + status);
			console.log('Data: ' + data);
		}
		if (status)
		{
			$('#dresults').text(data);
			$('#dspinner').hide('slow');
			$('#complete').show('slow');
			if (status == 'success')
				$('#dialogue').dialog('close');
		}
		else
			$('#dresults').append(data);
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
			url: opkg + arg,
			progress: loaddata,
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

			execopkg(encodeURIComponent($(this).attr('action') +
			    ' ' + $(this).attr('id')),
			    $(this).closest('tr').attr('pkg'));
		}).fadeIn('slow');

		$('a.depends').click(function(e) {
			e.preventDefault();
			var pkg = $(this).closest('tr').attr('pkg');
			execopkg(encodeURIComponent('whatdepends ' + pkg),
			    false);
		});
	}

});

