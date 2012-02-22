(function($)
{
	$.fn.tabsupport = function()
	{
		return this.each(function() {
		    $(this).keydown(function(e) {
			if (e.keyCode == 9)
			{
				var el = $(this).get(0);
				var start = el.selectionStart;
				var end = el.selectionEnd;
				$(this).val(
				    $(this).val().substring(0, start) +
				    "\t" +
				    $(this).val().substring(end)
				);
				el.selectionStart = el.selectionEnd = start + 1;
				return false;
			}
		    });
		});
	}
})(jQuery);
