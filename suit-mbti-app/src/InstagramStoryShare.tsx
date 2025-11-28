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

    // Google Fonts読み込み
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700&family=Noto+Serif+JP:wght@400;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
    };
  }, []);

  const handleShare = async () => {
    if (!cardRef.current || !isLibLoaded || !(window as any).html2canvas) {
      alert("画像生成ライブラリの読み込み中です。少々お待ちください。");
      return;
    }
    
    setIsGenerating(true);

    try {
      const canvas = await (window as any).html2canvas(cardRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: null,
        onclone: (documentClone: Document) => {
          const link = document.createElement('link');
          link.href = 'https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700&family=Noto+Serif+JP:wght@400;700&display=swap';
          link.rel = 'stylesheet';
          documentClone.head.appendChild(link);
        }
      });

      canvas.toBlob(async (blob: Blob | null) => {
        if (!blob) {
          setIsGenerating(false);
          return;
        }
        const file = new File([blob], "rat_diagnosis_result.png", { type: "image/png" });

        if (navigator.share && (navigator as any).canShare && (navigator as any).canShare({ files: [file] })) {
          try {
            await navigator.share({
              files: [file],
              title: 'RAT診断結果',
              text: `私のスーツタイプは「${typeNameJp}」でした！ #RAT診断 #Regalis`,
            });
          } catch (error: any) {
            if (error.name !== 'AbortError') {
              console.log('シェアがキャンセルされました', error);
            }
          }
        } else {
          const link = document.createElement('a');
          link.download = 'rat_diagnosis_result.png';
          link.href = canvas.toDataURL();
          link.click();
          alert("画像を保存しました。\nInstagramアプリを開き、ストーリーズ作成画面から保存した画像を選択して投稿してください！");
        }
        setIsGenerating(false);
      }, 'image/png');

    } catch (error) {
      console.error("画像生成エラー:", error);
      setIsGenerating(false);
      alert("画像の生成に失敗しました。もう一度お試しください。");
    }
  };

  // グラデーションカラーを抽出（color propから）
  const colorClasses = result.archetype.color || 'bg-gradient-to-b from-[#4a1915] via-[#8B4513] to-[#2a0f0d]';

  return (
    <div className="w-full max-w-md mx-auto space-y-6">
      {/* ヘッダー */}
      <div className="text-center space-y-2">
        <h3 className="text-xl font-serif tracking-wider text-[#F5F5F5]">結果をシェア</h3>
        <p className="text-xs text-[#888] tracking-wider">Instagramストーリーに投稿</p>
      </div>

      {/* --- ストーリー用画像レイアウトエリア (ここが画像化される) --- */}
      <div 
        ref={cardRef}
        className={`relative w-[320px] h-[568px] mx-auto shadow-2xl overflow-hidden flex flex-col ${colorClasses}`}
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
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-black/60 to-transparent z-0"></div>
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/90 to-transparent z-0"></div>
        
        {/* 微細な光の粒子 */}
        <div className="absolute inset-0 z-0 opacity-20" style={{backgroundImage: 'radial-gradient(circle at center, white 1px, transparent 1px)', backgroundSize: '50px 50px'}}></div>

        {/* 上部：ブランドロゴ & 診断名 */}
        <div className="p-6 pt-10 z-10 flex flex-col items-center space-y-3 relative">
          <Sparkles className="w-5 h-5 text-yellow-400 opacity-80" />
          <span className="text-yellow-200 text-xs tracking-[0.35em] uppercase font-cinzel border-b border-yellow-500/30 pb-2 mb-1">Regalis Societas Tokyo</span>
          <span className="text-white text-[9px] tracking-[0.25em] opacity-70">RAT PERSONALITY DIAGNOSIS</span>
        </div>

        {/* メインコンテンツ */}
        <div className="flex-1 flex flex-col items-center justify-center z-10 relative -mt-10">
          
          {/* タイプNo */}
          <h1 
            className="text-6xl font-cinzel font-bold text-transparent bg-clip-text bg-gradient-to-b from-yellow-100 via-yellow-300 to-yellow-600 italic tracking-normal leading-relaxed mb-0 py-2 px-4 relative z-20"
            style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.5))' }}
          >
            {result.archetype.id ? `No.${result.archetype.id.padStart(2, '0')}` : 'No.00'}
          </h1>

          {/* キャラクター画像エリア */}
          <div className="w-full max-w-[320px] -my-6 relative z-0 pointer-events-none flex justify-center">
            <img 
              src={result.archetype.imageUrl} 
              alt="Character" 
              crossOrigin="anonymous"
              className="w-auto h-[320px] object-cover drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
              style={{
                maskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, black 70%, transparent 100%)'
              }}
              onError={(e) => {
                // 画像読み込み失敗時のフォールバック
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>

          {/* タイプ名 */}
          <div className="text-center px-6 space-y-3 relative z-20">
            <h2 className="text-xl font-cinzel font-bold text-white tracking-[0.25em] uppercase leading-relaxed">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-white">{result.archetype.name}</span>
            </h2>
            <p className="text-2xl font-bold text-[#FFD700] tracking-[0.1em] leading-relaxed" style={{textShadow: '0 2px 4px rgba(0,0,0,0.5)'}}>{typeNameJp}</p>
          </div>

          {/* MBTI風タグ */}
          <div className="mt-6 px-6 py-2 rounded-full border border-yellow-500/30 bg-gradient-to-r from-black/60 to-purple-900/60 backdrop-blur-md shadow-lg relative z-20">
            <span className="text-yellow-100 text-[10px] font-cinzel tracking-[0.3em]">{mbtiDisplay}</span>
          </div>
          
        </div>

        {/* 下部：アクション誘導 */}
        <div className="p-10 z-10 text-center relative">
          <div className="bg-gradient-to-r from-black/40 to-black/60 backdrop-blur-lg px-6 py-5 rounded-xl border border-white/5 shadow-inner relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-transparent to-yellow-500/10 opacity-50"></div>
            <p className="text-yellow-200/80 text-[10px] mb-3 tracking-[0.25em] font-cinzel">UNLEASH YOUR POTENTIAL</p>
            <p className="text-white font-bold text-xs tracking-[0.15em]">あなたの「戦闘服」を診断する</p>
          </div>
          {/* ストーリー上でリンクスタンプを置く場所のガイド */}
          <p className="text-[9px] text-yellow-500/60 mt-4 tracking-[0.2em] uppercase">▼ Place Link Sticker Here ▼</p>
        </div>

        {/* 全体の枠線装飾 */}
        <div className="absolute inset-3 border border-yellow-500/20 pointer-events-none z-30"></div>
        <div className="absolute inset-4 border border-white/10 pointer-events-none z-30"></div>
      </div>
      {/* --- 画像化エリア終了 --- */}

      {/* シェアボタンエリア */}
      <div className="space-y-3">
        <button
          onClick={handleShare}
          disabled={isGenerating || !isLibLoaded}
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
            ) : !isLibLoaded ? (
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
      `}</style>
    </div>
  );
};

export default InstagramStoryShare;

