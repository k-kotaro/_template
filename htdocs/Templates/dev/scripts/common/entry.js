// common
import * as common from './common';

let timer = false;

// グロナビ設定 ※サイト構造に応じて変更
const gnav = () => {
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
      return false;
    });
    gnavSet();
  }
};

const gnavSet = () => {
  if($('#gnav .menu').length){
    if($(window).width() < common.breakpoint){
      $('.menu + ul:visible').hide();
    }else{
      $('#gnav .menu > *').removeClass('is_active');
      $('.menu + ul').removeAttr('style');
    }
  }
};

$(window).on('load', function(){
  gnav();
});

$(window).on('resize', function(){
  if(timer !== false){
    clearTimeout(timer);
  }
  timer = setTimeout(function(){
    let nowSize = $(window).innerWidth();
    if(common.contentWidth != nowSize){
      gnavSet();
      common.contentWidth = $(window).innerWidth();
    }
  }, 50);
});