
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

});

