/**
 * (c) Tonytemplates Ltd, https://www.tonytemplates.com/support@tonytemplates.com
 */

'use strict';
window.Mogo = {};
window.Mogo.vars = {};
window.Mogo.methods = {};

window.Mogo.vars = {
    $header: $('.tt-header'),
    $options: $('.tt-header__options'),
    $tonyMenu_top: $('.TonyM.TonyM--header'),
    $btn_menu_toggle: $('.tt-header__btn-menu'),
    $settings: $('.tt-header__settings'),
    $settings_btn: $('.tt-header__btn-settings'),
    $user: $('.tt-header__user'),
    $user_btn: $('.tt-header__btn-user'),
    $cart: $('.tt-header__cart'),
    $cart_btn: $('.tt-header__btn-cart'),
    $search_btn: $('.tt-header__btn-open-search'),
    $search_close_btn: $('.tt-header__btn-close-search'),
    $search_input: $('.tt-header__search-form input'),
    $search_dropdown: $('.tt-header__search-dropdown')
};

window.Mogo.preloader = function() {
    var $preloader = $('.tt-preloader'),
        delay = 200;

    if($preloader.length) {
        $(window).on('load', function() {
            setTimeout(function() {
                $preloader.on('transitionend', function() {
                    $preloader.remove();
                });
                $preloader.addClass('tt-loaded');
            }, delay);
        });
    }
};

window.Mogo.logoCurtain = function() {
    var $logo = $('.tt-logo.tt-logo__curtain');

    if($logo) {
        $(window).on('load', function() {
            $logo.addClass('tt-logo__curtain-hide');
        });
    }
};

window.Mogo.lazyLoad = function() {
    var $images = $('img[data-srcset]');

    $images.Lazy({
        effect: 'fadeIn',
        scrollDirection: 'vertical'
    });
};

window.Mogo.stickyHeader = function() {
    var $sticky = $('.tt-header--sticky');

    if (!$sticky.length) return;

    var effect = $sticky.attr('data-sticky-effect') || 1,
        params = {
        bp: 1024,
        mobile: {
            sticky: '.tt-header__nav',
            limit: 'bottom',
            fade: true,
            duration: 300
        }
    };

    if ($sticky.hasClass('tt-header--build-01') || $sticky.hasClass('tt-header--build-04')) {
        $.extend(true, params, {
            desktop: {
                sticky: '.tt-header__content',
                height: 60
            }
        });
    } else if ($sticky.hasClass('tt-header--build-02') || $sticky.hasClass('tt-header--build-03')) {
        $.extend(true, params, {
            desktop: {
                sticky: '.tt-header__menu',
                move: [
                    {
                        elem: '.tt-header__sidebar',
                        to: '.tt-header__menu',
                        method: 'append'
                    }
                ]
            },
            mobile: {
                move: [
                    {
                        elem: '.tt-header__menu',
                        to: '.tt-header__nav',
                        method: 'append'
                    }
                ]
            }
        });
    }

    if(effect === '2') {
        $.extend(true, params, {
            desktop: {
                limit: 'bottom',
                fade: true,
                duration: 300
            }
        });
    }

    var stickyHeader = {
        _create: function() {
            var _ = this,
                $elem = this.bindings,
                $sticky_m = $elem.find(this.options.mobile.sticky),
                $sticky_d = $elem.find(this.options.desktop.sticky),
                $spacer_m = $('<div>').addClass('tt-header__spacer tt-header__spacer--m').insertBefore($sticky_m),
                $spacer_d = $('<div>').addClass('tt-header__spacer tt-header__spacer--d').insertBefore($sticky_d);

            this.sticky_class = 'tt-header__sticky';

            function fix() {
                _._fix(_.$sticky, _.$spacer);
                _._move(_.options[_.bp]);
            };

            function unfix() {
                _._unfix(_.$sticky, _.$spacer);
                _._return(_.options[_.bp]);
            };

            function on_resize() {
                var w = window.innerWidth,
                    is_desktop = w > _.options.bp;

                _.bp = is_desktop ? 'desktop' : 'mobile';
                _.$sticky = is_desktop ? $sticky_d : $sticky_m;
                _.$spacer = is_desktop ? $spacer_d : $spacer_m;

                if (is_desktop) {
                    $spacer_m.removeClass('tt-header__spacer--visible');
                    $spacer_d.addClass('tt-header__spacer--visible');

                    if ($sticky_m.hasClass(_.sticky_class)) {
                        _._unfix($sticky_m, $spacer_m);
                        _._return(_.options.mobile);
                    }
                } else {
                    $spacer_d.removeClass('tt-header__spacer--visible');
                    $spacer_m.addClass('tt-header__spacer--visible');

                    if ($sticky_d.hasClass(_.sticky_class)) {
                        _._unfix($sticky_d, $spacer_d);
                        _._return(_.options.desktop);
                    }
                }
            };

            function on_scroll() {
                var limit = _.options[_.bp].limit ? _.options[_.bp].limit : 0,
                    spacer_pos = _.$spacer[0].getBoundingClientRect();

                if (limit === 'bottom') {
                    limit = _.$sticky.hasClass(_.sticky_class) ? _.$spacer.innerHeight() : _.$sticky.innerHeight();
                }

                limit *= -1;

                if (spacer_pos.top < limit) {
                    if (!_.$sticky.hasClass(_.sticky_class)) {
                        fix();
                    }

                    if(!Mogo.ie) {
                        _._check_height(_.$sticky, _.options[_.bp]);
                    }
                } else {
                    if (_.$sticky.hasClass(_.sticky_class)) {
                        unfix();
                    }
                }
            };

            on_resize();
            on_scroll();

            $(window).on({
                'resize.stickyHeader': function() {
                    on_resize();
                    on_scroll();
                },
                'scroll.stickyHeader': on_scroll
            });
        },
        _fix: function($sticky, $spacer) {
            var height = $sticky.innerHeight();

            $spacer.height(height);

            if(this.options[this.bp].fade) {
                $sticky.css({ 'opacity': 0 }).velocity({ 'opacity': 1 }, this.options[this.bp].fade || 300);
            }

            $sticky.addClass(this.sticky_class);
        },
        _unfix: function($sticky, $spacer) {
            $spacer.removeAttr('style');

            if(this.options[this.bp].fade) {
                $sticky.velocity('stop', true);
            }

            $sticky.removeAttr('style').removeClass(this.sticky_class);
        },
        _move: function(obj) {
            if (!obj.move) return;

            $.each(obj.move, function() {
                var $elem = $(this.elem),
                    $to = $(this.to),
                    method = this.method || 'append';

                this.$elem = $elem;
                this.$parent = $elem.parent();

                $to[method]($elem);
            });
        },
        _return: function(obj) {
            if (!obj.move) return;

            $.each(obj.move, function() {
                var method = this.method || 'append';

                this.$parent[method](this.$elem);
                this.$elem = null;
                this.$parent = null;
            });
        },
        _check_height: function($sticky, obj) {
            if(!obj.height) return;

            var spacer_pos = this.$spacer[0].getBoundingClientRect(),
                height = spacer_pos.bottom <= obj.height ? obj.height : spacer_pos.bottom;

            $sticky.css({ 'min-height': height });
        },
        getStickyHeight: function() {
            return this.options[this.bp].height || $(this.options[this.bp].sticky).innerHeight();
        },
        destroy: function() {
            $(window).unbind('resize.stickyHeader scroll.stickyHeader');

            $.Widget.prototype.destroy.call(this);
        }
    };

    $.widget('ui.stickyHeader', stickyHeader);

    $sticky.stickyHeader(params);
};

window.Mogo.megamenu = function() {
    var _self = this;

    function closeAllDD() {
        _self.vars.$user_btn.trigger('togglelist.close');
        _self.vars.$cart_btn.trigger('togglelist.close');
        _self.vars.$search_close_btn.trigger('search.close');
        _self.vars.$settings_btn.trigger('togglelist.close');
    };

    this.vars.$tonyMenu_top.TonyM({
        btn: _self.vars.$btn_menu_toggle,
        beforeOpenTM: function() {
            closeAllDD();
        },
        beforeOpenMM: function() {
            closeAllDD();
        }
    });
};

window.Mogo.headerDropdowns = function() {
    var $body = $('body'),
        scrollW,
        $scrlBl = $('<div>').css({
            overflowY: 'scroll',
            width: '50px',
            height: '50px',
            visibility: 'hidden'
        });

    $body.append($scrlBl);
    scrollW = $scrlBl[0].offsetWidth - $scrlBl[0].clientWidth;
    $scrlBl.remove();

    $.fn.toggleList = function(options) {
        var $elem = $(this),
            breakpoint = 1024,
            duration = options.duration || 500,
            animate = false;

        options.$btn.on('click', function (e) {
            if(animate) return;
            animate = true;

            var wind_w = window.innerWidth,
                mobile = wind_w <= breakpoint;

            $elem.toggleClass('tt-header__option-open');

            if($elem.hasClass('tt-header__option-open')) {
                var wind_h = window.innerHeight;

                if(options.beforeOpen) options.beforeOpen();

                $elem.removeAttr('style');

                function open() {
                    $elem.perfectScrollbar();

                    options.$btn.addClass('active');

                    $elem.velocity('stop').velocity('slideDown', {
                        duration: duration,
                        complete: function () {
                            $(window).on('resize.popupclose', function () {
                                closeList();
                            });

                            if(options.afterOpen) options.afterOpen();
                            animate = false;
                        }
                    });
                };

                if(mobile) {
                    var $options = $('.tt-header__options');

                    $elem.height(wind_h - $options[0].getBoundingClientRect().bottom);

                    $body.addClass('ttg-ovf-hidden').css({ 'padding-right': scrollW });
                    $('.tt-header__sticky .tt-header__sidebar').css({ 'padding-right': scrollW });

                    open();
                } else {
                    var options_b = $('.tt-header__options').get(0).getBoundingClientRect().bottom;

                    $elem.css({ 'max-height': wind_h - options_b });

                    open();
                }

            } else {
                if(options.beforeClose) options.beforeClose();

                $elem.perfectScrollbar('destroy').removeClass('ps');

                options.$btn.removeClass('active');

                $(window).unbind('resize.popupclose');

                $elem.velocity('stop').velocity('slideUp', {
                    duration: duration,
                    complete: function () {
                        if(mobile) {
                            $body.removeClass('ttg-ovf-hidden').removeAttr('style');
                            $('.tt-header__sticky .tt-header__sidebar').removeAttr('style');
                        }

                        if(options.afterClose) options.afterClose();
                        animate = false;
                    }
                });
            }

            e.preventDefault();
            return false;
        });

        function closeList() {
            if($elem.hasClass('tt-header__option-open')) {
                $elem.removeAttr('style').removeClass('tt-header__option-open');
                $body.removeClass('ttg-ovf-hidden').removeAttr('style');
                options.$btn.removeClass('active');
            }
        };

        options.$btn.on('togglelist.close', function () {
            closeList();
        });
    };

    Mogo.vars.$settings.toggleList({
        $btn: Mogo.vars.$settings_btn,
        duration: 400,
        beforeOpen: function () {
            Mogo.vars.$user_btn.trigger('togglelist.close');
            Mogo.vars.$cart_btn.trigger('togglelist.close');
            Mogo.vars.$search_close_btn.trigger('search.close');
            Mogo.vars.$tonyMenu_top.TonyM('hideTM', false, false, true);
        }
    });

    Mogo.vars.$user.toggleList({
        $btn: Mogo.vars.$user_btn,
        duration: 400,
        beforeOpen: function () {
            Mogo.vars.$settings_btn.trigger('togglelist.close');
            Mogo.vars.$cart_btn.trigger('togglelist.close');
            Mogo.vars.$search_close_btn.trigger('search.close');
            Mogo.vars.$tonyMenu_top.TonyM('hideTM', false, false, true);
        }
    });

    Mogo.vars.$cart.toggleList({
        $btn: Mogo.vars.$cart_btn,
        duration: 400,
        beforeOpen: function () {
            Mogo.vars.$settings_btn.trigger('togglelist.close');
            Mogo.vars.$user_btn.trigger('togglelist.close');
            Mogo.vars.$search_close_btn.trigger('search.close');
            Mogo.vars.$tonyMenu_top.TonyM('hideTM', false, false, true);
            Mogo.vars.$cart.find('ul').addClass('ttg-loading');
        },
        afterOpen: function () {
            Mogo.vars.$cart.find('ul').removeClass('ttg-loading');
        },
        afterClose: function () {
            Mogo.vars.$cart.find('ul').removeClass('ttg-loading');
        }
    });
};

window.Mogo.search = function() {
    var search_empty = '<div class="tt-header__search-empty"><p>Search is empty</p></div>',
        search_loading = '<div class="tt-header__search-empty"><p>More products</p></div>',
        search_data,
        ajax_request,
        bp = 1024;

    Mogo.vars.$search_btn.on('click', function (e) {
        Mogo.vars.$settings_btn.trigger('togglelist.close');
        Mogo.vars.$user_btn.trigger('togglelist.close');
        Mogo.vars.$cart_btn.trigger('togglelist.close');
        Mogo.vars.$tonyMenu_top.TonyM('hideTM', false, false, true);
        Mogo.vars.$search_dropdown.perfectScrollbar();

        function action() {
            Mogo.vars.$search_dropdown.removeClass('tt-header__search-dropdown--open');
            Mogo.vars.$search_dropdown.html(search_loading);
            Mogo.vars.$header.addClass('tt-header--search');
            Mogo.vars.$search_input.val('').focus();
        };

        action();

        e.preventDefault();
        return false;
    });

    Mogo.vars.$search_close_btn.on('click search.close', function (e) {
        Mogo.vars.$header.removeClass('tt-header--search');
        Mogo.vars.$search_dropdown.perfectScrollbar('destroy').removeClass('ps');
        $(window).unbind('resize.search scroll.search');

        e.preventDefault();
        return false;
    });

    function debounce(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };

    function send_ajax() {
        var data = {
            results_count: 2,
            results: [
                {
                    url: 'product.html',
                    thumbnail: 'images/products/product-02.jpg',
                    thumbnail2x: 'images/products/product-02.jpg',
                    title: 'Elegant and fresh. A most attractive mobile power supply.'
                },
                {
                    url: 'product.html',
                    thumbnail: 'images/products/product-03.jpg',
                    thumbnail2x: 'images/products/product-03.jpg',
                    title: 'Elegant and fresh. A most attractive mobile power supply.'
                }
            ]
        };

        Mogo.vars.$search_dropdown.html(searchResultsToHtml(data)).removeClass('ttg-loading');
        resizeSearch();
    };

    var myEfficientFn = debounce(function() {
        var $this = $(this),
            data = $this.val();

        if(search_data === data) return;

        search_data = data;

        Mogo.vars.$search_dropdown.addClass('tt-header__search-dropdown--open ttg-loading');

        send_ajax();
    }, 500);

    Mogo.vars.$search_input.on('keyup', function (e) {
        if(e.keyCode === 27) {
            Mogo.vars.$search_close_btn.trigger('search.close');
            return;
        }

        myEfficientFn.call(this);
    });

    function resizeSearch() {
        function _func() {
            var $options = $('.tt-header__options'),
                options_b = $options.get(0).getBoundingClientRect().bottom,
                wind_h = window.innerHeight;

            Mogo.vars.$search_dropdown.css({ 'max-height': wind_h - options_b });
            Mogo.vars.$search_dropdown.perfectScrollbar('update');
        };

        _func();
        $(window).on('resize.search scroll.search', _func);
    };

    function searchResultsToHtml (resultsInJson) {
        var html = '';

        if(resultsInJson.results_count < 1) {
            html = search_empty;
        } else {
            $(resultsInJson.results).each(function (key, value) {
                html += '<div>';
                html += 	'<a href="' + value.url + '"><img src="' + value.thumbnail + '" srcset="' + value.thumbnail + ' 1x, ' + value.thumbnail2x + ' 2x" class="colorize-bd2 colorize-main-bd-h" alt="value.title"></a>';
                html += 	'<p><a href="' + value.url + '">' + value.title + '</a></p>';
                html += '</div>';
            });
        }

        return html
    }
};

window.Mogo.listDropdown = function() {
    var duration = 500,
        $list_toggle = $('.tt-list-toggle'),
        $li = $list_toggle.find('> *:not(a)'),
        $li_open = $li.filter('.tt-list-toggle__open'),
        $li_next;

    $li.each(function () {
        var $this = $(this);

        if($this.find('> *:not(a)').length) $this.addClass('tt-list-toggle__next');
    });

    $li_next = $list_toggle.find('.tt-list-toggle__next');

    $li_next.find('> a').on('click', function (e) {
        var $this = $(this),
            $li = $this.parent(),
            $content = $li.find('> *:not(a)');

        if($content.length) {
            $li.toggleClass('tt-list-toggle__open');


            if ($li.hasClass('tt-list-toggle__open')) $content.velocity('stop').removeAttr('style').velocity( 'slideDown', duration);
            else $content.velocity('stop').velocity( 'slideUp', duration);

            e.preventDefault();
            return false;
        }
    });

    $li_open.find('> *:not(a)').show();
};

window.Mogo.counter = function() {
    var counter = '.tt-counter';

    $(document).on('click', counter + ' .tt-counter__control span', function (e) {
        var $this = $(this),
            $counter = $this.parents('.tt-counter'),
            $input = $counter.find('input'),
            min_val = $counter.attr('data-min') || 1,
            max_val = $counter.attr('data-max') || Infinity,
            direction = $(this).attr('data-direction'),
            val = +$input.val(),
            set_val;

        if(!$.isNumeric(val)) {
            $input.val(min_val);
            e.preventDefault();
            return false;
        }

        if(direction === 'next') {
            set_val = ++val;
        } else if(direction === 'prev') {
            set_val = --val;
        }

        if(set_val < min_val) set_val = min_val;
        else if(set_val > max_val) set_val = max_val;

        if(set_val < 0) set_val = 0;

        $input.val(set_val);
    });

    $(document).on('keydown', counter + ' input', function (e) {
        var keyArr = [8, 9, 27, 37, 38, 39, 40, 46, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105];

        if($.inArray(e.keyCode, keyArr) === -1) {
            e.preventDefault();
            return false;
        }
    });

    $(document).on('focus', counter + ' input', function (e) {
        $(this).select();
    });

    $(document).on('blur', counter + ' input', function (e) {
        var $this = $(this),
            $input = $this,
            val = +$input.val(),
            $counter = $this.parents('.tt-counter'),
            min_val = $counter.attr('data-min') || 1,
            max_val = $counter.attr('data-max') || Infinity;

        if(!$.isNumeric(val)) {
            $input.val(min_val);
        } else if(val < min_val) {
            $input.val(min_val);
        } else if(val > max_val) {
            $input.val(max_val);
        }
    });
};

window.Mogo.toggleHeaderInfo = function() {
    var $btn = $('.tt-header__btn-info'),
        $info = $('.tt-header__tape'),
        dur = 400,
        breakpoint = 1024;

    $btn.on('click', function() {
        $btn.toggleClass('tt-header__btn-info--open');

        if($btn.hasClass('tt-header__btn-info--open')) {
            $info.velocity('stop').removeAttr('style').velocity( 'slideDown', dur);

            $(window).on('resize.headerinfo', function() {
                if(window.innerWidth > breakpoint) {
                    if($btn.hasClass('tt-header__btn-info--open')) {
                        $btn.removeClass('tt-header__btn-info--open');
                        $info.velocity('stop').removeAttr('style');
                    }
                }
            });
        } else {
            $info.velocity('stop').velocity( 'slideUp', {
                duration: dur,
                complete: function() {
                    $info.removeAttr('style');
                    $(window).on('resize.headerinfo');
                }
            });
        }
    });
};

window.Mogo.revolutionSlider = {
    resizeRev: function (options, new_rev_obj, bp_arr) {
        if(!options.wrapper || !options.slider || !options.breakpoints) return false;

        var wrapper = options.wrapper,
            slider = options.slider,
            breakpoints = options.breakpoints,
            fullscreen_BP = options.fullscreen_BP || false,
            new_rev_obj = new_rev_obj || {},
            bp_arr = bp_arr || [],
            rev_obj = {
                jsFileLocation: "vendor/revolution/js/"
            };

        $.extend(rev_obj, new_rev_obj);

        var get_Slider = function() {
            return $sliderWrapp.find(slider);
        };

        var get_current_bp = function() {
            var wind_W = window.innerWidth;

            for(var i = 0; i < breakpoints.length; i++) {
                var bp = breakpoints[i];

                if(!breakpoints.length) return false;

                if(wind_W <= bp) {
                    if(i === 0) {
                        return bp;
                    } else {
                        if(bp > breakpoints[i - 1])
                            return bp;
                    }
                } else if(wind_W > bp && i === breakpoints.length - 1)
                    return Infinity;
            }
            return false;
        };

        var $sliderWrapp = $(wrapper),
            $sliderInit = get_Slider(),
            $sliderCopy = $sliderWrapp.clone(),
            bp = get_current_bp();

        if(!$sliderInit.length) return false;

        var start_Rev = function($sliderInit, bp) {
            var wind_W = window.innerWidth,
                rev_settings_obj = {},
                rev_screen_obj = {},
                set_rev_obj = {};

            if(fullscreen_BP) {
                var full_width = (wind_W >= fullscreen_BP) ? 'off' : 'on',
                    full_screen = (wind_W >= fullscreen_BP) ? 'on' : 'off',
                    sliderLayout = (wind_W >= fullscreen_BP) ? 'fullscreen' : 'fullwidth';

                rev_screen_obj = {
                    fullWidth: full_width,
                    fullScreen: full_screen,
                    sliderLayout: sliderLayout
                };
            }

            if(bp_arr.length) {
                for(var i = 0; i < bp_arr.length; i++) {
                    var this_obj = bp_arr[i];

                    if(this_obj.bp && this_obj.bp.length === 2 && this_obj.bp[0] < this_obj.bp[1]) {
                        var from = this_obj.bp[0],
                            to = this_obj.bp[1];

                        if(from <= bp && to >= bp) {
                            for(var key in this_obj) {
                                if(key !== 'bp')
                                    rev_settings_obj[key] = this_obj[key];
                            }
                        }
                    }
                }
            }

            $.extend(set_rev_obj, rev_obj, rev_settings_obj, rev_screen_obj);

            var local_revolution = $($sliderInit).revolution(set_rev_obj);

            local_revolution.one('revolution.slide.onloaded', function() {
                $($sliderInit).css({visibility: 'visible'});
            });

            $(options.functions).each(function() {
                this.call($sliderInit);
            });
        };

        start_Rev($sliderInit, bp);

        var restart_Rev = function(current_bp) {
            if(!$($sliderInit).hasClass('revslider-initialised')) return;
            bp = current_bp || 0;
            var $slider_kill = $sliderInit.parents('.forcefullwidth_wrapper_tp_banner').replaceWith($sliderCopy);
            $slider_kill.revkill();
            $slider_kill.empty();
            $sliderWrapp = $sliderCopy;
            $sliderCopy = $sliderWrapp.clone();
            $sliderInit = get_Slider();
            start_Rev($sliderInit, bp);
        };

        function endResize(func) {
            var windWidth = window.innerWidth,
                interval;

            interval = setInterval(function() {
                var windWidthInterval = window.innerWidth;
                if(windWidth === windWidthInterval) {
                    setTimeout(function() {
                        func();
                    }, 200);
                }
                clearInterval(interval);
            }, 100);
        };

        $(window).on('resize', function() {
            endResize(function() {
                var current_bp = get_current_bp();
                if(current_bp !== bp)
                    restart_Rev(current_bp);
            })
        });
    },
    init: function() {
        var $slider = $('.tt-sr'),
            $header = $('.tt-header'),
            layout = $slider.attr('data-layout'),
            offset_top = !$header.hasClass('tt-header__transparent'),
            rtl = $('body').attr('dir') === 'rtl';

        if($slider.length) {
            var rev_bullets = {},
                rev_arrows = {},
                revolution_obj = {
                    sliderLayout: layout || 'fullscreen',
                    fullScreenOffsetContainer: (offset_top) ? 'header' : false,
                    delay: 118000,
                    startwidth: 1920,
                    gridwidth: 1920,
                    gridheight: 960,
                    shadow: 0,
                    spinner: 'off',
                    shuffle: "off",
                    startWithSlide: 0,
                    dottedOverlay: "none",
                    disableProgressBar: 'on',
                    navigation: {
                        onHoverStop: "on",
                        keyboardNavigation: "on",
                        keyboard_direction: "horizontal",
                        mouseScrollNavigation: "off",
                        bullets: {
                            enable: true,
                            style: 'ares',
                            tmp: '',
                            direction: 'horizontal',
                            rtl: false,
                            container: 'slider',
                            h_align: 'right',
                            v_align: 'bottom',
                            h_offset: 200,
                            v_offset: 92,
                            space: 16,
                            hide_onleave: false,
                            hide_onmobile: false,
                            hide_under: 0,
                            hide_over: 9999,
                            hide_delay: 200,
                            hide_delay_mobile: 1200
                        },
                        arrows: {
                            enable: true,
                            style: 'uranus',
                            tmp: '',
                            rtl: $('body').attr('dir') === 'rtl' ? true : false,
                            hide_onleave: false,
                            hide_onmobile: true,
                            hide_under: 0,
                            hide_over: 9999,
                            hide_delay: 200,
                            hide_delay_mobile: 1200,
                            left: {
                                container: 'slider',
                                h_align: 'right',
                                v_align: 'bottom',
                                h_offset: 130,
                                v_offset: 70
                            },
                            right: {
                                container: 'slider',
                                h_align: 'right',
                                v_align: 'bottom',
                                h_offset: 76,
                                v_offset: 70
                            }
                        },
                        touch: {
                            touchenabled: "on",
                            swipe_threshold: 75,
                            swipe_min_touches: 1,
                            swipe_direction: "horizontal",
                            drag_block_vertical: false
                        },
                    },
                    viewPort: {
                        enable: true,
                        outof: "pause",
                        visible_area: "80%",
                        presize: false
                    },
                    lazyType: "smart",
                    parallax: {
                        type: "mouse",
                        origo: "slidercenter",
                        speed: 2000,
                        levels: [2, 3, 4, 5, 6, 7, 12, 16, 10, 50, 46, 47, 48, 49, 50, 55],
                        disable_onmobile: 'on',
                    }
                };

            if($slider.hasClass('tt-sr__nav-v2')) {
                rev_bullets = {
                    h_align: 'center',
                    v_align: 'bottom',
                    h_offset: 0,
                    v_offset: 120,
                };

                rev_arrows = {
                    left: {
                        h_align: 'left',
                        v_align: 'center',
                        h_offset: 60,
                        v_offset: 0
                    },
                    right: {
                        h_align: 'right',
                        v_align: 'center',
                        h_offset: 60,
                        v_offset: 0
                    }
                };

            } else if($slider.hasClass('tt-sr__nav-vertical')) {
                rev_bullets = {
                    h_align: 'right',
                    v_align: 'center',
                    h_offset: 100,
                    v_offset: -60,
                    direction: 'vertical',
                };

                rev_arrows = {
                    left: {
                        h_align: 'right',
                        v_align: 'center',
                        h_offset: 80,
                        v_offset: 40
                    },
                    right: {
                        h_align: 'right',
                        v_align: 'center',
                        h_offset: 80,
                        v_offset: 100
                    }
                };
            }

            $.extend(revolution_obj['navigation']['bullets'], rev_bullets);
            $.extend(revolution_obj['navigation']['arrows'], rev_arrows);

            this.resizeRev({
                    wrapper: '.tt-sr',
                    slider: '.tt-sr__content',
                    breakpoints: [767, 1024]
                },
                revolution_obj,
                [
                    {
                        bp: [769, 1024],
                        navigation : {
                            onHoverStop:"on",
                            keyboardNavigation:"on",
                            keyboard_direction: "horizontal",
                            mouseScrollNavigation:"off",
                            bullets: {
                                enable: true,
                                style: 'ares',
                                tmp: '',
                                direction: 'horizontal',
                                rtl: $('body').attr('dir') === 'rtl' ? true : false,

                                container: 'slider',
                                h_align: 'center',
                                v_align: 'bottom',
                                h_offset: 0,
                                v_offset: 92,
                                space: 16,

                                hide_onleave: false,
                                hide_onmobile: false,
                                hide_under: 0,
                                hide_over: 9999,
                                hide_delay: 200,
                                hide_delay_mobile: 1200

                            },
                            arrows: {
                                enable: false
                            },
                            touch:{
                                touchenabled:"on",
                                swipe_threshold: 75,
                                swipe_min_touches: 1,
                                swipe_direction: "horizontal",
                                drag_block_vertical: false
                            },
                        },
                        parallax: {},
                    },
                    {
                        bp: [0, 768],
                        navigation : {
                            onHoverStop:"on",
                            keyboardNavigation:"on",
                            keyboard_direction: "horizontal",
                            mouseScrollNavigation:"off",
                            bullets: {
                                enable: true,
                                style: 'ares',
                                tmp: '',
                                direction: 'horizontal',
                                rtl: $('body').attr('dir') === 'rtl' ? true : false,

                                container: 'slider',
                                h_align: 'center',
                                v_align: 'bottom',
                                h_offset: 0,
                                v_offset: 38,
                                space: 16,

                                hide_onleave: false,
                                hide_onmobile: false,
                                hide_under: 0,
                                hide_over: 9999,
                                hide_delay: 200,
                                hide_delay_mobile: 1200

                            },
                            arrows: {
                                enable: false
                            },
                            touch:{
                                touchenabled:"on",
                                swipe_threshold: 75,
                                swipe_min_touches: 1,
                                swipe_direction: "horizontal",
                                drag_block_vertical: false
                            },
                        },
                        parallax: {},
                    }
                ]
            );
        };
    }
};

window.Mogo.countdown = function Countdown(selector) {
    var $countdown = $('.tt-product__countdown, .tt-product-head__countdown').not('.tt-countdown--init');

    $countdown.each(function () {
        var $this = $(this),
            date = $this.data('date'),
            zone = $this.data('zone'),
            reduction = $this.data('reduction') || false,
            hideZero = $this.data('hidezero') || true,
            set_year = $this.data('year') || 'Yrs',
            set_month = $this.data('month') || 'Mth',
            set_week = $this.data('week') || 'Wk',
            set_day = $this.data('day') || 'Day',
            set_hour = $this.data('hour') || 'Hrs',
            set_minute = $this.data('minute') || 'Min',
            set_second = $this.data('second') || 'Sec';

        //remove timezone
        var remove_from = date.indexOf(' +');

        if(remove_from != -1) {
            date = date.slice(0, remove_from);
        }
        //END:remove timezone

        var date_obj = new Date(date.replace(/-/g, "/"));

        if(date_obj.getTime() - new Date().getTime() <= 0) return;

        var t = $this.countdown(date_obj, function (e) {
            var format = '<span class="countdown-row">',
                structure = [
                    ['months', set_month],
                    ['daysToMonth', set_day],
                    ['hours', set_hour],
                    ['minutes', set_minute],
                    ['seconds', set_second]
                ];

            for(var i = 0; i < structure.length; i++) {
                var prop = structure[i][0],
                    time = e.offset[prop],
                    postfix = structure[i][1];

                if (i === 0 && time === 0 && hideZero === true) {
                    continue;
                }

                if(reduction && e.offset.months > 0 && (prop === 'hours' || prop === 'minutes' || prop === 'seconds')) {
                    format += '<span class="countdown-section countdown-section--small">' +
                        '<span class="countdown-amount">' + time + '</span>' +
                        '</span>';
                } else {
                    format += '<span class="countdown-section">' +
                        '<span class="countdown-amount">' + time + '</span>' +
                        '<span class="countdown-period">' + postfix + '</span>' +
                        '</span>';
                }
            }

            format += '</span>';

            $(this).html(format);
        });

        $this.addClass('.tt-countdown--init');
    });
};

window.Mogo.productOptions = function() {
    var option = '.tt-product__option',
        option_hover;

    $(document).on('click', option + ' > span', function (e) {
        var $btn = $(this),
            btn_has_act = $btn.hasClass('active'),
            $option = $btn.parents(option),
            $product = $btn.parents('.tt-product'),
            $options = $product.find(option),
            swatch_obj = $product.attr('data-tt-swatch-product'),
            variant_info = '_',
            priority_option = 'priority-option';

        option_hover = true;

        function changeImage(src, transparent) {
            var $prod_image = $product.find('.tt-product__image a'),
                $prod_image_img = $prod_image.find('img');

            function hover_transparent() {
                if(transparent !== 'off' && option_hover) $btn.parents('.tt-product__hover.tt-product__clr-clk-transp').addClass('tt-product__hover-transparent');
            };

            if($prod_image_img.attr('src') !== src) {
                $prod_image.addClass('ttg-loading');

                var $image = $('<img>').attr('alt', '').attr('src', src);

                $image.on('load', function () {
                    $prod_image_img.replaceWith($image);
                    $prod_image.removeClass('ttg-loading');
                    hover_transparent();
                });
            } else {
                hover_transparent();
            }
        };

        if(swatch_obj && swatch_obj.length) swatch_obj = JSON.parse(swatch_obj);
        else select_obj = false;

        if(!btn_has_act) {
            if(swatch_obj) {
                var opt_act_value = $btn.attr('data-tt-swatch-val'),
                    opt_act_class = $option.attr('data-tt-swatch-opt'),
                    select_obj = $product.attr('data-tt-swatch-select'),
                    disable_click,
                    variants_fit_obj = [],
                    variant_select = null;

                if($btn.hasClass('disabled')) {
                    disable_click = true;
                    $product.removeAttr('data-tt-selected');

                    $options.find('> span').removeClass('active');

                    select_obj = {};

                    select_obj[opt_act_class] = opt_act_value;
                } else {
                    $option.find('> span').removeClass('active');

                    if(select_obj && select_obj.length) select_obj = JSON.parse(select_obj);
                    else select_obj = {};

                    select_obj[opt_act_class] = opt_act_value;
                }

                $btn.addClass('active');
                $options.find('> span').removeClass('disabled').not($btn).addClass('disabled');

                var $selected_btn = $options.find('> span.active');

                function is_this_variant(variant) {
                    var bool = true;

                    $.each($selected_btn, function() {
                        var $this = $(this),
                            this_opt_act_class = $this.parents(option).attr('data-tt-swatch-opt'),
                            this_opt_act_value = $this.attr('data-tt-swatch-val');

                        if(variant[this_opt_act_class] !== this_opt_act_value) {
                            bool = false;
                            return false;
                        }
                    });

                    return bool;
                };

                $.each(swatch_obj['variants'], function() {
                    if(is_this_variant(this)) variants_fit_obj.push(this);
                });

                var variant_single = (variants_fit_obj.length === 1) ? true : false;

                $.each(variants_fit_obj, function() {
                    var select_all = true;

                    $.each(this, function(key, value) {
                        if(key === variant_info) return;

                        var $this_btn = $options.filter('[data-tt-swatch-opt="' + key + '"]').find('> span[data-tt-swatch-val="' + value + '"]');

                        $this_btn.removeClass('disabled');

                        if(variant_single) {
                            $this_btn.addClass('active');
                            select_obj[key] = value;
                        } else if(select_obj[key] !== value) {
                            select_all = false;
                        }
                    });

                    if(variant_single || select_all) variant_select = this;
                });

                $product.attr('data-tt-swatch-select', JSON.stringify(select_obj));

                if(variant_select) {
                    if(variant_select[variant_info]['id']) $product.find('.tt-product__buttons_cart').attr('href', variant_select[variant_info]['id']);
                    if(variant_select[variant_info]['price']) $product.find('.tt-product__price').replaceWith($(variant_select[variant_info]['price']));
                    if(variant_select[variant_info]['image']) changeImage(variant_select[variant_info]['image']);

                    $product.attr('data-tt-selected', true);
                } else {
                    var set_default_img = true;

                    if(opt_act_class === swatch_obj[priority_option]) {
                        $.each(swatch_obj['variants'], function() {
                            if(this[opt_act_class] === opt_act_value) {
                                if(this[variant_info]['image']) {
                                    changeImage(this[variant_info]['image']);
                                    set_default_img = false;

                                    return false;
                                }
                            }
                        });
                    }

                    if(set_default_img && disable_click) {
                        if(swatch_obj['image']) changeImage(swatch_obj['image'], 'off');
                    }

                    if(swatch_obj['id']) $product.find('.tt-product__buttons_cart').attr('href', swatch_obj['id']);
                    if(swatch_obj['price']) $product.find('.tt-product__price').replaceWith($(swatch_obj['price']));
                }
            } else {
                var btn_image = $btn.attr('data-image-src');

                if(btn_image) {
                    changeImage(btn_image);

                    $option.find('> span').removeClass('active');
                    $btn.addClass('active');
                }
            }
        } else {
            $options.find('> span').removeClass('active disabled');
            $product.removeAttr('data-tt-swatch-select');

            if(swatch_obj) {
                if(swatch_obj['id']) $product.find('.tt-product__buttons_cart').attr('href', swatch_obj['id']);
                if(swatch_obj['price']) $product.find('.tt-product__price').replaceWith($(swatch_obj['price']));
                if(swatch_obj['image']) changeImage(swatch_obj['image'], 'off');

                $product.removeAttr('data-tt-selected');
            }
        }
    });

    //color switch opacity
    $(document).on('mouseleave', option, function () {
        option_hover = false;
        $(this).parents('.tt-product__hover.tt-product__clr-clk-transp').removeClass('tt-product__hover-transparent');
    });
};

window.Mogo.productScroll = function() {
    var $product_content = $('.tt-product__content');

    $(window).on('load', function() {
        setTimeout(function() {
            $product_content.perfectScrollbar();
        }, 1000);
    });
};

window.Mogo.btnAjax = {
    quickView: {
        class: 'tt-product__buttons_qv',
        ajax_settings: {
            type: 'POST',
            url: 'extensions/ajax/product-ajax.php'
        },
        beforeSend: function ($this_btn) {
            var $product = $this_btn.parents('.tt-product'),
                index = $product.attr('data-index') || '';

            this.ajax_settings.data = 'product=' + index + '&skin=' + $('html').attr('data-page-skin');
        },
        afterSend: function(data, $this_btn) {
            $this_btn.trigger('blur');

            $.magnificPopup.open({
                mainClass: 'mfp-with-zoom',
                removalDelay: 300,
                closeMarkup: '<button title="%title%" type="button" class="mfp-close icon-cancel"></button>',
                items: [
                    {
                        //src: '.tt-qv',
                        src: $(data),
                        type: 'inline',
                    }
                ],
                callbacks: {
                    beforeOpen: function() {
                        var $body = $('body'),
                            $pd_images = $('.tt-product-page .tt-product-head__images'),
                            is_zoom = $pd_images.find('.tt-product-head__image-main').hasClass('fotorama--zoom'),
                            scrollW,
                            $scrlBl = $('<div>').css({
                                overflowY: 'scroll',
                                width: '50px',
                                height: '50px',
                                visibility: 'hidden'
                            });

                        this.is_zoom = is_zoom;

                        if(is_zoom) $pd_images.productGallery('zoomToggle', 'off');

                        $body.append($scrlBl);
                        scrollW = $scrlBl[0].offsetWidth - $scrlBl[0].clientWidth;
                        $scrlBl.remove();

                        $body.addClass('tt-qv-open');
                        $('.tt-header.tt-header__sticky').css({ paddingRight: scrollW });
                    },
                    open: function () {
                        var timeout = 500,
                            $qv_images = $('.tt-qv .tt-product-head__images');



                        setTimeout(function() {
                            $qv_images.productGallery({
                                slick: {
                                    slidesToShow: 4,
                                    vertical: false,
                                    verticalSwiping: false,
                                }
                            });
                        }, timeout);


                        window.Mogo.countdown('.tt-qv .tt-product-head__countdown');
                    },
                    afterClose: function() {
                        var $qv_images = $('.tt-qv .tt-product-head__images'),
                            $pd_images = $('.tt-product-page .tt-product-head__images');

                        $('body').removeClass('tt-qv-open');
                        $('.tt-header').removeAttr('style');

                        $qv_images.productGallery('destroy');

                        if(this.is_zoom) $pd_images.productGallery('zoomToggle', 'on');
                    },
                }
            });

            $this_btn.removeClass('tt-btn__state--wait');
        }
    },
    addToCart: {
        class: [
            'tt-product__buttons_cart',
            'tt-product-head__cart'
        ],
        ajax_settings: {
            type: 'POST',
            url: 'extensions/ajax/answer.php'
        },
        beforeSend: function ($this_btn) {
            var $product = $this_btn.parents('.tt-product'),
                index = $product.attr('data-index') || '';

            this.ajax_settings.data = 'product=' + index;

            if (!$this_btn.hasClass('tt-btn__state--active')) this.ajax_settings.data += '&answer=true';
            else this.ajax_settings.data += '&answer=false';
        },
        afterSend: function(data, $this_btn) {
            var add_to_cart = '.tt-add-to-cart',
                $add_to_cart = $(add_to_cart),
                show_popup = $add_to_cart.attr('data-active');

            if(data == 1) {
                if($add_to_cart.length && show_popup === 'true') {
                    $this_btn.trigger('blur');

                    $.magnificPopup.open({
                        mainClass: 'mfp-with-zoom',
                        removalDelay: 300,
                        closeMarkup: '<button title="%title%" type="button" class="mfp-close icon-cancel"></button>',
                        items: [
                            {
                                src: add_to_cart,
                                type: 'inline',
                            }
                        ]
                    });
                }

                $this_btn.addClass('tt-btn__state--active');
            } else if(data == 0) {
                $this_btn.removeClass('tt-btn__state--active');
            }

            $this_btn.removeClass('tt-btn__state--wait');
        }
    },
    init: function() {
        var btn_ajax =
                '.tt-btn-type--ajax, ' +
                '.tt-product__buttons_cart, ' +
                '.tt-product__buttons_like, ' +
                '.tt-product__buttons_compare, ' +
                '.tt-product__buttons_qv, ' +
                '.tt-product-head__cart, ' +
                '.tt-product-head__like, ' +
                '.tt-product-head__compare',
            handlers = [
                this.quickView,
                this.addToCart
            ];

        function send_ajax(ajax_obj, successFunc, $this_btn) {
            var ajax_settings = {
                timeout: 5000,
                cache: false,
                success: function (data) {
                    successFunc(data, $this_btn);
                },
                error: function (jqXHR, exception) {

                    if (jqXHR.status === 0) {
                        console.log('Not connect.\n Verify Network.');
                    } else if (jqXHR.status == 404) {
                        console.log('Requested page not found. [404]');
                    } else if (jqXHR.status == 500) {
                        console.log('Internal Server Error [500].');
                    } else if (exception === 'parsererror') {
                        console.log(jqXHR.responseText);
                    } else if (exception === 'timeout') {
                        console.log('Time out error.');
                    } else if (exception === 'abort') {
                        console.log('Ajax request aborted.');
                    } else {
                        console.log('Uncaught Error.\n' + jqXHR.responseText);
                    }

                    $this_btn.removeClass('tt-btn__state--wait');
                }
            };

            ajax_obj = ajax_obj || {};

            $.extend(ajax_settings, ajax_obj);

            $.ajax(ajax_settings);
        };

        $(document).on('click', btn_ajax, function (e) {
            var $this = $(this),
                $this_btn = $this,
                ajax_obj = {
                    type: 'POST'
                },
                successFunc;

            $this_btn.addClass('tt-btn__state--wait');

            $(handlers).each(function() {
                var handler = this,
                    has_class = false;

                if(Array.isArray(handler.class)) {
                    $(handler.class).each(function () {
                        if($this_btn.hasClass(this)) {
                            has_class = true;
                            return false;
                        }
                    });
                } else {
                    if($this_btn.hasClass(handler.class)) has_class = true;
                }

                if(has_class) {
                    handler.beforeSend($this_btn);

                    $.extend(ajax_obj, handler.ajax_settings);

                    successFunc = function (data, $this_btn) {
                        handler.afterSend(data, $this_btn);
                    };
                }
            });

            if(!successFunc) {
                if (!$this_btn.hasClass('tt-btn__state--active')) ajax_obj.data = 'answer=true';
                else ajax_obj.data = 'answer=false';

                ajax_obj.url = 'extensions/ajax/answer.php';

                successFunc = function (data, $this_btn) {
                    if(data == 1) {
                        $this_btn.addClass('tt-btn__state--active');
                    } else if(data == 0) {
                        $this_btn.removeClass('tt-btn__state--active');
                    }

                    $this_btn.removeClass('tt-btn__state--wait');
                };
            }

            send_ajax(ajax_obj, successFunc, $this_btn);

            e.preventDefault();
            return false;
        });
    }
};

window.Mogo.sidebarMobile = function() {
    var _self = this,
        $sidebar = $('.tt-sidebar'),
        $sidebar_content = $sidebar.find('.tt-sidebar__content'),
        $bg = $('.tt-sidebar__bg'),
        $btn = $('.tt-sidebar__btn'),
        $body = $('body'),
        scrollW,
        breakpoint = 1024;

    var $scrlBl = $('<div>').css({
        overflowY: 'scroll',
        width: '50px',
        height: '50px',
        visibility: 'hidden'
    });

    $body.append($scrlBl);
    scrollW = $scrlBl[0].offsetWidth - $scrlBl[0].clientWidth;
    $scrlBl.remove();

    function close(is_fast) {
        $sidebar.removeClass('tt-sidebar--open');
        $bg.removeClass('tt-sidebar__bg--visible');

        $sidebar.unbind('transitionend').one('transitionend', function () {
            var t = parseInt($body.css('top'), 10) * -1;

            $body.removeClass('ttg-ovf-hidden').removeAttr('style').scrollTop(t);

            $sidebar.removeClass('tt-sidebar--ready').removeAttr('style');
            $bg.removeClass('tt-sidebar__bg--ready');

            $sidebar_content.perfectScrollbar('destroy').removeClass('ps');
        });

        if(is_fast) $sidebar.trigger('transitionend');

        $(window).unbind('resize.sidebar');
    };

    $btn.on('click', function () {
        if(!$sidebar.hasClass('tt-sidebar--open')) {
            _self.vars.$settings_btn.trigger('togglelist.close');
            _self.vars.$user_btn.trigger('togglelist.close');
            _self.vars.$cart_btn.trigger('togglelist.close');
            _self.vars.$search_close_btn.trigger('search.close');
            _self.vars.$tonyMenu_top.TonyM('hideTM', false, false, true);

            var t = -$body.scrollTop();

            $body.css({ top: t }).addClass('ttg-ovf-hidden').css({ 'padding-right': scrollW });

            $sidebar_content.perfectScrollbar();

            $sidebar.addClass('tt-sidebar--ready');
            $bg.addClass('tt-sidebar__bg--ready');

            setTimeout(function () {
                $sidebar.addClass('tt-sidebar--open');
                $bg.addClass('tt-sidebar__bg--visible');
            }, 0);

            $(window).on('resize.sidebar', function() {
                if(window.innerWidth > breakpoint) close(true);
            });
        } else {
            close();
        }
    });

    $bg.on('click', function () {
        $sidebar.filter('.tt-sidebar--open').find($btn).trigger('click');
    });
};

window.Mogo.sliderBlog = function() {
    var $slider_blog = $('.tt-post__slider');

    $slider_blog.each(function () {
        var $this = $(this),
            $post = $this.parents('.tt-post'),
            $slider_nav = $('<div>').appendTo($post.find('.tt-post__slider-nav'));

        $this.slick({
            rtl: $('body').attr('dir') === 'rtl' ? true : false,
            arrows: true,
            dots: true,
            infinite: true,
            slidesToShow: 1,
            speed: 1000,
            autoplay: true,
            autoplaySpeed: 2500,
            fade: true,
            prevArrow: '<i class="icon-left-open-big"></i>',
            nextArrow: '<i class="icon-right-open-big"></i>',
            appendDots: $slider_nav,
            appendArrows: $slider_nav,
        });
    });
};

window.Mogo.newsletterPopup = function() {
    var timeout = 500;

    setTimeout(function () {
        var newsletter_popup = '.tt-newsletter-popup',
            $checkbox_show_popup = $(newsletter_popup).find('.tt-newsletter-popup__show_popup input'),
            cookie_news = $.cookie('newsletter');

        if($(newsletter_popup + '[data-active="true"]').length && cookie_news !== 'off') {
            $.magnificPopup.open({
                mainClass: 'mfp-with-zoom',
                removalDelay: 300,
                closeMarkup: '<button title="%title%" type="button" class="mfp-close icon-cancel"></button>',
                items: [
                    {
                        src: '.tt-newsletter-popup',
                        type: 'inline'
                    }
                ],
                callbacks: {
                    close: function() {
                        if($checkbox_show_popup.is(':checked')) {
                            $.cookie('newsletter', 'off', {
                                //expires: 1,
                                path: '/'
                            });
                        }
                    }
                }
            });
        }
    }, timeout);
};

window.Mogo.newsletter = function() {
    var $newsletters = $('.tt-newsletter');

    if($newsletters.length) {
        $newsletters.each(function () {
            var $newsletter = $(this),
                $btn_news = $newsletter.find('button'),
                $input_news = $newsletter.find('input'),
                transition = 700,
                is_act = false,
                timeout = Math.round(Math.random() * 1000),
                ajsx = {
                    type: 'POST',
                    url: 'ajax/answer.php',
                    data: 'answer=ok'
                };

            function isEmail(email) {
                var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
                return regex.test(email);
            };

            function act(e) {
                is_act = true;

                var email = $input_news.prop('value'),
                //ajsx.data += '&email=' + email,
                    $error_text = $newsletter.find('.tt-newsletter__text-error'),
                    $default_text = $newsletter.find('.tt-newsletter__text-default'),
                    $complete_text = $newsletter.find('.tt-newsletter__text-complete'),
                    $wait_text = $newsletter.find('.tt-newsletter__text-wait');

                if (isEmail(email)) {
                    $default_text.fadeOut({
                        duration: transition / 2,
                        complete: function () {
                            $newsletter.addClass('tt-newsletter__wait');
                            $wait_text.show();

                            $.ajax({
                                type: ajsx.type,
                                url: ajsx.url,
                                data: ajsx.data,
                                success: function (data) {
                                    if (data) {
                                        $wait_text.hide();

                                        $newsletter.removeClass('tt-newsletter__wait').addClass('tt-newsletter__message tt-newsletter__complete');

                                        setTimeout(function () {
                                            $complete_text.fadeIn({
                                                duration: transition,
                                                complete: function () {
                                                    setTimeout(function () {
                                                        var $newsletter_popup = $newsletter.parents('.mfp-wrap');

                                                        $input_news.prop('value', '');

                                                        if($newsletter_popup.length) {
                                                            $('.mfp-bg').trigger('click');
                                                        } else {
                                                            $complete_text.fadeOut({
                                                                complete: function () {
                                                                    $newsletter.removeClass('tt-newsletter__message tt-newsletter__complete');

                                                                    $default_text.fadeIn({
                                                                        complete: function () {
                                                                            is_act = false;
                                                                        }
                                                                    });
                                                                }
                                                            });
                                                        }
                                                    }, 3000);
                                                }
                                            });
                                        }, transition);
                                    }
                                },
                                error: function (jqXHR, exception) {

                                    if (jqXHR.status === 0) {
                                        console.log('Not connect.\n Verify Network.');
                                    } else if (jqXHR.status == 404) {
                                        console.log('Requested page not found. [404]');
                                    } else if (jqXHR.status == 500) {
                                        console.log('Internal Server Error [500].');
                                    } else if (exception === 'parsererror') {
                                        console.log(jqXHR.responseText);
                                    } else if (exception === 'timeout') {
                                        console.log('Time out error.');
                                    } else if (exception === 'abort') {
                                        console.log('Ajax request aborted.');
                                    } else {
                                        console.log('Uncaught Error.\n' + jqXHR.responseText);
                                    }

                                    $btn_news.toggleClass('tt-btn__state--active').removeClass('tt-btn__state--wait');
                                }
                            });
                        }
                    });
                } else {
                    $default_text.fadeOut({
                        duration: transition / 2,
                        complete: function () {
                            $newsletter.addClass('tt-newsletter__message tt-newsletter__error');
                            setTimeout(function () {
                                $error_text.fadeIn({
                                    duration: transition,
                                    complete: function () {
                                        setTimeout(function () {
                                            $error_text.fadeOut({
                                                complete: function () {
                                                    $newsletter.removeClass('tt-newsletter__message tt-newsletter__error');

                                                    $default_text.fadeIn({
                                                        complete: function () {
                                                            is_act = false;
                                                        }
                                                    });
                                                }
                                            });
                                        }, 2000);
                                    }
                                });
                            }, transition);
                        }
                    });
                }
            }

            $btn_news.on('click.act', function (e) {
                if (!is_act) {
                    act(e);
                }

                e.preventDefault();
                return false;
            });
        });
    }
};

window.Mogo.btnToTop = function() {
    var $to_top = $('.tt-footer__to-top'),
        breakpoint = 500,
        direction = 'up',
        save_scroll = 0,
        is_animate = false;

    $to_top.on('click', function(e){
        if(is_animate) return;
        is_animate = true;

        if(direction === 'up') {
            save_scroll = $('body').scrollTop();

            $('html, body').velocity('stop').velocity( 'scroll' , {
                offset: 0,
                duration: 1000,
                complete: function () {
                    direction = 'down';
                    $to_top.addClass('tt-footer__to-top-back');

                    $(window).on('scroll.to-top-back', function () {
                        var scroll_t = pageYOffset || Math.max($('body').scrollTop(), $('html').scrollTop());

                        if (scroll_t > breakpoint) {
                            direction = 'up';
                            $to_top.removeClass('tt-footer__to-top-back');
                            $(window).unbind('scroll.to-top-back');
                        }
                    });

                    is_animate = false;
                }
            });
        } else if (direction === 'down') {
            direction = 'up';

            $('html, body').velocity('stop').velocity( 'scroll' , {
                offset: save_scroll,
                duration: 1000,
                complete: function () {
                    is_animate = false;
                }
            });
        }

        e.preventDefault();
        e.stopPropagation();
        return false;
    });

    if($to_top.hasClass('tt-footer__to-top-desktop')) {
        $(window).on('scroll.to-top resize.to-top', function () {
            var scroll_t = pageYOffset || Math.max($('body').scrollTop(), $('html').scrollTop());

            if (scroll_t > breakpoint) {
                $to_top.addClass('tt-footer__to-top-open');
            } else {
                $to_top.removeClass('tt-footer__to-top-open');
            }
        });
    }
};

window.Mogo.carouselBrands = function() {
    var $carousel_brands = $('.tt-carousel-brands');

    $carousel_brands.slick({
        dots: false,
        arrows: false,
        autoplay: true,
        autoplaySpeed: 2500,
        infinite: true,
        slidesToShow: 8,
        rtl: $('body').attr('dir') === 'rtl' ? true : false,
        responsive: [
            {
                breakpoint: 1400,
                settings: {
                    slidesToShow: 6
                },
            },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 4
                },
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 3
                },
            },
            {
                breakpoint: 479,
                settings: {
                    slidesToShow: 2
                },
            },
        ]
    });
};

window.Mogo.carouselBox = function() {
    var $carousel_box = $('.tt-carousel-box'),
        speed_correct = 500;

    function getRand(min, max) {
        return Math.random() * (max - min) + min;
    };

    $carousel_box.each(function () {
        var $this_carousel = $(this),
            $this_slider = $this_carousel.find('.tt-carousel-box__slider'),
            $arrows = $this_carousel.parents('.tt-page__section').find('.tt-page__arrows'),
            grid = $this_slider.attr('data-grid'),
            slick_obj = {
                dots: false,
                arrows: false,
                autoplay: true,
                autoplaySpeed: 2000 + speed_correct + getRand(500, 1000),
                touchMove: false
            };

        speed_correct *= -1;

        if(!grid) grid = 4;

        if(!$this_carousel.hasClass('tt-carousel-box--vertical')) {
            $.extend(slick_obj, {
                rtl: $('body').attr('dir') === 'rtl' ? true : false,
                infinite: true,
                slidesToShow: grid,
                responsive: [
                    {
                        breakpoint: 1400,
                        settings: {
                            slidesToShow: 2
                        }
                    },
                    {
                        breakpoint: 769,
                        settings: {
                            slidesToShow: 1,
                            touchMove: false
                        }
                    }
                ]
            });
        } else {
            $.extend(slick_obj, {
                infinite: false,
                vertical: true,
                slidesToShow: 2,
                verticalSwiping: true,
                responsive: [
                    {
                        breakpoint: 1025,
                        settings: {
                            swipe: false
                        }
                    }
                ]
            });
        }

        $this_slider.slick(slick_obj);

        if($arrows.length) {
            $arrows.on('click', 'span', function (e) {
                var $this = $(this);

                if ($this.hasClass('tt-page__arrows-prev')) {
                    $this_slider.slick('slickPrev');
                } else if ($this.hasClass('tt-page__arrows-next')) {
                    $this_slider.slick('slickNext');
                }
            });
        }
    });
};

window.Mogo.sliderBlog = function() {
    var $slider_blog = $('.tt-post__slider');

    $slider_blog.each(function () {
        var $this = $(this),
            $post = $this.parents('.tt-post'),
            $slider_nav = $('<div>').appendTo($post.find('.tt-post__slider-nav'));

        $this.slick({
            rtl: $('body').attr('dir') === 'rtl' ? true : false,
            arrows: true,
            dots: true,
            infinite: true,
            slidesToShow: 1,
            speed: 1000,
            autoplay: true,
            autoplaySpeed: 2500,
            fade: true,
            prevArrow: '<i class="icon-left-open-big"></i>',
            nextArrow: '<i class="icon-right-open-big"></i>',
            appendDots: $slider_nav,
            appendArrows: $slider_nav,
        });
    });
};

window.Mogo.sliderBlogGrid = function() {
    var $slider_blog_grid = $('.tt-post-grid__slider');

    $slider_blog_grid.each(function () {
        var $this = $(this),
            $post = $this.parents('.tt-post-grid'),
            $slider_nav = $post.find('.tt-post-grid__slider-nav');

        $this.slick({
            rtl: $('body').attr('dir') === 'rtl' ? true : false,
            arrows: true,
            dots: true,
            infinite: true,
            slidesToShow: 1,
            speed: 1000,
            autoplay: true,
            autoplaySpeed: 2500,
            fade: true,
            prevArrow: '<i class="icon-left-open-big"></i>',
            nextArrow: '<i class="icon-right-open-big"></i>',
            appendDots: $slider_nav,
            appendArrows: $slider_nav,
        });
    });
};

window.Mogo.sliderBlogSingle = function() {
    var $post_slider = $('.tt-post-slider');

    $post_slider.slick({
        rtl: $('body').attr('dir') === 'rtl' ? true : false,
        arrows: true,
        dots: true,
        infinite: true,
        slidesToShow: 1,
        speed: 1000,
        autoplay: true,
        autoplaySpeed: 2500,
        prevArrow: '<i class="slick-prev icon-left-open-big"></i>',
        nextArrow: '<i class="slick-next icon-right-open-big"></i>',
    }).addClass('tt-post-slider__init').hide().fadeIn();
};

window.Mogo.sliderScroll = function() {
    $.fn.sliderScroll = function() {
        var $slider = this;

        if (!$slider.length) return false;

        var $nav = $slider.find('.tt-slider-scroll__nav'),
            $nav_ul = $nav.find('ul'),
            $nav_arrows = $nav.find('.tt-slider-scroll__nav_arrows span'),
            scroll_is_act = false;

        $nav_ul.on('click', 'li', function(e) {
            if(!scroll_is_act) {
                scroll_is_act = true;

                var wind_H = window.innerHeight,
                    $li = $nav_ul.children(),
                    $item,
                    item_top,
                    item_H,
                    scroll_to,
                    eq = 0,
                    i = 0;

                for (; i < $li.length; i++) {
                    if ($li.get(i) === this)
                        eq = i;
                }

                $item = $slider.find('.tt-slider-scroll__item').eq(eq),
                    item_top = $item.offset().top,
                    item_H = $item.outerHeight(),
                    scroll_to = item_top - wind_H / 2 + item_H / 2;

                $('html, body').animate({
                    scrollTop: scroll_to
                }, {
                    duration: 500,
                    complete: function () {
                        scroll_is_act = false;
                    }
                });
            }

            e.preventDefault();
            e.stopPropagation();
            return false;
        });

        $nav_arrows.on('click', function (e) {
            var index = $nav_arrows.index(this),
                $nav_li_act = $nav.find('li.active');

            if(index === 0) {
                $nav_li_act.prev().trigger('click');
            } else if (index === 1) {
                $nav_li_act.next().trigger('click');
            }
        });

        function moveAction() {
            var wind_H = window.innerHeight,
                wind_W = window.innerWidth,
                $items = $slider.find('.tt-slider-scroll__item');

            $items.height(wind_H);

            var nav_H = $nav.innerHeight(),
                nav_top = $nav_ul.offset().top,
                $last_item = $slider.find('.tt-slider-scroll__item:last-child'),
                last_item_top = $last_item.offset().top,
                last_item_H = $last_item.outerHeight(),
                last_item_max = last_item_top + last_item_H / 2,
                $first_item = $slider.find('.tt-slider-scroll__item').eq(0),
                first_item_top = $first_item.offset().top,
                first_item_H = $first_item.outerHeight(),
                first_item_max = first_item_top + first_item_H / 2,
                pos_top = 0,
                i = 0;

            if (last_item_max < pageYOffset + wind_H / 2){
                pos_top = last_item_max - nav_H / 2 - pageYOffset;
            } else if (first_item_max > pageYOffset + wind_H / 2) {
                pos_top = first_item_max - nav_H / 2 - pageYOffset;
            } else {
                pos_top = wind_H / 2 - nav_H / 2;
            }

            $nav.css({
                'top': pos_top
            });

            for(; i < $items.length; i++) {
                var $item = $items.eq(i),
                    this_bottom = $item.offset().top + $item.outerHeight();

                if (this_bottom > nav_top + nav_H / 2) {
                    $nav_ul.find('li').removeClass('active').eq(i).addClass('active');
                    break;
                }
            }
        };

        $(window).on('resize.scrollslider scroll.scrollslider load.scrollslider ', function() {
            moveAction();
        });

        if(this.firstLoad) {
            this.firstLoad = false;
        } else {
            moveAction();
        }

        $slider.velocity({ opacity: 1 }, 1000);
    };

    $('.tt-slider-scroll').sliderScroll();
};

window.Mogo.tabs = function() {
    $.fn.ttTabs = function (options) {
        function ttTabs(tabs) {
            var $tabs = $(tabs),
                trl = $('body').attr('dir') === 'rtl' ? true : false,
                tabs_type = $tabs.attr('data-tt-type'),
                $head = $tabs.find('.tt-tabs__head'),
                $head_slider = $head.find('.tt-tabs__slider'),
                $head_btn = $head_slider.find('.tt-tabs__btn'),
                $border = $head.find('.tt-tabs__border'),
                $body = $tabs.find('.tt-tabs__body'),
                $body_tab = $body.find('> div'),
                anim_tab_duration = options.anim_tab_duration || 500,
                anim_scroll_duration = options.anim_scroll_duration || 500,
                breakpoint = 1024,
                scrollToOpenMobile = (options.scrollToOpenMobile !== undefined) ? options.scrollToOpenMobile : true,
                singleOpen = (options.singleOpen !== undefined) ? options.singleOpen : true,
                toggleOnDesktop = (options.toggleOnDesktop !== undefined) ? options.toggleOnDesktop : true,
                effect = (options.effect !== undefined) ? options.effect : 'slide',
                offsetTop = (options.offsetTop !== undefined) ? options.offsetTop : '',
                goToTab = options.goToTab,
                $btn_prev = $head.find('.tt-tabs__btn-prev'),
                $btn_next = $head.find('.tt-tabs__btn-next');

            function _closeTab($li, desktop) {
                var $animElem,
                    anim_obj = {
                        duration: anim_tab_duration,
                        complete: function () {
                            $(this).removeAttr('style');
                        }
                    };

                function _anim_func($animElem) {
                    switch(effect) {
                        case 'toggle':
                            $animElem.hide().removeAttr('style');
                            break;
                        case 'slide':
                            $animElem.velocity('slideUp', anim_obj);
                            break;
                        default:
                            $animElem.velocity('slideUp', anim_obj);
                    }
                };

                /*function _anim_func($animElem) {
                 if(effect === 'toggle') {
                 $animElem.hide().removeAttr('style');
                 } else if(effect === 'slide') {
                 $animElem.slideUp(anim_obj);
                 } else {
                 $animElem.slideUp(anim_obj);
                 }
                 };*/

                if(desktop || singleOpen) {
                    $head_btn.removeClass('active');
                    $animElem = $body_tab.filter('.active').removeClass('active').find('> div').stop();

                    _anim_func($animElem);
                } else {
                    var index = $head_btn.index($li);

                    $li.removeClass('active');
                    $animElem = $body_tab.eq(index).removeClass('active').find('> div').stop();

                    _anim_func($animElem);
                }
            };

            function _openTab($li, desktop, beforeOpen, afterOpen, trigger) {
                var index = $head_btn.index($li),
                    $body_li_act = $body_tab.eq(index),
                    $animElem,
                    anim_obj = {
                        duration: anim_tab_duration,
                        complete: function () {
                            if(afterOpen) afterOpen($body_li_act);
                        }
                    };

                function _anim_func($animElem) {
                    if($head_slider.hasClass('slick-initialized')) {
                        var btn_l = $li.last().get(0).getBoundingClientRect().left,
                            btn_r = $li.last().get(0).getBoundingClientRect().right,
                            head_l = $head.get(0).getBoundingClientRect().left,
                            head_r = $head.get(0).getBoundingClientRect().right;

                        if(btn_r > head_r) $head_slider.slick('slickNext');
                        else if(btn_l < head_l) $head_slider.slick('slickPrev');
                    }

                    if(beforeOpen) beforeOpen($li.find('> span'));

                    switch(effect) {
                        case 'toggle':
                            $animElem.show();
                            if(afterOpen) afterOpen($body_li_act);
                            break;
                        case 'slide':
                            $animElem.velocity( 'slideDown', anim_obj);
                            break;
                        default:
                            $animElem.velocity( 'slideDown', anim_obj);
                    }

                    /*if(effect === 'toggle') {
                     $animElem.show();
                     if(afterOpen) afterOpen($body_li_act);
                     } else if(effect === 'slide') {
                     $animElem.slideDown(anim_obj);
                     } else {
                     $animElem.slideDown(anim_obj);
                     }*/
                };

                $li.addClass('active');
                $animElem = $body_li_act.addClass('active').find('> div').stop();

                _anim_func($animElem);
            };

            function _replaceBorder($this, animate) {
                var $btns_body = ($head_slider.hasClass('slick-initialized')) ? $head_slider.find('.slick-track') : $head;

                if(tabs_type === 'horizontal') {
                    var position = {},
                        side = trl ? 'right' : 'left';

                    if($this.length) {
                        var span_l = $this.get(0).getBoundingClientRect()[side],
                            head_l = $btns_body.get(0).getBoundingClientRect()[side],
                            left = span_l - head_l;

                        if(trl) left *= -1;

                        position['width'] = $this.innerWidth();
                        position[side] = left;
                    } else {
                        position['width'] = 0;
                        position[side] = 0;
                    }

                } else if(tabs_type === 'vertical') {
                    if($this.length) {
                        var span_t = $this.get(0).getBoundingClientRect().top,
                            head_t = $head.get(0).getBoundingClientRect().top,
                            position = {
                                top: span_t - head_t,
                                height: $this.innerHeight()
                            };
                    } else {
                        var position = {
                            top: 0,
                            height: 0
                        };
                    }
                }

                if(animate) $border.velocity('stop').velocity(position, anim_tab_duration);
                else $border.velocity('stop').css(position);
            };

            $head_btn.on('click', '> span', function (e, trigger) {
                var $this = $(this),
                    $li = $this.parent(),
                    wind_w = window.innerWidth,
                    desktop = wind_w > breakpoint,
                    trigger = (trigger === 'trigger') ? true : false;

                if($li.hasClass('active')) {
                    if(desktop && !toggleOnDesktop) return;

                    _closeTab($li, desktop);

                    _replaceBorder('', true);
                } else {
                    _closeTab($li, desktop);

                    _openTab($li, desktop,
                        function($li_act) {
                            if(desktop) {
                                var animate = !trigger;

                                _replaceBorder($li_act, animate);
                            }
                        },
                        function ($body_li_act) {
                            if(!desktop && !trigger && scrollToOpenMobile) {
                                var tob_t = $body_li_act.offset().top;
                                $('html, body').velocity('stop').velocity( 'scroll' , {
                                    offset: tob_t,
                                    duration: anim_scroll_duration
                                });
                            }
                        }
                    );
                }
            });

            $body.on('click', '> div > span', function (e) {
                var $this = $(this),
                    $li = $this.parent(),
                    index = $body_tab.index($li);

                $head_btn.eq(index).find('> span').trigger('click');
            });

            function _toTab(tab, scrollTo, focus) {
                var wind_w = window.innerWidth,
                    desktop = wind_w > breakpoint,
                    header_h = 0,
                    $sticky = $(offsetTop),
                    $openTab = $head_btn.filter('[data-tab="' + tab + '"]'),
                    $scrollTo = $(scrollTo);

                if(desktop && $sticky.length) {
                    header_h = $sticky.height();
                }

                function srlToBlock() {
                    if ($scrollTo.length) {
                        $('html, body').velocity( 'scroll' , {
                            offset: $scrollTo.offset().top - header_h,
                            duration: anim_scroll_duration,
                            complete: function () {
                                var $focus = $(focus);

                                if ($focus.length) $focus.focus();
                            }
                        });
                    }
                };

                if(!$openTab.hasClass('active')) {
                    $('html, body').velocity('stop').velocity( 'scroll' , {
                        offset: $tabs.offset().top - header_h,
                        duration: anim_scroll_duration,
                        complete: function () {
                            _closeTab($openTab, desktop);

                            _openTab($openTab, desktop,
                                function($li_act) {
                                    _replaceBorder($li_act, true);
                                },
                                function () {
                                    srlToBlock();
                                }
                            );
                        }
                    });
                } else {
                    srlToBlock();
                }
            };

            if($.isArray(goToTab) && goToTab.length) {
                $(goToTab).each(function () {
                    var elem = this.elem,
                        tab = this.tab,
                        scrollTo = this.scrollTo,
                        focus = this.focus;

                    $(elem).on('click', function (e) {
                        _toTab(tab, scrollTo, focus);

                        e.preventDefault();
                        return false;
                    });
                });
            }

            function _btn_disabled(currentSlide) {
                var btn_last_r = $head_btn.last().get(0).getBoundingClientRect().right,
                    head_r = $head.get(0).getBoundingClientRect().right;

                if(currentSlide === 0) $btn_prev.addClass('disabled');
                else $btn_prev.removeClass('disabled');

                if(btn_last_r <= head_r) $btn_next.addClass('disabled');
                else $btn_next.removeClass('disabled');
            };

            function _slider_init() {
                if($head_slider.hasClass('slick-initialized')) return;

                $head.addClass('tt-tabs__head--slider');

                $head_slider.slick({
                    infinite: false,
                    slidesToShow: 1,
                    variableWidth: true,
                    draggable: false,
                    dots: false,
                    arrows: false
                });

                $head_slider.find('.slick-track').append($border);

                $btn_prev.addClass('disabled');

                $head_slider.on('afterChange', function(e, slick, currentSlide) {
                    _btn_disabled(currentSlide);
                });

                $btn_prev.on('click', function() {
                    if($(this).hasClass('disabled')) return;
                    $head_slider.slick('slickPrev');
                });

                $btn_next.on('click', function() {
                    if($(this).hasClass('disabled')) return;
                    $head_slider.slick('slickNext');
                });
            };

            function _slider_destroy() {
                if(!$head_slider.hasClass('slick-initialized')) return;

                $($head_slider, $btn_prev, $btn_next).off();

                $head.append($border);

                $head_slider.slick('unslick');

                $head.removeClass('tt-tabs__head--slider');
            };

            $(window).on('resize', function () {
                var wind_w = window.innerWidth,
                    desktop = wind_w > breakpoint,
                    head_w = $head.innerWidth(),
                    li_w = 0;

                $head_btn.each(function () {
                    li_w += $(this).innerWidth();
                });

                if(desktop) {
                    var $li_act = $head_btn.filter('.active'),
                        $span_act = $li_act.find('> span');

                    if(!singleOpen && $span_act.length > 1) {
                        var $save_active = $li_act.first();

                        _closeTab('', desktop);
                        _openTab($save_active, desktop);
                    }

                    if(li_w > head_w) {
                        if(tabs_type === 'horizontal') _slider_init();
                        if($head_slider.hasClass('slick-initialized')) {
                            setTimeout(function() {
                                _btn_disabled($head_btn.index($('.tt-tabs__btn.slick-current')));
                            }, 0);
                        }
                        _replaceBorder($span_act, false);
                    } else {
                        if(tabs_type === 'horizontal') _slider_destroy();
                        _replaceBorder($span_act, false);
                    }
                } else {
                    if(tabs_type === 'horizontal') _slider_destroy();
                    $border.removeAttr('style');
                }
            });

            $head_btn.filter('[data-active="true"]').find('> span').trigger('click', ['trigger']);

            return $tabs;
        };

        $(this).each(function() {
            new ttTabs(this);
        });
    };

    var tabsObj = {
        singleOpen: true,
        anim_tab_duration: 500,
        anim_scroll_duration: 500,
        toggleOnDesktop: true,
        scrollToOpenMobile: true,
        effect: 'slide',
        offsetTop: '.tt-header[data-sticky="true"]'
    };

    $('.tt-product-page__tabs').ttTabs($.extend(tabsObj, {
        goToTab: [
            {
                elem: '.tt-product-head__review-count',
                tab: 'review',
                scrollTo: '.tt-review__comments'
            },
            {
                elem: '.tt-product-head__review-add, .tt-review__head > a',
                tab: 'review',
                scrollTo: '.tt-review__form',
                focus: '#reviewName'
            },
            {
                elem: '.spr-summary-actions-newreview',
                tab: 'review-shopify',
                scrollTo: '.spr-content',
                focus: '#reviewNameShopify'
            }
        ]
    }));

    $('.tt-my-account__tabs').ttTabs(tabsObj);

    $('.tt-tabs-test').ttTabs(tabsObj);
};

window.Mogo.setStars = function() {
    var stars_input = '.tt-stars.tt-stars__input';

    function get_stars(e) {
        var $this = $(this),
            $set = $this.find('.tt-stars__set'),
            $input = $this.find('input'),
            stars_w = $this.width(),
            pos_x = (e.pageX - $this.offset().left),
            set_stars;

        if(pos_x < 0) pos_x = 0;

        set_stars = (Math.floor(5 * (pos_x / stars_w)) + 1) * 20;

        $set.css({ width: set_stars * 20 + '%'});

        $set.css({ width: set_stars + '%'});

        return set_stars;
    };

    $(document).on({
        mousemove: function (e) {
            get_stars.call(this, e);
        },
        mouseleave: function () {
            var $this = $(this),
                $set = $this.find('.tt-stars__set'),
                $input = $this.find('input'),
                value = $input.val();

            if(value.length) {
                $set.css({ width: value + '%'});
            }
        },
        click: function (e) {
            var $input = $(this).find('input');

            $input.val(get_stars.call(this, e));

        }
    }, stars_input);
};

window.Mogo.socialIcons = function() {
    var $iconsAddThis = $('<script type="text/javascript" src="//s7.addthis.com/js/300/addthis_widget.js#pubid=ra-58cfdc36dacf870d"></script>'),
        i = 0;

    $('.tt-product-head').append($iconsAddThis);

    function removeLabels() {
        setTimeout(function () {
            var labels = $('.at-resp-share-element');

            if(labels.length) {
                labels.find('.at-label').remove();
            } else if(i < 50) {
                removeLabels();
            }

            i++;
        }, 10);
    };

    removeLabels();
};

window.Mogo.categories = function() {
    var $categories = $('.tt-categories.tt-categories__toggle'),
        breakpoint = 1024,
        anim_duration = 500,
        interval;

    $categories.on('click', 'a', function (e) {
        var $this = $(this),
            $li = $this.parent();

        $li.toggleClass('active');

        $li.filter('.active').not('.tt-categories__open').find('> i').trigger('click');

        e.preventDefault();
        return false;
    });

    $categories.on('click', '.tt-categories__next', function () {
        var $this = $(this),
            $li = $this.parent(),
            $ul = $li.find('> ul').first(),
            wind_w = window.innerWidth,
            desktop = wind_w > breakpoint;

        $li.toggleClass('tt-categories__open');

        if($ul.length) {
            if($li.hasClass('tt-categories__open')) {
                if(desktop) {
                    clearInterval(interval);
                    interval = setInterval(function () {
                        $(window).trigger('stickySide.position');
                    }, 5);
                }

                $ul.velocity('stop').removeAttr('style').velocity( 'slideDown', {
                    duration: anim_duration,
                    complete: function () {
                        clearInterval(interval);
                    }
                });
            } else {
                $ul.velocity('stop').velocity( 'slideUp', {
                    duration: anim_duration,
                    complete: function () {
                        $(window).trigger('stickySide.position');
                    }
                });
                $ul.find('ul').velocity('stop').velocity( 'slideUp', anim_duration );
                $ul.find('li').removeClass('tt-categories__open');
            }
        }
    });

    $categories.find('li.tt-categories__open > ul').show();
};

window.Mogo.rangeSlider = function() {
    var $range = $('.tt-layer-nav__price-range'),
        $range_i = $range.find('> input'),
        $sidebar_content = $('.tt-sidebar__content'),
        breakpoint = 1024;

    if($range_i.length > 0) {
        $range_i.ionRangeSlider({
            type: "double",
            min: 0,
            max: 500,
            from: 0,
            to: 2300,
            step: 10,
            prefix: "$",
            prettify_enabled: true,
            onFinish: function () {
                if(window.innerWidth <= breakpoint) {
                    $sidebar_content.perfectScrollbar();
                }
            }
        });

        $range.find('.irs-slider, .irs-from, .irs-to').on('mousedown touchstart', function() {
            if($sidebar_content.hasClass('ps') && window.innerWidth <= breakpoint) {
                $sidebar_content.perfectScrollbar('destroy').removeClass('ps');
            }
        });
    }
};

window.Mogo.viewProduct = function() {
    var $vw_prod = $('.tt-product-btn-vw');

    if ($vw_prod.length) {
        var $control = $($vw_prod.attr('data-control')),
            $input = $vw_prod.find('input');

        $input.on('change', function () {
            $control.addClass('ttg-loading');

            var $this = $(this);

            $input.each(function () {
                var view = $(this).attr('data-view-class');

                $control.removeClass(view);
            });

            $control.addClass($this.attr('data-view-class'));

            $control.removeClass('ttg-loading');
        });
    }
};

window.Mogo.instafeed = function() {
    var $instagram = $('#instafeed');

    if($instagram.length) {
        $.fn.func_instafeed = function(new_obj) {
            var $this = $(this);

            if (!$this.length) return;

            var new_obj = new_obj || {},
                set_obj = {
                    get: 'user',
                    userId: '5666153596',
                    clientId: '606758bfc4da4b72a422f7d15da8136b',
                    accessToken: '5666153596.1677ed0.df044d21f65c40819af900da18707a24',
                    limit: 10,
                    sortBy: 'most-liked',
                    resolution: "standard_resolution",
                    template: '<div class="col-xl-12"><a href="{{link}}" class="tt-instagram"><img src="{{image}}" alt="Image name"><div class="tt-instagram__mask"><i class="icon-instagram-1"></i></div></a></div>',
                };

            $.extend(set_obj, new_obj);

            var feed = new Instafeed(set_obj);
            feed.run();
        };

        $instagram.func_instafeed({
            after: function() {
                $instagram.slick({
                    dots: false,
                    arrows: false,
                    autoplay: true,
                    autoplaySpeed: 2000,
                    infinite: true,
                    slidesToShow: 6,
                    responsive: [
                        {
                            breakpoint: 1400,
                            settings: {
                                slidesToShow: 4
                            }
                        },
                        {
                            breakpoint: 769,
                            settings: {
                                slidesToShow: 2
                            }
                        }
                    ]
                });
            }
        });
    }
};

window.Mogo.gallery = function() {
    function _show_popup($slider_clone, single) {
        $.magnificPopup.open({
            mainClass: 'mfp-with-zoom mfp-gallery',
            removalDelay: 300,
            closeMarkup: '<button title="%title%" type="button" class="mfp-close icon-cancel-circled2"></button>',
            items: [
                {
                    src: $slider_clone,
                    type: 'inline'
                }
            ],
            callbacks: {
                open: function () {
                    galleryTop = new Swiper('.mfp-content .gallery-top', {
                        nextButton: '.swiper-btn-next',
                        prevButton: '.swiper-btn-prev'
                    });

                    if(!single) {
                        galleryThumbs = new Swiper('.mfp-content .gallery-thumbs', {
                            centeredSlides: true,
                            slidesPerView: 'auto',
                            touchRatio: 0.2,
                            slideToClickedSlide: true,
                            autoHeight: true
                        });

                        galleryTop.params.control = galleryThumbs;
                        galleryThumbs.params.control = galleryTop;
                    }
                },
                afterClose: function () {
                    galleryTop.destroy();
                    if(!single) galleryThumbs.destroy();
                    $slider_clone.remove();
                },
            }
        });
    };

    function _wrap_tags($tags, tags) {
        for(var j = 0; j < tags.length; j++) {
            var this_tag = (j < tags.length - 1) ? tags[j] + ', ' : tags[j];
            $tags.append($('<a>').html(this_tag).attr('href', '#' + tags[j]));
        }
    };

    $('.tt-gallery').on('click', 'a[data-album-id], a[data-photo]', function (e) {
        var $this = $(this),
            album_id = $this.attr('data-album-id'),
            single_photo = $this.attr('data-photo'),
            $slider_clone = $('.tt-gallery > .tt-gallery__slider').clone(),
            galleryTop,
            galleryThumbs;

        if (album_id) {
            $.ajax({
                url: 'extensions/ajax/gallery.php',
                type: 'POST',
                dataType: 'json',
                data: 'album_id=' + album_id,
                timeout: 5000,
                success: function (data) {
                    $slider_clone.find('.gallery-top').append($('<div>').addClass('swiper-wrapper'));
                    $slider_clone.find('.gallery-thumbs').append($('<div>').addClass('swiper-wrapper'));

                    var $gallery_top = $slider_clone.find('.gallery-top .swiper-wrapper'),
                        $gallery_thumbs = $slider_clone.find('.gallery-thumbs .swiper-wrapper');

                    for (var i = 0; i < data.length; i++) {
                        var $image = $('<img>').attr('src', data[i]['src']).addClass('swiper-lazy'),
                            $info = $('<div>').addClass('swiper-info'),
                            $title = $('<div>').addClass('swiper-title').html(data[i]['title']),
                            $tags = $('<div>').addClass('swiper-tags'),
                            tags = data[i]['tags'];

                        _wrap_tags($tags, tags);

                        $info.append($title, $tags);

                        $gallery_top.append($('<div>').addClass('swiper-slide').append($info, $image));
                        $gallery_thumbs.append($('<div>').addClass('swiper-slide').append($image.clone()));
                    }

                    _show_popup($slider_clone);
                },
                error: function (jqXHR, exception) {

                    if (jqXHR.status === 0) {
                        console.log('Not connect.\n Verify Network.');
                    } else if (jqXHR.status == 404) {
                        console.log('Requested page not found. [404]');
                    } else if (jqXHR.status == 500) {
                        console.log('Internal Server Error [500].');
                    } else if (exception === 'parsererror') {
                        console.log(jqXHR.responseText);
                    } else if (exception === 'timeout') {
                        console.log('Time out error.');
                    } else if (exception === 'abort') {
                        console.log('Ajax request aborted.');
                    } else {
                        console.log('Uncaught Error.\n' + jqXHR.responseText);
                    }
                }
            });
        } else if(single_photo) {
            $slider_clone
                .addClass('tt-gallery__slider-single')
                .find('.gallery-top')
                .append($('<div>').addClass('swiper-wrapper'));

            var $gallery_top = $slider_clone.find('.gallery-top .swiper-wrapper'),
                $image = $('<img>').attr('src', single_photo).addClass('swiper-lazy'),
                $info = $('<div>').addClass('swiper-info'),
                $title = $('<div>').addClass('swiper-title').html($this.attr('data-title')),
                $tags = $('<div>').addClass('swiper-tags'),
                tags = $this.attr('data-tags').split(', ');

            _wrap_tags($tags, tags);

            $info.append($title, $tags);

            $gallery_top.append($('<div>').addClass('swiper-slide').append($info, $image));

            _show_popup($slider_clone, true);
        }

        e.preventDefault();
        return false;
    });

    $(document).on('mousedown', '.gallery-top .swiper-slide', function (e) {
        if($(e.target).hasClass('swiper-slide')) {
            $(this).one({
                'mouseup.clickbg': function () {
                    $('.mfp-bg').trigger('click');
                    //$(this).unbind('mousemove.clickbg');
                },
                'mousemove.clickbg': function () {
                    //$(this).unbind('mouseup.clickbg');
                }
            });
        }
    });
};

window.Mogo.progressBar = function() {
    var $progress_bar = $('.tt-prog-bar'),
        duration = 2000;

    $(function() {
        $progress_bar.each(function() {
            var $this = $(this),
                val = $this.attr('data-tt-val') || false;

            if(val) {
                var $range = $this.find('.tt-prog-bar__range > div'),
                    $numb = $this.find('span');

                $range.animate({
                    width: val + '%'
                }, {
                    duration: duration,
                    step: function(num) {
                        $numb.html(Math.round(num) + '%');
                    }
                });
            }
        });
    });
};

window.Mogo.toggleProductParam = function() {
    var $param_control = $('.tt-summary__products_param-control'),
        param = '.tt-summary__products_param';

    $param_control.on('click', function() {
        var $this = $(this),
            $param = $this.parent().find(param);

        $this.toggleClass('active');

        if($this.hasClass('active')) {
            $param.velocity('stop').removeAttr('style').velocity('slideDown', 400);
        } else {
            $param.velocity('stop').velocity('slideUp', 400);
        }
    });

    $('.tt-summary__products_param-control--open').trigger('click');
};

window.Mogo.dbClickLink = function() {
    var Modernizr = window.Modernizr;

    if( Modernizr.touch ){

        (function link_dbclick() {
            var link_dbclick = 'a[data-ttg-event="link-dbclick"]',
                active_link = null;

            $(document).on('click', link_dbclick, function (e) {
                if(active_link !== this) {
                    active_link = this;
                    e.preventDefault;
                    return false;
                } else {
                    active_link = null;
                }
            });
        })();
    }
};

window.Mogo.productGLR = function() {
    var zoomSettings = {
        zoomType: "inner",
        cursor: "crosshair",
        easing : true,
        zoomWindowFadeIn: 500,
        zoomWindowFadeOut: 500
    };

    $.widget( 'ui.productGallery', {
        options: {
            bp: 1024,
            bp_slick: 479,
            fotorama: {
                nav: false,
                arrows: false,
                allowfullscreen: true,
                auto: false,
                shadows: false,
                transition: 'slide',
                clicktransition: 'crossfade'
            },
            slick: {
                vertical: true,
                verticalSwiping: true,
                slidesToShow: 5,
                dots: false,
                arrows: false,
                infinite: false,
                responsive: [
                    {
                        breakpoint: 1400,
                        settings: {
                            vertical: false,
                            verticalSwiping: false,
                            slidesToShow: 4
                        }
                    },
                    {
                        breakpoint: 1024,
                        settings: {
                            vertical: false,
                            verticalSwiping: false,
                            slidesToShow: 5
                        }
                    },
                    {
                        breakpoint: 768,
                        settings: {
                            vertical: false,
                            verticalSwiping: false,
                            slidesToShow: 4
                        }
                    }
                ]
            },
            //zoomEnable: true,
            zoom: zoomSettings
        },
        _create: function() {
            var _self = this;

            this.$image = this.element;
            this.$main = this.$image.find('.tt-product-head__image-main');
            this.$preview = this.$image.find('.tt-product-head__image-preview');
            this.zoom_src = {};
            this.$main_act_img = null;
            this.slick_state = false;
            this.zoom_activate = true;
            this.zoom_state = false;
            this.id = 'id' + Math.ceil(Math.random() * 10000000);

            this.$main.addClass('ttg-loading');

            this.$main.find('img').each(function() {
                var $this = $(this);

                _self.zoom_src[$this.attr('src')] = $this.attr('data-zoom-image');
            });

            this.fotorama = this.$main.fotorama(this.options.fotorama).data('fotorama');

            this.$btn_full = $('<div>').addClass('fotorama__fullscreen-custom').append($('<i>').addClass('icon-resize-full-alt'));

            this.$main.append(this.$btn_full);

            this.$btn_full.on('click', function() {
                if(_self.$main.hasClass('fotorama--fullscreen')) {
                    _self.fotorama.cancelFullScreen();

                    _self._checkSlick();

                    _self.$main_act_img = _self.$main.find('.fotorama__active img');

                    _self._zoomInit();
                } else {
                    _self._zoomDestroy();

                    _self.fotorama.requestFullScreen();
                }
            });

            this.$btn_zoom_toggle = $('<div>').addClass('fotorama__btn-zoom').append($('<i>').addClass('icon-zoom-in'));

            this.$main.append(this.$btn_zoom_toggle);

            this.$btn_zoom_toggle.on('click', function() {
                if(_self.zoom_state) _self.zoomToggle('off');
                else _self.zoomToggle('on');
            });

            this.$arrow_prev = $('<div>').addClass('fotorama__arrow-custom fotorama__arrow-custom--disabled fotorama__arrow-custom-prev').append($('<i>').addClass('icon-left-open-big'));
            this.$arrow_next = $('<div>').addClass('fotorama__arrow-custom fotorama__arrow-custom--disabled fotorama__arrow-custom-next').append($('<i>').addClass('icon-right-open-big'));

            this.$main.append(this.$arrow_prev, this.$arrow_next);

            this.$arrow_prev.on('click', function() {
                _self._setEffect('crossfade', function() {
                    _self.fotorama.show('<');
                });
            });

            this.$arrow_next.on('click', function() {
                _self._setEffect('crossfade', function() {
                    _self.fotorama.show('>');
                });
            });

            this._slickInit();

            this.$image.addClass('tt-product-head__images--loaded');

            this.$main.one('fotorama:load', function(e, fotorama) {
                _self.$main_act_img = _self.$main.find('.fotorama__active img');

                _self._zoomInit();

                _self._checkBtns(fotorama);

                _self.$main.removeClass('ttg-loading');
            });

            this.$main.on('fotorama:show', function(e, fotorama) {
                _self.$main.unbind('fotorama:showend fotorama:load');

                _self._zoomDestroy();

                _self._checkSlick();

                _self._checkBtns(fotorama);

                _self.$main.one('fotorama:load', function() {
                    _self.$main_act_img = _self.$main.find('.fotorama__active img');

                    _self._zoomInit();
                });

                _self.$main.one('fotorama:showend', function(e, fotorama) {
                    if(_self.$main.find('.fotorama__active img').attr('src')) {
                        _self.$main.trigger('fotorama:load');
                    }
                });
            });

            $(window).on('resize.productgallery' + this.id, function() {
                _self._debounce(function() {
                    _self._slickInit();
                    _self._zoomDestroy();
                    _self._zoomInit();
                });
            });
        },
        _slickInit: function() {
            var _self = this,
                this_state = window.innerWidth > this.options.bp_slick ? true : false;

            if(this_state === this.slick_state) {
                if(this.$preview.hasClass('slick-initialized')) this.$preview.slick('setPosition');
                return;
            }

            if(this.$preview.hasClass('slick-initialized')) this.$preview.slick('destroy');

            this.$preview.on('init', function() {
                setTimeout(function() {
                    _self._checkSlick();
                }, 0);
            });

            if(this_state) this.$preview.slick(this.options.slick);

            this.slick_state = this_state;

            if(!this_state) {
                this.$preview.off();
                return;
            }

            this.$prev_slides = this.$preview.find('.slick-slide');

            this.$preview.on('mousedown', '.slick-slide', function() {
                $(this).one({
                    'mouseup': function(e) {
                        var $this = $(this);

                        if($this.hasClass('current')) return;

                        var index = _self.$prev_slides.index(this);

                        _self._setEffect('crossfade', function() {
                            _self.fotorama.show(index);
                        });
                    },
                    'mousemove': function() {
                        $(this).unbind('mouseup');
                    }
                });
            });
        },
        _checkSlick: function(fotorama) {
            if(this.$main.hasClass('fotorama--fullscreen')) return;

            var index = this.fotorama.activeFrame.i;

            this.$prev_slides.removeClass('current');
            this.$prev_slides.eq(--index).addClass('current');
            this.$preview.slick('slickGoTo', index);
        },
        _checkBtns: function(fotorama) {
            var index = fotorama.activeFrame.i;

            if(index === 1) {
                this.$arrow_prev.addClass('fotorama__arrow-custom--disabled');
            } else {
                this.$arrow_prev.removeClass('fotorama__arrow-custom--disabled');
            }

            if(index === fotorama.size) {
                this.$arrow_next.addClass('fotorama__arrow-custom--disabled');
            } else {
                this.$arrow_next.removeClass('fotorama__arrow-custom--disabled');
            }
        },
        _zoomDestroy: function () {
            if(this.zoom_state && this.$zoomContainer) {
                $.removeData(this.$main_act_img, 'elevateZoom');

                this.$zoomContainer.remove();
                this.$zoomContainer = null;

                this.$main.removeClass('fotorama--zoom');

                this.zoom_state = false;
            }
        },
        _zoomInit: function () {
            if(this.$main_act_img.length && window.innerWidth > this.options.bp && this.zoom_activate && !this.$main.hasClass('fotorama--fullscreen')) {
                var _self = this,
                    set_zoom_src = this.zoom_src[this.$main_act_img.attr('src')];

                if(!set_zoom_src) return;

                this.$main_act_img.attr('data-zoom-image', set_zoom_src);;

                this.$main_act_img.elevateZoom(this.options.zoom);

                function replaceCont() {
                    setTimeout(function() {
                        _self.$zoomContainer = $('body > .zoomContainer');
                        if(_self.$zoomContainer.length) {
                            _self.$zoomContainer.appendTo(_self.$main);
                        } else {
                            replaceCont();
                        }
                    }, 20);
                };

                replaceCont();

                this.$main.addClass('fotorama--zoom');

                this.zoom_state = true;
            }
        },
        zoomToggle: function(state) {
            var $icon = this.$btn_zoom_toggle.find('i');

            $icon.removeAttr('class');

            if(state === 'on') {
                $icon.addClass('icon-zoom-in');

                this.zoom_activate = true;

                this._zoomInit();
            } else if(state === 'off') {
                $icon.addClass('icon-zoom-out');

                this.zoom_activate = false;

                this._zoomDestroy();
            }
        },
        _setEffect: function(effect, func) {
            var _self = this;

            this.fotorama.setOptions({ transition: effect });

            func();

            this.$main.one('fotorama:showend', function() {
                _self.fotorama.setOptions({ transition: 'slide' });
            });
        },
        _debounce: function(func) {
            var wind_w = window.innerWidth,
                timeout;

            timeout = setInterval(function() {
                var wind_w_int = window.innerWidth;
                if (wind_w === wind_w_int) {
                    setTimeout(function() {
                        func();
                    }, 200);
                }
                clearTimeout(timeout);
            }, 100);
        },
        _init: function () {

        },
        _setOption: function(key, value) {
            $.Widget.prototype._setOption.apply(this, arguments);
        },
        destroy: function() {
            this._zoomDestroy(this.$main_act_img);

            this.$preview.unbind('mousedown');

            this.$preview.slick('destroy');

            $(this.$btn_full, this.$arrow_prev, this.$arrow_next, this.$btn_zoom_toggle).off().remove();

            this.fotorama.destroy();

            $(window).unbind('resize.productgallery' + this.id);

            $.Widget.prototype.destroy.call(this);
        }
    });

    var $images = $('.tt-product-head__images');

    if($images.find('.tt-product-head__image-main').length) {
        $images.productGallery();
    } else {
        $images.addClass('tt-product-head__images--loaded');

        $images.find('img').elevateZoom(zoomSettings);
    }
};

window.Mogo.testimonials = function() {
    var $testimonials = $('.tt-testimonials');

    $testimonials.each(function () {
        var $this = $(this),
            $slider = $this.find('.tt-testimonials__slider');

        $slider.slick({
            rtl: $('body').attr('dir') === 'rtl' ? true : false,
            arrows: false,
            dots: true,
            infinite: true,
            slidesToShow: 1,
            speed: 1000,
            autoplay: true,
            autoplaySpeed: 2500,
            fade: false,
        });
    });
};

Mogo.masonryBlog = function() {
    jQueryBridget( 'masonry', window.Masonry, $ );

    var $masonry_grid = $('.tt-masonry'),
        masonry,
        params = {
            itemSelector: '[class^="col-"]'
        };

    masonry = $masonry_grid.masonry(params).css({ 'visibility': 'visible' });

    $(window).on('load', function() {
        masonry.masonry('layout');
    });

    $masonry_grid.imagesLoaded().progress(function() {
        masonry.masonry('layout');
    });

    setTimeout(function() {
        masonry.masonry('layout');
    }, 400);
};

$(function () {
    for (var key in window.Mogo) {
        if (typeof window.Mogo[key] === 'function') {
            window.Mogo[key]();
        } else if (window.Mogo[key].init && typeof window.Mogo[key].init === 'function') {
            window.Mogo[key].init();
        }
    }
});