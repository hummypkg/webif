var tb_lastupd = 0;
if (window.location.pathname != '/' &&
    window.location.pathname != '/index.jim')
{
	var down = function() {
		$('#toolbar').stop(true, true).delay(200).slideDown(400,
		    function() {
			if (+new Date() - tb_lastupd > 5000)
			{
				tb_lastupd = +new Date();
				$('#tbstatus')
				    .empty()
				    .html('<img src=/img/spin.gif> ' +
					'Updating...')
				    .load('/cgi-bin/status.jim');
			}
		});
	};
	var up = function() {
		$('#toolbar').stop(true, true).delay(200).slideUp();
	};
	$('#topbar, #toolbar').hover(down, up);

	$('span.toolbarcell').hover(
	    function() {
		$(this).addClass('tbhover');
	    }, function() {
		$(this).removeClass('tbhover');
	    });
}

