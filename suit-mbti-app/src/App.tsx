import React, { useState } from 'react';
import { 
  Scissors, ArrowRight, CheckCircle, ChevronLeft, Loader2, Award, Zap, Anchor, Feather, Briefcase, UserCircle2, Gem, PenTool, Ticket, CheckSquare,
  TrendingDown, Info, Crown, ThumbsUp, Clock, MousePointer2, Ruler
} from 'lucide-react';

// --- Branding & Config ---
const BRAND_INFO = {
  name: "Regalis Japan Group",
  concept: "現代の呉服商",
  philosophy: "鎧を砕く / Suit Identity",
  sub: "次世代型ビスポークプラットフォーム"
};

const LOTTERY_PROBABILITY = 200;

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

// --- Archetypes ---
const STYLE_ARCHETYPES = {
  traditionalist: {
    id: 'TRAD', name: "The Traditionalist", desc: "英国の伝統と格式を重んじる、揺るぎない自信家。",
    icon: Anchor, color: "bg-indigo-900 text-white", baseStyle: "Authentic Classic",
    recOptions: { button: { name: "本水牛釦", price: 4400 }, lining: { name: "キュプラ", price: 4400 } },
    palette: COLOR_PALETTES.traditionalist, imageUrl: "/api/placeholder/400/400?text=TRAD"
  },
  modernist: {
    id: 'MOD', name: "The Modernist", desc: "都会的で洗練された、イタリアン・エレガンスの体現者。",
    icon: Feather, color: "bg-blue-600 text-white", baseStyle: "Neapolitan Soft",
    recOptions: { button: { name: "ナット釦", price: 3300 }, lining: { name: "柄裏地", price: 6600 } },
    palette: COLOR_PALETTES.modernist, imageUrl: "/api/placeholder/400/400?text=MOD"
  },
  executive: {
    id: 'EXEC', name: "The Executive", desc: "機能性と信頼性を武器に、世界を飛び回るリーダー。",
    icon: Briefcase, color: "bg-neutral-800 text-white", baseStyle: "Modern British",
    recOptions: { button: { name: "本水牛釦", price: 4400 }, lining: { name: "キュプラ", price: 4400 } },
    palette: COLOR_PALETTES.executive, imageUrl: "/api/placeholder/400/400?text=EXEC"
  },
  visionary: {
    id: 'VIS', name: "The Visionary", desc: "常識にとらわれない、革新的でモードな開拓者。",
    icon: Zap, color: "bg-purple-700 text-white", baseStyle: "Avant-Garde Mode",
    recOptions: { button: { name: "メタル釦", price: 5500 }, lining: { name: "赤裏地", price: 4400 } },
    palette: COLOR_PALETTES.visionary, imageUrl: "/api/placeholder/400/400?text=VIS"
  },
  naturalist: {
    id: 'NAT', name: "The Naturalist", desc: "自然体で飾らない、素材の本質を知る賢者。",
    icon: UserCircle2, color: "bg-green-700 text-white", baseStyle: "Relaxed Tailoring",
    recOptions: { button: { name: "ナット釦", price: 3300 }, lining: { name: "アンコン", price: 0 } },
    palette: COLOR_PALETTES.naturalist, imageUrl: "/api/placeholder/400/400?text=NAT"
  }
};

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
  vbc_rev: {
    id: 'vbc_rev', name: "V.B. Canonico (Revenge)", origin: "Italy",
    desc: "ワンランク上のSuper 150s。圧倒的な滑らかさ。",
    basePrice: 145000, marketPrice: 190000,
    type: "Milestone",
    features: ["Super 150s", "極上の肌触り", "深い光沢"]
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

// --- Question Definitions ---
// Scale: -2 (Left Strong), -1 (Left Mild), 0 (Neutral), 1 (Right Mild), 2 (Right Strong)

const MANDATORY_QUESTIONS = [
  { id: 'q1', category: 'Philosophy', text: 'スーツに対する価値観', left: '伝統・格式', right: '革新・自由', factor: 'modernity' },
  { id: 'q2', category: 'Style', text: '好みのシルエット', left: '構築的 (ハリ)', right: '柔らかい (ドレープ)', factor: 'structure' },
  { id: 'q3', category: 'Pattern', text: '柄の好み', left: '無地・シンプル', right: '柄物・華やか', factor: 'boldness' },
  { id: 'q4', category: 'Usage', text: '生地の質感', left: 'ドライ・マット', right: '光沢・しっとり', factor: 'texture' },
  { id: 'q5', category: 'Environment', text: '着用シーズン', left: '夏中心・通気性', right: '冬中心・保温性', factor: 'seasonality' },
  { id: 'q6', category: 'Budget', text: '予算感 (Cost vs Investment)', left: 'コスパ重視 (~10万)', right: '投資重視 (20万~)', factor: 'budget' },
  { id: 'q7', category: 'Anatomy', text: '肩の形状 (Shoulder)', left: 'なで肩 (下がる)', right: 'いかり肩 (張る)', factor: 'shoulder_slope' },
  { id: 'q8', category: 'Anatomy', text: '姿勢 (Posture)', left: '猫背・前傾', right: '反り腰・胸張', factor: 'posture' },
  { id: 'q9', category: 'Anatomy', text: 'チェストドロップ', left: '細身・フラット', right: '筋肉質・厚み', factor: 'chest_drop' },
  { id: 'q10', category: 'Anatomy', text: 'ヒップ・脚', left: '平尻・細身', right: '出尻・ガッチリ', factor: 'hip_shape' },
  { id: 'q11', category: 'Detail', text: 'ベスト (Vest)', left: '不要 (2P)', right: '必要 (3P)', factor: 'vest_pref' },
  { id: 'q12', category: 'Detail', text: 'シャツフィット', left: 'ゆとり重視', right: 'タイト重視', factor: 'shirt_fit' },
  { id: 'q13', category: 'Detail', text: '靴のスタイル', left: '紐靴 (Oxford)', right: 'ローファー', factor: 'shoes_style' },
  { id: 'q14', category: 'Detail', text: 'パンツライン', left: 'クラシック', right: 'テーパード', factor: 'pants_fit' },
  { id: 'q15', category: 'Detail', text: '裾の仕上げ', left: 'シングル', right: 'ダブル', factor: 'hem_finish' },
];

const OPTIONAL_QUESTIONS = [
  { id: 'o1', category: 'Advanced', text: '時計のサイズ (左手首)', left: 'しない/薄型', right: '大型/ダイバーズ', factor: 'watch_size' },
  { id: 'o2', category: 'Advanced', text: 'デスクワークの姿勢', left: '前傾・PC作業多', right: '後傾・会議多', factor: 'desk_posture' },
  { id: 'o3', category: 'Advanced', text: '運転の頻度', left: 'ほぼしない', right: '毎日する', factor: 'driving_freq' },
  { id: 'o4', category: 'Advanced', text: '首の長さ', left: '短い・詰まる', right: '長い・抜ける', factor: 'neck_length' },
  { id: 'o5', category: 'Advanced', text: '腕の長さ (裄丈)', left: '短め', right: '長め', factor: 'arm_length' },
  { id: 'o6', category: 'Advanced', text: '太もも (ワタリ)', left: '細い', right: '競輪/サッカー型', factor: 'thigh_size' },
  { id: 'o7', category: 'Advanced', text: 'ふくらはぎ', left: '細い', right: '張っている', factor: 'calf_size' },
  { id: 'o8', category: 'Advanced', text: 'O脚・X脚', left: 'O脚気味', right: 'X脚気味', factor: 'leg_bow' },
  { id: 'o9', category: 'Advanced', text: 'ポケットの角度', left: '水平 (標準)', right: '斜め (スラント)', factor: 'pocket_angle' },
  { id: 'o10', category: 'Advanced', text: '裏地の好み', left: '通気性 (背抜き)', right: '耐久性 (総裏)', factor: 'lining_type' },
];

const PHYSICAL_TYPES = {
  A: { name: "Type A: Standard", code: 'A' },
  B: { name: "Type B: Stooped", code: 'B' },
  C: { name: "Type C: Erect", code: 'C' },
  D: { name: "Type D: Sloping", code: 'D' },
  E: { name: "Type E: Square", code: 'E' },
  F: { name: "Type F: Athletic", code: 'F' }
};

const CORRECTION_MAP = {
  shoulder_slope: { low: ["撫で肩補正", "鎌深補正"], high: ["怒り肩補正", "ネックポイント下げ"] },
  posture: { low: ["屈身補正", "背幅出し"], high: ["反身補正", "前丈出し"] },
  hip_shape: { low: ["平尻補正", "渡り幅詰め"], high: ["出尻補正", "Vカット仕様"] },
  watch_size: { high: ["左袖口幅出し (+1.0cm)", "カフス周り調整"] },
  neck_length: { low: ["カラー低寸 (-0.5cm)"], high: ["カラー高寸 (+0.5cm)"] },
  driving_freq: { high: ["背幅ゆとり追加", "サイドベンツ推奨"] },
  thigh_size: { high: ["ワタリ幅出し", "シック補強"] },
  leg_bow: { low: ["O脚補正センター移動"], high: ["X脚補正"] }
};

const App = () => {
  const [appState, setAppState] = useState('welcome');
  const [currentStep, setCurrentStep] = useState(0);
  const [isOptionalPhase, setIsOptionalPhase] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<any>(null);
  const [selectedPlan, setSelectedPlan] = useState<string>('milestone');
  const [bookingData, setBookingData] = useState<any>({});
  const [lotteryResult, setLotteryResult] = useState<any>(null);

  const currentQuestions = isOptionalPhase ? OPTIONAL_QUESTIONS : MANDATORY_QUESTIONS;
  const totalQuestions = MANDATORY_QUESTIONS.length + OPTIONAL_QUESTIONS.length;
  const progress = ((Object.keys(answers).length) / totalQuestions) * 100;

  // Auto-advance handleAnswer
  const handleAnswer = (value: number) => {
    const factor = currentQuestions[currentStep].factor;
    setAnswers(prev => ({ ...prev, [factor]: value }));
    
    setTimeout(() => {
      if (currentStep < currentQuestions.length - 1) {
        setCurrentStep(curr => curr + 1);
      } else {
        if (!isOptionalPhase) {
          // Mandatory finished, ask for optional
          setAppState('optional_prompt');
        } else {
          // All finished
          calculateResult();
        }
      }
    }, 300); // Slight delay for visual feedback
  };

  const skipOptional = () => {
    calculateResult();
  };

  const startOptional = () => {
    setIsOptionalPhase(true);
    setCurrentStep(0);
    setAppState('diagnosis');
  };

  const calculateResult = () => {
    setAppState('loading');
    setTimeout(() => {
      // 1. Archetype Logic
      let archetype = STYLE_ARCHETYPES.executive;
      const { modernity, structure, boldness, texture } = answers;
      if (modernity > 1) archetype = STYLE_ARCHETYPES.visionary;
      else if (modernity < -1 && structure > 0) archetype = STYLE_ARCHETYPES.traditionalist;
      else if (structure < -1 && texture > 0) archetype = STYLE_ARCHETYPES.modernist;
      else if (texture < -1 && boldness < 0) archetype = STYLE_ARCHETYPES.naturalist;
      
      // 2. Physical Type Logic
      let physicalType = PHYSICAL_TYPES.A;
      const { shoulder_slope, posture, hip_shape } = answers;
      if (posture <= -2) physicalType = PHYSICAL_TYPES.B;
      else if (posture >= 2) physicalType = PHYSICAL_TYPES.C;
      else if (shoulder_slope <= -2) physicalType = PHYSICAL_TYPES.D;
      else if (shoulder_slope >= 2) physicalType = PHYSICAL_TYPES.E;
      else if (hip_shape >= 2) physicalType = PHYSICAL_TYPES.F;

      // 3. Plans Logic
      const vestCostRate = answers.vest_pref > 0 ? 0.35 : 0;
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

      const isSoft = structure < 0;
      const isGlossy = texture > 0;
      const valueFabric = FABRIC_PLANS.omc;
      const milestoneFabric = isGlossy ? FABRIC_PLANS.reda_silky : FABRIC_PLANS.vbc_n;
      const authenticFabric = isSoft ? FABRIC_PLANS.zegna : FABRIC_PLANS.dormeuil;

      const plans = {
        value: createPlanData(valueFabric, "Best Value", "圧倒的コストパフォーマンス"),
        milestone: createPlanData(milestoneFabric, "Milestone", "日常〜オフィシャルの最適解"),
        authentic: createPlanData(authenticFabric, "Authentic", "最高峰の格式と品質")
      };

      // 4. Corrections Logic (Extended)
      let corrections: string[] = [];
      Object.keys(answers).forEach(key => {
        const val = answers[key];
        // Check if this key exists in CORRECTION_MAP
        const mapKey = key as keyof typeof CORRECTION_MAP;
        if (CORRECTION_MAP[mapKey]) {
          const map = CORRECTION_MAP[mapKey];
          if (val <= -1 && 'low' in map && map.low) corrections = [...corrections, ...map.low];
          if (val >= 1 && 'high' in map && map.high) corrections = [...corrections, ...map.high];
        }
      });
      if (physicalType.code === 'A' && corrections.length === 0) corrections.push("基本体型補正");

      const identityId = `${archetype.id}-${physicalType.code}`;

      setResult({ archetype, physicalType, plans, corrections, identityId });
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

  // -- Render Logic --
  if (appState === 'welcome') return <WelcomeScreen onStart={() => setAppState('diagnosis')} />;
  if (appState === 'loading') return <LoadingScreen />;
  if (appState === 'optional_prompt') return <OptionalPromptScreen onYes={startOptional} onNo={skipOptional} />;
  if (appState === 'diagnosis') return (
    <ClickableQuestionScreen 
      question={currentQuestions[currentStep]} 
      currentStep={isOptionalPhase ? MANDATORY_QUESTIONS.length + currentStep : currentStep} 
      totalSteps={totalQuestions}
      onAnswer={handleAnswer}
      onBack={() => {
        if (currentStep > 0) setCurrentStep(c => c - 1);
        else if (isOptionalPhase) {
          setIsOptionalPhase(false);
          setCurrentStep(MANDATORY_QUESTIONS.length - 1);
        }
      }}
      progress={progress}
    />
  );
  if (appState === 'result') return <ResultScreen result={result} selectedPlan={selectedPlan} setSelectedPlan={setSelectedPlan} onBook={() => setAppState('booking')} />;
  if (appState === 'booking') return <BookingForm result={result} selectedPlan={selectedPlan} onSubmit={startLottery} />;
  if (appState === 'lottery_spin' || appState === 'lottery_result') return <LotteryScreen result={lotteryResult} isSpinning={appState === 'lottery_spin'} bookingData={bookingData} diagnosisResult={result} selectedPlan={selectedPlan} />;

  return null;
};

// --- UI Components ---

const Header = ({ progress }: { progress?: number }) => (
  <header className="fixed top-[80px] left-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-neutral-100">
    {progress !== undefined && (
      <div className="h-1 w-full bg-neutral-100">
        <div className="h-full bg-indigo-600 transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>
    )}
    <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <Scissors className="w-5 h-5" />
        <span className="font-serif font-bold tracking-wider">REGALIS</span>
      </div>
      <span className="text-xs font-mono text-neutral-400 hidden md:block">SUIT IDENTITY SYSTEM v9.0</span>
    </div>
  </header>
);

const WelcomeScreen = ({ onStart }: any) => (
  <div className="min-h-screen bg-neutral-900 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans" style={{ paddingTop: '80px' }}>
    <div className="absolute inset-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1600609842388-27563a3655d1?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay" />
    <div className="relative z-10 max-w-2xl text-center space-y-8">
      <div className="inline-flex items-center justify-center p-3 border border-white/20 rounded-full mb-4">
        <Clock className="w-6 h-6 mr-3" />
        <span className="tracking-[0.3em] text-sm uppercase">EST. TIME: 3 MIN</span>
      </div>
      <h1 className="text-5xl md:text-7xl font-serif leading-tight">{BRAND_INFO.philosophy}</h1>
      <p className="text-neutral-300 text-lg md:text-xl max-w-lg mx-auto leading-relaxed">
        15問の必須診断＋10問のプロフェッショナル診断。<br/>
        クリックだけの高速操作で、<br/>
        あなたに最適な「適正価格プラン」を導き出します。
      </p>
      <button onClick={onStart} className="mt-12 group relative inline-flex items-center justify-center px-12 py-5 text-lg font-bold text-neutral-900 transition-all duration-200 bg-white font-serif rounded-full hover:bg-neutral-200 hover:scale-105 shadow-xl">
        <MousePointer2 className="w-5 h-5 mr-2" />
        診断を開始する
      </button>
    </div>
  </div>
);

const OptionalPromptScreen = ({ onYes, onNo }: any) => (
  <div className="min-h-screen bg-indigo-900 text-white flex flex-col items-center justify-center p-6 text-center">
    <h2 className="text-3xl font-serif mb-6">基本診断が完了しました。</h2>
    <p className="text-indigo-200 mb-12 max-w-md mx-auto">
      より精度の高い補正（袖丈、O脚補正、時計の干渉など）をご希望の場合、
      追加の10問（約1分）にお答えください。
    </p>
    <div className="flex flex-col md:flex-row gap-4 w-full max-w-md">
      <button onClick={onYes} className="flex-1 bg-white text-indigo-900 py-4 rounded-xl font-bold hover:bg-indigo-50 transition-all shadow-lg flex items-center justify-center">
        <CheckSquare className="w-5 h-5 mr-2" /> 詳細診断へ進む (+1分)
      </button>
      <button onClick={onNo} className="flex-1 border border-indigo-400 text-indigo-200 py-4 rounded-xl font-bold hover:bg-indigo-800 transition-all">
        結果を見る
      </button>
    </div>
  </div>
);

// --- CLICKABLE OPTION COMPONENT ---
const ClickableOption = ({ value, label, onClick }: { value: number, label: string, onClick: (v: number) => void }) => {
  return (
    <button
      onClick={() => onClick(value)}
      className={`
        group relative w-full p-4 rounded-xl border transition-all duration-200 ease-out
        hover:border-indigo-500 hover:shadow-[0_0_15px_rgba(99,102,241,0.4)] hover:-translate-y-1
        active:scale-95 active:shadow-[0_0_20px_rgba(99,102,241,0.6)] active:border-indigo-600
        flex flex-col items-center justify-center gap-2 bg-white shadow-sm
      `}
    >
      <div className={`w-1 rounded-full bg-indigo-500 transition-all duration-300 group-hover:h-8 group-hover:opacity-100 opacity-30 ${Math.abs(value) === 2 ? 'h-8' : Math.abs(value) === 1 ? 'h-5' : 'h-3'}`}></div>
      <span className="font-bold text-sm text-neutral-700 group-hover:text-indigo-700">{label}</span>
    </button>
  );
};

const ClickableQuestionScreen = ({ question, currentStep, totalSteps, onAnswer, onBack, progress }: any) => {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans pt-32 pb-10">
      <Header progress={progress} />
      <main className="max-w-xl mx-auto px-6 py-8 flex flex-col min-h-[80vh]">
        <div className="flex-1 flex flex-col justify-center">
          <div className="mb-8 text-center">
            <span className="text-xs font-bold tracking-widest text-neutral-400 uppercase">
              Q{currentStep + 1} / {totalSteps} • {question.category}
            </span>
            <h2 className="text-2xl md:text-3xl font-serif mt-2 mb-4 font-bold">{question.text}</h2>
          </div>

          <div className="space-y-3">
            {/* 5-Step Options */}
            <div className="grid grid-cols-1 gap-3">
              <ClickableOption value={-2} label={`<<< ${question.left} (強く)`} onClick={onAnswer} />
              <ClickableOption value={-1} label={`< ${question.left} (やや)`} onClick={onAnswer} />
              <ClickableOption value={0} label="どちらでもない / 標準" onClick={onAnswer} />
              <ClickableOption value={1} label={`${question.right} (やや) >`} onClick={onAnswer} />
              <ClickableOption value={2} label={`${question.right} (強く) >>>`} onClick={onAnswer} />
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-start">
          <button onClick={onBack} disabled={currentStep === 0} className={`flex items-center text-sm font-medium transition-colors ${currentStep === 0 ? 'opacity-0' : 'text-neutral-400 hover:text-black'}`}>
            <ChevronLeft className="w-4 h-4 mr-1" /> 戻る
          </button>
        </div>
      </main>
    </div>
  );
};

const LoadingScreen = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-900 text-white font-sans">
    <Loader2 className="w-16 h-16 animate-spin text-white mb-8" />
    <h3 className="text-2xl font-serif mb-4 tracking-wider">ANALYZING 25 DATA POINTS...</h3>
    <div className="space-y-2 text-center text-neutral-400 text-sm font-mono">
      <p>Calculating Biometric Fit...</p>
      <p>Optimizing Cost Performance...</p>
      <p>Generating Strategic Plans...</p>
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
      className={`relative cursor-pointer rounded-xl p-6 transition-all duration-300 border-2 flex flex-col h-full
        ${isSelected 
          ? 'border-indigo-600 bg-indigo-50 shadow-xl scale-105 z-10' 
          : 'border-neutral-100 bg-white shadow-md hover:border-indigo-200'
        }
      `}
    >
      {isSelected && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center">
          <CheckCircle className="w-3 h-3 mr-1" /> SELECTED
        </div>
      )}
      
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className={`text-xs font-bold uppercase tracking-widest px-2 py-1 rounded 
            ${isValue ? 'bg-green-100 text-green-800' : isAuthentic ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'}`}>
            {plan.title}
          </span>
          {isValue && <ThumbsUp className="w-4 h-4 text-green-600" />}
          {isAuthentic && <Crown className="w-4 h-4 text-amber-500" />}
        </div>
        <h3 className="text-lg font-serif font-bold text-neutral-900 leading-tight">{plan.fabric.name}</h3>
        <p className="text-xs text-neutral-500 mt-1">{plan.subtitle}</p>
      </div>

      <div className="mt-auto">
        <div className="text-xs text-neutral-400 mb-1 flex justify-between">
          <span>市場相場:</span>
          <span className="line-through decoration-red-400">{priceFormatter.format(plan.marketTotal)}</span>
        </div>
        <div className="flex items-end justify-between border-t border-neutral-200 pt-3">
          <div>
            <span className="block text-2xl font-bold text-neutral-900">{priceFormatter.format(plan.total)}</span>
            <span className="text-[10px] text-neutral-500">税込/オプション込</span>
          </div>
        </div>
        <div className="mt-2 bg-indigo-100 text-indigo-800 text-xs font-bold py-1.5 px-2 rounded text-center flex justify-center items-center">
          <TrendingDown className="w-3 h-3 mr-1" />
          {priceFormatter.format(plan.diff)} OFF ({plan.discountRate}%)
        </div>
      </div>
    </div>
  );
};

const ResultScreen = ({ result, selectedPlan, setSelectedPlan, onBook }: any) => {
  const ArchetypeIcon = result.archetype.icon;
  const priceFormatter = new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' });

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900 font-sans pb-20 overflow-x-hidden">
      <Header progress={100} />
      
      {/* Hero */}
      <div className={`relative w-full ${result.archetype.color} pt-32 pb-12 px-6`}>
        <div className="max-w-6xl mx-auto relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/2 text-center md:text-left">
            <div className="inline-flex items-center bg-white/10 px-4 py-2 rounded-full text-sm font-mono mb-4 backdrop-blur-sm border border-white/20">
              <Award className="w-4 h-4 mr-2" />
              <span>ID: <strong>{result.identityId}</strong></span>
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-3 flex items-center justify-center md:justify-start">
              <ArchetypeIcon className="w-10 h-10 mr-4 opacity-80" />
              {result.archetype.name}
            </h1>
            <p className="text-lg text-white/90 font-light">"{result.archetype.desc}"</p>
          </div>
          <div className="md:w-1/2 flex justify-center">
             <div className="w-40 h-40 bg-white/10 backdrop-blur-md rounded-full border-2 border-white/20 shadow-xl flex items-center justify-center relative overflow-hidden">
              <ArchetypeIcon className="w-16 h-16 text-white opacity-40" />
            </div>
          </div>
        </div>
      </div>

      {/* Plans */}
      <div className="max-w-6xl mx-auto px-6 -mt-8 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <PlanCard plan={result.plans.value} type="value" isSelected={selectedPlan === 'value'} onSelect={() => setSelectedPlan('value')} />
          <PlanCard plan={result.plans.milestone} type="milestone" isSelected={selectedPlan === 'milestone'} onSelect={() => setSelectedPlan('milestone')} />
          <PlanCard plan={result.plans.authentic} type="authentic" isSelected={selectedPlan === 'authentic'} onSelect={() => setSelectedPlan('authentic')} />
        </div>
      </div>

      {/* Details */}
      <div className="max-w-4xl mx-auto px-6 mt-12">
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center mb-4 text-neutral-400 text-xs font-bold tracking-widest uppercase">
            <Gem className="w-4 h-4 mr-2"/> Plan Details
          </div>
          <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 flex items-start mb-6">
            <Info className="w-5 h-5 text-yellow-600 mr-3 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-yellow-900">
              市場価格と比較して <span className="font-bold text-lg underline">{priceFormatter.format(result.plans[selectedPlan].diff)}</span> お得です。
            </div>
          </div>
          <h3 className="font-bold text-sm mb-3 flex items-center"><Ruler className="w-4 h-4 mr-2"/> Structural Corrections (Included)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {result.corrections.map((corr: string, i: number) => (
              <div key={i} className="text-xs bg-neutral-50 p-2 rounded border border-neutral-100 flex items-center">
                <CheckCircle className="w-3 h-3 mr-2 text-green-500" />{corr}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-12 text-center px-6">
        <div className="inline-block w-full max-w-md bg-white border-2 border-yellow-400 rounded-lg p-4 mb-6 shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-center text-yellow-800 font-bold">
            <Ticket className="w-6 h-6 mr-3" />
            <div className="text-left">
              <span className="block text-sm">Web Reservation Benefit</span>
              <span className="text-lg">Win a Free Suit (1/200 Chance)</span>
            </div>
          </div>
        </div>
        <button onClick={onBook} className="w-full max-w-md mx-auto bg-indigo-900 text-white px-12 py-5 rounded-full font-bold text-lg shadow-xl hover:bg-indigo-800 transition-colors flex items-center justify-center">
          このプランで予約に進む <ArrowRight className="ml-2 w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

const BookingForm = ({ result, selectedPlan, onSubmit }: any) => {
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
    <div className="min-h-screen bg-neutral-50 font-sans py-20 px-6" style={{ paddingTop: '120px' }}>
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-neutral-900 text-white p-6">
          <h2 className="text-2xl font-serif font-bold flex items-center">
            <PenTool className="w-6 h-6 mr-3" /> Personal Order Sheet
          </h2>
          <p className="text-sm text-neutral-400 mt-1">Plan: {result.plans[selectedPlan].title}</p>
        </div>
        <form className="p-8 space-y-8" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <input required name="name" onChange={handleInputChange} type="text" placeholder="Name" className="w-full p-3 border rounded" />
             <input required name="email" onChange={handleInputChange} type="email" placeholder="Email" className="w-full p-3 border rounded" />
             <input required name="phone" onChange={handleInputChange} type="tel" placeholder="Phone" className="w-full p-3 border rounded" />
             <input required name="age" onChange={handleInputChange} type="number" placeholder="Age" className="w-full p-3 border rounded" />
          </div>
          <button type="submit" className="w-full bg-neutral-900 text-white py-4 rounded-lg font-bold text-lg shadow-lg flex items-center justify-center">
            <CheckSquare className="w-5 h-5 mr-2" />
            予約を確定して抽選に進む
          </button>
        </form>
      </div>
    </div>
  );
};

const LotteryScreen = ({ result, isSpinning, bookingData, diagnosisResult, selectedPlan }: any) => {
  return (
    <div className="min-h-screen bg-neutral-900 flex flex-col items-center justify-center p-6 text-center text-white">
       {isSpinning ? <Loader2 className="w-24 h-24 animate-spin text-yellow-500" /> : (
         <div className="bg-white text-neutral-900 p-8 rounded-2xl max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">{result ? "WINNER!" : "Reservation Confirmed"}</h2>
            <div className="text-left bg-neutral-50 p-4 rounded text-sm mb-6">
              <p><strong>Plan:</strong> {diagnosisResult.plans[selectedPlan].title}</p>
              <p><strong>ID:</strong> {bookingData.fullId}</p>
            </div>
            <button onClick={() => window.location.reload()} className="underline text-neutral-500">Back to Top</button>
         </div>
       )}
    </div>
  );
};

export default App;
