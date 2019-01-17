
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
	buttons: { "Close": function() { $(this).dialog('close'); }}
});

function loaddata(data, status)
{
	$('#results').text(data).wrapInner('<pre>');
	if (status) // Request completed
	{
		$('#resultscomplete').slideDown('slow');
		$('#resultsheader').slideUp('slow', function() {
		    $(this).empty();
		});
	}
	else
		$('#results').append('<br><img src=/img/spin.gif> ' +
		    'Still working...');
	$('#d_results').animate({
	    scrollTop: $('#d_results').prop('scrollHeight')
	}, 'slow');
}

function chunked_request(placeholder, url, data)
{
	$('#resultsheader').html('<img src=/img/spin.gif> ' + placeholder)
	    .slideDown('slow');
	$('#resultscomplete').hide();
	$('#results').empty();
	$('#d_results').dialog('open');

	$.ajax({
		type: "GET",
		url: url,
		data: data,
		xhrFields: {
			onprogress: function(x) {
				if (x.target)
					loaddata(x.target.responseText);
			}
		},
		progressInterval: 500,
		success: function(data, status, xhr) {
			//console.log(xhr.status);
			loaddata(data, status);
		},
		error: function(_, _, e) {
			if (window.console)
				console.log("ajax error");
			alert(e);
		}
	});
}

$('#rundiag').on('click', function() {
	var val = $('#diagsel').val();
	if (val == '0')
		val = $('#seq').val();

	chunked_request('Running diagnostic <i>' + val + '</i>',
	    'rundiag.jim', { diag: val });
});

$('#runfopkg').on('click', function() {
	var pkg = $('#fopkg').val();

	chunked_request('Re-installing package <i>' + pkg + '</i>',
	    '/cgi-bin/opkg.jim', { cmd: 'install --force-reinstall ' + pkg });
});

$('a.logclear').on('click', function(e) {
	e.preventDefault();

	var $t = $(this);
	var file = $t.attr('file');
	var act = $t.attr('act');

	if (act == 'clear')
		t = 'Truncate';
	else
		t = 'Delete';
	if (!confirm(t + ' ' + file + '?'))
		return;

	chunked_request('Clearing log <i>' + file + '</i>',
	    '/log/act.jim', { action: act, file: file });
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

