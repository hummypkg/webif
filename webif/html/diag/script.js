
$(function() {

$('button').button();

$('#rundiag').button({icons: {primary: "ui-icon-play"}});
$('#runfopkg').button({icons: {primary: "ui-icon-play"}});

$('#rundiag').on('click', function() {
	var val = $('#diagsel').val();
	if (val == '0')
		val = $('#seq').val();
	$('#results')
	    .slideDown()
	    .html('<span class=blood><img src=/img/loading.gif> ' +
		'Running diagnostic, please wait...</span>')
	    .load('rundiag.jim?diag=' + encodeURIComponent(val), function() {
		$('#results').wrapInner('<pre>');
	    });
});

$('#runfopkg').on('click', function() {
	$('#results')
	    .slideDown()
	    .text('\n\nForcibly re-installing package, please wait...\n\n')
	    .load('/cgi-bin/opkg.jim?cmd=install+--force-reinstall+' +
	    encodeURIComponent($('#fopkg').val()), function() {
		$('#results').wrapInner('<pre>');
		$('#fopkg').val('');
	    });
});

$('a.logclear').on('click', function(e) {
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

$.getJSON('/diag/rpc.jim?act=getall', function(data) {
	$.each(data, function(k, v) {
		if (v == '1')
			$('#' + k + 'result').text('(Enabled)');
		else
			$('#' + k + 'result').text('');
	});
});


$('#safe,#reset,#rma').on('click', function(e) {
	e.preventDefault();

	opt = $(this).attr('id');

	$d = $('#' + opt + 'confirm');
	title = $d.attr('xtitle');
	$.get('/diag/rpc.jim?act=get&opt=' + opt, function(data) {
		if (data == "1")
		{
			act = 'unset';
			tact = 'Disable';
			cur = 'enabled';
		}
		else
		{
			act = 'set';
			tact = 'Enable';
			cur = 'disabled';
		}

		$d.find('span.cur').text(cur);
		$d.dialog({
			height: 'auto',
			width: 500,
			modal: true,
			title: title,
			buttons: [
			    {
				text: tact + ' ' + title,
				icons: {
					primary: "ui-icon-check"
				},
				click: function() {
					$.get('/diag/rpc.jim?act=' + act +
					    '&opt=' + opt, function() {
						$d.dialog('close');
						$('#' + opt + 'result')
						  .text('(Now ' + tact + 'd)');
					});
				}
			    },
			    {
				text: "Cancel",
				icons: {
					primary: "ui-icon-close"
				},
				click: function() {
					$d.dialog('close');
				}
			    }
			]
		});
	});
});

});

