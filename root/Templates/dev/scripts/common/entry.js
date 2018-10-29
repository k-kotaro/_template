import news from './libs/echo.min';

class Entry {
	constructor() {
		var breakpoint = 768;
		var gnavMenuOpenFlg = 0;

		// ページロード中は画面見せないようにする
		$("html").prepend('<div class="windowload" style="position: fixed;background-color: #fff;width: 100%; height: 100%;z-index: 20000;"></div>');

		// デバイス判定
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

		// phone to のPC非活性化
		var phoneLink = function(){
			var $phoneLink = $('a[href*="tel:"]');
			$phoneLink.click(function(){
				if(!_ua.Mobile){
					return false;
				}
			});
		}

		// スムーススクロール
		var sroothscroll = function(){
			$('.pagetop > a[href*="#document"], a[href*="#anc_"]').click(function(){
				var offset = $($(this).attr('href')).offset();
				$("html, body").animate({scrollTop:offset.top}, 400);
				return false;
			});
		}

		// グロナビ設定　※サイト構造に応じて変更
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

		// PC⇔SPの画像切り替え
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

		$(function(){
			contentWidth = $(window).innerWidth();
			// PC⇔SPの画像切り替えのプリロード
			preLoad();

			// echo.jsの実行
			echo.init({
				offset: 300    // オフセット値
			});
		});

		$(window).on('load', function(){
			phoneLink();
			sroothscroll();
			gnavMenuOpen();

			// echo.jsの実行
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
	}
}

(function() {
	new Entry();
}());
