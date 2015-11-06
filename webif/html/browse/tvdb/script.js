
$(function() {

function select_episode()
{
	var sid = $(this).attr('sid');

	$('.tvdbresults').hide();
	$('#tvdbresults_saving').show();
	$('#tvdbresults').diagrefresh();

	$.get('tvdb/store.jim', { dir: dir, sid: sid }, function(data) {
		if (data <= 0)
		{
			window.location.reload(true);
			return;
		}
		$('.tvdbresults').hide();
		$('#tvdbresults_force').show();
		$('#tvdb_forceseries').attr('max', data).val(0);

		$('#tvdbresults').dialog('option', 'buttons', {
		    "Save": function() {
			$('.tvdbresults').hide();
			$('#tvdbresults_saving').show();
			$('#tvdbresults').diagrefresh();
			$.get('tvdb/store.jim', {
				dir: dir,
				sid: sid,
				series: $('#tvdb_forceseries').val()
			    }, function() {
				window.location.reload(true);
			    });
		    }
		});
	});
}

$('#tvdbsetseries').button().on('click', function(e) {
	e.stopPropagation();
	val = $('#tvdbseriesname').text();
	if (!val)
		val = dir.split(/[\\/]/).pop();
	val = val.trim();
	$('#tvdbsearch').val(val);
	$('#tvdbdialogue').dialog({
		modal: true, autoOpen: true,
		height: 'auto', width: 'auto',
		show: 'scale', hide: 'fade',
		draggable: true, resizable: true,
		closeOnEscape: true,
		buttons: [
		  {
		text: "Search",
		icons: { primary: "ui-icon-search" },
		click: function() {
			$(this).dialog('close');
			$('.tvdbresults').hide();
			$('#tvdbresults_loading').show();
			$('#tvdbresults_inner').empty();
			$('#tvdbresults').dialog({
				modal: true, autoOpen: true,
				height: 'auto', width: 'auto',
				show: 'scale', hide: 'fade',
				draggable: true, resizable: true,
				closeOnEscape: true,
				buttons: {
				    "Cancel": function() {
					$(this).dialog('close');
				    }
				}
			});
			$('#tvdbresults_inner').load('tvdb/search.jim',
			    { term: $('#tvdbsearch').val() }, function() {
				$('#tvdbresults_inner')
				    .find('.tvdbselect')
				    .button()
				    .on('click', select_episode);
				$('#tvdbresults_loading').slideUp('slow');
				$('#tvdbresults_inner').show();
				$('#tvdbresults').diagrefresh({
				    width: $(window).width() - 100,
				    height: $(window).height() - 100
				});
			});
		    }
		  },
		  {
			text: "Clear Series Information",
			'class': 'red',
			click: function() {
				if (!confirm('Clear series information for ' +
				    'this folder?'))
					return;
				blockpage('Clearing Series Information...');
				$.get('tvdb/store.jim', {dir: dir, sid: 0},
				    function() {
					window.location.reload(true);
				});
			}
		  },
		  {
			text: "Close",
			click: function() {
				$(this).dialog('close');
			}
		  }
		]
	});
});

$('img.tvdbbannertop').hover(
    function() { $(this).css('cursor', 'pointer'); },
    function() { $(this).css('cursor', 'auto'); }
).on('click', function() {
	var sid = $(this).closest('div').attr('sid');
	window.open('http://thetvdb.com/?tab=series&id=' + sid, '_blank');
});

});

