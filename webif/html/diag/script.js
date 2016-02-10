
$(function() {

$('button').button();

$('#rundiag').button({icons: {primary: "ui-icon-play"}});
$('#runfopkg').button({icons: {primary: "ui-icon-play"}});

var $dialog = $('#d_results').dialog({
	title: "Results",
	modal: true, autoOpen: false,
	height: 600, width: 900,
	show: 'scale', hide: 'fade',
	draggable: true, resizable: true,
	buttons: { "Close":
	    function() {$(this).dialog('close');}},
});

$('#rundiag').on('click', function() {
	var val = $('#diagsel').val();
	if (val == '0')
		val = $('#seq').val();
	$('#results')
	    .html('<img src=/img/loading.gif> Running diagnostic ' +
		'<i>' + val + '</i>')
	    .load('rundiag.jim', { diag: val }, function() {
		$('#results').wrapInner('<pre>');
	    });
	$('#d_results').dialog('open');
});

$('#runfopkg').on('click', function() {
	var pkg = $('#fopkg').val();
	$('#results')
	    .html('<img src=/img/loading.gif> ' +
		'Forcibly re-installing package <i>' + pkg + '</i>')
	    .load('/cgi-bin/opkg.jim', {
		cmd: 'install --force-reinstall ' + pkg
	    }, function() {
		$('#results').wrapInner('<pre>');
	    });
	$('#d_results').dialog('open');
});

$('a.logclear').on('click', function(e) {
	e.preventDefault();

	var $t = $(this);
	var file = $t.attr('file');

	if (!confirm('Delete ' + file + '?'))
		return;
	$('#results')
	    .html('<img src=/img/loading.gif> Clearing log ' +
		'<i>' + file + '</i>')
	    .load('/log/act.jim', {
		action: 'clear',
		file: file
	    }, function() {
		$('#results').wrapInner('<pre>');
	    });
	$('#d_results').dialog('open');
});

$.getJSON('/diag/rpc.jim?act=getall', function(data) {
	$.each(data, function(k, v) {
		if (v == '1')
			$('#' + k + 'result').text('(Enabled)');
		else
			$('#' + k + 'result').text('');
	});
});


$('#safe,#reset,#rma,#maint').on('click', function(e) {
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
					if (!confirm('Are you sure?'))
					{
						$d.dialog('close');
						return;
					}
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

