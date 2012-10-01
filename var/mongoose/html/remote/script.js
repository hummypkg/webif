
$(function() {

$('area').click(function() {
	var code = $(this).attr('code');
	var x = $(this).attr('xmit');

	console.log("CODE: %o", code);

	$('#xmit' + x).fadeIn('fast').delay(500).fadeOut('fast');
	$.get('send.jim?code=' + code);
}).hover(
	function() { $(this).css('cursor', 'pointer'); },
	function() { $(this).css('cursor', 'auto'); }
);

});

