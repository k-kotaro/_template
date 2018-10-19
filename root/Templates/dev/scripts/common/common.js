// JavaScript Document
(function($){

    var breakpoint = 768;
    var gnavMenuOpenFlg = 0;

    $("html").prepend('<div class="windowload" style="position: fixed;background-color: #fff;width: 100%; height: 100%;z-index: 20000;"></div>');

    var _ua = (function(u){
        return {
            Tablet:(u.indexOf("windows") != -1 && u.indexOf("touch") != -1 && u.indexOf("tablet pc") == -1)
            || u.indexOf("ipad") != -1
            || (u.indexOf("android") != -1 && u.indexOf("mobile") == -1)
            || (u.indexOf("firefox") != -1 && u.indexOf("tablet") != -1)
            || u.indexOf("kindle") != -1
            || u.indexOf("silk") != -1
            || u.indexOf("playbook") != -1,
            Mobile:(u.indexOf("windows") != -1 && u.indexOf("phone") != -1)
            || u.indexOf("iphone") != -1
            || u.indexOf("ipod") != -1
            || (u.indexOf("android") != -1 && u.indexOf("mobile") != -1)
            || (u.indexOf("firefox") != -1 && u.indexOf("mobile") != -1)
            || u.indexOf("blackberry") != -1
        }
    })(window.navigator.userAgent.toLowerCase());

    //viewport set
    var viewport = function(){
        if(_ua.Mobile){
            $('head').append('<meta name="viewport" content="width=device-width, initial-scale=1.0">');
        }
    }

    //phone to
    var phoneLink = function(){
        var $phoneLink = $('a[href*="tel:"]');
        $phoneLink.click(function(){
            if(!_ua.Mobile){
                return false;
            }
        });
    }

    // smoothscroll
    var sroothscroll = function(){
        $('.pagetop > a[href*="#document"], a[href*="#anc_"]').click(function(){
            var offset = $($(this).attr('href')).offset();
            $("html, body").animate({scrollTop:offset.top}, 400);
            return false;
        });
    }

    //gnav
    var gnavMenuOpen = function(){
        if($('#gnav .menu').length){
            $('#gnav .menu > *').click(function(){
                if($(this).hasClass('s_animate')){
                    if($(this).hasClass('is_active')){
                        $(this).removeClass('is_active').addClass('close');
                    }else{
                        $(this).addClass('is_active').removeClass('close');
                    }
                }else{
                    $(this).toggleClass('is_active');
                }

                if(gnavMenuOpenFlg == 0){
                    $(this).parent().next('ul').slideDown();
                    gnavMenuOpenFlg = 1;
                }else{
                    $(this).parent().next('ul').slideUp();
                    gnavMenuOpenFlg = 0;
                }

                return false;
            });
            gnavMenu();
        }
    }
    var gnavMenu = function(){
        if($('#gnav .menu').length){
            if($(window).width() < breakpoint){
                $('.menu + ul:visible').hide();
            }else{
                $('#gnav .menu > *').removeClass('is_active');
                $('.menu + ul').removeAttr('style');
                gnavMenuOpenFlg = 0;
            }
        }
    }

    //rwdImage
    var conf = {
        'dataPc' : "data-pcimg",
        'dataPcWidth' : "data-pcimgwidth",
        'dataPcHeight' : "data-pcimgheight",
        'dataSp' : "data-smtimg",
        'dataSpWidth' : "data-smtimgwidth",
        'dataSpHeight' : "data-smtimgheight"
    }

    var curentType = 'pc';

    function preLoad(){
        $("img").each(function(){
            if ($(this).attr(conf.dataSp)!="") {
                $("<img>").attr("src", $(this).attr(conf.dataSp));
            }
        });
    }

    function getDevice(){
        if ($(window).width() < breakpoint){
            return 'sp';
        } else {
            return 'pc';
        }
    }

    function convSmtImage(){
        $(window).on("resize", function(){
            convert();
        });
        convert();
    }

    function convert(){
        if (curentType != getDevice()) {
            var before,after;
            if (curentType == 'pc') {
                before = conf.dataPc;
                beforeWidth = conf.dataPcWidth;
                beforeHeight = conf.dataPcHeight;
                after =  conf.dataSp;
                afterWidth =  conf.dataSpWidth;
                afterHeight =  conf.dataSpHeight;
            } else {
                before =  conf.dataSp;
                beforeWidth =  conf.dataSpWidth;
                beforeHeight =  conf.dataSpHeight;
                after =  conf.dataPc;
                afterWidth =  conf.dataPcWidth;
                afterHeight =  conf.dataPcHeight;
            }
            curentType = getDevice();

            $("img").each(function(){
                if ($(this).attr(after)!="") {
                    $(this).attr(before, $(this).attr('src'));
                    $(this).attr('src', $(this).attr(after));
                    if($(this).attr(conf.dataSpWidth)!=''){
                        $(this).attr(beforeWidth, $(this).attr('width'));
                        $(this).attr('width', $(this).attr(afterWidth));
                    }
                    if($(this).attr(conf.dataSpHeight)!=''){
                        $(this).attr(beforeHeight, $(this).attr('height'));
                        $(this).attr('height', $(this).attr(afterHeight));
                    }
                }
            });
        }
    }

    /*! echo-js v1.7.3 | (c) 2016 @toddmotto | https://github.com/toddmotto/echo */
    !function(t,e){"function"==typeof define&&define.amd?define(function(){return e(t)}):"object"==typeof exports?module.exports=e:t.echo=e(t)}(this,function(t){"use strict";var e,n,o,r,c,a={},u=function(){},d=function(t){return null===t.offsetParent},l=function(t,e){if(d(t))return!1;var n=t.getBoundingClientRect();return n.right>=e.l&&n.bottom>=e.t&&n.left<=e.r&&n.top<=e.b},i=function(){(r||!n)&&(clearTimeout(n),n=setTimeout(function(){a.render(),n=null},o))};return a.init=function(n){n=n||{};var d=n.offset||0,l=n.offsetVertical||d,f=n.offsetHorizontal||d,s=function(t,e){return parseInt(t||e,10)};e={t:s(n.offsetTop,l),b:s(n.offsetBottom,l),l:s(n.offsetLeft,f),r:s(n.offsetRight,f)},o=s(n.throttle,250),r=n.debounce!==!1,c=!!n.unload,u=n.callback||u,a.render(),document.addEventListener?(t.addEventListener("scroll",i,!1),t.addEventListener("load",i,!1)):(t.attachEvent("onscroll",i),t.attachEvent("onload",i))},a.render=function(n){for(var o,r,d=(n||document).querySelectorAll("[data-echo], [data-echo-background]"),i=d.length,f={l:0-e.l,t:0-e.t,b:(t.innerHeight||document.documentElement.clientHeight)+e.b,r:(t.innerWidth||document.documentElement.clientWidth)+e.r},s=0;i>s;s++)r=d[s],l(r,f)?(c&&r.setAttribute("data-echo-placeholder",r.src),null!==r.getAttribute("data-echo-background")?r.style.backgroundImage="url("+r.getAttribute("data-echo-background")+")":r.src!==(o=r.getAttribute("data-echo"))&&(r.src=o),c||(r.removeAttribute("data-echo"),r.removeAttribute("data-echo-background")),u(r,"load")):c&&(o=r.getAttribute("data-echo-placeholder"))&&(null!==r.getAttribute("data-echo-background")?r.style.backgroundImage="url("+o+")":r.src=o,r.removeAttribute("data-echo-placeholder"),u(r,"unload"));i||a.detach()},a.detach=function(){document.removeEventListener?t.removeEventListener("scroll",i):t.detachEvent("onscroll",i),clearTimeout(n)},a});


    $(function(){
        contentWidth = $(window).innerWidth();
        preLoad();
    });

    $(window).on('load', function(){
        viewport();
        phoneLink();
        sroothscroll();
        gnavMenuOpen();
        convSmtImage();

        $(".windowload").fadeOut(250, function(){
            $(".windowload").remove();
        });
    });

    var timer = false;
    $(window).on('resize', function(){
        if(timer !== false){
            clearTimeout(timer);
        }
        timer = setTimeout(function(){
        var nowSize = $(window).innerWidth();
            if(contentWidth != nowSize){
                gnavMenu();
                contentWidth = $(window).innerWidth();
            }
        }, 50);
    });
})(jQuery);
