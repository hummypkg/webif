
$(document).ready(function() {

var url = $('#url').text();

var vlc = VLCobject.embedPlayer('vlc', 800, 450, true);
vlc.play(encodeURI(url));

if (window.console)
	console.log("Playing: %o", url);

});

