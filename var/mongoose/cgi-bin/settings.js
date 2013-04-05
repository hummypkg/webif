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
	//$('[type="checkbox"] :not(.yesno)').iphoneStyle();
	$('[type="checkbox"]').iphoneStyle({
		checkedLabel: 'YES',
		uncheckedLabel: 'NO'
	});
	$('form.auto').each(function(i, el) {
		var id = $(this).attr('id');
		var output = '#' + id + '_output';
		$(this).ajaxForm({
			target: output,
			success: function() {
			    $(output)
				.css('font-style', 'italic')
			    	.show('slow')
			    	.delay(2000)
				.fadeOut('slow');
			}
		});
	});

	$('.setting_toggle').change(function() {
		var arg = '0';
		var urlargs;
		if ($(this).attr('checked'))
			arg = '1';

		if ($(this).attr('invert'))
			arg = arg == "0" ? "1" : "0";

		var el = $(this);
		var attr = $(this).attr('attr');
		var output = '#' + attr + '_output';

		if ($(this).attr('useval'))
			urlargs = 'act=' + attr + '&val=' + arg;
		else
			urlargs = attr + '=' + arg;

		$(this).disable();

		$(output)
		    .empty()
		    .show('slow')
		    .load('/cgi-bin/settings.jim?' + urlargs,
		        function() {
				$(el).enable();
				$(output)
				    .css('font-style', 'italic')
				    .delay(2000).fadeOut('slow');
		    });
	});
});

