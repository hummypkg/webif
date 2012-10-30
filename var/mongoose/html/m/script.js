
function s(query) {return $("div.ui-page-active " + query);}

$(document).bind('pageinit', function() {
	$('div.status').last().load('/cgi-bin/status.jim', function() {
		$(this).slideDown('slow');
	});
	$('a.refresh').on('click', function(e) {
		e.preventDefault();
		$.mobile.showPageLoadingMsg();
		window.location.reload(true);
	});
});

$(document).delegate('#indexpage', 'pageinit', function() {
	$('#epgsearch').on('click', function(e) {
		e.preventDefault();
		$('#xepgsearch').toggle('slow');
	});
});

$(document).delegate('#event_dpage', 'pageinit', function() {
	$('a.schedule').click(function(e) {
		e.preventDefault();
		$.mobile.showPageLoadingMsg();
		$('#epginfo_extra').load('/cgi-bin/epg/schedule.jim?' +
		    'service=' +
		    encodeURIComponent($(this).attr('sid')) +
		    '&event=' +
		    encodeURIComponent($(this).attr('eid')) +
		    '&type=' +
		    $(this).attr('stype'), function() {
			$('a.schedule').fadeOut('slow');
		    });
	});
});

$(document).delegate('#schedule_dpage', 'pageinit', function() {
	$('#delevent').click(function(e) {
		e.preventDefault();
		if (!confirm('Confirm event cancellation?'))
			return;
		$.mobile.showPageLoadingMsg();
		$.get('/sched/cancel.jim' +
		    '?slot=' + $(this).attr('slot') +
		    '&table=' + $(this).attr('tab'), function() {
			$('.ui-dialog').dialog('close');
			$.mobile.showPageLoadingMsg();
			window.location.reload(true);
		});
	});
});

function insert_folder_size(folder, size)
{
	folder = folder.replace(/ /g, '');
	folder = folder.replace(/([ #;&,.+*~\':"!^$[\]()=>|\/@])/g, '\\$1');
	//console.log("Folder: (%s) = (%s)", folder, size);
	if (size.search(/\d$/) == -1)
		size += 'iB';
	else
		size += ' bytes';
	if (folder == "")
		$('span.dirsize').text(size);
	else
		$('#' + folder).text(size);
}

function folder_size_callback(data, status, xhr)
{
	//console.log("Status: %s", status);
	//console.dir(data);
	$.each(data, insert_folder_size);
}

function set_folder_new(folder, cnt)
{
	folder = folder.replace(/ /g, '');
	folder = folder.replace(/([ #;&,.+*~\':"!^$[\]()=>|\/@])/g, '\\$1');
	//console.log("Folder: (%s) = (%s)", folder, cnt);
	$('#img' + folder).attr('src', '/img/Folder_New.png');
}

function new_folder_callback(data, status, xhr)
{
	//console.log("Status: %s", status);
	//console.dir(data);
	$.each(data, set_folder_new);
}

function insert_shrunk(file, perc)
{
	if (perc == 0)
	{
		file = file.replace(/[ ]/g, '');
		file = file.replace(/([ #;&,.+*~\':"!^$[\]()=>|\/@])/g, '\\$1');
		//console.log("File: (%s) = (%s)", file, perc);
		$('#sp_' + file).show();
	}
}

function shrunk_callback(data, status, xhr)
{
	//console.log("Status: %s", status);
	//console.dir(data);
	$.each(data, insert_shrunk);
}

$(document).delegate('#browsepage', 'pageinit', function() {
	var dir = $('span.dir').last().text();

	//console.log('DIR: %O', dir);

	// Load folder sizes
	$.getJSON('/cgi-bin/browse/sizes.jim?dir=' + encodeURIComponent(dir),
		folder_size_callback);

	// Flag folders with unwatched items
	$.getJSON('/cgi-bin/browse/newdir.jim?dir=' + encodeURIComponent(dir),
		new_folder_callback);

	// Flag shrunk recordings
	$.getJSON('/cgi-bin/browse/shrunk.jim?dir=' + encodeURIComponent(dir),
		shrunk_callback);
});


