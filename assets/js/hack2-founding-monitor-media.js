(function () {
  'use strict';

  var ROOT = '/images/lp/hack2/founding-monitor/';

  function image(name, alt, width, height, options) {
    options = options || {};
    var img = document.createElement('img');
    img.src = ROOT + name;
    img.alt = alt || '';
    img.width = width;
    img.height = height;
    img.loading = options.loading || 'lazy';
    img.decoding = 'async';
    if (options.className) img.className = options.className;
    if (options.fetchPriority) img.fetchPriority = options.fetchPriority;
    return img;
  }

  function figure(name, alt, width, height, className, caption) {
    var node = document.createElement('figure');
    node.className = 'lp-generated-visual ' + (className || '');
    node.appendChild(image(name, alt, width, height));
    if (caption) {
      var figcaption = document.createElement('figcaption');
      figcaption.textContent = caption;
      node.appendChild(figcaption);
    }
    return node;
  }

  function insertAfter(reference, node) {
    if (reference && reference.parentNode) {
      reference.parentNode.insertBefore(node, reference.nextSibling);
    }
  }

  function enhanceHero() {
    var wrap = document.querySelector('.lp-hero .lp-wrap');
    if (!wrap || wrap.dataset.mediaEnhanced === 'true') return;
    wrap.dataset.mediaEnhanced = 'true';

    var copy = document.createElement('div');
    copy.className = 'lp-hero-copy';
    while (wrap.firstChild) copy.appendChild(wrap.firstChild);

    var media = document.createElement('figure');
    media.className = 'lp-hero-media';
    var picture = document.createElement('picture');
    var mobileSource = document.createElement('source');
    mobileSource.media = '(max-width: 640px)';
    mobileSource.srcset = ROOT + 'mobile-vertical.webp';
    picture.appendChild(mobileSource);
    picture.appendChild(image(
      'hero-visual.webp',
      'HackⅡ Founding MonitorでAI検索上の見え方を90日間可視化するサービス概要',
      780,
      439,
      { loading: 'eager', fetchPriority: 'high', className: 'lp-asset-main' }
    ));
    media.appendChild(picture);
    media.appendChild(image(
      'founding-badge.webp',
      'Founding Monitor 先行受付中',
      520,
      520,
      { className: 'lp-hero-badge' }
    ));

    wrap.classList.add('lp-hero-grid');
    wrap.appendChild(copy);
    wrap.appendChild(media);
  }

  function addSectionMedia() {
    var problems = document.querySelector('.lp-problems');
    if (problems) {
      insertAfter(problems, figure(
        'wide-ad.webp',
        'AI検索の見えない壁をデータで可視化するHackⅡの概要',
        780,
        408,
        'lp-generated-visual--wide'
      ));
    }

    var features = document.querySelector('.lp-features');
    if (features) {
      insertAfter(features, figure(
        'competitor-comparison.webp',
        '自社と競合2社のAI検索状況を比較し、改善ポイントを整理する画面イメージ',
        520,
        520,
        'lp-generated-visual--square',
        '比較項目・数値は説明用の画面イメージです。'
      ));
    }

    var spec = document.querySelector('.lp-spec');
    if (spec && spec.parentNode) {
      spec.parentNode.insertBefore(figure(
        'plan-90days.webp',
        '90日間のFounding Monitorプログラム内容と進行イメージ',
        520,
        693,
        'lp-generated-visual--portrait'
      ), spec);
    }

    var flow = document.querySelector('.lp-flow');
    if (flow && flow.parentNode) {
      flow.parentNode.insertBefore(figure(
        'application-flow.webp',
        'URL入力、情報入力、内容確認、送信完了、商談予約までの申込フロー',
        780,
        292,
        'lp-generated-visual--wide'
      ), flow);
    }

    var midCta = document.querySelector('.lp-cta-box');
    if (midCta) {
      var ctaFigure = figure(
        'url-cta-banner.webp',
        '対策したいサイトURLを入力してFounding Monitorへ申し込む',
        780,
        244,
        'lp-generated-visual--wide'
      );
      var link = document.createElement('a');
      link.className = 'lp-generated-cta';
      link.href = '#lp-form-section';
      link.setAttribute('aria-label', '対策したいサイトURLの入力フォームへ移動');
      link.appendChild(ctaFigure.firstElementChild);
      ctaFigure.insertBefore(link, ctaFigure.firstChild);
      insertAfter(midCta, ctaFigure);
    }
  }

  function replaceDashboardPlaceholder() {
    var placeholder = document.querySelector('.lp-screen-placeholder');
    if (!placeholder) return;
    var screen = placeholder.closest('.lp-screen');
    if (!screen) return;
    screen.classList.add('lp-screen--generated');
    screen.replaceChildren(
      image(
        'dashboard.webp',
        'HackⅡ Founding Monitorレポートのダッシュボード画面イメージ',
        780,
        501
      )
    );
    var caption = document.createElement('p');
    caption.className = 'lp-screen-caption';
    caption.textContent = '画面イメージです。実際の表示内容は計測条件により異なります。';
    screen.appendChild(caption);
  }

  function addMascotPopup() {
    if (sessionStorage.getItem('hack2-founding-monitor-popup-closed') === '1') return;
    var form = document.getElementById('lp-form-section');
    if (!form) return;

    var popup = document.createElement('aside');
    popup.className = 'lp-mascot-popup';
    popup.setAttribute('aria-label', 'Founding Monitor申し込み案内');

    var link = document.createElement('a');
    link.className = 'lp-mascot-popup__link';
    link.href = '#lp-form-section';
    link.setAttribute('aria-label', 'Founding MonitorのURL入力フォームへ移動');
    link.appendChild(image(
      'mascot-popup.webp',
      'AI検索での見え方は、まず現状把握から。サイトURLを入力する案内',
      520,
      520
    ));

    var close = document.createElement('button');
    close.className = 'lp-mascot-popup__close';
    close.type = 'button';
    close.setAttribute('aria-label', '案内を閉じる');
    close.textContent = '×';
    close.addEventListener('click', function () {
      sessionStorage.setItem('hack2-founding-monitor-popup-closed', '1');
      popup.hidden = true;
    });

    popup.appendChild(link);
    popup.appendChild(close);
    document.body.appendChild(popup);

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          popup.style.opacity = entry.isIntersecting ? '0' : '1';
          popup.style.pointerEvents = entry.isIntersecting ? 'none' : 'auto';
          popup.style.transform = entry.isIntersecting ? 'translateY(18px)' : 'translateY(0)';
        });
      }, { threshold: 0.1 });
      observer.observe(form);
    }
  }

  function start() {
    if (!document.querySelector('.lp-hero') || !document.getElementById('lp-form-section')) return;
    enhanceHero();
    addSectionMedia();
    replaceDashboardPlaceholder();
    addMascotPopup();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();
