(function(){
  'use strict';

  var path = window.location.pathname.replace(/\/+$/, '');
  if(path !== '/lp/hack2/founding-monitor') return;
  if(document.documentElement.dataset.hack2Visuals === 'ready') return;
  document.documentElement.dataset.hack2Visuals = 'ready';

  var ROOT = '/images/lp/hack2/founding-monitor/';
  var assets = {
    hero: ['hero.webp', 'HackⅡ Founding Monitorの90日間計測とサイトURL入力を説明するビジュアル', 560, 315],
    narrative: ['ai-visibility.webp', 'AI検索上の見えない評価をデータで可視化する説明ビジュアル', 480, 251],
    competitor: ['competitor.webp', '自社サイトと競合2社を比較して改善優先度を整理する説明ビジュアル', 400, 400],
    plan: ['plan-90days.webp', '90日間・質問10件・競合2社・計測3回・面談2回の進行イメージ', 360, 480],
    cta: ['url-cta.webp', '対策したいサイトURLの入力を促す案内ビジュアル', 560, 175],
    badge: ['founding-badge.webp', '', 200, 200],
    mascot: ['mascot-cta.webp', 'サイトURLを入力してFounding Monitorへ申し込む', 220, 220],
    flow: ['application-flow.webp', 'URL入力から情報入力、送信、商談予約までの流れ', 560, 210],
    dashboard: ['dashboard.webp', 'HackⅡ Founding Monitorのレポート画面構成イメージ', 520, 334],
    mobile: ['mobile-hero.webp', 'スマートフォン向けFounding Monitor案内ビジュアル', 280, 498]
  };

  function image(asset, loading){
    var img = document.createElement('img');
    img.src = ROOT + asset[0];
    img.alt = asset[1];
    img.width = asset[2];
    img.height = asset[3];
    img.loading = loading || 'lazy';
    img.decoding = 'async';
    return img;
  }

  function visual(asset, options){
    options = options || {};
    var wrap = document.createElement('div');
    wrap.className = 'lp-visual ' + (options.className || '');
    var figure = document.createElement('figure');
    figure.className = 'lp-visual__frame';
    figure.appendChild(image(asset, options.loading));
    wrap.appendChild(figure);
    if(options.caption){
      var caption = document.createElement('p');
      caption.className = 'lp-visual__caption';
      caption.textContent = options.caption;
      wrap.appendChild(caption);
    }
    return wrap;
  }

  function insertAfter(reference, node){
    if(reference && reference.parentNode) reference.parentNode.insertBefore(node, reference.nextSibling);
  }

  var heroWrap = document.querySelector('.lp-hero .lp-wrap');
  var heroBox = document.getElementById('heroUrlBox') || document.querySelector('.lp-hero .lp-url-box');
  if(heroWrap && heroBox){
    var desktopHero = visual(assets.hero, {className:'lp-visual--hero lp-visual--desktop-only', loading:'eager'});
    heroBox.parentNode.insertBefore(desktopHero, heroBox);
    var mobileHero = visual(assets.mobile, {className:'lp-visual--hero lp-visual--mobile-only', loading:'eager'});
    heroBox.parentNode.insertBefore(mobileHero, heroBox);
    var badge = image(assets.badge, 'eager');
    badge.className = 'lp-founding-badge';
    badge.setAttribute('aria-hidden', 'true');
    heroWrap.appendChild(badge);
  }

  var problems = document.querySelector('.lp-problems');
  if(problems){
    insertAfter(problems, visual(assets.narrative, {
      caption:'AIが御社をどう理解しているかを、推測ではなく計測結果で確認します。'
    }));
  }

  var features = document.querySelector('.lp-features');
  if(features){
    insertAfter(features, visual(assets.competitor, {
      className:'lp-visual--square',
      caption:'比較表は説明用の構成イメージです。実際の計測結果は対象サイトごとに異なります。'
    }));
  }

  var screenPlaceholder = document.querySelector('.lp-screen-placeholder');
  if(screenPlaceholder){
    screenPlaceholder.replaceWith(visual(assets.dashboard, {
      className:'lp-visual--dashboard',
      caption:'画面はレポート構成のイメージです。実際の表示内容とは異なる場合があります。'
    }));
  }

  var spec = document.querySelector('#program .lp-spec') || document.querySelector('.lp-spec');
  if(spec){
    spec.parentNode.insertBefore(visual(assets.plan, {
      className:'lp-visual--portrait',
      caption:'本サービスは設定・計測・分析をトリリオンバンクが行う運用支援型です。Web改修は含みません。'
    }), spec);
  }

  var flow = document.querySelector('.lp-flow');
  if(flow){
    flow.parentNode.insertBefore(visual(assets.flow, {className:'lp-visual--flow'}), flow);
  }

  var firstCta = document.querySelector('.lp-cta-box');
  if(firstCta){
    var ctaLink = document.createElement('a');
    ctaLink.href = '#lp-form-section';
    ctaLink.className = 'lp-cta-visual-link';
    ctaLink.setAttribute('aria-label', '対策したいサイトURLの入力フォームへ移動');
    ctaLink.appendChild(image(assets.cta));
    insertAfter(firstCta, ctaLink);
  }

  var formIntro = document.querySelector('#lp-form-section .lp-center');
  if(formIntro){
    var card = document.createElement('a');
    card.href = '#lp-form-section';
    card.className = 'lp-form-mascot-card';
    card.setAttribute('aria-label', 'Founding Monitorの申込フォームへ進む');
    card.appendChild(image(assets.mascot));
    var copy = document.createElement('span');
    copy.className = 'lp-form-mascot-card__copy';
    copy.innerHTML = '<strong>まずは対象サイトを共有してください</strong>URLと会社情報を送信した後に、商談予約へ進みます。送信前にカレンダーへ移動することはありません。';
    card.appendChild(copy);
    insertAfter(formIntro, card);
  }
})();
