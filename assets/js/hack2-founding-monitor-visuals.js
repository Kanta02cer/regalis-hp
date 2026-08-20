(function(){
  'use strict';

  var PAGE_PATH = '/lp/hack2/founding-monitor';

  function node(tag, className, text){
    var element = document.createElement(tag);
    if(className) element.className = className;
    if(typeof text === 'string') element.textContent = text;
    return element;
  }

  function picture(base, file, alt, width, height, eager){
    var image = document.createElement('img');
    image.src = base + file;
    image.alt = alt || '';
    image.width = width;
    image.height = height;
    image.loading = eager ? 'eager' : 'lazy';
    image.decoding = 'async';
    if(eager) image.setAttribute('fetchpriority','high');
    return image;
  }

  function insertAfter(reference, newNode){
    if(reference && reference.parentNode){
      reference.parentNode.insertBefore(newNode, reference.nextSibling);
    }
  }

  function reveal(element, direction){
    element.classList.add('lp-reveal');
    if(direction) element.setAttribute('data-reveal', direction);
    return element;
  }

  function buildHero(base){
    var wrap = document.querySelector('.lp-hero .lp-wrap');
    if(!wrap || wrap.querySelector('.lp-hero-stage')) return;

    var copy = node('div','lp-hero-copy');
    while(wrap.firstChild) copy.appendChild(wrap.firstChild);
    wrap.appendChild(copy);

    var stage = node('div','lp-hero-stage');

    var backplate = reveal(node('div','lp-hero-backplate'),'left');
    backplate.appendChild(picture(base,'01_hero_visual_1600x900.webp','HackⅡ Founding Monitorのサービス全体像',760,428,true));
    stage.appendChild(backplate);

    var frame = reveal(node('div','lp-portrait-frame'));
    var chrome = node('div','lp-portrait-frame__chrome');
    var dots = node('span','lp-portrait-frame__dots');
    dots.innerHTML = '<i></i><i></i><i></i>';
    chrome.appendChild(dots);
    chrome.appendChild(node('span','', 'FOUNDING MONITOR'));
    frame.appendChild(chrome);
    frame.appendChild(picture(base,'10_mobile_vertical_1080x1920.webp','AI検索時代の勝ち筋を可視化するHackⅡ Founding Monitorの縦型ビジュアル',540,960,true));
    stage.appendChild(frame);

    var competitor = reveal(node('aside','lp-hero-pop lp-hero-pop--competitor'),'left');
    competitor.appendChild(picture(base,'03_competitor_square_1080x1080.webp','自社と競合の比較イメージ',360,360,false));
    var competitorBody = node('div','lp-hero-pop__body');
    competitorBody.innerHTML = '<span class="lp-hero-pop__kicker">Competitive view</span><strong class="lp-hero-pop__title">競合との差を、回答と引用で比較</strong><span class="lp-hero-pop__meta">候補入り・引用数・改善優先度を同じ条件で確認</span>';
    competitor.appendChild(competitorBody);
    stage.appendChild(competitor);

    var badge = reveal(node('div','lp-hero-pop lp-hero-pop--badge'),'right');
    badge.setAttribute('aria-hidden','true');
    badge.appendChild(picture(base,'06_founding_badge_transparent_1000x1000.webp','',260,260,false));
    stage.appendChild(badge);

    var dashboard = reveal(node('aside','lp-hero-pop lp-hero-pop--dashboard'),'right');
    dashboard.appendChild(picture(base,'09_dashboard_mockup_1400x900.webp','引用率・言及率・競合SOVを確認するダッシュボードイメージ',420,270,false));
    var dashboardBody = node('div','lp-hero-pop__body');
    dashboardBody.innerHTML = '<span class="lp-hero-pop__kicker">Evidence dashboard</span><strong class="lp-hero-pop__title">計測結果を、証拠付きで確認</strong><span class="lp-hero-pop__meta">回答本文・引用URL・週次推移を記録</span>';
    dashboard.appendChild(dashboardBody);
    stage.appendChild(dashboard);

    var mascot = reveal(node('aside','lp-hero-pop lp-hero-pop--mascot'),'left');
    mascot.appendChild(picture(base,'07_mascot_popup_transparent_1000x1000.webp','トリリオンバンクの案内キャラクター',180,180,false));
    var mascotBody = node('div','');
    mascotBody.innerHTML = '<strong class="lp-hero-pop__title">まずはURLを共有</strong><span class="lp-hero-pop__meta">入力後に詳細情報へ進みます</span><a href="#lp-form-section">診断対象を入力する <span aria-hidden="true">→</span></a>';
    mascot.appendChild(mascotBody);
    stage.appendChild(mascot);

    wrap.appendChild(stage);

    var proof = node('div','lp-hero-proof');
    [
      ['最大10問','御社向けに質問設計'],
      ['競合2社','同じ条件で比較'],
      ['計測3回','初回・中間・最終'],
      ['面談2回','設計と最終レビュー']
    ].forEach(function(item){
      var box = node('div','lp-hero-proof__item');
      box.innerHTML = '<span class="lp-hero-proof__value">' + item[0] + '</span><span class="lp-hero-proof__label">' + item[1] + '</span>';
      proof.appendChild(box);
    });
    wrap.appendChild(reveal(proof));
  }

  function buildProblemVisual(base){
    var problems = document.querySelector('.lp-problems');
    if(!problems || problems.parentNode.querySelector('.lp-wide-story')) return;
    var figure = reveal(node('figure','lp-wide-story'));
    figure.appendChild(picture(base,'02_wide_ad_1200x628.webp','AI検索で選ばれるサイトを目指すHackⅡ Founding Monitorの紹介ビジュアル',960,502,false));
    var caption = node('figcaption','', 'AI検索での見え方を、推測ではなく回答・引用・競合データで確認します。');
    figure.appendChild(caption);
    insertAfter(problems, figure);
  }

  function buildMidCta(base){
    var cta = document.querySelector('.lp-cta-box');
    if(!cta || cta.parentNode.querySelector('.lp-cta-art')) return;
    var link = reveal(node('a','lp-cta-art'));
    link.href = '#lp-form-section';
    link.setAttribute('aria-label','対策したいサイトURLの入力フォームへ移動');
    link.appendChild(picture(base,'05_url_cta_banner_1600x500.webp','対策したいサイトURLを入力して診断を始める案内',960,300,false));
    insertAfter(cta, link);
  }

  function storyPop(base, file, alt, title, meta, className, direction, width, height){
    var pop = reveal(node('article','lp-story-pop ' + className),direction);
    pop.appendChild(picture(base,file,alt,width,height,false));
    var copy = node('div','lp-story-pop__copy');
    copy.innerHTML = '<strong>' + title + '</strong><span>' + meta + '</span>';
    pop.appendChild(copy);
    return pop;
  }

  function buildPortraitStory(base){
    var features = document.querySelector('.lp-features');
    if(!features || document.querySelector('.lp-portrait-story')) return;

    var section = node('section','lp-portrait-story');
    section.setAttribute('aria-labelledby','lp-portrait-story-title');
    var inner = node('div','lp-portrait-story__inner');
    var heading = reveal(node('div','lp-portrait-story__heading'));
    heading.innerHTML = '<span class="lp-portrait-story__eyebrow">Visual monitoring journey</span><h2 id="lp-portrait-story-title">現在地から改善までを、一つの流れで理解</h2><p>90日間の計測プロセスを中心に、競合比較・ダッシュボード・申込フローを一画面で確認。何を測り、どう改善するかを迷わず把握できます。</p>';
    inner.appendChild(heading);

    var stage = node('div','lp-portrait-story__stage');
    var frame = reveal(node('div','lp-story-frame'));
    frame.appendChild(picture(base,'04_90day_plan_900x1200.webp','90日間のFounding Monitorプランを説明する縦型ビジュアル',540,720,false));
    stage.appendChild(frame);

    stage.appendChild(storyPop(base,'03_competitor_square_1080x1080.webp','自社と競合を比較するビジュアル','競合比較を一枚で','自社が選ばれない質問と改善ポイントを可視化します。','lp-story-pop--left-top','left',520,520));
    stage.appendChild(storyPop(base,'09_dashboard_mockup_1400x900.webp','HackⅡダッシュボードイメージ','数値と証拠を同じ画面に','引用率・言及率・SOV・回答本文をまとめて確認できます。','lp-story-pop--right-top','right',560,360));
    stage.appendChild(storyPop(base,'08_cta_flow_1600x600.webp','申込から計測開始までの流れ','申込後の流れも明快に','URL入力から商談予約、計測開始までを5ステップで案内します。','lp-story-pop--left-bottom','left',640,240));

    var mascotPop = reveal(node('article','lp-story-pop lp-story-pop--right-bottom'),'right');
    mascotPop.appendChild(picture(base,'07_mascot_popup_transparent_1000x1000.webp','トリリオンバンクの案内キャラクター',220,220,false));
    var mascotCopy = node('div','lp-story-pop__copy');
    mascotCopy.innerHTML = '<strong>専門チームが伴走</strong><span>設定・計測・分析・改善優先度の整理まで支援します。</span><em class="lp-story-badge">運用支援型</em>';
    mascotPop.appendChild(mascotCopy);
    stage.appendChild(mascotPop);

    inner.appendChild(stage);
    section.appendChild(inner);
    insertAfter(features.closest('section'), section);
  }

  function buildDashboard(base){
    var placeholder = document.querySelector('.lp-screen-placeholder');
    if(!placeholder) return;
    var screen = placeholder.closest('.lp-screen');
    if(screen){
      screen.style.maxWidth = '980px';
      screen.style.border = '0';
      screen.style.overflow = 'visible';
      screen.style.background = 'transparent';
      screen.style.boxShadow = 'none';
    }
    var shell = reveal(node('div','lp-dashboard-shell'));
    var frame = node('div','lp-dashboard-frame');
    frame.appendChild(picture(base,'09_dashboard_mockup_1400x900.webp','HackⅡで引用率・言及率・SOV・競合比較を確認するダッシュボードイメージ',920,591,false));
    shell.appendChild(frame);

    var left = node('div','lp-dashboard-chip lp-dashboard-chip--left');
    left.innerHTML = '<strong>回答本文・引用URL</strong><span>計測時点の証拠を保存</span>';
    shell.appendChild(left);
    var right = node('div','lp-dashboard-chip lp-dashboard-chip--right');
    right.innerHTML = '<strong>競合SOV・週次推移</strong><span>変化と優先順位を確認</span>';
    shell.appendChild(right);
    shell.appendChild(node('p','lp-dashboard-caption','画面は提供内容を説明するイメージです。実際の表示・数値は計測条件により異なります。'));
    placeholder.replaceWith(shell);
  }

  function buildFlow(base){
    var flow = document.querySelector('.lp-flow');
    if(!flow || flow.parentNode.querySelector('.lp-flow-art')) return;
    var figure = reveal(node('figure','lp-flow-art'));
    figure.appendChild(picture(base,'08_cta_flow_1600x600.webp','URL入力から情報入力、内容確認、商談予約、利用開始までの申込フロー',960,360,false));
    flow.parentNode.insertBefore(figure, flow);
  }

  function buildForm(base){
    var section = document.getElementById('lp-form-section');
    if(!section || section.querySelector('.lp-form-layout')) return;
    var form = section.querySelector('.lp-form');
    if(!form) return;

    var layout = reveal(node('div','lp-form-layout'));
    form.parentNode.insertBefore(layout, form);
    layout.appendChild(form);

    var side = node('aside','lp-form-side-card');
    side.appendChild(picture(base,'07_mascot_popup_transparent_1000x1000.webp','トリリオンバンクの案内キャラクター',320,320,false));
    var content = node('div','');
    content.innerHTML = '<h3>まずは対象サイトを共有してください</h3><p>URLと会社情報を送信した後に、商談予約へ進みます。送信前に外部カレンダーへ移動することはありません。</p><div class="lp-form-side-card__chips"><span>URL入力</span><span>情報送信</span><span>日程予約</span></div>';
    side.appendChild(content);
    layout.appendChild(side);
  }

  function buildFloatingCta(base){
    if(document.querySelector('.lp-floating-conversion')) return;
    var panel = node('aside','lp-floating-conversion');
    panel.setAttribute('aria-label','Founding Monitor申込案内');
    var close = node('button','lp-floating-conversion__close','×');
    close.type = 'button';
    close.setAttribute('aria-label','案内を閉じる');
    panel.appendChild(close);
    panel.appendChild(picture(base,'07_mascot_popup_transparent_1000x1000.webp','',150,150,false));
    var title = node('strong','', 'Founding Monitor 先行受付中');
    panel.appendChild(title);
    panel.appendChild(node('p','', '対策したいサイトURLを入力して、現在地の確認へ進みます。'));
    var link = node('a','', 'URLを入力する →');
    link.href = '#lp-form-section';
    panel.appendChild(link);
    document.body.appendChild(panel);

    var dismissed = false;
    var formVisible = false;
    var formSection = document.getElementById('lp-form-section');

    function update(){
      var shouldShow = !dismissed && !formVisible && window.scrollY > 720;
      panel.classList.toggle('is-visible', shouldShow);
    }

    close.addEventListener('click', function(){
      dismissed = true;
      panel.classList.remove('is-visible');
    });
    window.addEventListener('scroll', update, {passive:true});

    if('IntersectionObserver' in window && formSection){
      new IntersectionObserver(function(entries){
        formVisible = entries[0].isIntersecting;
        update();
      },{rootMargin:'0px 0px -18% 0px'}).observe(formSection);
    }
    update();
  }

  function initReveal(){
    var items = document.querySelectorAll('.lp-reveal');
    if(!('IntersectionObserver' in window)){
      items.forEach(function(item){ item.classList.add('is-inview'); });
      return;
    }
    var observer = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('is-inview');
          observer.unobserve(entry.target);
        }
      });
    },{threshold:.12,rootMargin:'0px 0px -6% 0px'});
    items.forEach(function(item){ observer.observe(item); });
  }

  function init(){
    var path = window.location.pathname.replace(/\/+$/,'');
    if(path !== PAGE_PATH || !document.querySelector('.lp-main')) return;
    if(document.documentElement.dataset.hack2Visuals === 'ready') return;
    document.documentElement.dataset.hack2Visuals = 'ready';
    document.body.classList.add('hack2-lp-enhanced');

    var base = window.HACK2_ASSET_BASE || '/images/lp/hack2/founding-monitor/';
    buildHero(base);
    buildProblemVisual(base);
    buildMidCta(base);
    buildPortraitStory(base);
    buildDashboard(base);
    buildFlow(base);
    buildForm(base);
    buildFloatingCta(base);
    initReveal();
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
