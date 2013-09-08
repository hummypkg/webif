$(function() {

$('#epgswitch').button().click(function() {
	window.location = '/epg.shtml';
});

$('button.nav').click(function() {
        window.location = '/cgi-bin/xepg.jim?stt=' + $(this).attr('tt') +
            '&pos=' + $('#xegrid').scrollTop();
});

var now = new Date().getTime();

$('#xepg_dp').datepicker({
        buttonImage: '/img/cal.gif',
        buttonImageOnly: true,
        showOn: 'button',
        dateFormat: '@',
        minDate: now,
        maxDate: now + 7 * 86400,
        onSelect: function(val, sel) {
                var stt = $(this).attr('stt');
                // Extract date part
                dval  = Math.round(val / 86400000.0);
                // Extract current time part
                var tm = ~~(stt % 86400);

                var ret = dval * 86400 + tm;

                window.location = '/cgi-bin/xepg.jim?stt=' + ret;
        }
});

$('img.ui-datepicker-trigger').hover(
    function() { $(this).css('cursor', 'pointer'); },
    function() { $(this).css('cursor', 'auto'); }
);

});

