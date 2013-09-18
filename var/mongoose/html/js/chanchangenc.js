$(function() {

var signalarray = ['ZERO', 'ONE', 'TWO', 'THREE', 'FOUR',
                   'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE'];

$('a.chanchange').on('click', function(el) {
	el.preventDefault();
	var lcn = $(this).attr('chan');

	var cmd = '';
	for (i = 0; i < lcn.length; i++)
	{
		if (i > 0)
			cmd += '+';
		cmd += signalarray[lcn.charAt(i)];
	}
	if (lcn < 1000)
		cmd += '+OK';
	$.get('/plugin/ir/send.jim?code=' + cmd);
});

});

