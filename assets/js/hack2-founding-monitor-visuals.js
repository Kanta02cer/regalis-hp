(function(){
  'use strict';

  function init(){
    if(!document.querySelector('.lp-main') || document.documentElement.dataset.hack2Visuals === 'ready') return;
    document.documentElement.dataset.hack2Visuals = 'ready';

    var base = window.HACK2_ASSET_BASE || '/images/lp/hack2/founding-monitor/';
    var image = function(file, alt, width, height, eager){
      var loading = eager ? 'eager' : 'lazy';
      var priority = eager ? ' fetchpriority="high"' : '';
      return '<img src="' + base + file + '" alt="' + alt + '" width="' + width + '" height="' + height + '" loading="' + loading + '" decoding="async"' + priority + '>';
    };

    var heroWrap = document.querySelector('.lp-hero .lp-wrap');
    var heroNote = document.querySelector('.lp-hero-note');
    if(heroWrap && heroNote){
      heroWrap.insertAdjacentHTML('afterbegin',
        '<div class="lp-founding-badge" aria-hidden="true">' +
          image('06_founding_badge_transparent_1000x1000.webp','',320,320,false) +
        '</div>'
      );
      heroNote.insertAdjacentHTML('afterend',
        '<figure class="lp-hero-visual">' +
          image('01_hero_visual_1600x900.webp','HackⅡ Founding MonitorのAI検索可視化ダッシュボードとサイトURL入力導線のイメージ',800,450,true) +
          '<figcaption class="lp-story-caption">AI検索上の候補入り・引用URL・競合状況・改善優先度を、90日間で確認します。</figcaption>' +
        '</figure>'
      );
    }

    var problemCards = document.querySelector('.lp-problems');
    if(problemCards){
      problemCards.insertAdjacentHTML('afterend',
        '<figure class="lp-story-visual">' +
          image('02_wide_ad_1200x628.webp','AI検索で選ばれるサイトを目指すHackⅡ Founding Monitorの紹介ビジュアル',720,377,false) +
          '<figcaption class="lp-story-caption">AIが御社をどう理解しているかを、推測ではなく計測結果で確認します。</figcaption>' +
        '</figure>'
      );
    }

    var midCta = document.querySelector('.lp-cta-box');
    if(midCta){
      midCta.insertAdjacentHTML('afterend',
        '<a class="lp-cta-art" href="#lp-form-section" aria-label="対策したいサイトURLの入力フォームへ移動">' +
          image('05_url_cta_banner_1600x500.webp','対策したいサイトURLを入力して診断を始めるCTAイメージ',800,250,false) +
        '</a>'
      );
    }

    var features = document.querySelector('.lp-features');
    if(features){
      features.insertAdjacentHTML('afterend',
        '<figure class="lp-story-visual lp-story-visual--square">' +
          image('03_competitor_square_1080x1080.webp','AI検索における自社と競合の候補入り・引用数・改善優先度を比較するイメージ',560,560,false) +
          '<figcaption class="lp-story-caption">競合2社までを同じ条件で比較し、自社が選ばれない質問を特定します。</figcaption>' +
        '</figure>'
      );
    }

    var dashboardPlaceholder = document.querySelector('.lp-screen-placeholder');
    if(dashboardPlaceholder){
      dashboardPlaceholder.outerHTML =
        '<figure style="margin:0">' +
          image('09_dashboard_mockup_1400x900.webp','HackⅡでAI検索の回答内容、引用URL、競合状況、改善優先度を確認するダッシュボードイメージ',760,489,false).replace('<img ','<img class="lp-dashboard-visual" ') +
          '<figcaption class="lp-story-caption" style="padding:0 18px 16px">画面は提供内容を説明するイメージです。実際の表示は計測条件により異なります。</figcaption>' +
        '</figure>';
    }

    var spec = document.querySelector('.lp-spec');
    if(spec){
      spec.insertAdjacentHTML('afterend',
        '<div class="lp-program-visual">' +
          '<figure class="lp-story-visual">' +
            image('04_90day_plan_900x1200.webp','90日間、質問10件、競合2社、AIエンジン1つ、計測3回、面談2回のFounding Monitor基本プラン',480,640,false) +
          '</figure>' +
          '<div class="lp-program-copy"><strong>運用支援型で実施</strong><p>初回設定から計測、分析、改善優先度の整理まで、トリリオンバンクが伴走します。Webサイトの改修作業は含まれません。</p></div>' +
        '</div>'
      );
    }

    var flow = document.querySelector('.lp-flow');
    if(flow){
      flow.insertAdjacentHTML('beforebegin',
        '<figure class="lp-story-visual lp-flow-visual">' +
          image('08_cta_flow_1600x600.webp','サイトURL入力から情報入力、内容確認、商談予約、計測開始までの申込フロー',800,300,false) +
        '</figure>'
      );
    }

    var formSection = document.getElementById('lp-form-section');
    if(formSection){
      var formWrap = formSection.querySelector('.lp-wrap');
      var formHeading = formSection.querySelector('.lp-center');
      if(formWrap && formHeading){
        formHeading.insertAdjacentHTML('afterend',
          '<div class="lp-form-mascot">' +
            image('07_mascot_popup_transparent_1000x1000.webp','トリリオンバンクの案内キャラクター',360,360,false) +
            '<div class="lp-form-mascot-copy"><strong>まずは対象サイトを共有してください</strong>URLと会社情報を送信した後に、商談予約へ進みます。送信前にカレンダーへ移動することはありません。</div>' +
          '</div>'
        );
        formWrap.insertAdjacentHTML('beforeend',
          '<figure class="lp-mobile-story">' +
            image('10_mobile_vertical_1080x1920.webp','スマートフォン向けHackⅡ Founding Monitor案内ビジュアル',420,747,false) +
          '</figure>'
        );
      }
    }
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();
})();
