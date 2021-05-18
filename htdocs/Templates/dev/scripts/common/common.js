// Layzr js
import Layzr from 'layzr.js';

// picturefill js
import picturefill from 'picturefill';
picturefill();

// css browser selector js
//import './libs/css_browser_selector';

export const breakpoint = 768;
export let contentWidth,
  timer = false;



// デバイス判定
export const _ua = ((u) => {
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
  };
})(window.navigator.userAgent.toLowerCase());

// phone to のPC非活性化
const phoneLink = () => {
  const $phoneLink = $('a[href*="tel:"]');
  $phoneLink.on('click', function(e){
    if(!_ua.Mobile){
      e.preventDefault();
    }
  });
};

// スムーススクロール
const sroothscroll = () => {
  $(document).on('click', '.pagetop > a[href*="#document"], a[href*="#anc_"]', function(e){
    let offset = $($(this).attr('href')).offset().top;
    $('html, body').animate({scrollTop:offset}, 400);
    e.preventDefault();
  });
};

// 画像遅延読み込み
const layzr = Layzr({
  normal: 'data-normal',
  threshold: 10
});
/*layzr.on('src:after', image => {
  // 画像の書き換えをした後に実行
  //image.classList.add('is-show'); // 今回はクラス名を追加してみました。
});*/

$(function(){
  contentWidth = $(window).innerWidth();
});

$(window).on('load', function(){
  phoneLink();
  sroothscroll();

  // 画像遅延読み込み実行
  layzr.update().check().handlers(true);

  $('.windowload').fadeOut(250, function(){
    $('.windowload').remove();
  });
});

