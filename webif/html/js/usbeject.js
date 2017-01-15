
String.prototype.capitalise = function() {
	return this.charAt(0).toUpperCase() + this.slice(1);
}

var usbeject_lastupd = 0;
var usbeject_visible = 0;

$('#usbeject').on('click', function(e) {
	e.stopPropagation();
	if (usbeject_visible)
	{
		$('#usbejectinfo').slideUp();
		usbeject_visible = 0;
		return;
	}
	if (+new Date() - usbeject_lastupd <= 5000)
	{
		$('#usbejectinfo').slideDown();
		usbeject_visible = 1;
		return;
	}
	usbeject_lastupd = +new Date();
	$('#usbejecttab tbody').empty();
	$('#usbejectout').html('<img src=/img/spin.gif> ' +
	    '<span class=blood>Scanning media...</span>');
	usbeject_visible = 1;
	$('#usbejectinfo').slideDown();
	$.getJSON('/cgi-bin/usbinfo.jim', function(data) {
		var num = 0;

		$.each(data.mounts, function(k,v) {
			num++;
			var size = v.SIZE / 1000000000;
			if (size >= 1000)
				size = (size / 1000).toFixed(1) + "TB";
			else
				size = size.toFixed(1) + "GB";
			var type = v.TYPE;
			var drive = v.MP.split(/[/]/).pop().capitalise();
			switch (type)
			{
				case 'vfat':
					type = 'FAT';
				case 'Unknown':
					break;
				default:
					type = type.toUpperCase();
			}
			$('#usbejecttab').append(
			    '<tr><td><img class=va height=20 ' +
				'src=/img/usb.png></td>' +
			    '<td class=usblabel>' + v.LABEL + '</td>' +
			    '<td class=blood>(' + drive + '&nbsp;-&nbsp;' +
				type + '&nbsp;' + '&nbsp;-&nbsp;' +
				size + ')</td>' +
			    '<td class="va pie" data-percent="' + v.USED +
				'"></td>' +
			    '<td style="padding-left: 10px">' + v.USED +
				'%' + '</td>' +
			    '<td><img class="va eject" border=0 height=20' +
				' drive=' + v.MP +
				' label="' + v.LABEL + '"' +
				' src=/img/media-eject.png></td>' +
			    '</tr>');
			$('#usbejecttab .pie').easyPieChart({
				size: 20,
				barColor: '#00ff00',
				trackColor: '#A3A3C2',
				lineWidth: 4,
				scaleColor: false,
				lineCap: 'butt'
			});
		});

		if (data.disks)
		    $.each(data.disks, function(k,v) {
			num++;
			$('#usbejecttab').append(
			    '<tr><td><img class=va height=20 ' +
				'src=/img/usb.png></td>' +
			    '<td class=usblabel>' + v.device + '</td>' +
			    '<td colspan=3 class=blood>' +
			    '(Device not mounted)</td>' +
			    '<td><img class="va rescan" border=0 height=20' +
				' device=' + v.device +
				' src=/img/media-rescan.png></td>' +
			    '</tr>');
		    });

		$('#usbejectout').empty();
		if (!num)
			$('#usbejectout').html('No removable drives found.');
	});
}).on('click', 'img.eject', function(e) {
	e.stopPropagation();
	var btn = $(this);
	var drive = btn.attr('drive');
	var label = btn.attr('label');
	if (!confirm('Eject ' + label + '?'))
		return;
	$('#usbejectout').html('<img src=/img/spin.gif> ' +
	    '<span class=blood>Ejecting ' + label + '</span>');
	$.getJSON('/cgi-bin/usbeject.jim', {
	    label: label,
	    drive: drive
	    }, function(data) {
		$('#usbejectout').html(data.result);
		if (data.status)
			// Success
			btn.closest('tr').slideUp('slow', function() {
				$(this).remove();
			});
	    });
}).on('click', 'img.rescan', function(e) {
	e.stopPropagation();
	var btn = $(this);
	var dev = btn.attr('device');
	if (!confirm('Rescan ' + dev + '?'))
		return;
	$('#usbejectout').html('<img src=/img/spin.gif> ' +
	    '<span class=blood>Re-scanning ' + dev + '</span>');
	$.getJSON('/cgi-bin/usbrescan.jim', {
	    device: dev
	    }, function(data) {
		$('#usbejectout').html(data.result);
		if (data.status)
			// Success
			btn.closest('tr').slideUp('slow', function() {
				$(this).remove();
			});
	    });
});

