
$('#topbar').hover(
    function() { $(this).css('cursor', 'pointer'); },
    function() { $(this).css('cursor', 'auto'); }
);

$('#topbar a').on('click', function(e) {
	e.stopPropagation();
});

