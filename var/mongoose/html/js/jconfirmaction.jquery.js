/*
 * jQuery Plugin : jConfirmAction
 * 
 * by Hidayat Sagita
 * http://www.webstuffshare.com
 * Licensed Under GPL version 2 license.
 *
 */
(function($){

	jQuery.fn.jConfirmAction = function (options, callback) {
		
		// Some jConfirmAction options (limited to customize language) :
		// question : a text for your question.
		// yesAnswer : a text for Yes answer.
		// cancelAnswer : a text for Cancel/No answer.
		var theOptions = jQuery.extend ({
			question: "Are You Sure?",
			yesAnswer: "Yes",
			cancelAnswer: "Cancel"
		}, options);
		
		return this.each (function () {
			$(this).click(function(e) {

				e.preventDefault();

				var p = $(this);
				
				if($(this).next('.question').length <= 0)
					$(this).after('<div class="jcaquestion">'+theOptions.question+'<br/> <span class="jcayes">'+theOptions.yesAnswer+'</span><span class="jcacancel">'+theOptions.cancelAnswer+'</span></div>');
				
				$(this).next('.jcaquestion').animate({opacity: 1}, 300);
				
				$('.jcayes').bind('click', function() {
					callback(p);
				});
		
				$('.jcacancel').bind('click', function(){
					$(this).parents('.jcaquestion').fadeOut(300, function() {
						$(this).remove();
					});
				});
				
			});
			
		});
	}
	
})(jQuery);
