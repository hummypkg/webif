
$('#network_settings form').resetForm();

$('#network_settings').on('change', 'input[name=mode]', function(el) {
	var form = $(this).closest('form');

	val = $(form).find('input[name=mode]:checked').val();

	if (val == 'dhcp')
		$(form).find('input.static').disable();
	else
		$(form).find('input.static').enable();
});

$('#network_settings input[name=mode]').trigger('change');

$('#ns_pp_toggle').on('click', function(e) {
	e.preventDefault();
	if ($('#ns_pp').attr('type') == 'password')
	{
		$('#ns_pp').attr('type', 'input');
		$('#ns_pp_toggle').text('Hide');
	}
	else
	{
		$('#ns_pp').attr('type', 'password');
		$('#ns_pp_toggle').text('Reveal');
	}
});

$('#ns_ssid_scan').button({
       icons : {
        primary : "ui-icon-signal-diag"
       }
}).button('enable')
.on('click', function(e) {
	e.preventDefault();
	$('#ns_ssid_scan').button('disable');
	$('#ns_ssid_loading').show();
	$('#ns_ssid_list tbody').empty();
	$('#ns_ssid_list_row').slideDown();

	$.getJSON('/cgi-bin/wifiscan.jim', function(data) {
		$.each(data, function(k,v) {
			index = Math.round(v.quality / 20);
			if (index > 5) index = 5;
			str = 
'<tr><td><img class=va height=20 src=/images/345_5_08_ST_WiFi_Signal_0' +
    index + '.png alt="' + v.quality + '%"></td>';
if (v.encryption == 'on')
	str += '<td><img height=20 src=/images/178_1_00_Icon_Lock.png></td>';
else
	str += '<td></td>';
str += '<td><a class=ssid href=#>' + v.ssid + '</a></td>';
str += '<td class=footnote>(Channel ' + v.channel + ')</td>';
str += '</tr>';
			$('#ns_ssid_list').append(str);
		});

		$('#ns_ssid_loading').hide();
		$('#ns_ssid_scan').button('enable');
	});
});

$('#ns_ssid_list').on('click', 'a.ssid', function(el) {
	el.preventDefault();
	var form = $(this).closest('form');
	$(form).find('input[name=ssid]').val($(this).text());
});



