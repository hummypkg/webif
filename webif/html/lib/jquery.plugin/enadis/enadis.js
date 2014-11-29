(function($)
{
	$.fn.enable = function()
	{
		return this.each(function() {
			$(this)
			    .removeClass('ui-state-disabled')
			    .removeClass('ui-button-disabled')
			    .prop('disabled', false)
			    .removeAttr('aria-disabled')
			    .disabled = false;
		});
	};

	$.fn.disable = function()
	{
		return this.each(function() {
			$(this)
			    .addClass('ui-state-disabled')
			    .prop('disabled', true)
			    .disabled = true;
		});
	};
})(jQuery);
