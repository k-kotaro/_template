import "@babel/polyfill";

// smoothscroll-polyfill
import smoothscroll from 'smoothscroll-polyfill';
smoothscroll.polyfill();

// Layzr
import Layzr from 'layzr.js';

// picturefill
import picturefill from 'picturefill';
picturefill();

// css browser selector
//import './libs/css_browser_selector';

export const breakpoint = 768;

let timer = false,
  contentWidth;

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
      let rect = document.getElementById(getId).getBoundingClientRect();
      let offset = rect.top + window.pageYOffset;

      window.scrollTo({
        top: offset,
        behavior: "smooth"
      });
      e.preventDefault();
    });
  });
};

// グロナビ設定 ※サイト構造に応じて変更
const gnav = () => {
  const btnElm = document.querySelector('#gnav .menu > *');
  if(document.querySelector('#gnav .menu') != null){
    btnElm.addEventListener('click', (e) => {
      if(btnElm.classList.contains('s_animate')){
        if(btnElm.classList.contains('is_active')){
          btnElm.classList.remove('is_active').classList.add('close');
        }else{
          btnElm.classList.add('is_active').classList.remove('close');
        }
      }else{
        btnElm.classList.toggle('is_active');
      }
      e.preventDefault();
    });
    gnavSet();
  }
};

const gnavSet = () => {
  if(document.querySelector('#gnav .menu') != null){
    if(window.innerWidth < breakpoint){
      document.querySelector('.menu + ul').style.display = 'none';
    }else{
      document.querySelector('#gnav .menu > *').classList.remove('is_active');
      document.querySelector('.menu + ul').removeAttribute('style');
    }
  }
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

document.addEventListener('DOMContentLoaded', () => {
  contentWidth = window.innerWidth;

  // 画像遅延読み込み実行
  layzr.update().check().handlers(true);
});

window.addEventListener('load', () => {
  phoneLink();
  sroothscroll();
  gnav();

  const loadWindow = document.querySelector('.loadWindow');
  loadWindow.classList.add('is_anim');
  setTimeout(() => {
    loadWindow.parentNode.removeChild(loadWindow);
  }, 300);
});

window.addEventListener('resize', () => {
  if(timer !== false){
    clearTimeout(timer);
  }
  timer = setTimeout(() => {
    let nowSize = window.innerWidth;
    if(contentWidth != nowSize){
      gnavSet();
      contentWidth = window.innerWidth;
    }
  }, 50);
});
