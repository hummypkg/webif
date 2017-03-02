
$('#topbar').hover(
    function() { $(this).css('cursor', 'pointer'); },
    function() { $(this).css('cursor', 'auto'); }
);

$('#topbar a').on('click', function(e) {
	e.stopPropagation();
});

$(function() {

function updateidle()
{
	$.get('/cgi-bin/idle.jim', function(idle) {
		$('#idletime').html(idle);
	});
}

updateidle();
setInterval(updateidle, 60000);

if ($('#vfd').length)
{

	function updatevfd()
	{
		$.get('/cgi-bin/vfd.jim', function(vfd) {
			$('#vfd').html(vfd);
		});
	}

	updatevfd();
	setInterval(updatevfd, 5000);
}

});

