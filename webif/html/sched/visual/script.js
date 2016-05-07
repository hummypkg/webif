
var visual_notes = {
    'pending': 'Pending schedule command',
    'pending-unschedule': 'Pending unschedule',
    'pending-folder': 'Pending folder change',
    'pending-ar': 'Pending padding change',
    'pending-refresh': 'Pending refresh',
    'pending-skip': 'Pending episode skip'
};

function visual_loaded()
{

$epgpopup = $('#epgpopup').dialog({
	title: "Programme Details",
	modal: false, autoOpen: false,
	height: 500, width: 700,
	show: 'scale', hide: 'fade',
	draggable: true, resizable: true,
	buttons: [
	    {
		text: 'Cancel Recording',
		id: 'b_cancel',
		class: 'ep_button',
		icons: { primary: "ui-icon-trash" },
		click: cancel_recording
	    },
	    {
		text: 'Cancel Pending Change',
		id: 'b_cancelpending',
		class: 'ep_button',
		icons: { primary: "ui-icon-trash" },
		click: cancel_pending
	    },
	    {
		text: 'Skip This Episode',
		id: 'b_skip',
		class: 'ep_button',
		icons: { primary: "ui-icon-seek-next" },
		click: skip_episode
	    },
	    {
		text: 'Record This Showing Instead',
		id: 'b_alternate',
		class: 'ep_button',
		icons: { primary: "ui-icon-transfer-e-w" },
		click: alternate_recording
	    },
	    {
		text: 'Switch to This Series',
		id: 'b_alternateseries',
		class: 'ep_button',
		icons: { primary: "ui-icon-shuffle" },
		click: alternate_series
	    },
	    {
		text: 'More',
		id: 'b_more',
		class: 'ep_button',
		icons: { primary: "ui-icon-arrowthick-1-s" },
		click: function(e) { e.preventDefault(); }
	    },
	    {
		text: 'Close',
		icons: { primary: "ui-icon-close" },
		click: function() { $(this).dialog('close'); }
	    },
	]
});

function cancel_recording()
{
	$('#b_cancel').dojConfirmAction({
		question: 'Cancel Recording?',
		yesAnswer: 'Yes',
		cancelAnswer: 'No'
		}, function(el) {
			var sid = $epgpopup.attr('sid');
			$.get('rpc/cancel.jim?slot=' + sid,
			    function() {
				$('.ct_event[sid=' + sid + ']')
				    .attr('sclass', 'pending-unschedule')
				    .addClass('purpleshade strike');
				$epgpopup.dialog('close');
				$.growl.error({ title: 'Success',
				    message:
				    "The recording has been cancelled." });
				list_reload_required = true;
			});
	});
}

function cancel_pending()
{
	$('#b_cancelpending').dojConfirmAction({
		question: 'Cancel Pending Change?',
		yesAnswer: 'Yes',
		cancelAnswer: 'No'
		}, function(el) {
			var sid = $epgpopup.attr('sid');
			$.get('rpc/cancel.jim', {
				slot: sid,
				table: 'pending'
			    }, function() {
				$('.ct_event[sid=' + sid + ']')
				    .attr('sclass', 'queued-unschedule')
				    .addClass('purpleshade strike');
				$epgpopup.dialog('close');
				$.growl.error({ title: 'Success',
				    message:
				    "The pending change has been cancelled." });
				list_reload_required = true;
			});
	});
}

function skip_episode()
{
	$('#b_skip').dojConfirmAction({
		question: 'Skip Episode?',
		yesAnswer: 'Yes',
		cancelAnswer: 'No'
		}, function(el) {
			var sid = $epgpopup.attr('sid');
			var xs = $epgpopup.attr('xs');
			var xe = $epgpopup.attr('xe');
			$.get('rpc/skip.jim?slot=' + sid +
			    '&service=' + xs + '&event=' + xe,
			    function() {
				$('.ct_event[sid=' + sid + ']')
				    .filter('[xe=' + xe + ']')
				    .attr('sclass', 'pending-skip')
				    .addClass('purpleshade strike');
				$epgpopup.dialog('close');
				$.growl.warning({ title: 'Success',
				    message: "The episode will be skipped." });
				list_reload_required = true;
			});
	});
}

function alternate_series()
{
	$('#b_alternateseries').dojConfirmAction({
		question: 'Switch Series?',
		yesAnswer: 'Yes',
		cancelAnswer: 'No'
		}, function(el) {

//////////////////////////////////////////////////////////////////////

var sid = $epgpopup.attr('sid');
var xs = $epgpopup.attr('xs');
var xe = $epgpopup.attr('xe');
var reckind = $epgpopup.attr('reckind');

if (reckind != 4)
{
	alert('Not a series!');
	return;
}

$.blockUI({message: '<h1><img src=/img/loading.gif> ' +
    'Re-scheduling series... </h1>'});

$.get('/cgi-bin/epg/schedule.jim?type=2&service=' + xs + '&event=' + xe,
    function() {
	$.growl.notice({ title: 'Success', message: "Scheduled new series." });
	$.get('rpc/cancel.jim?slot=' + sid, function() {
		$epgpopup.dialog('close');
		$('.ct_event[sid=' + sid + ']')
		    .addClass('purpleshade strike');
		$.unblockUI();
		$.growl.error({ title: 'Success',
		    message: "Unscheduled old series." });
		page_refresh();
	});
});

//////////////////////////////////////////////////////////////////////

	});
}

function alternate_recording()
{
	$('#b_alternate').dojConfirmAction({
		question: 'Move Recording?',
		yesAnswer: 'Yes',
		cancelAnswer: 'No'
		}, function(el) {

//////////////////////////////////////////////////////////////////////

var sid = $epgpopup.attr('sid');
var xs = $epgpopup.attr('xs');
var xe = $epgpopup.attr('xe');
var oxs = $epgpopup.attr('oxs');
var oxe = $epgpopup.attr('oxe');
var reckind = $epgpopup.attr('reckind');

// If it's a one-off event, schedule the new one and then cancel the old.

if (reckind != 4)
{
	$.blockUI({message: '<h1><img src=/img/loading.gif> ' +
	    'Re-scheduling one-off event... </h1>'});

	$.get('/cgi-bin/epg/schedule.jim?type=1&service=' + xs + '&event=' + xe,
	    function() {
		$.growl.notice({ title: 'Success',
		    message: "Scheduled replacement event." });
		$.get('rpc/cancel.jim?slot=' + sid, function() {
			$epgpopup.dialog('close');
			$('.ct_event[sid=' + sid + ']')
			    .attr('sclass', 'pending-unschedule')
			    .addClass('purpleshade strike');
			$.unblockUI();
			$.growl.error({ title: 'Success',
			    message: "Unscheduled original event." });
			page_refresh();
		});
	});
}
else
{
	$.blockUI({message: '<h1><img src=/img/loading.gif> ' +
	    'Re-scheduling series event... </h1>'});

	$.get('/cgi-bin/epg/schedule.jim?type=1&service=' + xs + '&event=' + xe,
	    function() {
		$.growl.notice({ title: 'Success',
		    message: "Scheduled replacement event." });
		$.get('rpc/skip.jim?slot=' + sid +
		    '&service=' + oxs + '&event=' + oxe, function() {
			$epgpopup.dialog('close');
			$('.ct_event[sid=' + sid + ']')
			    .attr('sclass', 'pending-skip')
			    .addClass('purpleshade strike');
			$.unblockUI();
			$.growl.warning({ title: 'Success',
			    message: "Skipped unwanted episode." });
			page_refresh();
		});
	});
}

//////////////////////////////////////////////////////////////////////

	});

}

function visual_menuclick(action, el, pos)
{
	var sid = $epgpopup.attr('sid');

	switch (action)
	{
            case 'refresh':
		if (confirm('Are you sure you want to refresh events ' +
		    'for this entry?'))
			$.get('rpc/refresh.jim?slot=' + sid,
			    function() {
				$('.ct_event[sid=' + sid + ']')
				    .attr('sclass', 'pending-refresh')
				    .addClass('orangeshade');
				$.growl.warning({ title: 'Success',
				    message: "The schedule entry will be " +
				    "refreshed." });
				$epgpopup.dialog('close');
				list_reload_required = true;
			});
		break;
	}
}

function update_buttons(xs, xe)
{
	var oxs = $epgpopup.attr('oxs');
	var oxe = $epgpopup.attr('oxe');
	var sid = $epgpopup.attr('sid');
	var reckind = $epgpopup.attr('reckind');
	var ocrid = $epgpopup.attr('crid');
	var sclass = $epgpopup.attr('sclass');
	var crid = $.trim($epgpopup.find('span.scrid').text());

	$('.ep_button').hide();
	if (sid < 0)
		return;

	if (sclass.indexOf('pending') >= 0)
	{
		$('#b_cancelpending').show();
		return;
	}

	$('#b_more').show().contextMenu({
		menu: 'visualoptmenu',
		leftButton: true,
		position: {
                    my: "center top",
                    at: "center bottom+5",
                    of: $('#b_more'),
                    collision: "fit"
		}
	}, visual_menuclick);

	if (oxs == xs && oxe == xe)
	{
		// Viewing original event.
		$('#b_alternate,#b_alternateseries').hide();
		$('#b_cancel').show();
		if (reckind == 4)
			$('#b_skip').show();
		else
			$('#b_skip').hide();
	}
	else
	{
		// Viewing alternate event.
		$('#b_alternate').show();
		$('#b_cancel,#b_skip').hide();
		if (reckind == 4 &&crid.toLowerCase() != ocrid.toLowerCase())
			$('#b_alternateseries').show();
		else
			$('#b_alternateseries').hide();
	}
}

function epgpopup(e, o, first)
{
	if (e)
		e.preventDefault();
	var xs = o.attr('xs');
	var xe = o.attr('xe');

	if (!xs || xs == 0 || !xe || xe == 0)
		return;

	if (first)
		$epgpopup.attr('oxs', xs).attr('oxe', xe);
	
	var url = '/cgi-bin/epg/info.jim?bare&service=' + xs + '&event=' + xe +
	    '&bare=1';
	$epgpopup
	    .empty().html('<img src="/img/loading.gif" alt="loading"> ' +
	    'Retrieving details...')
	    .load(url, function() {
		update_buttons(xs, xe);
		$epgpopup.find('a.event').on('click', function(e) {
			epgpopup(e, $(this));
		});
	    })
	    .attr('xs', xs)
	    .attr('xe', xe)
	    .dialog('open');
}

$('.ct_event, .ct_debug')
	.hover(
	    function() { $(this).css('cursor', 'pointer'); },
	    function() { $(this).css('cursor', 'auto'); }
	)
	.qtip({
		position: {
			my: 'bottom center',
			at: 'top center',
			viewport: $(window)
		},
		style: {
			classes: 'qtip-rounded qtip-shadow'
		},
		content: {
			title: function() {
				var reckind = $(this).attr('rc');
				var rsvtype = $(this).attr('et');
				var repeat = $(this).attr('rt');
				var channel = $(this).attr('sz');
				var period = $(this).attr('period');
				var s = '';

				schedule_icons(~~reckind, ~~rsvtype, ~~repeat)
				    .forEach(function(item, index) {
					s += '<img class=visualicon '
					    + 'src=/images/'
					    + item + '.png>';
				});
				return "<span>" + s +
				    '<img class=visualicon ' +
				    'src="/img/channels/out/' +
				    channel + '.png"></span> ' +
				    "<span>" + channel +
				    ' (' + period + ')</span>';
			},
			text:  function() {
				var t = '<center>' + $(this).html();
				var s = $(this).attr('sclass');

				x = visual_notes[s];

				if (x)
					t += '<div class=blood>' + x + '</div>';
				else if ($(this).hasClass('strike') ||
				    $(this).hasClass('orangeshade'))
					t += '<div class=blood>' +
					    'Changes pending</div>';

				t += '</center>';
				return t;
			}
		},
		events: {
			show: function(event, api) {
				var sid = api.target.attr('sid');
				$('.ct_event[sid=' + sid + ']')
				    .addClass('visual_hover');
			},
			hide: function(event, api) {
				var sid = api.target.attr('sid');
				$('.ct_event[sid=' + sid + ']')
				    .removeClass('visual_hover');
			}
		}
	})
	.on('click', function(e) {
		var reckind = ~~$(this).attr('rc');
		if (reckind == 4)	// Series record
		{
			$('#b_skip').show();
			$('#b_cancel .ui-button-text')
			    .text('Cancel Entire Series');
		}
		else
		{
			$('#b_skip').hide();
			$('#b_cancel .ui-button-text')
			    .text('Cancel Recording');
		}
		$('.ep_button').hide();
		$epgpopup.attr('reckind', reckind);
		$epgpopup.attr('sid', $(this).attr('sid'));
		$epgpopup.attr('crid', $(this).attr('crid'));
		$epgpopup.attr('sclass', $(this).attr('sclass'));
		epgpopup(e, $(this), true);
	});

}

