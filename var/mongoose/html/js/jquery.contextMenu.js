// jQuery Context Menu Plugin
//
// Version 1.00
//
// Cory S.N. LaViska
// A Beautiful Site (http://abeautifulsite.net/)
//
// Visit http://abeautifulsite.net/notebook/80 for usage and more information
//
// Terms of Use
//
// This software is licensed under a Creative Commons License and is copyrighted
// (C)2008 by Cory S.N. LaViska.
//
// For details, visit http://creativecommons.org/licenses/by/3.0/us/

// Modified by af123 to support left click, modification of menu items and
// utilise jQuery.ui.position for smart element positioning.

if (jQuery) (function() {
    $.extend($.fn, {

        contextMenu: function(o, callback) {
            // Defaults
            if (o.menu == undefined) return false;
            if (o.inSpeed == undefined) o.inSpeed = 150;
            if (o.outSpeed == undefined) o.outSpeed = 75;
            if (o.leftButton == undefined) o.leftButton = false;
	    if (o.beforeShow == undefined) o.beforeShow = false;
            // 0 needs to be -1 for expected results (no fade)
            if (o.inSpeed == 0) o.inSpeed = -1;
            if (o.outSpeed == 0) o.outSpeed = -1;
            // Loop each context menu
            $(this).each(function() {
                var el = $(this);
                var offset = $(el).offset();
                // Add contextMenu class
                $('#' + o.menu).addClass('contextMenu');
		if (o.leftButton) $(this).bind('click', false);
                // Simulate a true right click
                $(this).mousedown(function(e) {
                    var evt = e;
                    $(this).mouseup(function(e) {
                        var srcElement = $(this);
                        $(this).unbind('mouseup');
                        if (evt.button == 2 || o.leftButton == true) {
                            // Hide context menus that may be showing
                            $(".contextMenu").hide();
                            // Get this context menu
                            var menu = $('#' + o.menu);

                            if ($(el).hasClass('disabled')) return false;

			    if (o.beforeShow) o.beforeShow(el, menu);

                            // Show the menu
                            $(document).unbind('click');
//                            $(menu).css({ top: y, left: x }).fadeIn(o.inSpeed);
			$(menu).css('display', 'block').position({
			    my: "left top",
			    at: "right bottom",
			    of: this,
			    offset: "0 5",
			    collision: "fit"
			}).css('display', 'none').fadeIn(o.inSpeed);

                            // Hover events
                            $(menu).find('A').mouseover(function() {
                                $(menu).find('LI.hover').removeClass('hover');
                                $(this).parent().addClass('hover');
                            }).mouseout(function() {
                                $(menu).find('LI.hover').removeClass('hover');
                            });

                            // Keyboard
                            $(document).keypress(function(e) {
                                switch (e.keyCode) {
                                    case 38: // up
                                        if ($(menu).find('LI.hover').size() == 0) {
                                            $(menu).find('LI:last').addClass('hover');
                                        } else {
                                            $(menu).find('LI.hover').removeClass('hover').prevAll('LI:not(.disabled)').eq(0).addClass('hover');
                                            if ($(menu).find('LI.hover').size() == 0) $(menu).find('LI:last').addClass('hover');
                                        }
                                        break;
                                    case 40: // down
                                        if ($(menu).find('LI.hover').size() == 0) {
                                            $(menu).find('LI:first').addClass('hover');
                                        } else {
                                            $(menu).find('LI.hover').removeClass('hover').nextAll('LI:not(.disabled)').eq(0).addClass('hover');
                                            if ($(menu).find('LI.hover').size() == 0) $(menu).find('LI:first').addClass('hover');
                                        }
                                        break;
                                    case 13: // enter
                                        $(menu).find('LI.hover A').trigger('click');
                                        break;
                                    case 27: // esc
                                        $(document).trigger('click');
                                        break
                                }
                            });

                            // When items are selected
                            $('#' + o.menu).find('A').unbind('click');
                            $('#' + o.menu).find('LI:not(.disabled) A').click(function() {
                                $(document).unbind('click').unbind('keypress');
                                $(".contextMenu").hide();
                                // Callback
                                //if (callback) callback($(this).attr('href').substr(1), $(srcElement), { x: x - offset.left, y: y - offset.top, docX: x, docY: y });
                                if (callback) callback($(this).attr('href').substr(1), $(srcElement));
                                return false;
                            });

                            // Hide bindings
                            setTimeout(function() { // Delay for Mozilla
                                $(document).click(function() {
                                    $(document).unbind('click').unbind('keypress');
                                    $(menu).fadeOut(o.outSpeed);
                                    return false;
                                });
                            }, 0);
                        }
                    });
                });

                // Disable text selection
                if ($.browser.mozilla) {
                    $('#' + o.menu).each(function() { $(this).css({ 'MozUserSelect': 'none' }); });
                } else if ($.browser.msie) {
                    $('#' + o.menu).each(function() { $(this).bind('selectstart.disableTextSelect', function() { return false; }); });
                } else {
                    $('#' + o.menu).each(function() { $(this).bind('mousedown.disableTextSelect', function() { return false; }); });
                }
                // Disable browser context menu (requires both selectors to work in IE/Safari + FF/Chrome)
                $(el).add('UL.contextMenu').bind('contextmenu', function() { return false; });

            });
            return $(this);
        },

        // Disable context menu items on the fly
        disableContextMenuItems: function(o) {
            if (o == undefined) {
                // Disable all
                $(this).find('LI').addClass('disabled');
                return ($(this));
            }
            $(this).each(function() {
                if (o != undefined) {
                    var d = o.split(',');
                    for (var i = 0; i < d.length; i++) {
                        $(this).find('A[href="' + d[i] + '"]').parent().addClass('disabled');

                    }
                }
            });
            return ($(this));
        },

        // Enable context menu items on the fly
        enableContextMenuItems: function(o) {
            if (o == undefined) {
                // Enable all
                $(this).find('LI.disabled').removeClass('disabled');
                return ($(this));
            }
            $(this).each(function() {
                if (o != undefined) {
                    var d = o.split(',');
                    for (var i = 0; i < d.length; i++) {
                        $(this).find('A[href="' + d[i] + '"]').parent().removeClass('disabled');

                    }
                }
            });
            return ($(this));
        },

        // Change context menu text on the fly
       changeContextMenuItem: function(d, t) {
            if (d == undefined) return;
            $(this).each(function() {
		$(this).find('A[href="' + d + '"]').text(t);
	    });
            return ($(this));
        },

        // Disable context menu(s)
        disableContextMenu: function() {
            $(this).each(function() {
                $(this).addClass('disabled');
            });
            return ($(this));
        },

        // Enable context menu(s)
        enableContextMenu: function() {
            $(this).each(function() {
                $(this).removeClass('disabled');
            });
            return ($(this));
        },

        // Destroy context menu(s)
        destroyContextMenu: function() {
            // Destroy specified context menus
            $(this).each(function() {
                // Disable action
                $(this).unbind('mousedown').unbind('mouseup');
            });
            return ($(this));
        }

    });
})(jQuery);
