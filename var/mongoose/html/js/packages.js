
$(document).ready(function() {
	$('button').button();

	var $dialog = $('#dialogue').dialog({
		title: "Package Management Results",
		modal: false, autoOpen: false,
		height: 500, width: 700,
		show: 'scale', hide: 'fade',
		draggable: true, resizable: true,
		buttons: { "Close":
		    function() {$(this).dialog('close');}},
		close: function(e,u) { window.location.reload(true); }
	});

	var opkg = '/cgi-bin/opkg.jim?cmd=';

	$('#opkgupdate').click(function() {
		$('#result_txt').load(opkg + 'update');
		$('#results').show('slow');
	});

	$('button.remove, button.install, button.upgrade').click(function() {
		$('#dspinner').show();
		$('#dresults').load(
		    opkg + encodeURIComponent(
		        $(this).attr('action') + ' ' + $(this).attr('id')
		    ),
		    function() { $('#dspinner').hide('slow') });
		$dialog.dialog('open');
	});
});

