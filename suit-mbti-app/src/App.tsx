import React, { useState, useEffect } from 'react';
import { 
  Ruler, ArrowRight, ChevronLeft, Loader2, Award, Sparkles,
  Gem, Ticket, CheckSquare,
  TrendingDown, Info, Check, BookOpen, Heart, Activity, MapPin, ChevronDown
} from 'lucide-react';
import InstagramStoryShare from './InstagramStoryShare';
import { 
  BASIC_QUESTIONS, 
  CORRECTION_QUESTIONS, 
  FASHION_PREFERENCE_QUESTIONS, 
  USAGE_QUESTIONS,
  BINARY_DESIGN_QUESTIONS,
  getQuestionScore, 
  CATEGORY_DESCRIPTIONS 
} from './scenarioQuestions';
import { generateDiagnosisResult, type DiagnosisAnswers } from './diagnosisLogic';
import { generateEnhancedDiagnosisResult } from './enhancedDiagnosis';

// --- System Configuration ---
const SYSTEM_NAME = "Regalis Arche Type";
const SYSTEM_SUB = "RAT診断";
const SYSTEM_DESC = "あなただけのオーダースーツスタイルを発見する、次世代型診断システム";

const BRAND_INFO = {
  name: "Regalis Japan Group",
  provider: "オーダースーツ研究所 by Regalis Japan Group",
  mainTheme: "オーダースーツで個性を表現しよう",
  philosophy: [
    "誰でも自分自身に最適なオーダースーツが何かわかる",
    "TPOに縛られず、その場で自分の個性に合ったイメージを見つける",
    "悩み・用途・予算を学習し、最適な一着を「安く、早く」手に入れる"
  ],
  concept: "次世代の呉服商グループ",
  tagline: "ラグジュアリーと若者のインフルエンスを融合"
};

const LOTTERY_PROBABILITY = 200;

// --- Asset Mapping ---
// MBTIコードに基づく画像ファイル名のマッピング
// ファイル名形式: Gemini_Generated_Image_{MBTI1}:{MBTI2}.png
// 実際のファイル名に基づいてマッピング
const ARCHETYPE_MBTI_MAP: Record<string, string> = {
  '01': 'ESTJ:ISTJ',      // The Sovereign (ISTJ / ESTJ) - ファイル名はESTJ:ISTJ
  '02': 'ENTJ:INTJ',      // The Modernist Leader (ENTJ / INTJ)
  '03': 'ENFJ:ESFJ',      // The Aristocrat (ENFJ / ESFJ)
  '04': 'ENTP:EMFP',      // The Futurist Executive (ENTP / ENFP) - ファイル名はENTP:EMFP
  '05': 'ESTJ:ISTJ',      // The Iron Commander (ESTJ / ISTJ)
  '06': 'INTJ:ISTP',      // The Tech Strategist (INTJ / ISTP)
  '07': 'ISTP:ISFP',      // The Heritage Hunter (ISTP / ISFP)
  '08': 'ENTP:ESTP',      // The Urban Maverick (ENTP / ESTP)
  '09': 'ESFJ:ISFJ',      // The Classic Gentleman (ESFJ / ISFJ)
  '10': 'ISFP:INFJ',      // The Mode Icon (ISFP / INFJ)
  '11': 'ENFJ:ESFP',      // The Elegant Dandy (ENFJ / ESFP)
  '12': 'INFP:INFJ',      // The Neo Classicist (INFP / INFJ)
  '13': 'ISTP:ISFP',      // The Artisan (ISTP / ISFP)
  '14': 'ESTP:ENFP',      // The Street Smart (ESTP / ENFP)
  '15': 'ISFP:INFP',      // The Naturalist (ISFP / INFP)
  '16': 'INTP:INFJ'       // The Creative Minimalist (INTP / INFJ)
};

// MBTIコードから画像パスを生成
// Jekyllサイトの相対パスとして使用（Reactアプリ内では絶対パスとして機能）
const getArchetypeImagePath = (archetypeId: string): string => {
  const mbtiCode = ARCHETYPE_MBTI_MAP[archetypeId] || 'ESTJ:ISTJ';
  // パスはJekyllのビルド時に正しく解決される
  return `/images/MBTIキャラクター/Gemini_Generated_Image_${mbtiCode}.png`;
};

// Map archetype IDs to images (MBTIコードベース)
const ARCHETYPE_IMAGES: Record<string, string> = {
  '01': getArchetypeImagePath('01'),
  '02': getArchetypeImagePath('02'),
  '03': getArchetypeImagePath('03'),
  '04': getArchetypeImagePath('04'),
  '05': getArchetypeImagePath('05'),
  '06': getArchetypeImagePath('06'),
  '07': getArchetypeImagePath('07'),
  '08': getArchetypeImagePath('08'),
  '09': getArchetypeImagePath('09'),
  '10': getArchetypeImagePath('10'),
  '11': getArchetypeImagePath('11'),
  '12': getArchetypeImagePath('12'),
  '13': getArchetypeImagePath('13'),
  '14': getArchetypeImagePath('14'),
  '15': getArchetypeImagePath('15'),
  '16': getArchetypeImagePath('16')
};

// --- Color Palettes ---
const COLOR_PALETTES = {
  traditionalist: [
    { name: "British Navy", hex: "#1B2431", type: "Suit" },
    { name: "Crisp White", hex: "#F8F9FA", type: "Shirt" },
    { name: "Burgundy", hex: "#621B2F", type: "Tie" }
  ],
  modernist: [
    { name: "Charcoal Grey", hex: "#373737", type: "Suit" },
    { name: "Ice Blue", hex: "#E3F2FD", type: "Shirt" },
    { name: "Slate", hex: "#64748B", type: "Tie" }
  ],
  executive: [
    { name: "Midnight Blue", hex: "#0F172A", type: "Suit" },
    { name: "White Twill", hex: "#FFFFFF", type: "Shirt" },
    { name: "Royal Blue", hex: "#1E40AF", type: "Tie" }
  ],
  visionary: [
    { name: "Jet Black", hex: "#000000", type: "Suit" },
    { name: "Dark Mono", hex: "#1A1A1A", type: "Shirt" },
    { name: "Silver", hex: "#94A3B8", type: "Accent" }
  ],
  naturalist: [
    { name: "Olive Brown", hex: "#4A4036", type: "Suit" },
    { name: "Beige Oxford", hex: "#F5F5DC", type: "Shirt" },
    { name: "Forest Green", hex: "#14532D", type: "Tie" }
  ]
};

// --- 16 Archetypes (New System) - Moved to archetypeDefinitions.ts ---
// アーキタイプ定義は './archetypeDefinitions' からインポート


// --- Fabric Plans ---
const FABRIC_PLANS = {
  omc: {
    id: 'omc', name: "Order Made Collection", origin: "Japan/Global",
    desc: "機能性と耐久性を兼ね備えた、賢いエントリーモデル。",
    basePrice: 96000, marketPrice: 120000,
    type: "Value",
    features: ["防シワ加工", "ポリエステル混紡", "耐久性◎"]
  },
  vbc_n: {
    id: 'vbc_n', name: "V.B. Canonico (Perennial)", origin: "Italy",
    desc: "世界中で愛されるイタリアの定番。コストと品質の黄金比。",
    basePrice: 130900, marketPrice: 165000,
    type: "Value/Milestone",
    features: ["Super 110s", "オールシーズン", "美しい発色"]
  },
  reda_silky: {
    id: 'reda', name: "REDA (Silky Effect)", origin: "Italy",
    desc: "シルクのような光沢加工を施した、モダンな一着。",
    basePrice: 135900, marketPrice: 160000,
    type: "Milestone",
    features: ["ドルフィン加工", "強い光沢", "形態安定"]
  },
  dormeuil: {
    id: 'dormeuil', name: "Dormeuil (Amadeus)", origin: "UK",
    desc: "英国の伝統とフランスの感性。重厚な輝き。",
    basePrice: 185000, marketPrice: 240000,
    type: "Authentic",
    features: ["ペーパープレス", "構築的", "英国王室御用達"]
  },
  zegna: {
    id: 'zegna', name: "Ermenegildo Zegna (Trofeo)", origin: "Italy",
    desc: "成功者の証。最高級の原毛が生むドレープ。",
    basePrice: 198000, marketPrice: 280000,
    type: "Authentic",
    features: ["最高級原毛", "圧倒的知名度", "極上の着心地"]
  }
};

// --- Questions (New 4-Section System) ---
// 4つのセクション: 基本(8問) → 人体最適化(4問) → ファッション好み(3問) → 使用用途(3問)
// 合計18問、約3分の回答時間

const PHYSICAL_TYPES = {
  A: { name: "Type A: Standard", code: 'A' },
  B: { name: "Type B: Stooped", code: 'B' },
  C: { name: "Type C: Erect", code: 'C' },
  D: { name: "Type D: Sloping", code: 'D' },
  E: { name: "Type E: Square", code: 'E' },
  F: { name: "Type F: Athletic", code: 'F' }
};

// CORRECTION_MAP: Optional questions corrections (not used in 8-question system)
// const CORRECTION_MAP: Record<string, { low?: string[], high?: string[] }> = {
//   shoulder_slope: { low: ["撫で肩補正", "鎌深補正"], high: ["怒り肩補正", "ネックポイント下げ"] },
//   posture: { low: ["屈身補正", "背幅出し"], high: ["反身補正", "前丈出し"] },
//   hip_shape: { low: ["平尻補正", "渡り幅詰め"], high: ["出尻補正", "Vカット仕様"] },
//   watch_size: { high: ["左袖口幅出し", "カフス周り調整"] },
//   neck_length: { low: ["カラー低寸"], high: ["カラー高寸"] },
//   driving_freq: { high: ["背幅ゆとり追加", "サイドベンツ推奨"] },
//   thigh_size: { high: ["ワタリ幅出し", "シック補強"] },
//   leg_bow: { low: ["O脚補正"], high: ["X脚補正"] }
// };

// --- Shared Colors & Styles ---
const THEME = {
  bg: "bg-[#151515]",
  text: "text-[#E5E5E5]",
  gold: "text-[#C5A059]",
  goldBorder: "border-[#C5A059]",
  goldBg: "bg-[#C5A059]",
  border: "border-[#333333]",
  cardBg: "bg-[#1A1A1A]/80",
  subText: "text-[#888888]",
  hover: "hover:bg-[#C5A059] hover:text-[#151515]"
};

// --- App Component ---
const App = () => {
  const [appState, setAppState] = useState('welcome');
  const [currentStep, setCurrentStep] = useState(0);
  const [currentPhase, setCurrentPhase] = useState<'basic' | 'correction' | 'usage' | 'fashion' | 'binary'>('basic');
  const [answers, setAnswers] = useState<DiagnosisAnswers>({});
  const [result, setResult] = useState<any>(null);
  const [selectedPlan, setSelectedPlan] = useState<string>('milestone');
  const [bookingData, setBookingData] = useState<any>({});
  const [lotteryResult, setLotteryResult] = useState<any>(null);

  // 質問の決定: 基本 → 人体最適化 → ファッション好み → 使用用途
  const getCurrentQuestions = () => {
    switch (currentPhase) {
      case 'basic':
        return BASIC_QUESTIONS;
      case 'correction':
        return CORRECTION_QUESTIONS;
      case 'usage':
        return USAGE_QUESTIONS;
      case 'fashion':
        return FASHION_PREFERENCE_QUESTIONS;
      case 'binary':
        return BINARY_DESIGN_QUESTIONS;
      default:
        return BASIC_QUESTIONS;
    }
  };

  const getTotalQuestions = () => {
    return BASIC_QUESTIONS.length + CORRECTION_QUESTIONS.length + 
           USAGE_QUESTIONS.length + FASHION_PREFERENCE_QUESTIONS.length +
           BINARY_DESIGN_QUESTIONS.length;
  };

  const getCurrentQuestionNumber = () => {
    let base = 0;
    if (currentPhase === 'correction') base = BASIC_QUESTIONS.length;
    else if (currentPhase === 'usage') base = BASIC_QUESTIONS.length + CORRECTION_QUESTIONS.length;
    else if (currentPhase === 'fashion') base = BASIC_QUESTIONS.length + CORRECTION_QUESTIONS.length + USAGE_QUESTIONS.length;
    else if (currentPhase === 'binary') base = BASIC_QUESTIONS.length + CORRECTION_QUESTIONS.length + USAGE_QUESTIONS.length + FASHION_PREFERENCE_QUESTIONS.length;
    return base + currentStep + 1;
  };

  const currentQuestions = getCurrentQuestions();
  const totalQuestions = getTotalQuestions();
  const currentQuestionNumber = getCurrentQuestionNumber();
  const phaseProgress = (currentQuestionNumber / totalQuestions) * 100;

  const handleAnswer = (value: number) => {
    const question = currentQuestions[currentStep];
    const factor = question.factor; // 'S', 'C', 'P', 'M', or 'STYLE'
    
    // スコアリング: scenarioQuestions.tsのgetQuestionScoreを使用
    const score = getQuestionScore(question.id, value);
    
    setAnswers(prev => ({ 
      ...prev, 
      [question.id]: { [factor]: score }
    }));
    
    setTimeout(() => {
      if (currentStep < currentQuestions.length - 1) {
        setCurrentStep(curr => curr + 1);
      } else {
        // 現在のセクション完了 → 次のセクションへ
        if (currentPhase === 'basic') {
          setCurrentPhase('correction');
          setCurrentStep(0);
        } else if (currentPhase === 'correction') {
          setCurrentPhase('usage');
          setCurrentStep(0);
        } else if (currentPhase === 'usage') {
          setCurrentPhase('fashion');
          setCurrentStep(0);
        } else if (currentPhase === 'fashion') {
          setCurrentPhase('binary');
          setCurrentStep(0);
        } else if (currentPhase === 'binary') {
          // 全質問完了 → 結果計算
          calculateResult();
        }
      }
    }, 400);
  };

  const calculateResult = () => {
    setAppState('loading');
    setTimeout(() => {
      // 1. 診断ロジックを使用してアーキタイプを判定
      const diagnosisResult = generateDiagnosisResult(answers);
      const { 
        archetype: archetypeData, 
        axisScores, 
        axisResults, 
        axisDetail,
        subtypeTag,
        stylePreference,
        corrections: correctionItems,
        usageRecommendations,
      } = diagnosisResult;
      
      // 2. 画像パスの設定
      const archetype = {
        ...archetypeData,
        imageUrl: ARCHETYPE_IMAGES[archetypeData.id] || getArchetypeImagePath(archetypeData.id),
        palette: COLOR_PALETTES.traditionalist // デフォルトパレット（後でアーキタイプごとにカスタマイズ可能）
      };
      
      // 3. Physical Logic (オプション質問から判定、簡略化版)
      let physicalType = PHYSICAL_TYPES.A;

      // 4. Enhanced Diagnosis統合: 生地・スタイル・カラーパレット推奨
      const enhancedResult = generateEnhancedDiagnosisResult({
        archetype: archetypeData,
        axisScores,
        axisResults,
        stylePreference,
        answers,
      });

      // 5. Plans Logic (enhancedDiagnosisの結果を使用)
      // ベストの必要性: f1（3ピース vs ダブル）から推測
      // f1が-1（左: 3ピース）ならベストが必要、1（右: ダブル）なら不要
      const vestPref = answers.f1?.STYLE || answers.q_style?.STYLE || 0;
      const vestCostRate = (vestPref < 0) ? 0.35 : 0; // 3ピース（-1）ならベストが必要
      const optionCost = Object.values(archetype.recOptions).reduce((s:number, o:any) => s + o.price, 0);
      const createPlanData = (fabric: any, title: string, subtitle: string) => {
        const fabricCost = fabric.basePrice;
        const vestCost = Math.round(fabricCost * vestCostRate);
        const total = fabricCost + vestCost + optionCost;
        const marketBase = fabric.marketPrice;
        const marketVest = Math.round(marketBase * vestCostRate);
        const marketTotal = marketBase + marketVest + (optionCost * 1.2);
        const diff = marketTotal - total;
        const discountRate = Math.round((diff / marketTotal) * 100);
        return { title, subtitle, fabric, total, marketTotal, diff, discountRate, vestCost };
      };

      // 軸スコアに基づく生地選択（enhancedDiagnosisの推奨を活用）
      const isSoft = axisResults.S === 'Soft';
      const isGlossy = axisResults.M === 'Trad' && axisResults.P === 'Auth';
      
      const valueFabric = FABRIC_PLANS.omc;
      const milestoneFabric = isGlossy ? FABRIC_PLANS.reda_silky : FABRIC_PLANS.vbc_n;
      const authenticFabric = isSoft ? FABRIC_PLANS.zegna : FABRIC_PLANS.dormeuil;

      const plans = {
        value: createPlanData(valueFabric, "Best Value", "圧倒的コストパフォーマンス"),
        milestone: createPlanData(milestoneFabric, "Milestone", "日常〜オフィシャルの最適解"),
        authentic: createPlanData(authenticFabric, "Authentic", "最高峰の格式と品質")
      };

      // 6. Corrections (補正項目を生成)
      const corrections = (correctionItems && correctionItems.length > 0)
        ? correctionItems.map((c: any) => c.label)
        : ["基本体型補正"];

      const identityId = `${archetype.id}-${physicalType.code}`;
      setResult({ 
        archetype, 
        physicalType, 
        plans, 
        corrections, 
        identityId,
        axisScores,
        axisResults,
        stylePreference,
        axisDetail,
        subtypeTag,
        usageRecommendations,
        // Enhanced Diagnosis結果を追加
        fabricRecommendations: enhancedResult.fabricRecommendations,
        styleRecommendations: enhancedResult.styleRecommendations,
        colorPalette: enhancedResult.colorPalette,
        academicBasis: enhancedResult.academicBasis,
        specificRecommendations: enhancedResult.specificRecommendations,
      });
      setAppState('result');
    }, 2500);
  };

  const startLottery = (data: any) => {
    setBookingData(data);
      setAppState('lottery_spin');
      setTimeout(() => {
        const isWinner = Math.floor(Math.random() * LOTTERY_PROBABILITY) === 0;
        setLotteryResult(isWinner);
        setAppState('lottery_result');
      }, 3000);
  };

  // Render routing
  if (appState === 'welcome') return <WelcomeScreen onStart={() => setAppState('diagnosis')} />;
  if (appState === 'loading') return <LoadingScreen />;
  if (appState === 'diagnosis') return (
    <QuestionScreen 
      question={currentQuestions[currentStep]} 
      currentStep={currentQuestionNumber - 1} 
      totalSteps={totalQuestions}
      onAnswer={handleAnswer}
      onBack={() => {
        if (currentStep > 0) {
          setCurrentStep(c => c - 1);
        } else {
          // 現在のセクションの最初の質問から戻る場合
          if (currentPhase === 'correction') {
            setCurrentPhase('basic');
            setCurrentStep(BASIC_QUESTIONS.length - 1);
          } else if (currentPhase === 'usage') {
            setCurrentPhase('correction');
            setCurrentStep(CORRECTION_QUESTIONS.length - 1);
          } else if (currentPhase === 'fashion') {
            setCurrentPhase('usage');
            setCurrentStep(USAGE_QUESTIONS.length - 1);
          } else if (currentPhase === 'binary') {
            setCurrentPhase('fashion');
            setCurrentStep(FASHION_PREFERENCE_QUESTIONS.length - 1);
          } else if (currentPhase === 'basic') {
            setAppState('welcome');
          }
        }
      }}
      progress={phaseProgress}
      scene={currentQuestions[currentStep]?.scene}
      categoryDescription={currentQuestions[currentStep]?.category ? CATEGORY_DESCRIPTIONS[currentQuestions[currentStep].category as keyof typeof CATEGORY_DESCRIPTIONS] : undefined}
      phaseName={currentPhase === 'basic' ? '基本セクション' : 
                 currentPhase === 'correction' ? '人体最適化' :
                 currentPhase === 'usage' ? '使用用途' :
                 currentPhase === 'fashion' ? 'ファッション好み' : 'デザイン選好'}
    />
  );
  if (appState === 'result') return <ResultScreen result={result} selectedPlan={selectedPlan} setSelectedPlan={setSelectedPlan} onBook={() => setAppState('booking')} />;
  if (appState === 'booking') return <BookingForm result={result} selectedPlan={selectedPlan} onSubmit={startLottery} onBack={() => setAppState('result')} />;
  if (appState === 'lottery_spin' || appState === 'lottery_result') return <LotteryScreen result={lotteryResult} isSpinning={appState === 'lottery_spin'} bookingData={bookingData} diagnosisResult={result} selectedPlan={selectedPlan} />;

  return null;
};

// --- Components ---
const ProgressBar = ({ progress }: { progress?: number }) => {
  if (progress === undefined) return null;
  return (
    <div className="fixed top-[60px] md:top-[80px] left-0 w-full h-[2px] md:h-[1px] bg-[#222] z-50">
      <div className="h-full bg-[#C5A059] transition-all duration-700 ease-out shadow-[0_0_8px_rgba(197,160,89,0.5)]" style={{ width: `${progress}%` }} />
      <div className="absolute top-0 right-0 h-full w-[2px] bg-[#C5A059] opacity-50"></div>
    </div>
  );
};

const WelcomeScreen = ({ onStart }: any) => (
  <div className={`min-h-screen ${THEME.bg} ${THEME.text} flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans`} style={{ paddingTop: '80px' }}>
    {/* Cinematic Background */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(30,30,30,1)_0%,_rgba(21,21,21,1)_100%)]" />
    <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(#222 1px, transparent 1px), linear-gradient(90deg, #222 1px, transparent 1px)', backgroundSize: '60px 60px', opacity: 0.15 }}></div>
    
    <div className="relative z-10 max-w-4xl text-center space-y-16 animate-in fade-in zoom-in duration-1000">
      
      {/* Brand Title */}
      <div className="space-y-6">
        <div className="inline-flex items-center justify-center space-x-3 mb-2">
          <div className="h-[1px] w-12 bg-[#C5A059]/50"></div>
          <span className="tracking-[0.3em] text-xs font-bold uppercase text-[#C5A059]">EST. TIME: 3 MIN</span>
          <div className="h-[1px] w-12 bg-[#C5A059]/50"></div>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-serif leading-tight tracking-tight text-[#F5F5F5] drop-shadow-2xl">
          {SYSTEM_NAME}
        </h1>
        <p className="text-[#C5A059] text-2xl md:text-3xl font-serif mb-2 tracking-wider">{SYSTEM_SUB}</p>
        <p className="text-[#888] text-sm tracking-[0.2em] uppercase">{SYSTEM_DESC}</p>
        
        {/* Provider Info */}
        <div className="mt-8 pt-6 border-t border-[#333]">
          <p className="text-[#666] text-xs tracking-[0.15em] uppercase">{BRAND_INFO.provider}</p>
        </div>
      </div>

      {/* Philosophy (Cards) */}
      <div className="grid md:grid-cols-3 gap-6 text-left">
        {BRAND_INFO.philosophy.map((item, index) => (
          <div key={index} className="bg-[#1A1A1A] border border-[#333] p-6 hover:border-[#C5A059]/50 transition-all duration-500 group relative overflow-hidden">
            <div className="absolute -top-4 -right-4 text-[#222] font-serif text-9xl opacity-20 group-hover:text-[#C5A059]/10 transition-colors">0{index + 1}</div>
            <Sparkles className="w-5 h-5 text-[#C5A059] mb-4 opacity-70 group-hover:opacity-100" />
            <p className="text-[#CCC] text-sm font-light leading-relaxed relative z-10">{item}</p>
          </div>
        ))}
      </div>

      {/* CTA - Enhanced for Booking */}
      <div className="space-y-6">
        <button onClick={onStart} className="group relative inline-flex items-center justify-center px-16 py-6 text-lg text-[#151515] transition-all duration-500 bg-[#C5A059] font-serif tracking-[0.15em] hover:bg-[#DCC07A] hover:shadow-[0_0_30px_rgba(197,160,89,0.3)]">
          <span className="relative z-10 font-bold">RAT診断を開始する</span>
          <div className="absolute inset-0 border border-[#C5A059] translate-x-1 translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-300 pointer-events-none border-opacity-50"></div>
        </button>
        
        <p className="text-[#888] text-xs tracking-wider">
          診断完了後、最適なプランで<span className="text-[#C5A059] font-bold">予約に進めます</span>
        </p>
      </div>
    </div>
  </div>
);


// --- CLICKABLE OPTION (Luxury Style with Mobile Optimization) ---
const ClickableOption = ({ value, label, onClick }: { value: number, label: string, onClick: (v: number) => void }) => {
  return (
    <button
      onClick={() => onClick(value)}
      className={`
        group relative w-full p-4 md:p-6 border border-[#333] transition-all duration-500
        hover:border-[#C5A059] hover:bg-[#1A1A1A]
        active:scale-[0.98] active:bg-[#1A1A1A] active:border-[#C5A059]
        flex items-center justify-between bg-[#151515] overflow-hidden
        min-h-[56px] md:min-h-[64px]
        touch-manipulation
      `}
      style={{ touchAction: 'manipulation' }}
    >
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#C5A059]/0 via-[#C5A059]/5 to-[#C5A059]/0 translate-x-[-100%] group-hover:translate-x-[100%] group-active:translate-x-[100%] transition-transform duration-1000"></div>
      
      {/* Left Bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-[2px] bg-[#C5A059] transition-all duration-300 h-0 group-hover:h-full group-active:h-full opacity-0 group-hover:opacity-100 group-active:opacity-100`}></div>
      
      <span className="font-serif text-xs md:text-sm tracking-wider text-[#888] group-hover:text-[#F5F5F5] group-active:text-[#F5F5F5] z-10 transition-colors pl-3 md:pl-4 pr-3 md:pr-4 text-left flex-1 leading-relaxed">
        {label}
      </span>
      
      {/* Custom Radio Graphic */}
      <div className={`w-3 h-3 md:w-4 md:h-4 border border-[#444] rotate-45 transition-all duration-300 group-hover:border-[#C5A059] group-hover:bg-[#C5A059] group-active:border-[#C5A059] group-active:bg-[#C5A059] z-10 flex items-center justify-center flex-shrink-0 mr-2 md:mr-0`}>
      </div>
    </button>
  );
};

const QuestionScreen = ({ question, currentStep, totalSteps, onAnswer, onBack, progress, scene, categoryDescription, phaseName }: any) => {
  const isBinary = question?.inputType === 'binary';
  const [sliderValue, setSliderValue] = useState(0);

  useEffect(() => {
    setSliderValue(0);
  }, [question?.id]);

  return (
    <div className={`min-h-screen ${THEME.bg} ${THEME.text} font-sans pt-20 md:pt-24 pb-10`}>
      <ProgressBar progress={progress} />
      <main className="max-w-2xl mx-auto px-4 md:px-6 flex flex-col min-h-[70vh]">
        <div className="flex-1 flex flex-col justify-center">
          <div className="mb-8 md:mb-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Phase Indicator */}
            {phaseName && (
              <div className="mb-4 inline-block px-4 py-2 bg-[#1A1A1A] border border-[#333] rounded-full">
                <span className="text-[9px] font-bold tracking-[0.2em] text-[#C5A059] uppercase">
                  {phaseName}
                </span>
              </div>
            )}
            <div className="inline-block px-3 py-1 border border-[#333] rounded-full mb-3 md:mb-4">
              <span className="text-[10px] font-bold tracking-[0.2em] text-[#C5A059] uppercase">
                Q{currentStep + 1} / {totalSteps} — {question.category}
            </span>
            </div>
            {/* Scene Description */}
            {scene && (
              <div className="mb-4 text-[#C5A059] text-sm md:text-base font-serif italic border-l-2 border-[#C5A059]/30 pl-4 max-w-lg mx-auto">
                {scene}
              </div>
            )}
            {/* Category Description */}
            {categoryDescription && (
              <div className="mb-4 text-[#888] text-[10px] md:text-xs tracking-wider uppercase">
                {categoryDescription}
              </div>
            )}
            {/* Academic Basis (Tooltip) */}
            {question.academicBasis && (
              <div className="mb-4 text-[#666] text-[9px] italic max-w-2xl mx-auto">
                {question.academicBasis}
              </div>
            )}
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif font-medium text-[#F5F5F5] leading-relaxed px-2">{question.text}</h2>
          </div>
          {!isBinary && (
            <div className="space-y-6 bg-[#1A1A1A] border border-[#333] rounded-2xl p-6 md:p-8 shadow-xl animate-in fade-in slide-in-from-bottom-6 duration-700">
              {/* Left/Right Labels */}
              <div className="flex justify-between text-sm md:text-base text-[#AAA] font-medium mb-4">
                <div className="max-w-[45%] text-left">
                  <div className="text-[#C5A059] text-[10px] uppercase tracking-wider mb-1">左の選択</div>
                  <div className="leading-relaxed">{question.left}</div>
                </div>
                <div className="max-w-[45%] text-right">
                  <div className="text-[#C5A059] text-[10px] uppercase tracking-wider mb-1">右の選択</div>
                  <div className="leading-relaxed">{question.right}</div>
                </div>
              </div>
              
              {/* Scale Input (5段階) */}
              <div className="pt-4 border-t border-[#333]">
                <div className="grid grid-cols-5 gap-3 md:gap-4">
                  {[-2, -1, 0, 1, 2].map((v) => (
                    <button
                      key={v}
                      onClick={() => {
                        setSliderValue(v);
                        onAnswer(v);
                      }}
                      className={`group flex flex-col items-center justify-center border-2 rounded-xl py-4 md:py-5 transition-all duration-300 transform ${
                        sliderValue === v
                          ? 'border-[#C5A059] bg-gradient-to-b from-[#1F1A10] to-[#151515] text-[#F5F5F5] shadow-[0_0_20px_rgba(197,160,89,0.3)] scale-105'
                          : 'border-[#333] bg-[#151515] text-[#888] hover:border-[#555] hover:bg-[#1A1A1A] hover:scale-102'
                      }`}
                    >
                      <div
                        className={`w-10 h-10 md:w-12 md:h-12 rounded-full transition-all duration-300 flex items-center justify-center ${
                          sliderValue === v 
                            ? 'bg-[#C5A059] shadow-[0_0_15px_rgba(197,160,89,0.5)]' 
                            : 'bg-[#333] group-hover:bg-[#444]'
                        }`}
                      >
                        {sliderValue === v && (
                          <Check className="w-5 h-5 text-[#151515]" />
                        )}
                      </div>
                      <span className="mt-3 text-[9px] md:text-[10px] uppercase tracking-[0.2em] font-bold">
                        {v === -2
                          ? '強く左'
                          : v === -1
                            ? 'やや左'
                            : v === 0
                              ? '中立'
                              : v === 1
                                ? 'やや右'
                                : '強く右'}
                      </span>
                    </button>
                  ))}
                </div>
                {/* Scale Indicator */}
                <div className="mt-4 flex justify-between text-[9px] text-[#666] px-2">
                  <span>左寄り</span>
                  <span>中立</span>
                  <span>右寄り</span>
                </div>
              </div>
            </div>
          )}
          {isBinary && (
            <div className="space-y-3 md:space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
              <ClickableOption value={-1} label={question.left} onClick={onAnswer} />
              <ClickableOption value={1} label={question.right} onClick={onAnswer} />
            </div>
          )}
        </div>
        <div className="mt-8 md:mt-12 flex justify-center">
          <button onClick={onBack} disabled={currentStep === 0} className={`flex items-center text-[10px] tracking-[0.2em] text-[#444] hover:text-[#C5A059] transition-colors uppercase ${currentStep === 0 ? 'opacity-0 pointer-events-none' : ''}`}>
            <ChevronLeft className="w-3 h-3 mr-2" /> Back
          </button>
        </div>
      </main>
    </div>
  );
};

const LoadingScreen = () => (
  <div className={`min-h-screen flex flex-col items-center justify-center ${THEME.bg} ${THEME.text} font-sans`}>
    <div className="relative w-24 h-24 mb-8">
      <div className="absolute inset-0 border-t-2 border-[#C5A059] rounded-full animate-spin"></div>
      <div className="absolute inset-2 border-r-2 border-[#C5A059]/50 rounded-full animate-spin-slow"></div>
    </div>
    <h3 className="text-xl font-serif tracking-[0.3em] mb-4 text-[#F5F5F5]">ANALYZING IDENTITY</h3>
    <div className="space-y-2 text-center text-[#666] text-[10px] font-mono tracking-widest">
      <p>CALCULATING BIOMETRICS</p>
      <p>OPTIMIZING FABRIC SELECTION</p>
      <p>GENERATING UNIQUE ID</p>
    </div>
  </div>
);

const PlanCard = ({ plan, type, isSelected, onSelect }: any) => {
  const isValue = type === 'value';
  const isAuthentic = type === 'authentic';
  const priceFormatter = new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' });
  
  return (
    <div 
      onClick={onSelect}
      className={`relative cursor-pointer p-8 transition-all duration-500 border flex flex-col h-full group overflow-hidden
        ${isSelected 
          ? 'border-[#C5A059] bg-[#1A1A1A] shadow-[0_0_30px_rgba(197,160,89,0.15)] z-10' 
          : 'border-[#333] bg-[#1A1A1A] hover:border-[#666] opacity-60 hover:opacity-100'
        }
      `}
    >
      {isSelected && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-[#C5A059] text-[#151515] px-4 py-1 text-[10px] tracking-[0.2em] font-bold shadow-lg w-full text-center">
          SELECTED CHOICE
        </div>
      )}
      
      <div className="mb-6 text-center mt-4">
        <span className={`text-[10px] font-bold uppercase tracking-[0.2em] px-2 py-1 mb-3 inline-block
          ${isValue ? 'text-[#A8D5BA]' : isAuthentic ? 'text-[#F3DFA2]' : 'text-[#A2C4F3]'}`}>
            {plan.title}
          </span>
        <h3 className="text-xl font-serif font-medium text-[#F5F5F5] leading-tight mb-2">{plan.fabric.name}</h3>
        <p className="text-[10px] text-[#888] h-8 leading-relaxed">{plan.subtitle}</p>
        </div>
      <div className="space-y-3 mb-8 flex-1 border-t border-[#333] pt-6">
        <ul className="text-[10px] text-[#AAA] space-y-2">
          {plan.fabric.features.map((f: string, i: number) => (
            <li key={i} className="flex items-center justify-center"><Check className="w-3 h-3 mr-2 text-[#C5A059]"/>{f}</li>
          ))}
        </ul>
      </div>
      <div className="mt-auto text-center">
        <div className="text-[10px] text-[#666] mb-2 flex justify-center space-x-2">
          <span>MARKET:</span>
          <span className="line-through decoration-[#666]">{priceFormatter.format(plan.marketTotal)}</span>
        </div>
        <div className="border-t border-[#333] pt-4 pb-2">
          <span className="block text-3xl font-serif text-[#C5A059]">{priceFormatter.format(plan.total)}</span>
          <span className="text-[9px] text-[#666] uppercase tracking-widest">Total w/Tax</span>
        </div>
        <div className={`mt-3 border border-[#C5A059]/30 text-[#C5A059] text-[10px] font-bold py-1.5 px-3 inline-flex items-center tracking-widest ${isSelected ? 'bg-[#C5A059]/10' : ''}`}>
          <TrendingDown className="w-3 h-3 mr-2" />
          SAVE {priceFormatter.format(plan.diff)}
        </div>
      </div>
    </div>
  );
};

const ResultScreen = ({ result, selectedPlan, setSelectedPlan, onBook }: any) => {
  const priceFormatter = new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' });
  const [openDetail, setOpenDetail] = useState<string | null>(null);
  return (
    <div className={`min-h-screen ${THEME.bg} ${THEME.text} font-sans pb-20 overflow-x-hidden`}>
      
      {/* Hero */}
      <div className={`relative w-full bg-gradient-to-b ${result.archetype.color} pt-40 pb-20 px-6`}>
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center gap-16">
          <div className="md:w-1/2 text-center md:text-left">
            <div className="inline-flex items-center border border-[#C5A059]/30 px-6 py-2 mb-8 backdrop-blur-md bg-[#151515]/30">
              <Award className="w-4 h-4 mr-3 text-[#C5A059]" />
              <span className="text-xs font-mono text-[#C5A059]">ID: <strong className="tracking-widest ml-2">{result.identityId}</strong></span>
            </div>
            <div className="mb-4">
              <span className="text-xs font-bold tracking-[0.2em] text-[#C5A059] uppercase">{result.archetype.group}</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-medium mb-6 flex items-center justify-center md:justify-start text-[#F5F5F5]">
              {result.archetype.name}
            </h1>
            <p className="text-sm md:text-base text-[#AAA] font-light leading-relaxed max-w-lg">
              {result.archetype.desc}
            </p>
          </div>
          <div className="md:w-1/2 flex justify-center">
             <div className="max-w-full border border-[#333] shadow-2xl flex items-center justify-center relative overflow-hidden group bg-black/20 rounded-lg">
                <div className="absolute inset-0 bg-[#C5A059]/10 transform rotate-6 scale-110 group-hover:rotate-0 transition-all duration-700"></div>
                <img 
                  src={result.archetype.imageUrl} 
                  alt={result.archetype.name} 
                  className="relative w-full h-auto max-h-[600px] object-contain opacity-80 group-hover:opacity-100 transition-opacity duration-500 grayscale group-hover:grayscale-0" 
                  style={{ aspectRatio: '2816/1536' }}
                />
                <div className="absolute bottom-6 left-6 right-6 border-t border-white/20 pt-4">
                   <span className="text-[10px] font-mono text-white/70 tracking-[0.3em] uppercase block text-center">Visual Identity</span>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* Plans */}
      <div className="max-w-7xl mx-auto px-6 -mt-16 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <PlanCard plan={result.plans.value} type="value" isSelected={selectedPlan === 'value'} onSelect={() => setSelectedPlan('value')} />
          <PlanCard plan={result.plans.milestone} type="milestone" isSelected={selectedPlan === 'milestone'} onSelect={() => setSelectedPlan('milestone')} />
          <PlanCard plan={result.plans.authentic} type="authentic" isSelected={selectedPlan === 'authentic'} onSelect={() => setSelectedPlan('authentic')} />
        </div>
      </div>

      {/* Details */}
      <div className="max-w-5xl mx-auto px-6 mt-24">
        <div className="bg-[#1A1A1A] border border-[#333] p-10 shadow-2xl">
          <div className="flex items-center mb-8 text-[#666] text-[10px] font-bold tracking-[0.2em] uppercase border-b border-[#333] pb-4">
            <Gem className="w-4 h-4 mr-3 text-[#C5A059]"/> Plan Details
          </div>
          
          <div className="bg-[#222] border-l-2 border-[#C5A059] p-6 flex items-start mb-10">
            <Info className="w-5 h-5 text-[#C5A059] mr-4 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-[#CCC] leading-relaxed font-light">
              市場価格と比較して <span className="font-serif text-lg text-[#C5A059] mx-1 border-b border-[#C5A059]">{priceFormatter.format(result.plans[selectedPlan].diff)}</span> お得です。
              この差額で、推奨オプション（{result.archetype.recOptions.button.name}等）が含まれており、実質的なアップグレードが完了しています。
            </div>
          </div>

          {/* 具体的な品番推奨セクション */}
          {result?.specificRecommendations && (
            <div className="bg-gradient-to-br from-[#1F1A10] to-[#151515] border border-[#C5A059]/30 p-8 mb-10 rounded-lg shadow-[0_0_30px_rgba(197,160,89,0.1)]">
              <div className="flex items-center mb-6 text-[#C5A059] text-[12px] font-bold tracking-[0.2em] uppercase">
                <Sparkles className="w-5 h-5 mr-3" />
                推奨仕様の自動生成
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 生地 */}
                <div className="bg-[#151515] border border-[#333] p-6 rounded-lg">
                  <div className="text-[10px] text-[#666] uppercase tracking-[0.2em] mb-2">コレクション</div>
                  <div className="text-lg font-serif text-[#F5F5F5] mb-1">{result.specificRecommendations.fabricCode.collection} Line</div>
                  <div className="text-[10px] text-[#666] uppercase tracking-[0.2em] mb-2 mt-4">生地コード</div>
                  <div className="text-xl font-mono text-[#C5A059] mb-2">{result.specificRecommendations.fabricCode.code}</div>
                  <div className="text-sm text-[#AAA] mb-2">{result.specificRecommendations.fabricCode.name}</div>
                  <div className="text-[10px] text-[#888]">{result.specificRecommendations.fabricCode.color}</div>
                  <div className="mt-4 pt-4 border-t border-[#333]">
                    <div className="text-[10px] text-[#666] uppercase tracking-[0.2em] mb-1">価格</div>
                    <div className="text-2xl font-serif text-[#C5A059]">{priceFormatter.format(result.specificRecommendations.fabricCode.price)}</div>
                  </div>
                </div>

                {/* ボタン */}
                <div className="bg-[#151515] border border-[#333] p-6 rounded-lg">
                  <div className="text-[10px] text-[#666] uppercase tracking-[0.2em] mb-2">ボタン</div>
                  <div className="text-lg font-serif text-[#F5F5F5] mb-1">{result.specificRecommendations.buttonOption.name}</div>
                  <div className="text-[10px] text-[#666] uppercase tracking-[0.2em] mb-2 mt-4">コード</div>
                  <div className="text-xl font-mono text-[#C5A059] mb-2">{result.specificRecommendations.buttonOption.code}</div>
                  <div className="text-sm text-[#AAA] mb-2">{result.specificRecommendations.buttonOption.material}</div>
                  <div className="text-[10px] text-[#888] leading-relaxed">{result.specificRecommendations.buttonOption.description}</div>
                  <div className="mt-4 pt-4 border-t border-[#333]">
                    <div className="text-[10px] text-[#666] uppercase tracking-[0.2em] mb-1">価格</div>
                    <div className="text-2xl font-serif text-[#C5A059]">{priceFormatter.format(result.specificRecommendations.buttonOption.price)}</div>
                  </div>
                </div>

                {/* 裏地 */}
                <div className="bg-[#151515] border border-[#333] p-6 rounded-lg">
                  <div className="text-[10px] text-[#666] uppercase tracking-[0.2em] mb-2">裏地</div>
                  <div className="text-lg font-serif text-[#F5F5F5] mb-1">{result.specificRecommendations.liningOption.name}</div>
                  <div className="text-[10px] text-[#666] uppercase tracking-[0.2em] mb-2 mt-4">コード</div>
                  <div className="text-xl font-mono text-[#C5A059] mb-2">{result.specificRecommendations.liningOption.code}</div>
                  <div className="text-sm text-[#AAA] mb-2">{result.specificRecommendations.liningOption.brand}</div>
                  <div className="text-[10px] text-[#888] leading-relaxed mb-2">{result.specificRecommendations.liningOption.description}</div>
                  <div className="text-[9px] text-[#666] mb-2">
                    カラー: {result.specificRecommendations.liningOption.colors.slice(0, 3).join(', ')}
                    {result.specificRecommendations.liningOption.colors.length > 3 && '...'}
                  </div>
                  <div className="mt-4 pt-4 border-t border-[#333]">
                    <div className="text-[10px] text-[#666] uppercase tracking-[0.2em] mb-1">価格</div>
                    <div className="text-2xl font-serif text-[#C5A059]">{priceFormatter.format(result.specificRecommendations.liningOption.price)}</div>
                  </div>
                </div>
              </div>

              {/* 合計価格 */}
              <div className="mt-8 pt-6 border-t border-[#333]">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-[#666] uppercase tracking-[0.2em] mb-2">推奨仕様合計価格</div>
                    <div className="text-3xl font-serif text-[#C5A059]">{priceFormatter.format(result.specificRecommendations.totalPrice)}</div>
                    <div className="text-[10px] text-[#888] mt-2">（税込・送料無料）</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-[#666] uppercase tracking-[0.2em] mb-2">この仕様で予約</div>
                    <button
                      onClick={() => onBook(result)}
                      className="bg-[#C5A059] text-[#151515] px-8 py-3 font-bold text-sm uppercase tracking-[0.2em] hover:bg-[#D4B069] transition-colors flex items-center"
                    >
                      <ArrowRight className="w-4 h-4 mr-2" />
                      予約する
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        {result?.subtypeTag && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            {Object.entries(result.subtypeTag).map(([axis, tag]: any) => (
              <div key={axis} className="bg-[#222] border border-[#333] p-3 text-[11px] text-[#CCC] flex items-center justify-between">
                <span className="uppercase tracking-[0.2em] text-[#777]">{axis}</span>
                <span className="font-mono text-[#C5A059]">{tag}</span>
              </div>
            ))}
          </div>
        )}
        {result?.usageRecommendations && result.usageRecommendations.length > 0 && (
          <div className="mb-10">
            <h4 className="font-bold text-xs mb-3 flex items-center text-[#F5F5F5] tracking-widest"><Info className="w-4 h-4 mr-2 text-[#C5A059]" />用途に基づく推奨</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {result.usageRecommendations.map((u: any) => (
                <div key={u.code} className="bg-[#222] border border-[#333] p-4 text-[11px] text-[#CCC] leading-relaxed">
                  <div className="text-[#C5A059] font-mono mb-1 uppercase tracking-[0.15em]">{u.code}</div>
                  <div className="font-semibold text-[#F5F5F5]">{u.label}</div>
                  <div className="text-[#888] mt-1">{u.reason}</div>
                </div>
              ))}
            </div>
          </div>
        )}
          <h3 className="font-bold text-xs mb-6 flex items-center font-serif text-[#F5F5F5] tracking-widest"><Ruler className="w-4 h-4 mr-3 text-[#C5A059]"/> STRUCTURAL CORRECTIONS</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {result.corrections.map((corr: string, i: number) => (
              <div key={i} className="text-xs bg-[#222] p-4 border border-[#333] flex items-center text-[#CCC] font-mono">
                <span className="text-[#C5A059] mr-4">0{i+1}.</span>{corr}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA - Enhanced for Booking */}
      <div className="mt-24 text-center px-6 mb-12">
        <div className="inline-block w-full max-w-lg bg-[#111] border border-[#333] p-8 relative overflow-hidden mb-10 group hover:border-[#C5A059]/50 transition-colors">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#C5A059]/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-[#C5A059]/10 transition-all"></div>
          <div className="flex items-center justify-center">
            <Ticket className="w-8 h-8 mr-6 text-[#C5A059]" />
            <div className="text-left">
              <span className="block text-[10px] text-[#666] uppercase tracking-[0.2em] mb-1">Web Reservation Benefit</span>
              <span className="text-xl font-serif text-[#F5F5F5]">Win a Free Suit (1/200 Chance)</span>
            </div>
          </div>
        </div>
        
        {/* Provider Info */}
        <p className="text-[#666] text-xs mb-6 tracking-wider">{BRAND_INFO.provider}</p>
        
        <button onClick={onBook} className="w-full max-w-lg mx-auto bg-[#C5A059] text-[#151515] px-12 py-6 text-sm font-bold tracking-[0.2em] transition-all duration-300 flex items-center justify-center uppercase hover:bg-[#DCC07A] hover:shadow-[0_0_40px_rgba(197,160,89,0.2)]">
          無料採寸を依頼する <ArrowRight className="ml-3 w-4 h-4" />
          </button>
      </div>

      {/* Enhanced Diagnosis Results - 生地・スタイル・カラーパレット推奨 */}
      {result.fabricRecommendations && (
        <div className="mt-24 px-6 mb-12">
          <div className="max-w-5xl mx-auto">
            <div className="bg-[#1A1A1A] border border-[#333] p-10 shadow-2xl">
              <div className="flex items-center mb-8 text-[#666] text-[10px] font-bold tracking-[0.2em] uppercase border-b border-[#333] pb-4">
                <Gem className="w-4 h-4 mr-3 text-[#C5A059]"/> Enhanced Recommendations
              </div>
              
              {/* Fabric Recommendations */}
              <div className="mb-8">
                <h4 className="text-sm font-bold mb-4 text-[#F5F5F5] flex items-center">
                  <Activity className="w-4 h-4 mr-2 text-[#C5A059]" />
                  推奨生地
                </h4>
                <div className="bg-[#222] border border-[#333] p-6 rounded-lg mb-4">
                  <h5 className="text-base font-serif text-[#C5A059] mb-2">{result.fabricRecommendations.primary.name}</h5>
                  <p className="text-xs text-[#AAA] mb-4 leading-relaxed">{result.fabricRecommendations.reasoning}</p>
                  {result.fabricRecommendations.alternatives && result.fabricRecommendations.alternatives.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-[#333]">
                      <p className="text-[10px] text-[#666] uppercase tracking-wider mb-2">代替生地</p>
                      <div className="flex flex-wrap gap-2">
                        {result.fabricRecommendations.alternatives.slice(0, 3).map((fabric: any, i: number) => (
                          <span key={i} className="text-[9px] px-2 py-1 border border-[#444] rounded text-[#888]">{fabric.name}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Style Recommendations */}
              {result.styleRecommendations && (
                <div className="mb-8">
                  <h4 className="text-sm font-bold mb-4 text-[#F5F5F5] flex items-center">
                    <BookOpen className="w-4 h-4 mr-2 text-[#C5A059]" />
                    スタイル推奨
                  </h4>
                  <div className="bg-[#222] border border-[#333] p-6 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-[#AAA]">
                      <div>
                        <span className="text-[#666] uppercase tracking-wider text-[10px]">スーツスタイル</span>
                        <p className="text-[#F5F5F5] font-semibold mt-1">{result.styleRecommendations.suitStyle}</p>
                      </div>
                      <div>
                        <span className="text-[#666] uppercase tracking-wider text-[10px]">ボタン</span>
                        <p className="text-[#F5F5F5] font-semibold mt-1">{result.styleRecommendations.buttons.type} ({result.styleRecommendations.buttons.material})</p>
                      </div>
                      <div>
                        <span className="text-[#666] uppercase tracking-wider text-[10px]">ラペル</span>
                        <p className="text-[#F5F5F5] font-semibold mt-1">{result.styleRecommendations.lapel.type} ({result.styleRecommendations.lapel.width})</p>
                      </div>
                      <div>
                        <span className="text-[#666] uppercase tracking-wider text-[10px]">パンツ</span>
                        <p className="text-[#F5F5F5] font-semibold mt-1">{result.styleRecommendations.trousers.pleats}</p>
                      </div>
                    </div>
                    <p className="text-xs text-[#888] mt-4 leading-relaxed">{result.styleRecommendations.reasoning}</p>
                  </div>
                </div>
              )}

              {/* Color Palette */}
              {result.colorPalette && (
                <div className="mb-8">
                  <h4 className="text-sm font-bold mb-4 text-[#F5F5F5] flex items-center">
                    <Heart className="w-4 h-4 mr-2 text-[#C5A059]" />
                    カラーパレット
                  </h4>
                  <div className="bg-[#222] border border-[#333] p-6 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-[10px] text-[#666] uppercase tracking-wider mb-2">プライマリー</p>
                        <div className="space-y-2">
                          {result.colorPalette.primary.slice(0, 3).map((color: any, i: number) => (
                            <div key={i} className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded border border-[#444]" style={{ backgroundColor: color.hex }}></div>
                              <span className="text-xs text-[#AAA]">{color.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] text-[#666] uppercase tracking-wider mb-2">アクセント</p>
                        <div className="space-y-2">
                          {result.colorPalette.accent.slice(0, 3).map((color: any, i: number) => (
                            <div key={i} className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded border border-[#444]" style={{ backgroundColor: color.hex }}></div>
                              <span className="text-xs text-[#AAA]">{color.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-[10px] text-[#666] uppercase tracking-wider mb-2">避けるべき色</p>
                        <div className="space-y-2">
                          {result.colorPalette.avoid.slice(0, 2).map((color: any, i: number) => (
                            <div key={i} className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded border border-[#444] opacity-50" style={{ backgroundColor: color.hex }}></div>
                              <span className="text-xs text-[#666] line-through">{color.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-[#888] mt-4 leading-relaxed">{result.colorPalette.reasoning}</p>
                  </div>
                </div>
              )}

              {/* Academic Basis */}
              {result.academicBasis && (
                <div>
                  <h4 className="text-sm font-bold mb-4 text-[#F5F5F5] flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-[#C5A059]" />
                    学術的根拠
                  </h4>
                  <div className="bg-[#222] border border-[#333] p-6 rounded-lg space-y-4 text-xs text-[#AAA] leading-relaxed">
                    <div>
                      <span className="text-[#C5A059] font-bold uppercase tracking-wider text-[10px]">心理学:</span>
                      <p className="mt-1">{result.academicBasis.psychology}</p>
                    </div>
                    <div>
                      <span className="text-[#C5A059] font-bold uppercase tracking-wider text-[10px]">ファッション理論:</span>
                      <p className="mt-1">{result.academicBasis.fashion}</p>
                    </div>
                    <div>
                      <span className="text-[#C5A059] font-bold uppercase tracking-wider text-[10px]">形態学:</span>
                      <p className="mt-1">{result.academicBasis.morphology}</p>
                    </div>
                    <div>
                      <span className="text-[#C5A059] font-bold uppercase tracking-wider text-[10px]">色彩理論:</span>
                      <p className="mt-1">{result.academicBasis.colorTheory}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Comprehensive Analysis (Accordion) - 詳細レポート */}
      {result.archetype.details && (
        <div className="mt-24 px-6 mb-12">
          <div className="max-w-5xl mx-auto">
            <div className="bg-[#1A1A1A] border border-[#333] p-10 shadow-2xl">
              <h3 className="text-center text-[#C5A059] text-xs tracking-[0.3em] font-serif mb-8">- COMPREHENSIVE ANALYSIS -</h3>
              
              <div className="space-y-3">
                {/* Fashion */}
                <DetailAccordion
                  icon={<Activity className="w-4 h-4 text-blue-400" />}
                  title="SARTORIAL LOGIC"
                  subtitle="服飾形態学・色彩学"
                  isOpen={openDetail === 'fashion'}
                  onClick={() => setOpenDetail(openDetail === 'fashion' ? null : 'fashion')}
                >
                  <h4 className="text-[#C5A059] text-sm font-bold mb-2">{result.archetype.details.fashion.title}</h4>
                  <p className="text-gray-300 text-xs leading-relaxed mb-4">{result.archetype.details.fashion.text}</p>
                  <div className="flex gap-2 flex-wrap">
                    {result.archetype.details.fashion.items.map((item: string, i: number) => (
                      <span key={i} className="text-[9px] px-2 py-1 border border-gray-700 rounded text-gray-400">{item}</span>
                    ))}
                  </div>
                </DetailAccordion>

                {/* Psychology */}
                <DetailAccordion
                  icon={<BookOpen className="w-4 h-4 text-purple-400" />}
                  title="IDENTITY & PSYCHOLOGY"
                  subtitle="深層心理学・自我同一性"
                  isOpen={openDetail === 'psychology'}
                  onClick={() => setOpenDetail(openDetail === 'psychology' ? null : 'psychology')}
                >
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-[#C5A059] text-sm font-bold mb-2">{result.archetype.details.psychology.title}</h4>
                      <p className="text-gray-300 text-xs leading-relaxed mb-3">{result.archetype.details.psychology.text}</p>
                      <div className="bg-[#222] border border-[#333] px-3 py-2 rounded inline-block">
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">MBTI Type</p>
                        <p className="text-xs text-[#C5A059] font-mono">{result.archetype.details.psychology.tag}</p>
                      </div>
                    </div>
                  </div>
                </DetailAccordion>

                {/* Philosophy */}
                <DetailAccordion
                  icon={<MapPin className="w-4 h-4 text-green-400" />}
                  title="PHILOSOPHY & THEOLOGY"
                  subtitle="神学・哲学・人生論"
                  isOpen={openDetail === 'philosophy'}
                  onClick={() => setOpenDetail(openDetail === 'philosophy' ? null : 'philosophy')}
                >
                  <div>
                    <h4 className="text-[#C5A059] text-sm font-bold mb-3">{result.archetype.details.philosophy.title}</h4>
                    <p className="text-gray-300 text-sm leading-relaxed italic border-l-2 border-[#C5A059]/30 pl-4 py-2">
                      {result.archetype.details.philosophy.text}
                    </p>
                  </div>
                </DetailAccordion>

                {/* Romance */}
                <DetailAccordion
                  icon={<Heart className="w-4 h-4 text-red-400" />}
                  title="ROMANCE & FORTUNE"
                  subtitle="恋愛社会学・運勢"
                  isOpen={openDetail === 'romance'}
                  onClick={() => setOpenDetail(openDetail === 'romance' ? null : 'romance')}
                >
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-[#C5A059] text-sm font-bold mb-2">{result.archetype.details.romance.title}</h4>
                      <p className="text-gray-300 text-xs leading-relaxed mb-4">{result.archetype.details.romance.text}</p>
                    </div>
                    <div className="bg-gradient-to-r from-[#1F1A10] to-[#151515] border border-[#C5A059]/30 p-4 rounded-lg flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-[#C5A059]/20 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-6 h-6 text-[#C5A059]" />
                      </div>
                      <div>
                        <span className="text-[9px] text-[#C5A059] block uppercase tracking-wider mb-1 font-bold">Lucky Item</span>
                        <span className="text-sm text-gray-200 font-serif">{result.archetype.details.romance.lucky}</span>
                      </div>
                    </div>
                  </div>
                </DetailAccordion>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Instagram Story Share Section - 最下部に配置 */}
      <div className="mt-12 px-6 mb-12">
        <div className="max-w-5xl mx-auto">
          <div className="bg-[#1A1A1A] border border-[#333] p-10 shadow-2xl">
            <div className="flex items-center mb-8 text-[#666] text-[10px] font-bold tracking-[0.2em] uppercase border-b border-[#333] pb-4">
              <Sparkles className="w-4 h-4 mr-3 text-[#C5A059]"/> Share Your Result
            </div>
            <InstagramStoryShare result={result} />
          </div>
        </div>
      </div>
    </div>
  );
};

// Detail Accordion Component
const DetailAccordion = ({ icon, title, subtitle, isOpen, onClick, children }: any) => {
  const [openState, setOpenState] = useState(false);
  const isCurrentlyOpen = isOpen !== undefined ? isOpen : openState;
  const handleClick = () => {
    if (isOpen === undefined) setOpenState(!openState);
    onClick?.();
  };
  
  return (
    <div className="border border-white/10 bg-white/5 rounded-lg overflow-hidden transition-all duration-300">
      <button onClick={handleClick} className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
        <div className="flex items-center gap-3">
          {icon}
          <div className="text-left">
            <p className="text-xs font-bold text-gray-200 tracking-wider font-serif">{title}</p>
            <p className="text-[9px] text-gray-500">{subtitle}</p>
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${isCurrentlyOpen ? 'rotate-180' : ''}`} />
      </button>
      <div className={`grid transition-all duration-300 ease-in-out ${isCurrentlyOpen ? 'grid-rows-[1fr] opacity-100 p-4 pt-0' : 'grid-rows-[0fr] opacity-0 p-0'}`}>
        <div className="overflow-hidden">
          <div className="pt-2 border-t border-white/5">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

const BookingForm = ({ result, selectedPlan, onSubmit, onBack }: any) => {
  const [formData, setFormData] = useState<any>({});
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullId = `${result.identityId}-${selectedPlan.toUpperCase().substring(0,3)}`;
    onSubmit({ ...formData, fullId, planName: result.plans[selectedPlan].title });
  };

  return (
    <div className={`min-h-screen ${THEME.bg} font-sans py-20 px-6 text-[#F5F5F5]`} style={{ paddingTop: '120px' }}>
      <div className="max-w-2xl mx-auto bg-[#1A1A1A] border border-[#333] shadow-2xl">
        <div className="bg-[#111] p-10 text-center border-b border-[#333]">
          <h2 className="text-3xl font-serif font-medium mb-2 text-[#F5F5F5]">Personal Order Sheet</h2>
          <p className="text-[10px] text-[#666] tracking-[0.2em] uppercase">SELECTED PLAN: <span className="text-[#C5A059]">{result.plans[selectedPlan].title}</span></p>
          <p className="text-[9px] text-[#666] mt-2">{BRAND_INFO.provider}</p>
        </div>
        <form className="p-10 space-y-8" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="space-y-2">
               <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#666]">Full Name</label>
               <input required name="name" onChange={handleInputChange} type="text" className="w-full p-4 bg-[#222] border-b border-[#444] focus:border-[#C5A059] outline-none transition-colors text-[#F5F5F5] placeholder-[#444]" placeholder="Jiro Regalis" />
             </div>
             <div className="space-y-2">
               <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#666]">Email</label>
               <input required name="email" onChange={handleInputChange} type="email" className="w-full p-4 bg-[#222] border-b border-[#444] focus:border-[#C5A059] outline-none transition-colors text-[#F5F5F5] placeholder-[#444]" placeholder="example@regalis.jp" />
             </div>
             <div className="space-y-2">
               <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#666]">Phone</label>
               <input required name="phone" onChange={handleInputChange} type="tel" className="w-full p-4 bg-[#222] border-b border-[#444] focus:border-[#C5A059] outline-none transition-colors text-[#F5F5F5] placeholder-[#444]" placeholder="090-0000-0000" />
             </div>
             <div className="space-y-2">
               <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#666]">Age</label>
               <input required name="age" onChange={handleInputChange} type="number" className="w-full p-4 bg-[#222] border-b border-[#444] focus:border-[#C5A059] outline-none transition-colors text-[#F5F5F5] placeholder-[#444]" placeholder="30" />
             </div>
          </div>
          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onBack} className="w-1/3 border border-[#444] text-[#888] py-4 text-xs font-bold tracking-widest hover:border-[#C5A059] hover:text-[#C5A059] transition-colors uppercase">
              Back
            </button>
            <button type="submit" className="w-2/3 bg-[#C5A059] text-[#151515] py-4 text-xs font-bold tracking-widest hover:bg-[#DCC07A] transition-colors shadow-lg flex items-center justify-center uppercase">
              <CheckSquare className="w-4 h-4 mr-2" />
              CONFIRM & LOTTERY
          </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const LotteryScreen = ({ result, isSpinning, bookingData, diagnosisResult, selectedPlan }: any) => {
  return (
    <div className={`min-h-screen ${THEME.bg} flex flex-col items-center justify-center p-6 text-center text-[#F5F5F5]`}>
       {isSpinning ? <Loader2 className="w-24 h-24 animate-spin text-[#C5A059] opacity-80" /> : (
         <div className="bg-[#1A1A1A] text-[#F5F5F5] p-12 max-w-lg w-full shadow-2xl relative overflow-hidden border border-[#333]">
            <div className="absolute top-0 left-0 w-full h-1 bg-[#C5A059]"></div>
            <h2 className="text-4xl font-serif font-medium mb-6 text-[#F5F5F5]">{result ? "WINNER!" : "Confirmed"}</h2>
            <p className="text-[#888] text-sm mb-10 tracking-wide font-light">{result ? "You won the Golden Ticket!" : "Your appointment has been secured."}</p>
            
            <div className="text-left bg-[#222] p-8 border border-[#333] text-sm mb-10 space-y-4">
              <div className="flex justify-between border-b border-[#333] pb-2">
                <span className="text-[#666] text-[10px] uppercase tracking-[0.2em]">Selected Plan</span>
                <span className="font-serif text-[#C5A059]">{diagnosisResult.plans[selectedPlan].title}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-[#666] text-[10px] uppercase tracking-[0.2em]">Management ID</span>
                <span className="font-mono font-bold tracking-widest">{bookingData.fullId}</span>
        </div>
            </div>
            
            <p className="text-[#666] text-[9px] mb-4">{BRAND_INFO.provider}</p>
            
            <button onClick={() => window.location.reload()} className="text-[10px] text-[#666] hover:text-[#C5A059] tracking-[0.2em] uppercase border-b border-transparent hover:border-[#C5A059] transition-all pb-1">Return to Top</button>
            </div>
          )}
    </div>
  );
};

export default App;
