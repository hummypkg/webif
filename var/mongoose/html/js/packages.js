
function reset_results()
{
	$('#dresults').empty().val('Running package command,  please wait...');
}

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
		close: function(e,u) { reset_results(); }
	});
	reset_results();

	var opkg = '/cgi-bin/opkg.jim?cmd=';

	$('#opkgupdate').click(function() {
		$('#result_txt').load(opkg + 'update');
		$('#results').show('slow');
	});

	$('button.remove').click(function() {
		$('#dresults').load(opkg +
		    encodeURIComponent('remove ' + $(this).attr('id')));
		$dialog.dialog('open');
	});

	$('button.install').click(function() {
		$('#dresults').load(opkg +
		    encodeURIComponent('install ' + $(this).attr('id')));
		$dialog.dialog('open');
	});

	$('button.upgrade').click(function() {
		$('#dresults').load(opkg +
		    encodeURIComponent('upgrade ' + $(this).attr('id')));
		$dialog.dialog('open');
	});
});

