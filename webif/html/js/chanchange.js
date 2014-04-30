$(function() {

var signalarray = ['ZERO', 'ONE', 'TWO', 'THREE', 'FOUR',
                   'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE'];

$('a.chanchange').jConfirmAction({
	question: "Change channel?"
	}, function(el) {
		var lcn = $(el).attr('chan');

		$('.jcaquestion').fadeOut(300,function(){$(this).remove();});

		var cmd = '';
		for (i = 0; i < lcn.length; i++)
		{
			if (i > 0)
				cmd += '+';
			cmd += signalarray[lcn.charAt(i)];
		}
		if (lcn < 1000)
			cmd += '+OK';
		//console.log('LCN: %O', lcn);
		//console.log('CMD: %O', cmd);
		$.get('/plugin/ir/send.jim?code=' + cmd);
});

});

