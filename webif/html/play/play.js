
$(function() {

$('#back').button({icons: {primary: "ui-icon-arrowreturnthick-1-w"}})
    .on('click', function() {
	window.location = '/go/browse?dir=' +
	    encodeURIComponent($(this).attr('dir'));
});

var url = $('#url').text();
var duration = $('#duration').text();

var vlc = VLCobject.embedPlayer('vlc', 800, 450, true);
vlc.play(encodeURI(url));

if (window.console)
	console.log("Playing: %o", url);

});

