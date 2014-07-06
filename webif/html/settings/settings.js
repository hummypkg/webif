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
		if ($(this).prop('checked'))
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
		    .html('<img src=/img/loading.gif> Please wait...')
		    .load('/settings/settings.jim?' + urlargs,
		        function() {
				$(el).enable();
				$(output)
				    .css('font-style', 'italic')
				    .delay(2000).fadeOut('slow');
		    });
	});

	// Use window.name to remember the active accordion index
	if (window.name == "")
		window.name = "0";
	accordionindex = ~~window.name;

	$('#accordion').accordion({
	    active: accordionindex,
	    header: 'h4',
	    collapsible: true,
	    heightStyle: 'content',
	    activate: function(event, ui) {
		window.name = $('#accordion').accordion('option', 'active');
	    }
	}).show();

	$('[type="checkbox"]').iphoneStyle({
		checkedLabel: 'YES',
		uncheckedLabel: 'NO'
	});

	// For now - until plugins are updated.
	$('div.pluginsettings').find('br + br').remove();
});

