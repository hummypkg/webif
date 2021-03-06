
function refresh_backup_files()
{
	$('#restore_button,#delete_button,#view_button')
	    .button('option', 'disabled', true);
	$('#backup_files').load('backup/files.jim', function() {
		$('input.restore').change(function() {
			$('#restore_button,#delete_button,#view_button')
			    .removeAttr('disabled')
			    .button('option', 'disabled', false);
		});
	});
}

function backup_loaded()
{

$('#backup_button').button({icons: {primary: "ui-icon-disk"}});
$('#restore_button').button({icons: {primary: "ui-icon-play"}});
$('#delete_button').button({icons: {primary: "ui-icon-trash"}});
$('#view_button').button({icons: {primary: "ui-icon-script"}});

refresh_backup_files();

$('#backup_button').click(function() {
	$('#backup_working').slideDown();
	$('#backup_results').load('backup/backup.jim?' +
	    $('#backup_name').serialize(), function() {
		$('#backup_results').slideDown(function() {
			$('#backup_working').slideUp();
			refresh_backup_files();
		});
	});
});
$('#delete_button').click(function() {
	var backup = $('input.restore:checked').val();
	if (confirm('Confirm deletion of ' + backup))
	{
		$('#backup_results').load('backup/delete.jim?' +
		    $('input.restore').serialize(), function() {
			$('#backup_results').slideDown(function() {
				refresh_backup_files();
			});
		});
	}
});
$('#view_button').click(function() {
	var backup = $('input.restore:checked').val();
	$('#backup_results').load('backup/view.jim?' +
	    $('input.restore').serialize(), function() {
		$('#backup_results').slideDown(function() {
			refresh_backup_files();
		});
	});
});
$('#restore_button').click(function() {
	var backup = $('input.restore:checked').val();
	if (confirm('!!!!!!!!!!!!!!!!!!!!!!!!! PLEASE CONFIRM !!!!!!!!!!!!!!!!!!!!!!!!!\n\nAre you sure you wish to erase all scheduled recordings and favourite channels and then restore them from\n' + backup + '?'))
	{
		$('#restore_working').slideDown();
		$('#backup_results').load('backup/restore.jim?' +
		    $('input.restore').serialize(), function() {
			$('#backup_results').slideDown(function() {
				$('#restore_working').slideUp();
				refresh_backup_files();
				$('#restore_warning').slideDown();
				$('#restart_block').slideDown('slow');
				list_reload_required = true;
				visual_reload_required = true;
			});
		});
	}
});

}

