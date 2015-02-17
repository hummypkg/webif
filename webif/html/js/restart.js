$('#restart_humaxtv').button({icons:{primary:"ui-icon-power"}})
    .on('click', function(e) {
	e.stopPropagation();
	window.location = '/restart/index.jim';
    });

