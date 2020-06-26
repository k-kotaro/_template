// Layzr js
import Layzr from 'layzr.js';

// picturefill js
import picturefill from 'picturefill';
picturefill();

// css browser selector js
//import './libs/css_browser_selector';

export const breakpoint = 768;
export let contentWidth;

// ページロード中は画面見せないようにする
const body = document.body;
const loadWindow = '<div class="loadWindow">';
body.insertAdjacentHTML('afterbegin', loadWindow);

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
  const phoneTarget = document.querySelectorAll('a[href*="tel:"]');
  const phoneNumArr = Array.prototype.slice.call(phoneTarget);
  phoneNumArr.forEach((target) => {
    target.addEventListener('click', (e) => {
      if(!_ua.Mobile){
        e.preventDefault();
      }
    });
  });
};

// スムーススクロール
const sroothscroll = () => {
  const ancTarget = document.querySelectorAll('.pagetop > a[href*="#document"], a[href*="#anc_"]');
  const ancTargetArr = Array.prototype.slice.call(ancTarget);
  ancTargetArr.forEach((target) => {
    target.addEventListener('click', (e) => {
      let getId = target.getAttribute('href').replace('#', '');
      let offset = document.getElementById(getId).offsetTop;
      $('html, body').animate({
        scrollTop: offset
      }, 400);
      e.preventDefault();
    });
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

document.addEventListener('load', () => {
  contentWidth = window.innerWidth;
});

window.addEventListener('load', () => {
  phoneLink();
  sroothscroll();

  // 画像遅延読み込み実行
  layzr.update().check().handlers(true);

  const loadWindow = document.querySelector('.loadWindow');
  loadWindow.classList.add('is_anim');
  setTimeout(() => {
    loadWindow.parentNode.removeChild(loadWindow);
  }, 300);
});

