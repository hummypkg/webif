(function($)
{
	$.fn.enable = function()
	{
		return this.each(function() {
			$(this)
			    .removeClass('ui-state-disabled')
			    .removeClass('ui-button-disabled')
			    .removeProp('disabled')
			    .removeAttr('aria-disabled');
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
