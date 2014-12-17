
$(function() {

// 0 - client side
// 1 - server side
var mode = -1;
var logfile;
var logdata;

var pageroptions = {
	container: $('.pager'),
	output: 'Showing {startRow} - {endRow} / {filteredRows}',
	size: 50,
	fixedHeight: true,
	removeRows: false,
	cssGoto: '.gotoPage'
};

var pageroptionsajax = $.extend({
 ajaxUrl: 'fetch.jim?page={page}&size={size}&{sortList:col}&{filterList:fcol}',
 customAjaxUrl: function(table, url) {
	var nurl = 'fetch.jim?file=' + encodeURIComponent(logfile) +
	    '&' + url.substring(10);
	alert(nurl);
	return nurl;
 }
}, pageroptions);

function loadlog_ajax()
{
	$('#loginfo').append(' <i>(Ajax)</i>');
	if (mode != 1)
	{
		//$('#logtab').trigger('destroy.pager');
		$('#logtab').tablesorterPager(pageroptionsajax);
		$('#logtab').trigger('pageSet', 0);
		mode = 1;
	}
	loadedlog();
}

function loadlog_entire(data)
{
	var lines = 0;

	if (data.lines > 5000)
	{
		lines = 5000;
		$('#loginfo').append(' - <i>showing 5000 most recent.</i>');
	}
		
	$.get('fetch.jim', {
		'file': logfile,
		'lines': lines
	     }, function(data) {
		if (mode != 0)
		{
			$('#logtab').trigger('destroy.pager');
			$('#logtab').tablesorterPager(pageroptions);
			mode = 0;
		}
		$('#logtab tbody').html(data).trigger('update');
		$('#logtab').trigger('update');
		loadedlog();
	});
}

function loadlog(file, ajax)
{
	$('button').button('disable');

	if (!file || file == '0')
		return;

	$('#logarea').slideDown();
	$('#loginfo').empty();
	$('#loading').show('fast');
	$('#logtab tbody').empty();

	// Fetch log info
	$.getJSON('loginfo.jim', { 'file': file }, function(data) {
		$('#loginfo').html(data.pretty_size +
		    ' (' + data.lines + ' line' +
		    (data.lines == 1 ? "" : "s") + ')');
		logfile = file;
		logdata = data;
		if (ajax)
			loadlog_ajax(data);
		else
			loadlog_entire(data);
	});
}

function loadedlog()
{
	$('#logtab')
	    .trigger('filterReset')
	    .trigger('sorton', [[[0,1]]]);
	$('#loading').hide('fast');

	$('button').button('enable');

	if (logdata.lines == 0)
	{
		$('#logtab tbody')
		  .html('<tr><td></td><td><i>Log is empty...</i></td></tr>');
		$('#clear').button('disable');
	}

	var hl = $('#highlight').val();
	if (hl && hl.length)
		$('#highlight').trigger('keyup');
}

$('#logtab')
    .tablesorter({
	theme: 'green',
	sortList: [[0,1]],
	headerTemplate : '{content} {icon}',
	widthFixed: true,
	widgets: ['zebra', 'filter']
    });

$('#clear').button({icons: { primary: "ui-icon-trash" }})
    .on('click', function() {
	if (confirm('Are you sure you wish to clear ' + logfile + '?'))
		$.get('act.jim', {
			'file': logfile,
			'action': 'clear'
		    }, function() {
			loadlog(logfile);
		    });
    });

$('#reload').button({icons: { primary: "ui-icon-refresh" }})
    .on('click', function() {
	$('#log').trigger('change');
    });

$('#highlight').bindWithDelay('keyup', function(e) {
	$('#logtab tbody').removeHighlight().highlight($(this).val());
}, 500);

$('#log').on('change', function() {
	loadlog($('#log').val())
}).trigger('change');

});

