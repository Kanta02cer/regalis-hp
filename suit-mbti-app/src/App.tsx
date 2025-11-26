import React, { useState } from 'react';
import { 
  Scissors, Ruler, ArrowRight, CheckCircle, ChevronLeft, Loader2, Award,
  Zap, Anchor, Feather, Briefcase, UserCircle2, Gem, PenTool, Ticket,
  TrendingDown, Info, Crown, ThumbsUp, Clock, MousePointer2, CheckSquare,
  FileText, Mail, Home
} from 'lucide-react';
import emailjs from '@emailjs/browser';

// --- Branding & Config ---
const BRAND_INFO = {
  name: "Regalis Japan Group",
  concept: "現代の呉服商",
  philosophy: "鎧を砕く / Suit Identity",
  sub: "次世代型ビスポークプラットフォーム"
};

const LOTTERY_PROBABILITY = 200;

// EmailJS設定（後で設定が必要）
const EMAILJS_SERVICE_ID = 'service_eknowod'; // EmailJSのサービスIDに置き換え
const EMAILJS_TEMPLATE_ID = 'template_xvgcres'; // EmailJSのテンプレートIDに置き換え
const EMAILJS_PUBLIC_KEY = 't_2xYv1Fj4qOBuUXS'; // EmailJSの公開キーに置き換え
const EMAILJS_REPORT_TEMPLATE_ID = 'template_bw2d2hq'; // レポート送信用テンプレートID
const EMAILJS_BOOKING_TEMPLATE_ID = 'template_xvgcres'; // 予約詳細レポート用テンプレートID

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

const CORRECTION_MAP: Record<string, { low?: string[], high?: string[] }> = {
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [allAnswers, setAllAnswers] = useState<Record<string, any>>({});

  const currentQuestions = isOptionalPhase ? OPTIONAL_QUESTIONS : MANDATORY_QUESTIONS;
  const totalQuestions = MANDATORY_QUESTIONS.length + OPTIONAL_QUESTIONS.length;
  const progress = ((Object.keys(answers).length) / totalQuestions) * 100;

  // Auto-advance handleAnswer
  const handleAnswer = (value: number) => {
    const factor = currentQuestions[currentStep].factor;
    const question = currentQuestions[currentStep];
    setAnswers(prev => ({ ...prev, [factor]: value }));
    // 全回答を保存（レポート用）
    setAllAnswers(prev => ({
      ...prev,
      [factor]: {
        value,
        question: question.text,
        category: question.category,
        left: question.left,
        right: question.right
      }
    }));
    
    setTimeout(() => {
      if (currentStep < currentQuestions.length - 1) {
        setCurrentStep(curr => curr + 1);
      } else {
        if (!isOptionalPhase) {
          setAppState('optional_prompt');
        } else {
          calculateResult();
        }
      }
    }, 300);
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

      // 4. Corrections Logic
      let corrections: string[] = [];
      Object.keys(answers).forEach(key => {
        const val = answers[key];
        const mapKey = key as keyof typeof CORRECTION_MAP;
        if (CORRECTION_MAP[mapKey]) {
          const map = CORRECTION_MAP[mapKey];
          if (val <= -1 && map.low) corrections = [...corrections, ...map.low];
          if (val >= 1 && map.high) corrections = [...corrections, ...map.high];
        }
      });
      if (physicalType.code === 'A' && corrections.length === 0) corrections.push("基本体型補正");

      const identityId = `${archetype.id}-${physicalType.code}`;
      setResult({ archetype, physicalType, plans, corrections, identityId });
      setAppState('result');
    }, 2500);
  };

  const startLottery = async (data: any, generateBookingReport?: (data: any, result: any, plan: string, answers: any) => string) => {
    setBookingData(data);
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const priceFormatter = new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' });
      
      // EmailJSで予約データ送信
      const templateParams = {
        to_name: data.name,
        to_email: data.email,
        customer_name: data.name,
        customer_email: data.email,
        customer_phone: data.phone,
        customer_age: data.age,
        identity_id: data.fullId,
        plan_name: data.planName,
        archetype: result.archetype.name,
        physical_type: result.physicalType.name,
        total_price: priceFormatter.format(result.plans[selectedPlan].total),
        message: `予約が完了しました。ID: ${data.fullId}`
      };

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );

      // 予約詳細レポートも送信
      if (generateBookingReport) {
        const bookingReport = generateBookingReport(data, result, selectedPlan, allAnswers);
        const reportTemplateParams = {
          to_email: data.email,
          customer_email: data.email,
          customer_name: data.name,
          booking_id: data.fullId,
          report_content: bookingReport,
          message: '予約詳細レポートをお送りしました。'
        };

        try {
          await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_BOOKING_TEMPLATE_ID,
            reportTemplateParams,
            EMAILJS_PUBLIC_KEY
          );
        } catch (reportError) {
          console.error('Booking Report EmailJS Error:', reportError);
          // レポート送信失敗でも予約は進める
        }
      }

      // 送信成功後、抽選画面へ
      setIsSubmitting(false);
      setAppState('lottery_spin');
      setTimeout(() => {
        const isWinner = Math.floor(Math.random() * LOTTERY_PROBABILITY) === 0;
        setLotteryResult(isWinner);
        setAppState('lottery_result');
      }, 3000);
    } catch (error) {
      console.error('EmailJS Error:', error);
      setIsSubmitting(false);
      setSubmitError('送信に失敗しました。しばらくしてから再度お試しください。');
      // エラーでも抽選は進める（開発中は便利）
      setAppState('lottery_spin');
      setTimeout(() => {
        const isWinner = Math.floor(Math.random() * LOTTERY_PROBABILITY) === 0;
        setLotteryResult(isWinner);
        setAppState('lottery_result');
      }, 3000);
    }
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
  // レポート生成関数
  const generateReport = (result: any, allAnswers: Record<string, any>, selectedPlan: string) => {
    const priceFormatter = new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' });
    const plan = result.plans[selectedPlan];
    
    let report = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【Regalis Japan Group】スーツ診断レポート
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【診断ID】
${result.identityId}

【あなたのスーツアイデンティティ】
${result.archetype.name}
${result.archetype.desc}

【体型タイプ】
${result.physicalType.name}

【推奨プラン】
${plan.title} - ${plan.fabric.name}
${plan.subtitle}

【価格情報】
市場相場: ${priceFormatter.format(plan.marketTotal)}
お見積もり: ${priceFormatter.format(plan.total)}
お得額: ${priceFormatter.format(plan.diff)} (${plan.discountRate}% OFF)

【含まれる補正】
${result.corrections.map((c: string) => `・${c}`).join('\n')}

【診断回答の詳細】
`;
    
    // 全回答を追加
    Object.keys(allAnswers).forEach((key) => {
      const answer = allAnswers[key];
      if (answer) {
        const scale = answer.value;
        let label = '';
        if (scale === -2) label = `${answer.left} (強く)`;
        else if (scale === -1) label = `${answer.left} (やや)`;
        else if (scale === 0) label = 'どちらでもない / 標準';
        else if (scale === 1) label = `${answer.right} (やや)`;
        else if (scale === 2) label = `${answer.right} (強く)`;
        
        report += `\n【${answer.category}】${answer.question}\n回答: ${label}\n`;
      }
    });
    
    report += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
このレポートは、あなたの回答に基づいて自動生成されました。
Regalis Japan Group
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
    
    return report;
  };

  // レポート送信関数
  const sendReport = async (email: string) => {
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      const reportContent = generateReport(result, allAnswers, selectedPlan);
      const priceFormatter = new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' });
      
      const templateParams = {
        to_email: email,
        customer_email: email,
        identity_id: result.identityId,
        archetype: result.archetype.name,
        physical_type: result.physicalType.name,
        plan_name: result.plans[selectedPlan].title,
        total_price: priceFormatter.format(result.plans[selectedPlan].total),
        report_content: reportContent,
        message: '診断レポートをお送りしました。'
      };

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_REPORT_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );

      setIsSubmitting(false);
      setAppState('report_sent');
    } catch (error) {
      console.error('EmailJS Error:', error);
      setIsSubmitting(false);
      setSubmitError('レポートの送信に失敗しました。しばらくしてから再度お試しください。');
    }
  };

  // 予約詳細レポート生成関数
  const generateBookingReport = (bookingData: any, result: any, selectedPlan: string, allAnswers: Record<string, any>) => {
    const priceFormatter = new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' });
    const plan = result.plans[selectedPlan];
    
    let report = `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【Regalis Japan Group】予約確認レポート
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【予約情報】
予約ID: ${bookingData.fullId}
お名前: ${bookingData.name}
メールアドレス: ${bookingData.email}
電話番号: ${bookingData.phone}
年齢: ${bookingData.age}歳

【診断結果】
診断ID: ${result.identityId}
アーキタイプ: ${result.archetype.name}
体型タイプ: ${result.physicalType.name}

【選択プラン】
${plan.title} - ${plan.fabric.name}
${plan.subtitle}

【価格情報】
お見積もり: ${priceFormatter.format(plan.total)}
市場相場: ${priceFormatter.format(plan.marketTotal)}
お得額: ${priceFormatter.format(plan.diff)} (${plan.discountRate}% OFF)

【含まれる補正】
${result.corrections.map((c: string) => `・${c}`).join('\n')}

【来店当日の流れ】
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【STEP 1】ご到着・ご挨拶（約10分）
お越しいただいたら、スタッフがご案内いたします。
お飲み物をご用意してお待ちしております。

【STEP 2】カウンセリング（約30分）
診断結果を基に、より詳細なご要望をお聞きします。
・使用シーンやライフスタイル
・好みの色や素材感
・予算感の最終確認

【STEP 3】生地選び（約20分）
400種以上のファブリックアーカイブから、
あなたに最適な生地を選定します。
実際に手に取って、質感や色味を確認できます。

【STEP 4】採寸（約30分）
3D採寸システムと手動採寸を組み合わせて、
1mm単位で正確なサイズを測定します。
診断結果に基づいた補正も反映されます。

【STEP 5】オーダー確定（約10分）
最終的な仕様を確認し、オーダーを確定します。
納期やアフターケアについてもご説明します。

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
合計所要時間: 約90分
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

【診断回答の詳細】
`;
    
    // 全回答を追加
    Object.keys(allAnswers).forEach((key) => {
      const answer = allAnswers[key];
      if (answer) {
        const scale = answer.value;
        let label = '';
        if (scale === -2) label = `${answer.left} (強く)`;
        else if (scale === -1) label = `${answer.left} (やや)`;
        else if (scale === 0) label = 'どちらでもない / 標準';
        else if (scale === 1) label = `${answer.right} (やや)`;
        else if (scale === 2) label = `${answer.right} (強く)`;
        
        report += `\n【${answer.category}】${answer.question}\n回答: ${label}\n`;
      }
    });
    
    report += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
【重要事項】
・予約日の前日までにキャンセル可能です
・当日のご変更はお電話でご連絡ください
・24ヶ月のアフターケアが含まれています

【お問い合わせ】
Regalis Japan Group
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;
    
    return report;
  };

  if (appState === 'result') return <ResultScreen result={result} selectedPlan={selectedPlan} setSelectedPlan={setSelectedPlan} onBook={() => setAppState('booking')} onGetReport={() => setAppState('report_request')} />;
  if (appState === 'report_request') return <ReportRequestForm result={result} allAnswers={allAnswers} selectedPlan={selectedPlan} onSubmit={sendReport} isSubmitting={isSubmitting} submitError={submitError} onBack={() => setAppState('result')} />;
  if (appState === 'report_sent') return <ReportSentScreen onBackToTop={() => setAppState('welcome')} />;
  if (appState === 'booking') return <BookingForm result={result} selectedPlan={selectedPlan} onSubmit={startLottery} isSubmitting={isSubmitting} submitError={submitError} generateBookingReport={generateBookingReport} />;
  if (appState === 'lottery_spin' || appState === 'lottery_result') return <LotteryScreen result={lotteryResult} isSpinning={appState === 'lottery_spin'} bookingData={bookingData} diagnosisResult={result} selectedPlan={selectedPlan} />;

  return null;
};

// --- UI Components ---
const Header = ({ progress }: { progress?: number }) => (
  <header className="fixed top-0 left-0 w-full bg-white/90 backdrop-blur-md z-50 border-b border-neutral-100">
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
  <div className="min-h-screen bg-neutral-900 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
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
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans pt-20 pb-10">
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

const ResultScreen = ({ result, selectedPlan, setSelectedPlan, onBook, onGetReport }: any) => {
  const ArchetypeIcon = result.archetype.icon;
  const priceFormatter = new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' });
  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900 font-sans pb-20 overflow-x-hidden">
      <Header progress={100} />
      
      {/* Hero */}
      <div className={`relative w-full ${result.archetype.color} pt-24 pb-12 px-6`}>
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

      {/* CTA - 2つの選択肢 */}
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
        
        <div className="max-w-md mx-auto space-y-4">
          <button onClick={onBook} className="w-full bg-indigo-900 text-white px-12 py-5 rounded-full font-bold text-lg shadow-xl hover:bg-indigo-800 transition-colors flex items-center justify-center">
            <Home className="w-5 h-5 mr-2" />
            来店予約をする <ArrowRight className="ml-2 w-5 h-5" />
          </button>
          
          <button onClick={onGetReport} className="w-full bg-white border-2 border-indigo-600 text-indigo-900 px-12 py-5 rounded-full font-bold text-lg shadow-lg hover:bg-indigo-50 transition-colors flex items-center justify-center">
            <FileText className="w-5 h-5 mr-2" />
            診断レポートを取得する
          </button>
        </div>
      </div>
    </div>
  );
};

const BookingForm = ({ result, selectedPlan, onSubmit, isSubmitting, submitError, generateBookingReport }: any) => {
  const [formData, setFormData] = useState<any>({});
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const fullId = `${result.identityId}-${selectedPlan.toUpperCase().substring(0,3)}`;
    onSubmit({ ...formData, fullId, planName: result.plans[selectedPlan].title }, generateBookingReport);
  };

  return (
    <div className="min-h-screen bg-neutral-50 font-sans py-20 px-6">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-neutral-900 text-white p-6">
          <h2 className="text-2xl font-serif font-bold flex items-center">
            <PenTool className="w-6 h-6 mr-3" /> Personal Order Sheet
          </h2>
          <p className="text-sm text-neutral-400 mt-1">Plan: {result.plans[selectedPlan].title}</p>
        </div>

        <form className="p-8 space-y-8" onSubmit={handleSubmit}>
          {submitError && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg text-sm">
              {submitError}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <input required name="name" onChange={handleInputChange} type="text" placeholder="Name" className="w-full p-3 border rounded" />
             <input required name="email" onChange={handleInputChange} type="email" placeholder="Email" className="w-full p-3 border rounded" />
             <input required name="phone" onChange={handleInputChange} type="tel" placeholder="Phone" className="w-full p-3 border rounded" />
             <input required name="age" onChange={handleInputChange} type="number" placeholder="Age" className="w-full p-3 border rounded" />
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-neutral-900 text-white py-4 rounded-lg font-bold text-lg shadow-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                送信中...
              </>
            ) : (
              <>
                <CheckSquare className="w-5 h-5 mr-2" />
                予約を確定して抽選に進む
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

// レポート取得フォーム
const ReportRequestForm = ({ onSubmit, isSubmitting, submitError, onBack }: any) => {
  const [email, setEmail] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email);
  };

  return (
    <div className="min-h-screen bg-neutral-50 font-sans py-20 px-6">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-indigo-900 text-white p-6">
          <h2 className="text-2xl font-serif font-bold flex items-center">
            <FileText className="w-6 h-6 mr-3" /> 診断レポート取得
          </h2>
          <p className="text-sm text-indigo-200 mt-2">
            診断結果と回答内容をまとめたレポートをメールでお送りします。
          </p>
        </div>

        <form className="p-8 space-y-8" onSubmit={handleSubmit}>
          {submitError && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg text-sm">
              {submitError}
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-neutral-700 mb-2">
              メールアドレス <span className="text-red-500">*</span>
            </label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <p className="text-xs text-neutral-500 mt-2">
              レポートはこのメールアドレスに送信されます
            </p>
          </div>

          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <h3 className="font-bold text-sm mb-2 flex items-center">
              <Info className="w-4 h-4 mr-2 text-indigo-600" />
              レポートに含まれる内容
            </h3>
            <ul className="text-xs text-neutral-700 space-y-1">
              <li>・診断IDとアーキタイプ情報</li>
              <li>・推奨プランと価格情報</li>
              <li>・含まれる補正の詳細</li>
              <li>・全質問への回答内容</li>
            </ul>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={onBack}
              className="flex-1 border-2 border-neutral-300 text-neutral-700 py-4 rounded-lg font-bold hover:bg-neutral-50 transition-colors"
            >
              戻る
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-indigo-900 text-white py-4 rounded-lg font-bold text-lg shadow-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  送信中...
                </>
              ) : (
                <>
                  <Mail className="w-5 h-5 mr-2" />
                  レポートを送信する
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// レポート送信完了画面
const ReportSentScreen = ({ onBackToTop }: any) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 flex flex-col items-center justify-center p-6 text-center text-white">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
        </div>
        
        <h1 className="text-3xl font-serif font-bold mb-4">
          レポートを送信しました
        </h1>
        <p className="text-neutral-300 mb-8">
          ご入力いただいたメールアドレスに診断レポートをお送りしました。<br/>
          メールボックスをご確認ください。
        </p>
        
        <button
          onClick={onBackToTop}
          className="w-full bg-white text-indigo-900 py-4 rounded-xl font-bold text-lg hover:bg-indigo-50 transition-all shadow-lg flex items-center justify-center"
        >
          <Home className="w-5 h-5 mr-2" />
          トップ画面に戻る
        </button>
      </div>
    </div>
  );
};

const LotteryScreen = ({ result, isSpinning, bookingData, diagnosisResult, selectedPlan }: any) => {
  const priceFormatter = new Intl.NumberFormat('ja-JP', { style: 'currency', currency: 'JPY' });
  
  if (isSpinning) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-purple-900 to-neutral-900 flex flex-col items-center justify-center p-6 text-center text-white relative overflow-hidden">
        {/* 背景アニメーション */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-400 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative z-10 max-w-2xl w-full">
          {/* スピンアニメーション */}
          <div className="mb-12 flex justify-center">
            <div className="relative w-48 h-48">
              {/* 外側のリング */}
              <div className="absolute inset-0 border-8 border-yellow-400/30 rounded-full animate-spin" style={{ animationDuration: '2s' }}></div>
              <div className="absolute inset-4 border-8 border-purple-400/30 rounded-full animate-spin" style={{ animationDuration: '1.5s', animationDirection: 'reverse' }}></div>
              {/* 中央のアイコン */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Ticket className="w-16 h-16 text-yellow-400 animate-bounce" />
              </div>
            </div>
          </div>
          
          {/* テキスト */}
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 animate-pulse">
            抽選中...
          </h2>
          <p className="text-xl text-neutral-300 mb-2">
            運命の瞬間が近づいています
          </p>
          <p className="text-sm text-neutral-400 font-mono">
            1/200の確率で無料スーツを獲得できるチャンス！
          </p>
          
          {/* プログレスバー */}
          <div className="mt-12 max-w-md mx-auto">
            <div className="h-2 bg-neutral-700 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-yellow-400 via-purple-500 to-yellow-400 rounded-full animate-pulse" style={{ width: '100%' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // 当選の場合
  if (result === true) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-500 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
        {/* 背景エフェクト */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/50 via-transparent to-transparent"></div>
        </div>
        
        {/* 紙吹雪エフェクト */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full animate-fall"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
        
        <div className="relative z-10 max-w-2xl w-full bg-white/95 backdrop-blur-md rounded-3xl p-8 md:p-12 shadow-2xl border-4 border-yellow-300">
          {/* 当選バッジ */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-2xl animate-bounce">
                <Ticket className="w-16 h-16 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-12 h-12 bg-red-500 rounded-full flex items-center justify-center animate-ping">
                <span className="text-white font-bold text-xl">!</span>
              </div>
            </div>
          </div>
          
          {/* 当選メッセージ */}
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-neutral-900 mb-4">
            🎉 当選おめでとうございます！ 🎉
          </h1>
          <p className="text-2xl md:text-3xl font-bold text-amber-600 mb-8">
            無料スーツを獲得しました！
          </p>
          
          {/* 当選チケット */}
          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border-4 border-dashed border-yellow-400 rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="text-center">
                <p className="text-xs text-neutral-500 uppercase tracking-widest mb-2">Golden Ticket</p>
                <p className="text-2xl font-mono font-bold text-neutral-900 tracking-wider">
                  FREE-SUIT-2025-WIN
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-neutral-500 mb-1">診断ID</p>
                <p className="font-bold text-neutral-900">{bookingData.fullId}</p>
              </div>
              <div>
                <p className="text-neutral-500 mb-1">選択プラン</p>
                <p className="font-bold text-neutral-900">{diagnosisResult.plans[selectedPlan].title}</p>
              </div>
            </div>
          </div>
          
          {/* 詳細情報 */}
          <div className="bg-neutral-50 rounded-xl p-6 mb-8 text-left">
            <h3 className="font-bold text-lg mb-4 flex items-center">
              <Award className="w-5 h-5 mr-2 text-yellow-600" />
              当選特典
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>選択されたプラン（{priceFormatter.format(diagnosisResult.plans[selectedPlan].total)}）が<strong className="text-yellow-600">完全無料</strong>になります</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>来店時にこの画面をスタッフにご提示ください</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>予約確認メールも送信されます</span>
              </li>
            </ul>
          </div>
          
          {/* アクションボタン */}
          <div className="space-y-4">
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-neutral-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-neutral-800 transition-all shadow-lg flex items-center justify-center"
            >
              <Home className="w-5 h-5 mr-2" />
              トップ画面に戻る
            </button>
            <p className="text-xs text-neutral-500">
              ※ 当選チケットは画面をスクリーンショットで保存することをお勧めします
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  // 落選の場合（予約は完了）
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-900 via-indigo-900 to-neutral-900 flex flex-col items-center justify-center p-6 text-center text-white relative overflow-hidden">
      {/* 背景エフェクト */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative z-10 max-w-2xl w-full">
        {/* アイコン */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 bg-indigo-500/50 backdrop-blur-md rounded-full flex items-center justify-center border-2 border-indigo-400">
              <CheckCircle className="w-12 h-12 text-indigo-300" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
              <span className="text-neutral-900 font-bold text-sm">!</span>
            </div>
          </div>
        </div>
        
        {/* メッセージ */}
        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
          予約が完了しました
        </h1>
        <p className="text-xl text-neutral-300 mb-2">
          残念ながら抽選は外れましたが、
        </p>
        <p className="text-lg text-indigo-300 mb-12">
          予約は正常に受け付けられました
        </p>
        
        {/* 予約情報カード */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 mb-8 border border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <div>
              <p className="text-xs text-neutral-400 uppercase tracking-widest mb-2">予約ID</p>
              <p className="text-xl font-mono font-bold text-white">{bookingData.fullId}</p>
            </div>
            <div>
              <p className="text-xs text-neutral-400 uppercase tracking-widest mb-2">選択プラン</p>
              <p className="text-xl font-bold text-white">{diagnosisResult.plans[selectedPlan].title}</p>
            </div>
            <div>
              <p className="text-xs text-neutral-400 uppercase tracking-widest mb-2">お見積もり</p>
              <p className="text-2xl font-bold text-indigo-300">{priceFormatter.format(diagnosisResult.plans[selectedPlan].total)}</p>
            </div>
            <div>
              <p className="text-xs text-neutral-400 uppercase tracking-widest mb-2">ステータス</p>
              <div className="inline-flex items-center bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-sm font-bold">
                <CheckCircle className="w-4 h-4 mr-1" />
                予約確定
              </div>
            </div>
          </div>
        </div>
        
        {/* 特典情報 */}
        <div className="bg-yellow-400/10 backdrop-blur-md rounded-xl p-6 mb-8 border border-yellow-400/30">
          <div className="flex items-start">
            <Ticket className="w-6 h-6 text-yellow-400 mr-3 flex-shrink-0 mt-1" />
            <div className="text-left">
              <p className="font-bold text-yellow-300 mb-2">Web予約特典</p>
              <p className="text-sm text-neutral-300">
                今回の予約で、次回オーダー時に使える<strong className="text-yellow-300">5,000円割引クーポン</strong>をプレゼントします。
                確認メールにクーポンコードを記載してお送りします。
              </p>
            </div>
          </div>
        </div>
        
        {/* アクションボタン */}
        <div className="space-y-4">
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg flex items-center justify-center"
          >
            <Home className="w-5 h-5 mr-2" />
            トップ画面に戻る
          </button>
          <p className="text-xs text-neutral-400">
            確認メールが届かない場合は、お手数ですがお問い合わせください
          </p>
        </div>
      </div>
    </div>
  );
};

export default App;

