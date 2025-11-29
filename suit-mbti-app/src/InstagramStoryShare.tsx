import React, { useRef, useState, useEffect } from 'react';
import { Instagram, Sparkles } from 'lucide-react';

// アーキタイプIDからMBTIタイプへのマッピング
const ARCHETYPE_MBTI_MAP: Record<string, string> = {
  '01': 'ESTJ:ISTJ',
  '02': 'ENTJ:INTJ',
  '03': 'ENFJ:ESFJ',
  '04': 'ENTP:EMFP',
  '05': 'ESTJ:ISTJ',
  '06': 'INTJ:ISTP',
  '07': 'ISTP:ISFP',
  '08': 'ENTP:ESTP',
  '09': 'ESFJ:ISFJ',
  '10': 'ISFP:INFJ',
  '11': 'ENFJ:ESFP',
  '12': 'INFP:INFJ',
  '13': 'ISTP:ISFP',
  '14': 'ESTP:ENFP',
  '15': 'ISFP:INFP',
  '16': 'INTP:INFJ'
};

// MBTIタイプから表示名へのマッピング
const MBTI_DISPLAY_MAP: Record<string, string> = {
  'ESTJ:ISTJ': 'ESTJ / ISTJ TYPE',
  'ENTJ:INTJ': 'ENTJ / INTJ TYPE',
  'ENFJ:ESFJ': 'ENFJ / ESFJ TYPE',
  'ENTP:EMFP': 'ENTP / ENFP TYPE',
  'INTJ:ISTP': 'INTJ / ISTP TYPE',
  'ISTP:ISFP': 'ISTP / ISFP TYPE',
  'ENTP:ESTP': 'ENTP / ESTP TYPE',
  'ESFJ:ISFJ': 'ESFJ / ISFJ TYPE',
  'ISFP:INFJ': 'ISFP / INFJ TYPE',
  'ENFJ:ESFP': 'ENFJ / ESFP TYPE',
  'INFP:INFJ': 'INFP / INFJ TYPE',
  'ESTP:ENFP': 'ESTP / ENFP TYPE',
  'ISFP:INFP': 'ISFP / INFP TYPE',
  'INTP:INFJ': 'INTP / INFJ TYPE'
};

// 日本語タイプ名のマッピング（必要に応じて追加）
const TYPE_NAME_JP_MAP: Record<string, string> = {
  '01': '至高の君主',
  '02': 'モダニスト・リーダー',
  '03': '貴族',
  '04': '未来主義者エグゼクティブ',
  '05': '鉄の指揮官',
  '06': 'テック・ストラテジスト',
  '07': 'ヘリテッジ・ハンター',
  '08': '都会の異端児',
  '09': 'クラシック・ジェントルマン',
  '10': 'モード・アイコン',
  '11': '優雅な伊達男',
  '12': 'ネオ・クラシシスト',
  '13': '職人',
  '14': 'ストリート・スマート',
  '15': 'ナチュラリスト',
  '16': '創造的ミニマリスト'
};

interface InstagramStoryShareProps {
  result: {
    archetype: {
      id: string;
      name: string;
      desc: string;
      color: string;
      imageUrl: string;
    };
    identityId: string;
  };
}

const InstagramStoryShare: React.FC<InstagramStoryShareProps> = ({ result }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLibLoaded, setIsLibLoaded] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // アーキタイプIDから必要な情報を取得
  const archetypeId = result.archetype.id;
  const mbtiCode = ARCHETYPE_MBTI_MAP[archetypeId] || 'ESTJ:ISTJ';
  const mbtiDisplay = MBTI_DISPLAY_MAP[mbtiCode] || 'ESTJ / ISTJ TYPE';
  const typeNameJp = TYPE_NAME_JP_MAP[archetypeId] || result.archetype.name;

  // キャッチフレーズのマッピング（将来的に使用する可能性があるため保持）
  // const catchphraseMap: Record<string, string> = { ... };

  // 外部ライブラリとWebフォントの読み込み
  useEffect(() => {
    // html2canvas読み込み
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
    script.async = true;
    script.onload = () => setIsLibLoaded(true);
    document.body.appendChild(script);

    // Google Fonts読み込みとフォントロード確認
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700&family=Noto+Serif+JP:wght@400;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // フォント読み込み完了を待つ
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        setFontsLoaded(true);
      });
    } else {
      // フォールバック: 一定時間後に読み込み完了とみなす
      setTimeout(() => setFontsLoaded(true), 2000);
    }

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, []);

  // Instagramアプリへの直接遷移（iOS/Android対応）
  const openInstagramApp = (blob: Blob) => {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    
    if (isIOS) {
      // iOS: Instagramアプリを開く試み
      const instagramUrl = 'instagram://';
      window.location.href = instagramUrl;
      
      // アプリが開かない場合のフォールバック
      setTimeout(() => {
        // Web Share APIでシェアを試みる
        if (navigator.share) {
          const file = new File([blob], "rat_diagnosis_result.png", { type: "image/png" });
          navigator.share({
            files: [file],
            title: 'RAT診断結果',
            text: `私のスーツタイプは「${typeNameJp}」でした！ #RAT診断 #Regalis`,
          }).catch(() => {
            // シェアが失敗した場合、ダウンロード
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'rat_diagnosis_result.png';
            link.click();
            URL.revokeObjectURL(url);
          });
        }
      }, 500);
    } else if (isAndroid) {
      // Android: Intentを使用してInstagramアプリを開く試み
      try {
        const intentUrl = 'intent://#Intent;package=com.instagram.android;scheme=https;end';
        window.location.href = intentUrl;
        
        // フォールバック
        setTimeout(() => {
          const file = new File([blob], "rat_diagnosis_result.png", { type: "image/png" });
          if (navigator.share && (navigator as any).canShare && (navigator as any).canShare({ files: [file] })) {
            navigator.share({
              files: [file],
              title: 'RAT診断結果',
              text: `私のスーツタイプは「${typeNameJp}」でした！ #RAT診断 #Regalis`,
            }).catch(() => {
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = 'rat_diagnosis_result.png';
              link.click();
              URL.revokeObjectURL(url);
            });
          }
        }, 500);
      } catch (e) {
        // エラーの場合、ダウンロード
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'rat_diagnosis_result.png';
        link.click();
        URL.revokeObjectURL(url);
      }
    }
  };

  const handleShare = async () => {
    if (!cardRef.current || !isLibLoaded || !(window as any).html2canvas) {
      alert("画像生成ライブラリの読み込み中です。少々お待ちください。");
      return;
    }
    
    setIsGenerating(true);

    try {
      // フォント読み込み完了を待つ
      if (!fontsLoaded) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // 画像生成時に要素を実際のサイズで表示
      const element = cardRef.current;
      if (!element) {
        setIsGenerating(false);
        return;
      }
      
      // 親要素のスケールを一時的に無効化して実際のサイズでキャプチャ
      const parent = element.parentElement;
      const originalTransform = parent?.style.transform;
      const originalPosition = parent?.style.position;
      const originalLeft = parent?.style.left;
      const originalTop = parent?.style.top;
      
      if (parent) {
        parent.style.transform = 'none';
        parent.style.position = 'fixed';
        parent.style.left = '0';
        parent.style.top = '0';
        parent.style.zIndex = '9999';
      }
      
      // 要素を実際のサイズで表示するために一時的にスタイルを調整
      const originalElementWidth = element.style.width;
      const originalElementHeight = element.style.height;
      element.style.width = '1080px';
      element.style.height = '1920px';
      
      // フォントを確実に読み込むための待機
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const canvas = await (window as any).html2canvas(element, {
        width: 1080,
        height: 1920,
        scale: 2,
        useCORS: true,
        allowTaint: false,
        backgroundColor: null,
        logging: false,
        letterRendering: true,
        removeContainer: false,
        onclone: (clonedDoc: Document) => {
          // クローンされたドキュメントにもフォントを追加
          const link = clonedDoc.createElement('link');
          link.href = 'https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700&family=Noto+Serif+JP:wght@400;700&display=swap';
          link.rel = 'stylesheet';
          clonedDoc.head.appendChild(link);
          
          // フォントを強制的に適用
          const style = clonedDoc.createElement('style');
          style.textContent = `
            @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700&family=Noto+Serif+JP:wght@400;700&display=swap');
            * {
              font-family: 'Cinzel Decorative', 'Noto Serif JP', serif !important;
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
            }
          `;
          clonedDoc.head.appendChild(style);
          
          // すべてのテキスト要素を確認
          const textElements = clonedDoc.querySelectorAll('*');
          textElements.forEach((el: Element) => {
            const htmlEl = el as HTMLElement;
            if (htmlEl.textContent && htmlEl.textContent.trim()) {
              htmlEl.style.fontFamily = "'Cinzel Decorative', 'Noto Serif JP', serif";
            }
          });
        }
      });
      
      // 元に戻す
      element.style.width = originalElementWidth;
      element.style.height = originalElementHeight;
      
      if (parent) {
        parent.style.transform = originalTransform || '';
        parent.style.position = originalPosition || '';
        parent.style.left = originalLeft || '';
        parent.style.top = originalTop || '';
        parent.style.zIndex = '';
      }

      canvas.toBlob(async (blob: Blob | null) => {
        if (!blob) {
          setIsGenerating(false);
          alert("画像の生成に失敗しました。もう一度お試しください。");
          return;
        }
        
        const file = new File([blob], "rat_diagnosis_result.png", { type: "image/png" });
        const imageUrl = canvas.toDataURL('image/png');

        // Web Share APIを試す
        if (navigator.share && (navigator as any).canShare && (navigator as any).canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              title: 'RAT診断結果',
              text: `私のスーツタイプは「${typeNameJp}」でした！ #RAT診断 #Regalis`,
            });
            setIsGenerating(false);
            return;
          } catch (error: any) {
            if (error.name !== 'AbortError') {
              console.log('シェアがキャンセルされました', error);
              // フォールバック: Instagramアプリを開く
              openInstagramApp(imageUrl);
            }
          }
        } else {
          // Web Share APIが使えない場合、モバイルではInstagramアプリを開く試み
          const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
          
          if (isMobile) {
            // モバイルの場合、Instagramアプリを開く試み
            try {
              openInstagramApp(blob);
              // アプリが開かない場合のフォールバック（ダウンロード）
              setTimeout(() => {
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'rat_diagnosis_result.png';
                link.click();
                URL.revokeObjectURL(url);
                alert("画像を保存しました。\nInstagramアプリを開き、ストーリーズ作成画面から保存した画像を選択して投稿してください！");
              }, 1500);
            } catch (err) {
              // エラーの場合、ダウンロード
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = 'rat_diagnosis_result.png';
              link.click();
              URL.revokeObjectURL(url);
              alert("画像を保存しました。\nInstagramアプリを開き、ストーリーズ作成画面から保存した画像を選択して投稿してください！");
            }
          } else {
            // PCの場合、ダウンロード
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'rat_diagnosis_result.png';
            link.click();
            URL.revokeObjectURL(url);
            alert("画像を保存しました。\nInstagramアプリを開き、ストーリーズ作成画面から保存した画像を選択して投稿してください！");
          }
        }
        setIsGenerating(false);
      }, 'image/png', 0.95);

    } catch (error) {
      console.error("画像生成エラー:", error);
      setIsGenerating(false);
      alert("画像の生成に失敗しました。もう一度お試しください。");
    }
  };

  // グラデーションカラーを抽出（color propから）
  const colorClasses = result.archetype.color || 'bg-gradient-to-b from-[#4a1915] via-[#8B4513] to-[#2a0f0d]';

  return (
    <div className="w-full max-w-full mx-auto space-y-6">
      {/* ヘッダー */}
      <div className="text-center space-y-2 mb-4">
        <h3 className="text-xl font-serif tracking-wider text-[#F5F5F5]">結果をシェア</h3>
        <p className="text-xs text-[#888] tracking-wider">Instagramストーリーに投稿</p>
      </div>

      {/* プレビュー用コンテナ - 小さく表示 */}
      <div className="w-full flex justify-center mb-6 overflow-hidden" style={{ maxHeight: '400px' }}>
        <div style={{ transform: 'scale(0.35)', transformOrigin: 'top center' }}>
          {/* --- ストーリー用画像レイアウトエリア (ここが画像化される) --- */}
          <div 
            ref={cardRef}
            className={`relative w-[1080px] h-[1920px] mx-auto shadow-2xl overflow-hidden flex flex-col ${colorClasses}`}
            style={{ fontFamily: '"Noto Serif JP", serif' }}
          >
        {/* 背景装飾：CSSグラデーションパターン */}
        <div 
          className="absolute inset-0 opacity-10 mix-blend-overlay" 
          style={{
            backgroundImage: 'linear-gradient(45deg, #ffffff 1px, transparent 1px), linear-gradient(-45deg, #ffffff 1px, transparent 1px)',
            backgroundSize: '30px 30px'
          }}
        ></div>

        {/* 光の効果 */}
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-black/50 to-transparent z-0"></div>
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/80 to-transparent z-0"></div>
        
        {/* 微細な光の粒子 */}
        <div className="absolute inset-0 z-0 opacity-20" style={{backgroundImage: 'radial-gradient(circle at center, white 1px, transparent 1px)', backgroundSize: '50px 50px'}}></div>

        {/* 上部：ブランドロゴ & 診断名 */}
        <div className="pt-16 pb-8 z-10 flex flex-col items-center space-y-4 relative">
          <Sparkles className="w-8 h-8 text-yellow-400 opacity-80" />
          <span className="text-yellow-200 text-sm tracking-[0.35em] uppercase font-cinzel border-b border-yellow-500/30 pb-3 mb-1">Regalis Societas Tokyo</span>
          <span className="text-white text-xs tracking-[0.25em] opacity-70">RAT PERSONALITY DIAGNOSIS</span>
        </div>

        {/* メインコンテンツ：診断結果画像を中心に配置 */}
        <div className="flex-1 flex flex-col items-center justify-center z-10 relative px-8">
          
          {/* キャラクター画像エリア - 大きく強調 */}
          <div className="w-full flex justify-center items-center mb-8 relative z-10">
            <div className="relative">
              {/* 画像の光る効果 */}
              <div 
                className="absolute inset-0 blur-3xl"
                style={{
                  background: 'radial-gradient(circle, rgba(255,215,0,0.2) 0%, transparent 70%)'
                }}
              ></div>
              <img 
                src={result.archetype.imageUrl} 
                alt="Character" 
                crossOrigin="anonymous"
                className="w-auto max-w-[800px] h-auto max-h-[900px] object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.8)] relative z-10"
                style={{
                  filter: 'drop-shadow(0 0 40px rgba(255,215,0,0.3))'
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          </div>

          {/* タイトル引用エリア - 英語タイトルを引用形式で強調 */}
          <div className="w-full text-center relative z-20 mb-6 px-8">
            {/* 引用符の装飾 */}
            <div className="relative inline-block">
              {/* 左側の引用符 */}
              <div className="absolute -left-12 -top-8 text-[120px] font-cinzel text-yellow-400/40 leading-none" style={{textShadow: '0 4px 8px rgba(0,0,0,0.5)'}}>
                "
              </div>
              
              {/* タイトルテキスト */}
              <h2 
                className="text-5xl md:text-6xl font-cinzel font-bold text-white tracking-[0.05em] leading-tight relative z-10"
                style={{
                  textShadow: '0 4px 12px rgba(0,0,0,0.8), 0 0 30px rgba(255,215,0,0.4)',
                  filter: 'drop-shadow(0 0 20px rgba(255,215,0,0.3))'
                }}
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-100 via-yellow-300 to-yellow-100">
                  {result.archetype.name}
                </span>
              </h2>
              
              {/* 右側の引用符 */}
              <div className="absolute -right-12 -top-8 text-[120px] font-cinzel text-yellow-400/40 leading-none" style={{textShadow: '0 4px 8px rgba(0,0,0,0.5)'}}>
                "
              </div>
            </div>
          </div>

          {/* 日本語タイプ名 */}
          <div className="text-center mb-6 relative z-20 px-8">
            <p 
              className="text-3xl font-bold text-[#FFD700] tracking-[0.1em] leading-relaxed"
              style={{
                textShadow: '0 4px 8px rgba(0,0,0,0.8), 0 0 20px rgba(255,215,0,0.5)',
                filter: 'drop-shadow(0 0 15px rgba(255,215,0,0.3))'
              }}
            >
              {typeNameJp}
            </p>
          </div>

          {/* タイプNo */}
          <div className="text-center mb-6 relative z-20">
            <div className="inline-block px-8 py-4 bg-black/40 backdrop-blur-md rounded-lg border border-yellow-500/30">
              <span 
                className="text-4xl font-cinzel font-bold text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-yellow-400 to-yellow-600 italic tracking-wider"
                style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.5))' }}
              >
                {result.archetype.id ? `No.${result.archetype.id.padStart(2, '0')}` : 'No.00'}
              </span>
            </div>
          </div>

          {/* MBTI風タグ */}
          <div className="px-8 py-3 rounded-full border border-yellow-500/30 bg-gradient-to-r from-black/60 to-purple-900/60 backdrop-blur-md shadow-lg relative z-20">
            <span className="text-yellow-100 text-sm font-cinzel tracking-[0.3em]">{mbtiDisplay}</span>
          </div>
          
        </div>

        {/* 下部：アクション誘導 */}
        <div className="pb-16 pt-8 z-10 text-center relative px-8">
          <div className="bg-gradient-to-r from-black/50 to-black/70 backdrop-blur-lg px-8 py-6 rounded-xl border border-white/10 shadow-inner relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-transparent to-yellow-500/10 opacity-50"></div>
            <p className="text-yellow-200/80 text-sm mb-3 tracking-[0.25em] font-cinzel">UNLEASH YOUR POTENTIAL</p>
            <p className="text-white font-bold text-base tracking-[0.15em]">あなたの「戦闘服」を診断する</p>
          </div>
        </div>

        {/* 全体の枠線装飾 */}
        <div className="absolute inset-4 border border-yellow-500/20 pointer-events-none z-30"></div>
        <div className="absolute inset-6 border border-white/10 pointer-events-none z-30"></div>
          </div>
          {/* --- 画像化エリア終了 --- */}
        </div>
      </div>

      {/* シェアボタンエリア */}
      <div className="space-y-3 max-w-md mx-auto">
        <button
          onClick={handleShare}
          disabled={isGenerating || !isLibLoaded || !fontsLoaded}
          className="group w-full relative overflow-hidden bg-gradient-to-r from-gray-900 to-black text-white font-bold py-4 px-6 rounded-xl shadow-[0_10px_20px_-10px_rgba(255,215,0,0.3)] transform transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 border border-yellow-500/20"
        >
          {/* ボタン背景エフェクト */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,215,0,0.2),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

          <div className="relative flex items-center justify-center gap-3">
            {isGenerating ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-yellow-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="tracking-[0.1em] text-sm">Generating...</span>
              </span>
            ) : !isLibLoaded || !fontsLoaded ? (
              <span className="tracking-[0.1em] text-sm">Loading System...</span>
            ) : (
              <>
                <Instagram className="w-5 h-5 text-yellow-500" />
                <span className="tracking-[0.1em] text-sm bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">SHARE ON STORY</span>
              </>
            )}
          </div>
        </button>

        <p className="text-[10px] text-center text-[#888] tracking-[0.05em] leading-relaxed">
          ※ボタンをタップすると共有メニューが開きます。<br/>Instagramを選択し、ストーリーズに投稿してください。
        </p>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700&family=Noto+Serif+JP:wght@400;700&display=swap');
        .font-cinzel {
          font-family: 'Cinzel Decorative', serif;
        }
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }
      `}</style>
    </div>
  );
};

export default InstagramStoryShare;

