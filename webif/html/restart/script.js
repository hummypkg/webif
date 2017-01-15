
var handle = 0;
var pct = 0;
function update()
{
	$('#progressbar').reportprogress(++pct);
	if (pct == 100)
	{
		clearInterval(handle);
		pct = 0;
		$.blockUI({
			message: '<h1><img src=/img/spin.gif> ' +
				'Reconnecting...</h1>',
			css: { background: '#ffffcc' }
		});
		window.location = '/';
	}
}

$(function() {

$('#restartbutton').button({icons:{primary:"ui-icon-power"}})
    .button('disable')
    .on('click', function() {
	$(this).button('disable');
	$('#restarting').slideDown('slow');
	handle = setInterval("update()" , 500);
	$.blockUI({
		message: '<h1><img src=/img/spin.gif> Restarting...</h1>' +
			 '<br>' +
			 '<center><div id=progressbar></div></center>',
		css: { background: '#ffffcc' }
	});
	$('#progressbar').reportprogress(0);
	$.get('restart.jim?now=yes');
});

$('#restart_status').load('/cgi-bin/status.jim?schedtime=7200', function() {
	$('#restartbutton').button('enable');
});

$('#restart_humaxtv').button('disable').hide();

$.getJSON('/diag/rpc.jim?act=getall', function(data) {
	$.each(data, function(k, v) {
		if (v == '1')
			$('#warn_' + k).show();
	});
});

});

