
$('.timejump').hover(
    function() {
	$(this).css('cursor', 'pointer');
	$(this).addClass('timejump_hover')
	$(this).nextAll('.timejump').slice(0,hours-1)
	    .addClass('timejump_hover');
    },
    function() {
	$(this).css('cursor', 'auto');
	$(this).removeClass('timejump_hover')
	$(this).nextAll('.timejump').slice(0,hours-1)
	    .removeClass('timejump_hover');
    }
).on('click', function(e) {
	e.preventDefault();

	tt = $(this).attr('tt');

	window.location = '/xepg/?stt=' + tt +
	    '&hours=' + hours +
	    '&pos=' + $('#xegrid').scrollTop();
}).on('contextmenu', function(e) {
	e.preventDefault();

	tt = $(this).attr('tt');

	// Change the end hour.
	nhours = Math.ceil((tt - stt) / 3600) + 1;
	if (nhours > 1)
		hours = nhours;
	window.location = '/xepg/?stt=' + stt +
	    '&hours=' + hours +
	    '&pos=' + $('#xegrid').scrollTop();
});

$('.dayjump').hover(
    function() {
	$(this).css('cursor', 'pointer');
	$(this).addClass('dayjump_hover')
    },
    function() {
	$(this).css('cursor', 'auto');
	$(this).removeClass('dayjump_hover')
    }
).on('click', function(e) {
	e.preventDefault();

	window.location = '/xepg/?stt=' + $(this).attr('tt') +
	    '&hours=' + hours +
	    '&pos=' + $('#xegrid').scrollTop();
});

$('button.nav').button().click(function() {
	window.location = '/xepg/?stt=' + $(this).attr('tt') +
	    '&pos=' + $('#xegrid').scrollTop();
});

$(function() {

$('#epgswitch').button().click(function() {
	window.location = '/epg/list.jim';
});

$('div.xeprog').qtip({
	position: {
		my: 'bottom center',
		at: 'top center',
		viewport: $(window)
	},
	style: {
		classes: 'qtip-rounded qtip-shadow'
	}
});


});

