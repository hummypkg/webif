
$(function() {

$('button').button();

$('#rundiag').click(function() {
	$('#results')
	    .slideDown()
	    .text('\n\nRunning diagnostic, please wait...\n\n')
	    .load('rundiag.jim?diag=' +
	    encodeURIComponent($('#seq').val()), function() {
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

$('a.log').click(function() {
	$('#results')
	    .slideDown()
	    .text('\n\nLoading log, please wait...\n\n')
	    .load('/cgi-bin/cat.jim?file=' +
	        encodeURIComponent($(this).attr('file')), function() {
	    		$('#results').wrapInner('<pre>');
		});
});

$('#runedit').click(function(e) {
	e.preventDefault();
	window.location = '/edit/edit.jim';
});

$('#runreset').disable();

});

