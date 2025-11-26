import React, { useState, useEffect } from 'react';
import { 
  Scissors, Ruler, User, ArrowRight, CheckCircle, RefreshCcw, Copy, ChevronLeft, Loader2, Award, Layers, Sparkles,
  Shield, Zap, Anchor, Feather, Briefcase, UserCircle2, Palette, Coins, Gem, PenTool, Ticket, Gift, Calendar, CheckSquare,
  MapPin, Building2, HelpCircle, Tag
} from 'lucide-react';

// --- Branding & Config ---
const BRAND_INFO = {
  name: "Regalis Japan Group",
  concept: "現代の呉服商",
  philosophy: "鎧を砕く / Suit Identity",
  sub: "次世代型ビスポークプラットフォーム"
};

const LOTTERY_PROBABILITY = 200; // 1/200 chance

// --- Color Palettes ---
const COLOR_PALETTES = {
  traditionalist: [
    { name: "British Navy", hex: "#1B2431", type: "Suit", desc: "信頼と格式の濃紺" },
    { name: "Crisp White", hex: "#F8F9FA", type: "Shirt", desc: "ブロード白" },
    { name: "Burgundy", hex: "#621B2F", type: "Tie", desc: "情熱と威厳" }
  ],
  modernist: [
    { name: "Charcoal Grey", hex: "#373737", type: "Suit", desc: "都会的な無彩色" },
    { name: "Ice Blue", hex: "#E3F2FD", type: "Shirt", desc: "知的な清涼感" },
    { name: "Slate", hex: "#64748B", type: "Tie", desc: "洗練されたトーン" }
  ],
  executive: [
    { name: "Midnight Blue", hex: "#0F172A", type: "Suit", desc: "リーダーの深青" },
    { name: "White Twill", hex: "#FFFFFF", type: "Shirt", desc: "光沢のある白" },
    { name: "Royal Blue", hex: "#1E40AF", type: "Tie", desc: "誠実と実行力" }
  ],
  visionary: [
    { name: "Jet Black", hex: "#000000", type: "Suit", desc: "モードの極致" },
    { name: "Dark Mono", hex: "#1A1A1A", type: "Shirt", desc: "同色の美学" },
    { name: "Silver", hex: "#94A3B8", type: "Accent", desc: "革新の輝き" }
  ],
  naturalist: [
    { name: "Olive Brown", hex: "#4A4036", type: "Suit", desc: "大地の安らぎ" },
    { name: "Beige Oxford", hex: "#F5F5DC", type: "Shirt", desc: "自然体な生成り" },
    { name: "Forest Green", hex: "#14532D", type: "Tie", desc: "調和の緑" }
  ]
};

// --- Archetypes & Recommended Options (Price Logic) ---
const STYLE_ARCHETYPES = {
  traditionalist: {
    id: 'TRAD',
    name: "The Traditionalist",
    desc: "英国の伝統と格式を重んじる、揺るぎない自信家。",
    icon: Anchor,
    color: "bg-indigo-900 text-white",
    baseStyle: "Authentic Classic",
    details: ["スリーピース推奨", "サイドベンツ", "チェンジポケット"],
    recOptions: {
      button: { name: "本水牛釦 (焼加工)", price: 4400 },
      lining: { name: "キュプラ裏地 (同色系)", price: 4400 },
      stitch: { name: "AMFステッチ", price: 3300 }
    },
    palette: COLOR_PALETTES.traditionalist,
    imageUrl: "/api/placeholder/400/400?text=TRAD"
  },
  modernist: {
    id: 'MOD',
    name: "The Modernist",
    desc: "都会的で洗練された、イタリアン・エレガンスの体現者。",
    icon: Feather,
    color: "bg-blue-600 text-white",
    baseStyle: "Neapolitan Soft",
    details: ["段返り3つボタン", "マニカカミーチャ", "パッチポケット"],
    recOptions: {
      button: { name: "ナット釦 (ブラウン)", price: 3300 },
      lining: { name: "柄裏地 (ペイズリー等)", price: 6600 },
      stitch: { name: "ダブルステッチ", price: 4400 }
    },
    palette: COLOR_PALETTES.modernist,
    imageUrl: "/api/placeholder/400/400?text=MOD"
  },
  executive: {
    id: 'EXEC',
    name: "The Executive",
    desc: "機能性と信頼性を武器に、世界を飛び回るリーダー。",
    icon: Briefcase,
    color: "bg-neutral-800 text-white",
    baseStyle: "Modern British",
    details: ["シングル2つボタン", "サイドベンツ", "ノッチドラペル"],
    recOptions: {
      button: { name: "本水牛釦 (黒/Hボタン)", price: 4400 },
      lining: { name: "キュプラ (シルバー/紺)", price: 4400 },
      stitch: { name: "AMFステッチ", price: 3300 }
    },
    palette: COLOR_PALETTES.executive,
    imageUrl: "/api/placeholder/400/400?text=EXEC"
  },
  visionary: {
    id: 'VIS',
    name: "The Visionary",
    desc: "常識にとらわれない、革新的でモードな開拓者。",
    icon: Zap,
    color: "bg-purple-700 text-white",
    baseStyle: "Avant-Garde Mode",
    details: ["シングル1つボタン", "ノーベント", "ピークドラペル"],
    recOptions: {
      button: { name: "メタル釦 / 本水牛", price: 5500 },
      lining: { name: "鮮やかな差し色 (赤/紫)", price: 4400 },
      stitch: { name: "なし (ミニマル)", price: 0 }
    },
    palette: COLOR_PALETTES.visionary,
    imageUrl: "/api/placeholder/400/400?text=VIS"
  },
  naturalist: {
    id: 'NAT',
    name: "The Naturalist",
    desc: "自然体で飾らない、素材の本質を知る賢者。",
    icon: UserCircle2,
    color: "bg-green-700 text-white",
    baseStyle: "Relaxed Tailoring",
    details: ["アンコン仕立て", "ドローコードパンツ", "パッチ＆フラップ"],
    recOptions: {
      button: { name: "ナット釦 (ベージュ)", price: 3300 },
      lining: { name: "アンコン仕様 (裏地なし)", price: 0 },
      stitch: { name: "ミシンステッチ", price: 2200 }
    },
    palette: COLOR_PALETTES.naturalist,
    imageUrl: "/api/placeholder/400/400?text=NAT"
  }
};

// --- Fabric Data (Profit Margin > 60% applied) ---
const FABRIC_LIBRARY = {
  omc: { 
    id: 'omc', name: "Order Made Collection", origin: "Japan/Global", 
    collections: [
      { name: "Standard Wool", weight: "250g", texture: { gloss: 3, thickness: 3, softness: 3 } },
      { name: "Functional Blend", weight: "240g", texture: { gloss: 2, thickness: 2, softness: 2 } }
    ], 
    tag: "High Cost-Performance", rankCode: 'E', basePrice: 96000 
  },
  vbc: { 
    id: 'vbc', name: "Vitale Barberis Canonico", origin: "Italy", 
    collections: [
      { name: "Perennial", weight: "260g", texture: { gloss: 4, thickness: 3, softness: 4 } },
      { name: "Revenge Super 150s", weight: "270g", texture: { gloss: 5, thickness: 3, softness: 5 } }
    ], 
    tag: "Global Standard", rankCode: 'S', basePrice: 130900
  },
  reda: { 
    id: 'reda', name: "REDA", origin: "Italy", 
    collections: [
      { name: "Silky Effect", weight: "250g", texture: { gloss: 5, thickness: 3, softness: 4 } },
      { name: "Ice Sense", weight: "230g", texture: { gloss: 3, thickness: 2, softness: 4 } }
    ], 
    tag: "Modern & Functional", rankCode: 'A', basePrice: 135900
  },
  zegna: { 
    id: 'zegna', name: "Ermenegildo Zegna", origin: "Italy", 
    collections: [
      { name: "Traveller", weight: "280g", texture: { gloss: 4, thickness: 4, softness: 5 } },
      { name: "Trofeo", weight: "240g", texture: { gloss: 5, thickness: 3, softness: 5 } }
    ], 
    tag: "The Masterpiece", rankCode: 'L', basePrice: 198000
  },
  dormeuil: { 
    id: 'dormeuil', name: "Dormeuil", origin: "UK", 
    collections: [
      { name: "Amadeus", weight: "310g", texture: { gloss: 5, thickness: 5, softness: 3 } },
      { name: "Exel", weight: "260g", texture: { gloss: 4, thickness: 3, softness: 4 } }
    ], 
    tag: "British Elegance", rankCode: 'L', basePrice: 185000
  }
};

// --- Extended Questions (12 items) ---
const QUESTIONS = [
  { id: 'q1', category: 'Philosophy', text: 'あなたのスーツに対する価値観は？', leftLabel: '伝統・格式・信頼', rightLabel: '革新・個性・自由', factor: 'modernity' },
  { id: 'q2', category: 'Style', text: '好みのシルエットバランスは？', leftLabel: '構築的・英国的(ハリ)', rightLabel: '柔らい・イタリア的(ドレープ)', factor: 'structure' },
  { id: 'q3', category: 'Pattern', text: '柄（デザイン）の好みは？', leftLabel: '無地・シンプル・控えめ', rightLabel: '柄物・華やか・主張', factor: 'boldness' },
  { id: 'q4', category: 'Usage', text: '生地の質感・機能の優先度は？', leftLabel: '通気性・ドライ(平織)', rightLabel: '光沢・しっとり(綾織)', factor: 'texture' },
  { id: 'q5', category: 'Budget', text: '今回の投資予算感', leftLabel: 'エントリー(コスパ)', rightLabel: 'ハイエンド(投資)', factor: 'budget' },
  // Anatomy
  { id: 'q6', category: 'Anatomy', text: '肩の形状に関する悩み', leftLabel: 'なで肩（下がる）', rightLabel: 'いかり肩（張る）', factor: 'shoulder_slope' },
  { id: 'q7', category: 'Anatomy', text: '姿勢の傾向', leftLabel: '猫背・前傾', rightLabel: '反り腰・胸張', factor: 'posture' },
  { id: 'q8', category: 'Anatomy', text: 'ヒップ・脚の形状', leftLabel: '平尻・細身', rightLabel: '出尻・筋肉質', factor: 'hip_shape' },
  // Detail Preferences
  { id: 'q9', category: 'Detail', text: 'ベスト（ジレ）の必要性', leftLabel: '不要 (2P)', rightLabel: '必要 (3P)', factor: 'vest_pref' },
  { id: 'q10', category: 'Detail', text: 'シャツのフィット感', leftLabel: 'ゆとり重視', rightLabel: 'タイト重視', factor: 'shirt_fit' },
  { id: 'q11', category: 'Detail', text: '合わせる靴のスタイル', leftLabel: '紐靴 (Oxford)', rightLabel: 'ローファー/スリッポン', factor: 'shoes_style' },
  { id: 'q12', category: 'Detail', text: 'パンツのシルエット', leftLabel: 'クラシック/ワイド', rightLabel: 'テーパード/スリム', factor: 'pants_fit' }
];

const PHYSICAL_TYPES = {
  A: { name: "Type A: Standard", code: 'A' },
  B: { name: "Type B: Stooped (猫背)", code: 'B' },
  C: { name: "Type C: Erect (反り腰)", code: 'C' },
  D: { name: "Type D: Sloping (なで肩)", code: 'D' },
  E: { name: "Type E: Square (いかり肩)", code: 'E' },
  F: { name: "Type F: Athletic (筋肉質)", code: 'F' }
};

const CORRECTION_MAP = {
  shoulder_slope: { low: ["撫で肩補正", "鎌深補正"], high: ["怒り肩補正", "ネックポイント下げ"] },
  posture: { low: ["屈身補正", "背幅出し", "前肩標準補正"], high: ["反身補正", "前丈出し", "胸ダーツ調整"] },
  hip_shape: { low: ["平尻補正", "渡り幅詰め"], high: ["出尻補正", "尻グリくり抜き", "Vカット仕様"] }
};

const App = () => {
  const [appState, setAppState] = useState('welcome'); // welcome, diagnosis, result, booking, lottery
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<any>(null);
  const [bookingData, setBookingData] = useState<any>({});
  const [lotteryResult, setLotteryResult] = useState<any>(null);

  // --- Logic Controllers ---
  const handleAnswer = (value: number) => {
    setAnswers(prev => ({ ...prev, [QUESTIONS[currentStep].factor]: value }));
  };

  const nextStep = () => {
    if (currentStep < QUESTIONS.length - 1) setCurrentStep(prev => prev + 1);
    else calculateResult();
  };

  const calculateResult = () => {
    setAppState('loading');
    setTimeout(() => {
      // 1. Archetype
      let archetype = STYLE_ARCHETYPES.executive;
      const { modernity, structure, boldness, texture, budget } = answers;
      if (modernity > 1) archetype = STYLE_ARCHETYPES.visionary;
      else if (modernity < -1 && structure > 0) archetype = STYLE_ARCHETYPES.traditionalist;
      else if (structure < -1 && texture > 0) archetype = STYLE_ARCHETYPES.modernist;
      else if (texture < -1 && boldness < 0) archetype = STYLE_ARCHETYPES.naturalist;
      
      // 2. Physical
      let physicalType = PHYSICAL_TYPES.A;
      const { shoulder_slope, posture, hip_shape } = answers;
      if (posture <= -2) physicalType = PHYSICAL_TYPES.B;
      else if (posture >= 2) physicalType = PHYSICAL_TYPES.C;
      else if (shoulder_slope <= -2) physicalType = PHYSICAL_TYPES.D;
      else if (shoulder_slope >= 2) physicalType = PHYSICAL_TYPES.E;
      else if (hip_shape >= 2) physicalType = PHYSICAL_TYPES.F;
      
      // 3. Fabric
      let fabricBrand = FABRIC_LIBRARY.vbc;
      if (budget <= -1) fabricBrand = FABRIC_LIBRARY.omc;
      else if (budget === 0) {
        if (texture > 0 || modernity > 0) fabricBrand = FABRIC_LIBRARY.reda;
        else fabricBrand = FABRIC_LIBRARY.vbc;
      } else if (budget >= 1) {
        if (structure > 0) fabricBrand = FABRIC_LIBRARY.dormeuil;
        else fabricBrand = FABRIC_LIBRARY.zegna;
      }

      let fabricCollection = fabricBrand.collections[0];
      if (texture > 0 && fabricBrand.collections[1]) fabricCollection = fabricBrand.collections[1];
      let weave = answers.texture < 0 ? { name: "平織", season: "S/S" } : { name: "綾織", season: "A/W" };

      // 4. Corrections
      let corrections: string[] = [];
      Object.keys(answers).forEach(key => {
        const val = answers[key];
        const map = CORRECTION_MAP[key as keyof typeof CORRECTION_MAP];
        if (map) {
          if (val <= -1 && map.low) corrections = [...corrections, ...map.low];
          if (val >= 1 && map.high) corrections = [...corrections, ...map.high];
        }
      });
      if (physicalType.code === 'A' && corrections.length === 0) corrections.push("基本体型補正 (Standard Adjustment)");

      // 5. Price Calculation
      const vestPrice = answers.vest_pref > 0 ? Math.round(fabricBrand.basePrice * 0.35) : 0; // Approx 35% for vest
      const optionTotal = Object.values(archetype.recOptions).reduce((sum: number, opt: any) => sum + opt.price, 0);
      const totalPrice = fabricBrand.basePrice + vestPrice + optionTotal;

      // Base ID
      const baseId = `${archetype.id}-${physicalType.code}-${fabricBrand.rankCode}`;

      setResult({ archetype, physicalType, fabricBrand, fabricCollection, weave, corrections, identityId: baseId, totalPrice, vestPrice, optionTotal });
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

  if (appState === 'welcome') return <WelcomeScreen onStart={() => setAppState('diagnosis')} />;
  if (appState === 'loading') return <LoadingScreen />;
  if (appState === 'diagnosis') return <QuestionScreen currentStep={currentStep} totalSteps={QUESTIONS.length} question={QUESTIONS[currentStep]} value={answers[QUESTIONS[currentStep].factor] || 0} onAnswer={handleAnswer} onNext={nextStep} onPrev={() => currentStep > 0 && setCurrentStep(c => c-1)} />;
  if (appState === 'result') return <ResultScreen result={result} onBook={() => setAppState('booking')} />;
  if (appState === 'booking') return <BookingForm result={result} onSubmit={startLottery} />;
  if (appState === 'lottery_spin' || appState === 'lottery_result') return <LotteryScreen result={lotteryResult} isSpinning={appState === 'lottery_spin'} bookingData={bookingData} diagnosisResult={result} />;

  return null;
};

// --- Components ---

const Header = () => (
  <header className="fixed top-0 left-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-neutral-100 py-4 px-6 flex justify-between items-center">
    <div className="flex items-center space-x-2">
      <Scissors className="w-5 h-5" />
      <span className="font-serif font-bold tracking-wider">REGALIS</span>
    </div>
    <span className="text-xs font-mono text-neutral-400 hidden md:block">SUIT IDENTITY SYSTEM v6.0 (CRM)</span>
  </header>
);

const WelcomeScreen = ({ onStart }: any) => (
  <div className="min-h-screen bg-neutral-900 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
    <div className="absolute inset-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1600609842388-27563a3655d1?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay" />
    <div className="relative z-10 max-w-2xl text-center space-y-8">
      <div className="inline-flex items-center justify-center p-3 border border-white/20 rounded-full mb-4">
        <Shield className="w-6 h-6 mr-3" />
        <span className="tracking-[0.3em] text-sm uppercase">{BRAND_INFO.concept}</span>
      </div>
      <h1 className="text-5xl md:text-7xl font-serif leading-tight">{BRAND_INFO.philosophy}</h1>
      <p className="text-neutral-300 text-lg md:text-xl max-w-lg mx-auto leading-relaxed">
        診断、価格提示、そしてID管理。<br/>
        あなたの属性と感性を統合した「スーツ・アイデンティティ」を発行し、<br/>
        パーソナルオーダーの履歴を管理します。
      </p>
      <button onClick={onStart} className="mt-12 group relative inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-neutral-900 transition-all duration-200 bg-white font-serif rounded-sm hover:bg-neutral-200">
        診断を開始する <ArrowRight className="ml-3 w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  </div>
);

const QuestionScreen = ({ currentStep, totalSteps, question, value, onAnswer, onNext, onPrev }: any) => (
  <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans pt-20">
    <Header />
    <main className="max-w-2xl mx-auto px-6 py-12">
      <div className="mb-12 text-center">
        <span className="text-xs font-bold tracking-widest text-neutral-500 uppercase">Question {currentStep + 1} / {totalSteps}</span>
        <h2 className="text-2xl md:text-3xl font-serif mt-4 mb-6">{question.text}</h2>
        <div className="inline-block px-3 py-1 bg-neutral-100 text-neutral-500 text-xs rounded-full uppercase tracking-widest">
          {question.category} Axis
        </div>
      </div>
      <div className="bg-white p-8 rounded-2xl shadow-xl border border-neutral-100">
        <div className="space-y-10 py-6">
          <div className="relative h-2 bg-neutral-100 rounded-full">
            <div className="absolute top-0 left-0 w-full h-full flex justify-between px-1">
              {[0, 1, 2, 3, 4].map((i) => <div key={i} className="w-0.5 h-2 bg-neutral-300 rounded-full mt-3" />)}
            </div>
            <input type="range" min="-2" max="2" step="1" value={value} onChange={(e) => onAnswer(parseInt(e.target.value))} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
            <div className="absolute top-1/2 -translate-y-1/2 h-2 bg-neutral-900 rounded-l-full transition-all duration-300" style={{ width: `${((value + 2) / 4) * 100}%` }} />
            <div className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-neutral-900 rounded-full shadow-lg border-2 border-white transition-all duration-300 pointer-events-none" style={{ left: `calc(${((value + 2) / 4) * 100}% - 12px)` }} />
          </div>
          <div className="flex justify-between text-sm font-medium pt-2">
            <div className={`w-1/2 pr-4 ${value < 0 ? 'text-neutral-900' : 'text-neutral-400'}`}>{question.leftLabel}</div>
            <div className={`w-1/2 pl-4 text-right ${value > 0 ? 'text-neutral-900' : 'text-neutral-400'}`}>{question.rightLabel}</div>
          </div>
        </div>
      </div>
      <div className="flex justify-between mt-12 items-center">
        <button onClick={onPrev} disabled={currentStep === 0} className={`flex items-center text-sm font-medium transition-colors ${currentStep === 0 ? 'text-neutral-300' : 'text-neutral-600 hover:text-black'}`}>
          <ChevronLeft className="w-4 h-4 mr-1" /> Back
        </button>
        <button onClick={onNext} className="group flex items-center bg-neutral-900 text-white px-8 py-4 rounded-full font-medium transition-all hover:bg-neutral-800 shadow-lg">
          {currentStep === totalSteps - 1 ? '診断結果を見る' : 'Next Question'} <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </main>
  </div>
);

const LoadingScreen = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-900 text-white font-sans">
    <Loader2 className="w-16 h-16 animate-spin text-white mb-8" />
    <h3 className="text-2xl font-serif mb-4 tracking-wider">CALCULATING ESTIMATE...</h3>
    <div className="space-y-2 text-center text-neutral-400 text-sm font-mono">
      <p>Selecting Best Fabric & Options...</p>
      <p>Computing Profit Margins...</p>
      <p>Generating Quote...</p>
    </div>
  </div>
);

const ResultScreen = ({ result, onBook }: any) => {
  const ArchetypeIcon = result.archetype.icon;
  const priceFormatter = new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' });

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900 font-sans pb-20 overflow-x-hidden">
      <Header />
      
      {/* 1. Identity Hero */}
      <div className={`relative w-full ${result.archetype.color} pt-24 pb-20 px-6`}>
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent scale-150" />
        <div className="max-w-6xl mx-auto relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-3/5">
            <div className="inline-flex items-center bg-white/10 px-4 py-2 rounded-full text-sm font-mono mb-6 backdrop-blur-sm border border-white/20">
              <Award className="w-4 h-4 mr-2" />
              <span>PRE-ID: <strong>{result.identityId}</strong></span>
            </div>
            <h1 className="text-5xl font-serif font-bold mb-4 flex items-center justify-center md:justify-start">
              <ArchetypeIcon className="w-10 h-10 mr-4 opacity-80" />
              {result.archetype.name}
            </h1>
            <p className="text-xl text-white/90 leading-relaxed mb-8 font-light">"{result.archetype.desc}"</p>
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20">
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-bold uppercase tracking-widest text-white/70">Estimated Price (Total)</span>
                <span className="text-4xl font-bold text-white">{priceFormatter.format(result.totalPrice)}</span>
              </div>
              <div className="text-xs text-white/50 text-right">
                Base: {priceFormatter.format(result.fabricBrand.basePrice)} + Options: {priceFormatter.format(result.optionTotal)}
                {result.vestPrice > 0 && ` + Vest: ${priceFormatter.format(result.vestPrice)}`}
              </div>
            </div>
          </div>
          <div className="md:w-2/5 flex justify-center">
             <div className="w-64 h-64 bg-white/10 backdrop-blur-md rounded-2xl border-2 border-white/20 shadow-2xl flex items-center justify-center relative overflow-hidden group"
                 style={{backgroundImage: `url(${result.archetype.imageUrl})`, backgroundSize: 'cover'}}>
              <ArchetypeIcon className="w-24 h-24 text-white opacity-20" />
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-4">
                 <span className="text-xs font-mono text-white/70">CHARACTER VISUAL</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Detail Grid */}
      <div className="max-w-6xl mx-auto px-6 -mt-10 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card A: Style & Palette */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-neutral-100">
             <div className="flex items-center mb-4 text-neutral-400 text-xs font-bold tracking-widest uppercase"><Palette className="w-4 h-4 mr-2"/> Palette & Style</div>
             <div className="space-y-4">
               {result.archetype.palette.map((col: any, idx: number) => (
                 <div key={idx} className="flex items-center justify-between">
                   <div className="flex items-center">
                     <div className="w-8 h-8 rounded shadow-sm mr-3" style={{backgroundColor: col.hex}}></div>
                     <span className="text-sm font-bold">{col.name}</span>
                   </div>
                   <span className="text-xs text-neutral-500">{col.type}</span>
                 </div>
               ))}
             </div>
          </div>

          {/* Card B: Fabric */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-neutral-100">
             <div className="flex items-center mb-4 text-neutral-400 text-xs font-bold tracking-widest uppercase"><Layers className="w-4 h-4 mr-2"/> Fabric Spec</div>
             <div className="mb-2"><h3 className="text-lg font-bold">{result.fabricBrand.name}</h3></div>
             <div className="text-sm text-neutral-600 mb-4">{result.fabricBrand.tag} / {result.fabricBrand.origin}</div>
             <div className="space-y-2 text-sm bg-neutral-50 p-3 rounded">
               <div className="flex justify-between"><span>Collection</span><span className="font-bold">{result.fabricCollection.name}</span></div>
               <div className="flex justify-between"><span>Weave</span><span className="font-bold">{result.weave.name}</span></div>
             </div>
          </div>

          {/* Card C: Options & Price Break */}
          <div className="bg-white p-6 rounded-xl shadow-lg border border-neutral-100">
             <div className="flex items-center mb-4 text-neutral-400 text-xs font-bold tracking-widest uppercase"><Gem className="w-4 h-4 mr-2"/> Included Options</div>
             <div className="space-y-3 text-sm">
                {Object.values(result.archetype.recOptions).map((opt: any, i: number) => (
                  <div key={i} className="flex justify-between items-center border-b border-dashed border-neutral-100 pb-2 last:border-0">
                    <span className="text-neutral-600">{opt.name}</span>
                    <span className="font-mono text-xs text-neutral-400">+{priceFormatter.format(opt.price)}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>
      </div>

      {/* 3. CTA */}
      <div className="mt-16 text-center px-6">
        <div className="inline-block bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 animate-bounce">
          <div className="flex items-center text-yellow-800 font-bold">
            <Ticket className="w-5 h-5 mr-2" />
            <span>予約完了で「1/200」の確率でスーツが無料になる抽選に参加可能！</span>
          </div>
        </div>
        <button onClick={onBook} className="w-full max-w-md mx-auto bg-neutral-900 text-white px-12 py-5 rounded-full font-bold text-lg shadow-xl hover:scale-105 transition-transform flex items-center justify-center">
          詳細情報を入力して予約に進む <ArrowRight className="ml-2 w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

const BookingForm = ({ result, onSubmit }: any) => {
  const [formData, setFormData] = useState<any>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Generate Full ID with customer attributes
    const fullId = `${result.identityId}-${formData.purpose?.substring(0,3).toUpperCase()}-${formData.location?.substring(0,3).toUpperCase()}`;
    onSubmit({ ...formData, fullId });
  };

  return (
    <div className="min-h-screen bg-neutral-50 font-sans py-20 px-6">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-neutral-900 text-white p-6">
          <h2 className="text-2xl font-serif font-bold flex items-center">
            <PenTool className="w-6 h-6 mr-3" /> Personal Order Sheet
          </h2>
          <p className="text-neutral-400 text-sm mt-2">
            より精密な提案のため、詳細な好みをお聞かせください。<br/>
            このシートは担当フィッターに事前に共有されます。
          </p>
        </div>
        
        <form className="p-8 space-y-8" onSubmit={handleSubmit}>
          {/* Section 1: Customer Info (CRM) */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-500 mb-4 border-b pb-2">01. Customer Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <input required name="name" onChange={handleInputChange} type="text" placeholder="お名前 (Full Name)" className="w-full p-3 border rounded focus:ring-2 ring-neutral-900 outline-none" />
               <input required name="email" onChange={handleInputChange} type="email" placeholder="メールアドレス (Email)" className="w-full p-3 border rounded focus:ring-2 ring-neutral-900 outline-none" />
               <input required name="phone" onChange={handleInputChange} type="tel" placeholder="電話番号 (Phone)" className="w-full p-3 border rounded focus:ring-2 ring-neutral-900 outline-none" />
               <div className="relative">
                 <Calendar className="absolute top-3 left-3 w-5 h-5 text-neutral-400" />
                 <input required name="date" onChange={handleInputChange} type="date" className="w-full p-3 pl-10 border rounded focus:ring-2 ring-neutral-900 outline-none" />
               </div>
            </div>
            {/* Expanded CRM Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
               <div className="relative">
                 <UserCircle2 className="absolute top-3 left-3 w-5 h-5 text-neutral-400" />
                 <input required name="age" onChange={handleInputChange} type="number" placeholder="年齢 (Age)" className="w-full p-3 pl-10 border rounded focus:ring-2 ring-neutral-900 outline-none" />
               </div>
               <div className="relative">
                 <Building2 className="absolute top-3 left-3 w-5 h-5 text-neutral-400" />
                 <input required name="affiliation" onChange={handleInputChange} type="text" placeholder="職業/所属 (Occupation)" className="w-full p-3 pl-10 border rounded focus:ring-2 ring-neutral-900 outline-none" />
               </div>
               <div className="relative">
                 <MapPin className="absolute top-3 left-3 w-5 h-5 text-neutral-400" />
                 <input required name="location" onChange={handleInputChange} type="text" placeholder="居住地 (Location)" className="w-full p-3 pl-10 border rounded focus:ring-2 ring-neutral-900 outline-none" />
               </div>
               <div className="relative">
                 <Tag className="absolute top-3 left-3 w-5 h-5 text-neutral-400" />
                 <select required name="purpose" onChange={handleInputChange} className="w-full p-3 pl-10 border rounded focus:ring-2 ring-neutral-900 outline-none bg-white">
                   <option value="">主な用途 (Purpose)</option>
                   <option value="Business">ビジネス (日常)</option>
                   <option value="Executive">ビジネス (勝負服)</option>
                   <option value="Wedding_Groom">結婚式 (新郎)</option>
                   <option value="Wedding_Guest">結婚式 (参列)</option>
                   <option value="ComingOfAge">成人式</option>
                   <option value="Casual">普段着/カジュアル</option>
                 </select>
               </div>
            </div>
          </div>

          {/* Section 2: Detail Preferences */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-500 mb-4 border-b pb-2">02. Detail Preferences</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <label className="block">
                <span className="text-neutral-700 font-bold mb-1 block">Jacket Lapel</span>
                <select name="lapel" onChange={handleInputChange} className="w-full p-3 bg-neutral-50 border rounded"><option>ノッチドラペル (標準)</option><option>ピークドラペル (華やか)</option><option>おまかせ</option></select>
              </label>
              <label className="block">
                <span className="text-neutral-700 font-bold mb-1 block">Vent Style</span>
                <select name="vent" onChange={handleInputChange} className="w-full p-3 bg-neutral-50 border rounded"><option>サイドベンツ (動きやすい)</option><option>センターベント (スポーティ)</option><option>ノーベント (フォーマル)</option></select>
              </label>
              <label className="block">
                <span className="text-neutral-700 font-bold mb-1 block">Pants Tuck</span>
                <select name="tuck" onChange={handleInputChange} className="w-full p-3 bg-neutral-50 border rounded"><option>ノータック (スリム)</option><option>ワンタック (標準)</option><option>ツータック (クラシック)</option></select>
              </label>
              <label className="block">
                <span className="text-neutral-700 font-bold mb-1 block">Pants Hem</span>
                <select name="hem" onChange={handleInputChange} className="w-full p-3 bg-neutral-50 border rounded"><option>シングル (すっきり)</option><option>ダブル (重厚感)</option></select>
              </label>
              <label className="block">
                <span className="text-neutral-700 font-bold mb-1 block">Shirt Collar</span>
                <select name="collar" onChange={handleInputChange} className="w-full p-3 bg-neutral-50 border rounded"><option>ワイド (標準)</option><option>カッタウェイ (ノータイ向)</option><option>ボタンダウン</option><option>タブカラー</option></select>
              </label>
              <label className="block">
                <span className="text-neutral-700 font-bold mb-1 block">Shoes Size (Approx)</span>
                <select name="shoes" onChange={handleInputChange} className="w-full p-3 bg-neutral-50 border rounded"><option>24.5cm</option><option>25.0cm</option><option>25.5cm</option><option>26.0cm</option><option>26.5cm</option><option>27.0cm</option><option>27.5cm+</option></select>
              </label>
            </div>
          </div>

          {/* Section 3: Options Check */}
          <div>
             <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-500 mb-4 border-b pb-2">03. Confirm Options</h3>
             <div className="bg-yellow-50 p-4 rounded border border-yellow-100 mb-4">
               <p className="text-xs text-yellow-800 mb-2 font-bold">Recommended for {result.archetype.name}:</p>
               <div className="flex flex-wrap gap-2">
                 <span className="bg-white px-2 py-1 rounded text-xs border shadow-sm">{result.archetype.recOptions.button.name}</span>
                 <span className="bg-white px-2 py-1 rounded text-xs border shadow-sm">{result.archetype.recOptions.lining.name}</span>
               </div>
             </div>
             <label className="flex items-center space-x-3 p-4 border rounded hover:bg-neutral-50 cursor-pointer">
               <input type="checkbox" className="w-5 h-5 text-neutral-900" defaultChecked />
               <div>
                 <span className="font-bold block">推奨オプションを含める</span>
                 <span className="text-xs text-neutral-500">担当者と相談して変更可能です。</span>
               </div>
             </label>
          </div>

          <button type="submit" className="w-full bg-neutral-900 text-white py-4 rounded-lg font-bold text-lg hover:bg-neutral-800 transition-colors shadow-lg flex items-center justify-center">
            <CheckSquare className="w-5 h-5 mr-2" />
            予約を確定して抽選に進む
          </button>
        </form>
      </div>
    </div>
  );
};

const LotteryScreen = ({ result, isSpinning, bookingData, diagnosisResult }: any) => {
  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col items-center justify-center p-6 text-center overflow-hidden relative">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
      
      {isSpinning ? (
        <div className="animate-pulse">
           <Loader2 className="w-24 h-24 text-yellow-500 animate-spin mb-8 mx-auto" />
           <h2 className="text-4xl font-serif font-bold text-white mb-4">Drawing Your Destiny...</h2>
           <p className="text-neutral-400">1/200の確率...抽選中</p>
        </div>
      ) : (
        <div className="relative z-10 max-w-lg w-full bg-white rounded-2xl p-8 shadow-2xl animate-in zoom-in duration-500">
           {result ? (
             // WINNER
             <div className="text-center">
                <div className="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-bounce">
                  <Gift className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-4xl font-bold text-neutral-900 mb-2">CONGRATULATIONS!</h2>
                <p className="text-lg text-neutral-600 mb-6">You won the Golden Ticket!</p>
                <div className="bg-neutral-100 p-4 rounded-lg border-2 border-yellow-400 border-dashed mb-6">
                  <p className="font-mono font-bold text-xl tracking-widest text-neutral-800">FREE-SUIT-2025-WIN</p>
                </div>
                <p className="text-xs text-neutral-400">※来店時にこの画面をスタッフにご提示ください。</p>
             </div>
           ) : (
             // LOSER (Standard Booking)
             <div className="text-center">
                <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-neutral-400" />
                </div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-2">Reservation Confirmed</h2>
                <p className="text-neutral-500 mb-6">残念ながら抽選は外れましたが、<br/>予約は正常に完了しました。</p>
                <div className="bg-neutral-50 p-4 rounded-lg text-left text-sm space-y-2 mb-6">
                   <div className="flex justify-between"><span>Status:</span><span className="font-bold text-green-600">Confirmed</span></div>
                   <div className="flex justify-between"><span>Management ID:</span><span className="font-bold text-indigo-600">{bookingData.fullId}</span></div>
                   <div className="flex justify-between"><span>Benefit:</span><span className="font-bold">Advanced Counseling</span></div>
                </div>
                
                {/* Debug Data View (For Admin) */}
                <details className="text-left text-xs text-neutral-400 mt-8">
                  <summary className="cursor-pointer hover:text-neutral-600">System Data (Debug)</summary>
                  <pre className="bg-neutral-900 text-green-400 p-4 rounded mt-2 overflow-x-auto">
                    {JSON.stringify({
                      customer: {
                        name: bookingData.name,
                        age: bookingData.age,
                        affiliation: bookingData.affiliation,
                        location: bookingData.location,
                        purpose: bookingData.purpose
                      },
                      diagnosis: {
                        archetype: diagnosisResult.archetype.name,
                        physical: diagnosisResult.physicalType.name,
                        fabric: diagnosisResult.fabricBrand.name
                      },
                      estimate: diagnosisResult.totalPrice
                    }, null, 2)}
                  </pre>
                </details>

                <button onClick={() => window.location.reload()} className="text-neutral-400 hover:text-neutral-900 underline text-sm mt-4 block mx-auto">トップに戻る</button>
             </div>
           )}
        </div>
      )}
    </div>
  );
};

export default App;
