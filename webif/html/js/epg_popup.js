$(function() {
	function doschedule(type)
	{
		$('#epginfo_extra').load('/cgi-bin/epg/schedule.jim?' +
		    'service=' +
		    encodeURIComponent($('#dialogue').attr('xs')) +
		    '&event=' +
		    encodeURIComponent($('#dialogue').attr('xe')) +
		    '&type=' + type, function() {
			$('#restart_block')
			    .load('/cgi-bin/restartblock.jim');
		});
		$(":button:contains('Record')").fadeOut('slow');
		$(":button:contains('Reminder')").fadeOut('slow');
	}

	var $buttons1 = {
	    "Close" : function() {$(this).dialog('close');}
	};
	var $buttons2 = $.extend(
	    {"Record Programme": function() { doschedule(1) }},
	    {"Set Reminder": function() { doschedule(3) }},
	    $buttons1);
	var $buttons3 = $.extend(
	    {"Record Series": function() { doschedule(2) }},
	    $buttons2);

	var $dialog = $('#dialogue').dialog({
		title: "Programme Details",
		modal: false, autoOpen: false,
		height: 500, width: 700,
		show: 'scale', hide: 'fade',
		draggable: true, resizable: true,
		buttons: $buttons1,
		close: function(e,u) { $('#dialogue').empty().html(
		    '<img src="/img/loading.gif" alt="loading">'); }
	});

	function epgpopup(e, o)
	{
		e.preventDefault();
		var sch = o.attr('sch');
		var rec = o.attr('rec');
		if (sch != 0)
			$dialog.dialog("option", "buttons", $buttons1);
		else if (rec == 2)
			$dialog.dialog("option", "buttons", $buttons3);
		else if (rec == 1)
			$dialog.dialog("option", "buttons", $buttons2);
		else
			$dialog.dialog("option", "buttons", $buttons1);
		var url = '/cgi-bin/epg/info.jim?service=' +
		    o.attr('xs') + '&event=' +
		    o.attr('xe') + '&bare=1';
		$('#dialogue')
		    .html('<img src=/img/loading.gif> Loading details...' +
			' Please wait...')
		    .load(url, function() {
			$('#dialogue a.event').click(function(e) {
				epgpopup(e, $(this));
			});
		});
		$('#dialogue')
		    .attr('xs', o.attr('xs'))
		    .attr('xe', o.attr('xe'));
		$dialog.dialog('open');
	}
	$('a.event').click(function(e) {
		e.preventDefault();
		epgpopup(e, $(this))
	});
});
