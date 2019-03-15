// libs js
import Layzr from './libs/layzr.js';

const breakpoint = 768;
let gnavMenuOpenFlg = 0;
let contentWidth;

// ページロード中は画面見せないようにする
$('html').prepend('<div class="windowload" style="position: fixed;background-color: #fff;width: 100%; height: 100%;z-index: 20000;"></div>');

// デバイス判定
const _ua = ((u) => {
	return {
		Tablet:(u.indexOf('windows') != -1 && u.indexOf('touch') != -1 && u.indexOf('tablet pc') == -1)
		|| u.indexOf('ipad') != -1
		|| (u.indexOf('android') != -1 && u.indexOf('mobile') == -1)
		|| (u.indexOf('firefox') != -1 && u.indexOf('tablet') != -1)
		|| u.indexOf('kindle') != -1
		|| u.indexOf('silk') != -1
		|| u.indexOf('playbook') != -1,
		Mobile:(u.indexOf('windows') != -1 && u.indexOf('phone') != -1)
		|| u.indexOf('iphone') != -1
		|| u.indexOf('ipod') != -1
		|| (u.indexOf('android') != -1 && u.indexOf('mobile') != -1)
		|| (u.indexOf('firefox') != -1 && u.indexOf('mobile') != -1)
		|| u.indexOf('blackberry') != -1
	}
})(window.navigator.userAgent.toLowerCase());

// phone to のPC非活性化
const phoneLink = () => {
	const $phoneLink = $('a[href*="tel:"]');
	$phoneLink.click(function(){
		if(!_ua.Mobile){
			return false;
		}
	});
}

// スムーススクロール
const sroothscroll = () => {
	$('.pagetop > a[href*="#document"], a[href*="#anc_"]').click(function(){
		let offset = $($(this).attr('href')).offset();
		$('html, body').animate({scrollTop:offset.top}, 400);
		return false;
	});
}

// グロナビ設定　※サイト構造に応じて変更
const gnavMenuOpen = () => {
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
const gnavMenu = () => {
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
const imageSwitch = {
	conf : {
		'dataPc' : 'data-pc',
		'dataPcWidth' : 'data-pc-width',
		'dataPcHeight' : 'data-pc-height',
		'dataSp' : 'data-sp',
		'dataSpWidth' : 'data-sp-width',
		'dataSpHeight' : 'data-sp-height',
		'currentType' : 'pc'
	},


	preLoad : function (){
		let self = this;
		$('img').each(function(){
			if ($(this).attr(self.conf.dataSp)!='') {
				$('<img>').attr('src', $(this).attr(self.conf.dataSp));
			}
		});
	},

	getDevice : function (){
		if ($(window).width() < breakpoint){
			return 'sp';
		} else {
			return 'pc';
		}
	},

	convSmtImage : function (){
		$(window).on('resize', function(){
			imageSwitch.convert();
		});
		imageSwitch.convert();
	},

	convert : function (){
		let self = this;
		if (self.conf.currentType != imageSwitch.getDevice()) {
			let before, beforeWidth, beforeHeight, after, afterWidth, afterHeight;
			if (self.conf.currentType == 'pc') {
				before = self.conf.dataPc;
				beforeWidth = self.conf.dataPcWidth;
				beforeHeight = self.conf.dataPcHeight;
				after =  self.conf.dataSp;
				afterWidth =  self.conf.dataSpWidth;
				afterHeight =  self.conf.dataSpHeight;
			} else {
				before =  self.conf.dataSp;
				beforeWidth =  self.conf.dataSpWidth;
				beforeHeight =  self.conf.dataSpHeight;
				after =  self.conf.dataPc;
				afterWidth =  self.conf.dataPcWidth;
				afterHeight =  self.conf.dataPcHeight;
			}
			self.conf.currentType = imageSwitch.getDevice();

			$('img').each(function(){
				if ($(this).attr(after)!='') {
					$(this).attr(before, $(this).attr('src'));
					$(this).attr('src', $(this).attr(after));
					if($(this).attr(self.conf.dataSpWidth)!=''){
						$(this).attr(beforeWidth, $(this).attr('width'));
						$(this).attr('width', $(this).attr(afterWidth));
					}
					if($(this).attr(self.conf.dataSpHeight)!=''){
						$(this).attr(beforeHeight, $(this).attr('height'));
						$(this).attr('height', $(this).attr(afterHeight));
					}
				}
			});
		}
	}
}

// 画像遅延読み込み
const layzr = Layzr({
	normal: 'data-normal',
	threshold: 10
});
layzr.on('src:after', image => {
	// 画像の書き換えをした後に実行
	//image.classList.add('is-show'); // 今回はクラス名を追加してみました。
});

$(function(){
	contentWidth = $(window).innerWidth();

	// PC⇔SPの画像切り替えのプリロード
	imageSwitch.preLoad();
});

$(window).on('load', function(){
	phoneLink();
	sroothscroll();
	gnavMenuOpen();

	// PC⇔SPの画像切り替え
	imageSwitch.convSmtImage();

	// 画像遅延読み込み実行
	layzr.update().check().handlers(true);

	$('.windowload').fadeOut(250, function(){
		$('.windowload').remove();
	});
});

let timer = false;
$(window).on('resize', function(){
	if(timer !== false){
		clearTimeout(timer);
	}
	timer = setTimeout(function(){
		let nowSize = $(window).innerWidth();
		if(contentWidth != nowSize){
			gnavMenu();
			contentWidth = $(window).innerWidth();
		}
	}, 50);
});