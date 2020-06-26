import "@babel/polyfill";

// common
import * as common from './common';

let timer = false;



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
    if(window.innerWidth < common.breakpoint){
      document.querySelector('.menu + ul').style.display = 'none';
    }else{
      document.querySelector('#gnav .menu > *').classList.remove('is_active');
      document.querySelector('.menu + ul').removeAttribute('style');
    }
  }
};

window.addEventListener('load', () => {
  gnav();
});

window.addEventListener('resize', () => {
  if(timer !== false){
    clearTimeout(timer);
  }
  timer = setTimeout(() => {
    let nowSize = window.innerWidth;
    if(common.contentWidth != nowSize){
      gnavSet();
      common.contentWidth = window.innerWidth;
    }
  }, 50);
});
