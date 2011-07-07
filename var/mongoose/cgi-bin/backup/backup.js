
function refresh_files()
{
	$('#backup_files').load('/cgi-bin/backup/files.jim', function() {
		$('input.restore').change(function() {
			$('#restore_button').removeAttr('disabled')
			    .button('option', 'disabled', false);
			$('#delete_button').removeAttr('disabled')
			    .button('option', 'disabled', false);
		});
	});
}

$(document).ready(function() {
	$('button').button();

	refresh_files();

	$('#backup_button').click(function() {
		$('#backup_working').slideDown();
		$('#results').load('/cgi-bin/backup/backup.jim?' +
		    $('#backup_name').serialize(), function() {
			$('#results').slideDown(function() {
				$('#backup_working').slideUp();
				refresh_files();
			});
		});
	});
	$('#delete_button').click(function() {
		var backup = $('input.restore').val();
		if (confirm('Confirm deletion of ' + backup))
		{
			$('#results').load('/cgi-bin/backup/delete.jim?' +
			    $('input.restore').serialize(), function() {
				$('#results').slideDown(function() {
					refresh_files();
				});
			});
		}
	});
	$('#restore_button').click(function() {
		var backup = $('input.restore').val();
		if (confirm('!!!!!!!!!!!!!!!!!!!!!!!!! PLEASE CONFIRM !!!!!!!!!!!!!!!!!!!!!!!!!\n\nAre you sure you wish to erase all scheduled recordings and favourite channels and then restore them from\n' + backup + '?'))
		{
			$('#restore_working').slideDown();
			$('#results').load('/cgi-bin/backup/restore.jim?' +
			    $('input.restore').serialize(), function() {
				$('#results').slideDown(function() {
					$('#restore_working').slideUp();
					refresh_files();
					alert('!!!!!!!!!!!!!! PLEASE NOTE !!!!!!!!!!!!!!\n\nAfter a restore you must restart the box using the link at the top of the screen or via the remote control and then add at least one scheduled entry using the remote control (which you can then delete).');
					window.location.reload(true);
				});
			});
		}
	});
});

