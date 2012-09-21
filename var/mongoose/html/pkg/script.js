var opkg = '/cgi-bin/opkg.jim?cmd=';

$(document).ready(function() {

	var busy = false;
	var reload = false;

	$('#opkgupdate')
	    .button()
	    .click(function() { reload = true; execopkg('update'); })
	    .fadeIn('slow');

	$('#opkgupgradeall')
	    .button()
	    .click(function() { reload = true; execopkg('upgrade'); })
	    .fadeIn('slow');

	$('#pkgtabs').tabs({
		select: function() {
			if (busy)
			{
				alert('Please wait until the current ' +
				    'operation completes.');
				return false;
			}
			busy = true;
			$('#pkgtabs')
			    .tabs('option', 'disabled', [0,1,2]);
		},
		load: function() {
			busy = false;
			setup_buttons();
			$('#pkgtabs').tabs('option', 'disabled', []);
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
			if (reload)
			{
				$('#refreshing').show('slow');
				$('#pkgtabs').hide('fast');
				window.location.reload(true);
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

	function loaddata(data, isfinal)
	{
		//console.log('loaddata called, final=' + isfinal);
		//console.log('Data: ' + data);
		$('#dresults').append(data);
		if (isfinal)
		{
			$('#dspinner').hide('slow');
			if (!$('#dresults').text())
				$('#dresults').append('Nothing to do.');
			else
				$('#complete').show('slow');
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

//		$('#dresults').load(opkg + arg, function() {
//			$('#dspinner').hide('slow');
//		});

		$.ajax({
			type: "GET",
			url: opkg + arg,
			progress: loaddata,
			success: function(data) {
				//console.log("ajax success");
				loaddata(data, true);
			},
			error: function(_, _, e) {
				//console.log("ajax error");
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

