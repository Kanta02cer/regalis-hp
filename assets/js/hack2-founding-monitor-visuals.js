(function () {
  'use strict';

  function visual(index, label, caption, extraClass) {
    var number = String(index).padStart(2, '0');
    var className = 'h2v-panel' + (extraClass ? ' ' + extraClass : '');
    var html = '<figure class="' + className + '">' +
      '<div class="h2v-panel__image h2v-' + number + '" role="img" aria-label="' + label + '"></div>';
    if (caption) html += '<figcaption class="h2v-panel__caption">' + caption + '</figcaption>';
    return html + '</figure>';
  }

  function initHack2Visuals() {
    if (!document.querySelector('.lp-main') || document.documentElement.dataset.hack2Visuals === 'ready') return;
    document.documentElement.dataset.hack2Visuals = 'ready';

    var heroWrap = document.querySelector('.lp-hero .lp-wrap');
    var heroNote = document.querySelector('.lp-hero-note');
    if (heroWrap && heroNote) {
      heroWrap.classList.add('h2v-hero-wrap');
      heroWrap.insertAdjacentHTML('afterbegin', visual(6, 'Founding Monitor先行受付中の募集バッジ', '', 'h2v-badge'));
      heroNote.insertAdjacentHTML('afterend', visual(1, 'HackⅡ Founding MonitorのAI検索可視化ダッシュボードとサイトURL入力導線のイメージ', 'AI検索上の候補入り・引用URL・競合状況・改善優先度を、90日間で確認します。', 'h2v-panel--hero'));
    }

    var problems = document.querySelector('.lp-problems');
    if (problems) {
      problems.insertAdjacentHTML('afterend', visual(2, 'AI検索で選ばれるサイトを目指すHackⅡ Founding Monitorの紹介ビジュアル', 'AIが御社をどう理解しているかを、推測ではなく計測結果で確認します。'));
    }

    var features = document.querySelector('.lp-features');
    if (features) {
      features.insertAdjacentHTML('afterend', visual(3, 'AI検索における自社と競合の候補入り、引用数、改善優先度を比較するイメージ', '競合2社までを同じ条件で比較し、自社が選ばれない質問を特定します。', 'h2v-panel--square'));
    }

    var midCta = document.querySelector('.lp-cta-box');
    if (midCta) {
      midCta.insertAdjacentHTML('afterend', '<a class="h2v-cta" href="#lp-form-section" aria-label="対策したいサイトURLの入力フォームへ移動"><div class="h2v-panel__image h2v-05" role="img" aria-label="対策したいサイトURLを入力して診断を始めるCTAイメージ"></div></a>');
    }

    var dashboardPlaceholder = document.querySelector('.lp-screen-placeholder');
    if (dashboardPlaceholder) {
      dashboardPlaceholder.outerHTML = visual(9, 'HackⅡでAI検索の回答内容、引用URL、競合状況、改善優先度を確認するダッシュボードの生成イメージ', '画面は提供内容を説明する生成イメージです。実際の表示・数値は計測条件により異なります。', 'h2v-dashboard');
    }

    var spec = document.querySelector('.lp-spec');
    if (spec) {
      spec.insertAdjacentHTML('afterend', '<div class="h2v-program">' + visual(4, '90日間、質問10件、競合2社、AIエンジン1つ、計測3回、面談2回のFounding Monitor基本プラン', '', 'h2v-panel--compact') + '<div class="h2v-program-copy"><strong>運用支援型で実施</strong><p>初回設定から計測、分析、改善優先度の整理まで、トリリオンバンクが伴走します。Webサイトの改修作業は含まれません。</p></div></div>');
    }

    var flow = document.querySelector('.lp-flow');
    if (flow) {
      flow.insertAdjacentHTML('beforebegin', visual(8, 'サイトURL入力から情報入力、内容確認、商談予約、計測開始までの申込フロー', '', 'h2v-panel--compact h2v-flow'));
    }

    var formSection = document.getElementById('lp-form-section');
    if (formSection) {
      var formWrap = formSection.querySelector('.lp-wrap');
      var formHeading = formSection.querySelector('.lp-center');
      if (formWrap && formHeading) {
        formHeading.insertAdjacentHTML('afterend', '<div class="h2v-form-guide">' + visual(7, 'トリリオンバンクの案内キャラクター', '', 'h2v-panel--compact') + '<div class="h2v-form-copy"><strong>まずは対象サイトを共有してください</strong>URLと会社情報を送信した後に、商談予約へ進みます。送信前にカレンダーへ移動することはありません。</div></div>');
        formWrap.insertAdjacentHTML('beforeend', visual(10, 'スマートフォン向けHackⅡ Founding Monitor案内ビジュアル', '', 'h2v-panel--compact h2v-mobile'));
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHack2Visuals, { once: true });
  } else {
    initHack2Visuals();
  }
})();
