var curval = 0;
var $slider;

function
setvals()
{
	values = $.trim($('#bookmarks').val()).split(/ +/);
	if (!values.length || values[0] == '')
	{
		refreshtimes();
		return;
	}
	nvalues = [];
	$.each(values, function(k, v) {
		if (v > len)
			v = len;
		if (v < 0)
			v = 0;
		nvalues.push(v);
	});
	values = nvalues;
	$('#bookmarks').val(values.join(' '));
	sortmarks();
	refreshtimes();
}

function
draw_slider()
{
	if ($slider)
		$slider.slider('destroy');
	else
		$slider = $('#slider');
	setvals();
	values = $.trim($('#bookmarks').val()).split(/ +/);
	if (!values.length || values[0] == '')
	{
		$slider = null;
		return;
	}
	$slider.slider({
		min: 0,
		max: len,
		step: 1,
		values: values,
		start: function(event, ui) {
			curval = ui.value;
		},
		stop: function(event, ui) {
			curval = ui.value;
			sortmarks();
			refreshtimes();
		},
		slide: function(event, ui) {
			var marks = '';
			for (var i = 0; i < ui.values.length; ++i)
				marks += ui.values[i] + ' ';
			$('#bookmarks').val($.trim(marks));
			setvals();
		}
	});
};

function
refreshtimes()
{
	var t = '';
	values = $.trim($('#bookmarks').val()).split(/ +/);
	if (!values.length || values[0] == '')
	{
		$('#bookmarkstime').text(t);
		return;
	}
	$.each(values, function(k, v) {
		t += new Date(null, null, null, null, null, v)
		    .toTimeString().match(/\d{2}:\d{2}:\d{2}/)[0] + ' ';
	});
	$('#bookmarkstime').text(t);
}

function
sortmarks()
{
	var a = $.trim($('#bookmarks').val()).split(/ +/);
	a.sort(function(a, b){return a-b});
	$('#bookmarks').val(a.join(" "));
}

$(function() {

$('#bookmarks').val($('#bookmarks').attr('init'));
draw_slider();

$('#addbmark').button({icons: {primary: "ui-icon-plus"}, text: false})
    .on('click', function() {
	$('#bookmarks').val('0 ' + $('#bookmarks').val());
	draw_slider();
});

$('#delbmark').button({icons: {primary: "ui-icon-minus"}, text: false})
    .on('click', function() {
	var cur = $('#bookmarks').val();
	cur = $.trim(cur.replace(
	    new RegExp('(^| )' + curval + '( |$)', ''), ' '));
	$('#bookmarks').val(cur);
	draw_slider();
});

$('#save').button({icons: {primary: "ui-icon-disk"}})
    .on('click', function() {
	$.post('save.jim', {
		file: file,
		bookmarks: $('#bookmarks').val()
	}, function(data) {
		$('#results').html(data)
		    .slideDown('slow').delay(5000).slideUp('slow');
	});
});

$('#back').button({icons: {primary: "ui-icon-arrowreturnthick-1-w"}})
    .on('click', function() {
	window.location = '/go/browse?dir=' + dir;
});

$('#update').button()
    .on('click', function() {
	draw_slider();
});


});

