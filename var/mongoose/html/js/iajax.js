
jQuery.ajaxPrefilter(function(options, _, jqXHR) {

    if (jQuery.isFunction(options.progress)) {

        var xhrFactory = options.xhr,
            interval;

        options.xhr = function() {
            
            var xhr = xhrFactory.apply(this, arguments),
                partial = "",
                prevcount = 1;

            interval = setInterval(function() {

                var responseText,
                    jQueryPartial;

                try {

                    responseText = xhr.responseText;
                    
                    if (responseText && (responseText.length > partial.length))
		    {

                        partial = responseText;
                        jQueryPartial = $(partial).filter("*")

                        if (jQueryPartial.length > prevcount) {
                            prevcount = jQueryPartial.length;
                            options.progress(jQueryPartial.filter("*:not(:last)"));
                        }
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

