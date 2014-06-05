/*
 * jQuery Plugin : jConfirmAction
 * 
 * Original by Hidayat Sagita
 * http://www.webstuffshare.com
 * Licensed Under GPL version 2 license.
 *
 * Modified by af123
 */
(function($){
	jQuery.fn.dojConfirmAction = function(options, callback) {
		var options = jQuery.extend ({
			question: "Are You Sure?",
			yesAnswer: "Yes",
			cancelAnswer: "Cancel"
		}, options);

		var obj = $(this);

		if (obj.next('.jcaquestion').length <= 0)
			obj.after('<div class=jcaquestion>' +
			    options.question + '<br/>' +
			    '<span class=jcayes>' + options.yesAnswer +
			    '</span>' +
			    '<span class=jcacancel>' + options.cancelAnswer +
			    '</span></div>');

		o = obj.next('.jcaquestion');

		o.animate({opacity: 1}, 300);
		o.find('.jcayes').on('click', function() {
			o.animate({opacity: 0}, 300);
			callback(obj);
		});
		o.find('.jcacancel').on('click', function() {
			o.animate({opacity: 0}, 300);
		});
	}

	jQuery.fn.jConfirmAction = function(options, callback) {
		return this.each(function () {
			$(this).on('click', function(e) {
				e.preventDefault();
				$(this).dojConfirmAction(options, callback);
			});
		});
	};
	
})(jQuery);
