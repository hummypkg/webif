
jQuery.ajaxPrefilter(function(options, _, jqXHR) {
    if (jQuery.isFunction(options.progress))
    {
	var xhrFactory = options.xhr;
	var interval;

	options.xhr = function() {
		var xhr = xhrFactory.apply(this, arguments);
		var partial = "";
		var prevcount = 1;

		interval = setInterval(function() {
			var responseText;
			var jQueryPartial;

			try {
				responseText = xhr.responseText;
	    
				if (responseText &&
				    responseText.length > partial.length)
				{
					options.progress(
					    responseText.substring(
					    partial.length));
					partial = responseText;
				}
			} catch(e) {
				if (window.console)
					console.log(e);
			}
		}, options.progressInterval);

		return xhr;
	};
        function stop()
	{
            if (interval)
                clearInterval(interval);
        }
        jqXHR.then(stop, stop);
    }
});

