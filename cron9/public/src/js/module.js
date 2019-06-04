! function(window, $) {
    "use strict";
    var Module = function() {
        this.VERSION = "0.0.1";
        this.AUTHOR = "Tarpit Grover";
        this.$body = $("body");
    };


    Module.prototype.setUserOS = function() {
        var OSName = ""; - 1 != navigator.appVersion.indexOf("Win") && (OSName = "windows"), -1 != navigator.appVersion.indexOf("Mac") && (OSName = "mac"), -1 != navigator.appVersion.indexOf("X11") && (OSName = "unix"), -1 != navigator.appVersion.indexOf("Linux") && (OSName = "linux");
        this.$body.addClass(OSName);
    };
    Module.prototype.setUserAgent = function() {
        navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i) ? this.$body.addClass("mobile") : (this.$body.addClass("desktop"), navigator.userAgent.match(/MSIE 9.0/) && this.$body.addClass("ie9"))
    };
    Module.prototype.initFastClick = function() {
        $(function() {
            FastClick.attach(document.body);
        });
    };
    Module.prototype.setHeader = function() {

    };

    Module.prototype.setBackgroundImage = function() {
        $('.background-image-holder').each(function() {
            var imgSrc = $(this).children('img').attr('src');
            $(this).css('background', 'url("' + imgSrc + '")');
            $(this).children('img').hide();
            $(this).css('background-position', 'initial');
        });

        setTimeout(function() {
            $('.background-image-holder').each(function() {
                $(this).addClass('animated fadeIn');
            });
        }, 200);
    }

    Module.prototype.sliderSetup = function() {
        $('.slider-all-controls').flexslider({});
        $('.slider-paging-controls').flexslider({
            animation: "slide",
            directionNav: false
        });
        $('.slider-arrow-controls').flexslider({
            controlNav: false
        });
        $('.slider-thumb-controls .slides li').each(function() {
            var imgSrc = $(this).find('img').attr('src');
            $(this).attr('data-thumb', imgSrc);
        });
        $('.slider-thumb-controls').flexslider({
            animation: "slide",
            controlNav: "thumbnails",
            directionNav: true
        });
        $('.logo-carousel').flexslider({
            minItems: 1,
            maxItems: 4,
            move: 1,
            itemWidth: 200,
            itemMargin: 0,
            animation: "slide",
            slideshow: true,
            slideshowSpeed: 3000,
            directionNav: false,
            controlNav: false
        });
    };

    Module.prototype.navSetup = function() {
        if (!$('nav').hasClass('fixed') && !$('nav').hasClass('absolute')) {

            // Make nav container height of nav

            $('.nav-container').css('min-height', $('nav').outerHeight(true));

            $(window).resize(function() {
                $('.nav-container').css('min-height', $('nav').outerHeight(true));
                //console.error('nav outerheight: ' + $('nav').outerHeight(true));
            });

            // Compensate the height of parallax element for inline nav

            if ($(window).width() > 768) {
                $('.parallax:nth-of-type(1) .background-image-holder').css('top', -($('nav').outerHeight(true)));
            }

            // Adjust fullscreen elements

            if ($(window).width() > 768) {
                $('section.fullscreen:nth-of-type(1)').css('height', ($(window).height() - $('nav').outerHeight(true)));
            }

        } else {
            $('body').addClass('nav-is-overlay');
        }

        if ($('nav').hasClass('bg-dark')) {
            $('.nav-container').addClass('bg-dark');
        }


        // Fix nav to top while scrolling

        var mr_nav = $('body .nav-container nav:first');
        var mr_navOuterHeight = $('body .nav-container nav:first').outerHeight();
        window.addEventListener("scroll", updateNav, false);
        
        function updateNav() {
            if(window.pageYOffset > 50) {
                if (!mr_navFixed) {
                    mr_nav.addClass('fixed');
                    mr_navFixed = true;
                }
            } else {
                if (mr_navFixed) {
                    mr_navFixed = false;
                    mr_nav.removeClass('fixed');
                }
            }
        }

        $('.menu > li > ul').each(function() {
            var menu = $(this).offset();
            var farRight = menu.left + $(this).outerWidth(true);
            if (farRight > $(window).width() && !$(this).hasClass('mega-menu')) {
                $(this).addClass('make-right');
            } else if (farRight > $(window).width() && $(this).hasClass('mega-menu')) {
                var isOnScreen = $(window).width() - menu.left;
                var difference = $(this).outerWidth(true) - isOnScreen;
                $(this).css('margin-left', -(difference));
            }
        });

        // Mobile Menu

        $('.mobile-toggle').click(function() {
            $('.nav-bar').toggleClass('nav-open');
            $(this).toggleClass('active');
        });

        $('.menu li').click(function(e) {
            if (!e) e = window.event;
            e.stopPropagation();
            if ($(this).find('ul').length) {
                $(this).toggleClass('toggle-sub');
            } else {
                $(this).parents('.toggle-sub').removeClass('toggle-sub');
            }
        });

        $('.module.widget-handle').click(function() {
            $(this).toggleClass('toggle-widget-handle');
        });
    }

    Module.prototype.parallaxSetup = function() {
        window.mr_parallax.profileParallaxElements();
    }

    Module.prototype.iePlaceHolderFix = function() {
        if (!Modernizr.input.placeholder) {
            $("input").each(function() {
                if ($(this).val() == "" && $(this).attr("placeholder") != "") {
                    $(this).val($(this).attr("placeholder"));
                    $(this).focus(function() {
                        if ($(this).val() == $(this).attr("placeholder")) $(this).val("");
                    });
                    $(this).blur(function() {
                        if ($(this).val() == "") $(this).val($(this).attr("placeholder"));
                    });
                }
            });
        }
    }

    Module.prototype.init = function() {
        this.setUserOS();
        this.setUserAgent();
        this.initFastClick();
        this.iePlaceHolderFix();
    }

    var instance = new Module();
    instance.init();
    window.ModuleInstance = instance;

}(window, window.jQuery);