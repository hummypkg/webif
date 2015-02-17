
$(function() {

$('button').button();

$('#rundiag').click(function() {
	var val = $('#diagsel').val();
	if (val == '0')
		val = $('#seq').val();
	$('#results')
	    .slideDown()
	    .html('<br><br><img src=/img/loading.gif> ' +
		'Running diagnostic, please wait...')
	    .load('rundiag.jim?diag=' + encodeURIComponent(val), function() {
		$('#results').wrapInner('<pre>');
	    });
});

$('#runfopkg').click(function() {
	$('#results')
	    .slideDown()
	    .text('\n\nForcibly re-installing package, please wait...\n\n')
	    .load('/cgi-bin/opkg.jim?cmd=install+--force-reinstall+' +
	    encodeURIComponent($('#fopkg').val()), function() {
		$('#results').wrapInner('<pre>');
		$('#fopkg').val('');
	    });
});

$('#runedit').click(function(e) {
	e.preventDefault();
	window.location = '/edit/edit.jim';
});

$('#dbinfo').click(function(e) {
	e.preventDefault();
	window.location = '/cgi-bin/db.jim';
});

$('#channelinfo').click(function(e) {
	e.preventDefault();
	window.location = '/cgi-bin/channel.jim';
});

$('#diskdiag').click(function(e) {
	e.preventDefault();
	window.location = 'disk.jim';
});

$('#dlna').click(function(e) {
	e.preventDefault();
	window.location = '/dlna/dlna.jim';
});

$('#dspace').click(function(e) {
	e.preventDefault();
	window.location = 'dspace/index.jim';
});

$('#reboot').button({icons:{primary:"ui-icon-power"}}).click(function(e) {
	e.preventDefault();
	window.location = '/restart/index.jim';
});

$('#runreset').click(function(e) {
	e.preventDefault();
	if (!confirm('Are you sure? This will completely remove all packages and settings.'))
		return;
	if (!confirm('Are you really sure?'))
		return;
	if (!confirm('One last time, are you sure?'))
		return;
	$.get('/cgi-bin/cfwreset.cgi', function() {
		$('button').disable();
		$('#resetdone').slideDown();
	});
});

$('#runrma').click(function(e) {
	e.preventDefault();
	if (!confirm('Are you sure? This will completely remove all packages and settings and return the unit to state where you can re-install official firmware ready to return a faulty box to Humax for repair.'))
		return;
	if (!confirm('Are you really sure?'))
		return;
	if (!confirm('One last time, are you sure?'))
		return;
	$.get('/cgi-bin/cfwreset.cgi?rma=1', function() {
		$('button').disable();
		$('#resetdone').slideDown();
	});
});

$('a.logclear').click(function(e) {
	var t = $(this);
	e.preventDefault();
	if (!confirm('Delete ' + $(this).attr('file') + '?'))
		return;
	$('#results')
	    .slideDown()
	    .text('\n\nClearing log, please wait...\n\n')
	    .load('/log/act.jim?action=clear&file=' +
		encodeURIComponent($(this).attr('file')), function() {
			$('#results').wrapInner('<pre>');
			$(t).prev('span.lsize').html('0 bytes');
		});
});

});


