(function($)
{
	$.fn.enable = function()
	{
		return this.each(function() {
			$(this)
			    .removeClass('ui-state-disabled')
			    .removeProp('disabled');
		});
	};

	$.fn.disable = function()
	{
		return this.each(function() {
			$(this)
			    .addClass('ui-state-disabled')
			    .prop('disabled', true);
		});
	};
})(jQuery);

$(document).ready(function () {
	$(":submit").button();
	$(":checkbox").iphoneStyle();
	$('form.auto').each(function(i, el) {
		var id = $(this).attr('id');
		var output = '#' + id + '_output'
		$(this).ajaxForm({
			target: output,
			success: function() {
			    $(output).css('font-style', 'italic');
			    $(output).show('slow');
			    $(output).delay(2000).fadeOut('slow');
			}
		});
	});

	$('#pkgdev').change(function() {
		var arg = '0';
		if ($(this).attr('checked'))
			arg = '1';

		$(this).disable();

		$('#pkgdev_output')
		    .empty()
		    .show('slow')
		    .load('/cgi-bin/settings.jim?pkgdev=' + arg,
		        function() {
				$('#pkgdev').enable();
				$('#pkgdev_output')
				    .css('font-style', 'italic')
				    .delay(2000).fadeOut('slow');
		    });
	});

	$('#https_toggle').change(function() {
		var arg = 'off';
		if ($(this).attr('checked'))
			arg = 'on';

		$(this).disable();

		$('#https_output')
		    .empty()
		    .html('<img src=/img/loading.gif>Please Wait...')
		    .show('slow')
		    .load('/cgi-bin/settings.jim?act=https&val=' + arg,
		        function() {
				$('#https_toggle').enable();
				$('#https_output')
				    .css('font-style', 'italic')
				    .delay(2000).fadeOut('slow');
		    });
	});

	$('#toolbar_toggle').change(function() {
		var arg = '1';
		if ($(this).attr('checked'))
			arg = '0';

		$(this).disable();

		$('#toolbar_output')
		    .empty()
		    .show('slow')
		    .load('/cgi-bin/settings.jim?notoolbar=' + arg,
		        function() {
				$('#toolbar_toggle').enable();
				$('#toolbar_output')
				    .css('font-style', 'italic')
				    .delay(2000).fadeOut('slow');
		    });
	});
});

