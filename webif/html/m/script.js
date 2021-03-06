
function s(query) {return $("div.ui-page-active " + query);}

$(document).on('pageshow', '#indexpage', function() {
console.log('pageshow - indexpage');
	$('div.status').last().empty()
	    .load('/cgi-bin/status.jim', function() {
		$(this).slideDown('slow');
	});
});

$(document).on('pagecreate', '#indexpage', function() {
console.log('pagecreate - indexpage');
	$('a.refresh').on('click', function(e) {
		e.preventDefault();
		$.mobile.loading('show');
		window.location.reload(true);
	});

	$('#xepgsearch').hide('fast');
	$('#epgsearch').on('click', function(e) {
		e.preventDefault();
		$('#xepgsearch').toggle('slow');
	});
});

$(document).on('pagecreate', '#event_dpage', function() {
	$('a.schedule').click(function(e) {
		e.preventDefault();
		$.mobile.loading('show');
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

$(document).on('pagecreate', '#schedule_dpage', function() {
	$('#delevent').click(function(e) {
		e.preventDefault();
		if (!confirm('Confirm event cancellation?'))
			return;
		$.mobile.loading('show');
		$.get('/sched/cancel.jim' +
		    '?slot=' + $(this).attr('slot') +
		    '&table=' + $(this).attr('tab'), function() {
			$('.ui-dialog').dialog('close');
			$.mobile.loading('show');
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

$(document).on('pagecreate', '#browsepage', function() {
	var dir = $('span.dir').last().text();

	//console.log('DIR: %O', dir);

	// Load folder sizes
	$.getJSON('/browse/sizes.jim?dir=' + encodeURIComponent(dir),
		folder_size_callback);

	// Flag folders with unwatched items
	$.getJSON('/browse/newdir.jim?dir=' + encodeURIComponent(dir),
		new_folder_callback);

	// Flag shrunk recordings
	$.getJSON('/browse/shrunk.jim?dir=' + encodeURIComponent(dir),
		shrunk_callback);
});

var opkgreload = false;
function execopkg(arg, pkg)
{
	$.mobile.loading('show');
	s('a').disable();
	s('.opkg_op_complete').hide('fast');
	s('.opkg_popup_text')
	    .empty()
	    .html('<img src=/img/spin.gif> Processing...');
	s('.opkg_popup').popup('open', {transition: 'pop'})
	s('.opkg_popup_text').load('/cgi-bin/opkg.jim?cmd=' + arg, function() {
		s('.opkg_op_complete').slideDown('slow');
		if (opkgreload)
			window.location.reload(true);
		else
		{
			if (pkg)
				s('.pkg_' + pkg).slideUp();
			$.mobile.hidePageLoadingMsg();
			s('a').enable();
		}
	});
}

$(document).on('pagecreate', '#pkga,#pkgi,#pkgu', function() {

	$('a.remove, a.install, a.upgrade')
	    .click(function() {
		if ($(this).attr('action') == 'remove' &&
		    !confirm('Please confirm removal of the ' +
		    $(this).attr('pkg') + ' package.'))
			return;

		execopkg(encodeURIComponent($(this).attr('action') +
		    ' ' + $(this).attr('pkg')), $(this).attr('pkg'));
	});

	$('button.opkg_update').on('click', function() {
		opkgreload = true;
		execopkg('update');
	});

	$('button.opkg_upgrade').on('click', function() {
		opkgreload = true;
		execopkg('upgrade');
	});
});

$(document).on('pagecreate', '#servicespage', function() {

	// Don't allow turning off the web server from within the web server..
	$('select[service=mongoose]').disable();

	$('select.auto,select.toggle').on('change', function() {
		var url = '/cgi-bin/service.jim?action=' +
		    escape($(this).attr('act')) +
		    '&service=' +
		    escape($(this).attr('service'));
		$.get(url);
	});

});

