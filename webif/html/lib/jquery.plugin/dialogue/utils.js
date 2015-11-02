(function($)
{
	$.fn.diagrefresh = function(options)
	{
		var defaults = {
			height: 'auto',
			width: 'auto'
		};

		var settings = $.extend(defaults, options);

		return this.each(function() {
			$(this)
			    .dialog('option', 'position', {
				my: "center", at: "center", of: window
			    })
			    .dialog('option', 'height', settings.height)
			    .dialog('option', 'width', settings.width);
		});
	};
})(jQuery);
