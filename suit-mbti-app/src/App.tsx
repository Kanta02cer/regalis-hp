import React, { useState } from 'react';
import { 
  Scissors, Ruler, ArrowRight, ChevronLeft, Loader2, Award, Sparkles,
  Zap, Anchor, Feather, Briefcase, UserCircle2, Gem, Ticket, CheckSquare,
  TrendingDown, Info, Check
} from 'lucide-react';
import InstagramStoryShare from './InstagramStoryShare';

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

// --- 16 Archetypes (New System) ---
const ARCHETYPE_DEFINITIONS = {
  '01': { id: '01', name: "The Sovereign", group: "Rulers", desc: "権威と格式を極めた、最高の統治者。", icon: Briefcase, color: "from-[#0a0f18] to-[#151515]", recOptions: { button: { name: "本水牛釦", price: 4400 }, lining: { name: "キュプラ", price: 4400 } } },
  '02': { id: '02', name: "The Modernist Leader", group: "Rulers", desc: "伝統を革新で補完する、次世代のリーダー。", icon: Zap, color: "from-[#1a1a1a] to-[#151515]", recOptions: { button: { name: "メタル釦", price: 5500 }, lining: { name: "柄裏地", price: 6600 } } },
  '03': { id: '03', name: "The Aristocrat", group: "Rulers", desc: "優雅さと格式を兼ね備えた、貴族の風格。", icon: Anchor, color: "from-[#081021] to-[#151515]", recOptions: { button: { name: "本水牛釦", price: 4400 }, lining: { name: "キュプラ", price: 4400 } } },
  '04': { id: '04', name: "The Futurist Executive", group: "Rulers", desc: "未来を見据えた、革新的な経営者。", icon: Zap, color: "from-[#1f080f] to-[#151515]", recOptions: { button: { name: "メタル釦", price: 5500 }, lining: { name: "赤裏地", price: 4400 } } },
  '05': { id: '05', name: "The Iron Commander", group: "Challengers", desc: "強固な意志と実用性を備えた、現場の指揮官。", icon: Briefcase, color: "from-[#0a0f18] to-[#151515]", recOptions: { button: { name: "本水牛釦", price: 4400 }, lining: { name: "キュプラ", price: 4400 } } },
  '06': { id: '06', name: "The Tech Strategist", group: "Challengers", desc: "テクノロジーと戦略を融合する、現代の軍師。", icon: Zap, color: "from-[#1a1a1a] to-[#151515]", recOptions: { button: { name: "メタル釦", price: 5500 }, lining: { name: "柄裏地", price: 6600 } } },
  '07': { id: '07', name: "The Heritage Hunter", group: "Challengers", desc: "伝統を探求し、実用性を追求する冒険家。", icon: Anchor, color: "from-[#081021] to-[#151515]", recOptions: { button: { name: "本水牛釦", price: 4400 }, lining: { name: "キュプラ", price: 4400 } } },
  '08': { id: '08', name: "The Urban Maverick", group: "Challengers", desc: "都市の自由と革新を体現する、反逆の精神。", icon: Zap, color: "from-[#1f080f] to-[#151515]", recOptions: { button: { name: "メタル釦", price: 5500 }, lining: { name: "赤裏地", price: 4400 } } },
  '09': { id: '09', name: "The Classic Gentleman", group: "Harmonizers", desc: "格式と親和性を両立する、真の紳士。", icon: Anchor, color: "from-[#0a0f18] to-[#151515]", recOptions: { button: { name: "本水牛釦", price: 4400 }, lining: { name: "キュプラ", price: 4400 } } },
  '10': { id: '10', name: "The Mode Icon", group: "Harmonizers", desc: "モードと親和性を融合する、時代のアイコン。", icon: Feather, color: "from-[#1a1a1a] to-[#151515]", recOptions: { button: { name: "ナット釦", price: 3300 }, lining: { name: "柄裏地", price: 6600 } } },
  '11': { id: '11', name: "The Elegant Dandy", group: "Harmonizers", desc: "優雅さと個性を調和させる、洗練されたダンディ。", icon: Feather, color: "from-[#081021] to-[#151515]", recOptions: { button: { name: "ナット釦", price: 3300 }, lining: { name: "キュプラ", price: 4400 } } },
  '12': { id: '12', name: "The Neo Classicist", group: "Harmonizers", desc: "伝統と革新を調和させる、新古典主義者。", icon: Zap, color: "from-[#1f080f] to-[#151515]", recOptions: { button: { name: "メタル釦", price: 5500 }, lining: { name: "赤裏地", price: 4400 } } },
  '13': { id: '13', name: "The Artisan", group: "Innovators", desc: "職人魂と実用性を追求する、創造の職人。", icon: Anchor, color: "from-[#0a0f18] to-[#151515]", recOptions: { button: { name: "本水牛釦", price: 4400 }, lining: { name: "キュプラ", price: 4400 } } },
  '14': { id: '14', name: "The Street Smart", group: "Innovators", desc: "ストリート感覚と機能性を備えた、都市の賢者。", icon: Zap, color: "from-[#1a1a1a] to-[#151515]", recOptions: { button: { name: "メタル釦", price: 5500 }, lining: { name: "柄裏地", price: 6600 } } },
  '15': { id: '15', name: "The Naturalist", group: "Innovators", desc: "自然体と伝統を融合する、本質を追求する者。", icon: UserCircle2, color: "from-[#081021] to-[#151515]", recOptions: { button: { name: "ナット釦", price: 3300 }, lining: { name: "アンコン", price: 0 } } },
  '16': { id: '16', name: "The Creative Minimalist", group: "Innovators", desc: "最小限と革新を追求する、創造的ミニマリスト。", icon: Zap, color: "from-[#1f080f] to-[#151515]", recOptions: { button: { name: "メタル釦", price: 5500 }, lining: { name: "赤裏地", price: 4400 } } }
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

// --- Questions (New 4-Axis System: 12 Questions) ---
const MANDATORY_QUESTIONS = [
  // Section 1: Identity (Identity軸) - Q1-Q3
  { id: 'q1', category: 'Identity', text: '重要な商談やプレゼンの場、あなたが相手に与えたい第一印象は？', left: '「この人なら任せられる」という、頼りがいと威厳。', right: '「この人なら話しやすい」という、親しみやすさと柔軟性。', factor: 'identity_q1' },
  { id: 'q2', category: 'Identity', text: 'チーム内でのあなたの役割に近いのは？', left: '先頭に立って決断を下すリーダータイプ。', right: '周囲の意見を聞き、調和を図るバランサータイプ。', factor: 'identity_q2' },
  { id: 'q3', category: 'Identity', text: 'スーツを着ることで高めたいマインドセットは？', left: '自身の自信を奮い立たせる「鎧（よろい）」のような強さ。', right: '自身の感性を表現する「名刺」のような個性。', factor: 'identity_q3' },
  
  // Section 2: Usage (Usage軸) - Q4-Q6
  { id: 'q4', category: 'Usage', text: 'スーツを着用する主なシチュエーションは？', left: '重役会議、式典、格式高いビジネスミーティング。', right: '顧客訪問、現場への移動、デスクワーク、リモート会議。', factor: 'usage_q1' },
  { id: 'q5', category: 'Usage', text: '職場における服装のルールや雰囲気は？', left: 'カッチリとしたドレスコードがあり、礼節が重視される。', right: '比較的自由で、機能性や動きやすさが重視される。', factor: 'usage_q2' },
  { id: 'q6', category: 'Usage', text: '一着のスーツに求める最優先事項は？', left: 'ここぞという勝負の時に着る「非日常の特別感」。', right: '毎日ストレスなく着られる「日常の快適性」。', factor: 'usage_q3' },
  
  // Section 3: Style (Style軸) - Q7-Q9
  { id: 'q7', category: 'Style', text: '好みのジャケットのシルエットは？', left: '肩のラインがしっかり出ている、構築的で男らしい形。', right: '肩パッドがなく、カーディガンのように羽織れる柔らかな形。', factor: 'style_q1' },
  { id: 'q8', category: 'Style', text: 'パンツ（トラウザーズ）の好みのフィット感は？', left: '足のラインに沿った、スタイリッシュで細身なライン。', right: '適度なゆとりがあり、動きやすく優雅なライン。', factor: 'style_q2' },
  { id: 'q9', category: 'Style', text: '「格好良い」と感じるスーツ姿は？', left: '隙がなく、ピシッと決まった「直線の美学」。', right: '動きに合わせて生地が揺れる「曲線の色気」。', factor: 'style_q3' },
  
  // Section 4: Trend (Trend軸) - Q10-Q12
  { id: 'q10', category: 'Trend', text: 'デザインやディテールを選ぶ基準は？', left: '時代に左右されない、歴史ある「王道」のデザイン。', right: '今の空気感を取り入れた、洗練された「最新」のデザイン。', factor: 'trend_q1' },
  { id: 'q11', category: 'Trend', text: '生地の質感で惹かれるのは？', left: '重厚感があり、ざっくりとした風合いの天然素材（ウール、ツイード）。', right: '光沢感があり、滑らか、もしくは機能的なハイテク素材。', factor: 'trend_q2' },
  { id: 'q12', category: 'Trend', text: 'あなたにとっての「理想の進化」とは？', left: '伝統を守りながら、深みを増していくこと。', right: '常識を疑い、新しく変化し続けること。', factor: 'trend_q3' },
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
  watch_size: { high: ["左袖口幅出し", "カフス周り調整"] },
  neck_length: { low: ["カラー低寸"], high: ["カラー高寸"] },
  driving_freq: { high: ["背幅ゆとり追加", "サイドベンツ推奨"] },
  thigh_size: { high: ["ワタリ幅出し", "シック補強"] },
  leg_bow: { low: ["O脚補正"], high: ["X脚補正"] }
};

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
  const [isOptionalPhase, setIsOptionalPhase] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<any>(null);
  const [selectedPlan, setSelectedPlan] = useState<string>('milestone');
  const [bookingData, setBookingData] = useState<any>({});
  const [lotteryResult, setLotteryResult] = useState<any>(null);

  const currentQuestions = isOptionalPhase ? OPTIONAL_QUESTIONS : MANDATORY_QUESTIONS;
  const phaseProgress = ((currentStep + 1) / currentQuestions.length) * 100;

  const handleAnswer = (value: number) => {
    const factor = currentQuestions[currentStep].factor;
    setAnswers(prev => ({ ...prev, [factor]: value }));
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
    }, 400);
  };

  const skipOptional = () => calculateResult();

  const startOptional = () => {
    setIsOptionalPhase(true);
    setCurrentStep(0);
    setAppState('diagnosis');
  };

  const calculateResult = () => {
    setAppState('loading');
    setTimeout(() => {
      // 1. Calculate 4-Axis Scores
      // Identity軸: Authority (+) / Affinity (-)
      const identityScore = (answers.identity_q1 || 0) + (answers.identity_q2 || 0) + (answers.identity_q3 || 0);
      const identityPositive = identityScore > 0; // Authority if positive, Affinity if negative/zero
      
      // Usage軸: Formal (+) / Active (-)
      const usageScore = (answers.usage_q1 || 0) + (answers.usage_q2 || 0) + (answers.usage_q3 || 0);
      const usagePositive = usageScore > 0; // Formal if positive, Active if negative/zero
      
      // Style軸: Sharp (+) / Soft (-)
      const styleScore = (answers.style_q1 || 0) + (answers.style_q2 || 0) + (answers.style_q3 || 0);
      const stylePositive = styleScore > 0; // Sharp if positive, Soft if negative/zero
      
      // Trend軸: Classic (+) / Modern (-)
      const trendScore = (answers.trend_q1 || 0) + (answers.trend_q2 || 0) + (answers.trend_q3 || 0);
      const trendPositive = trendScore > 0; // Classic if positive, Modern if negative/zero
      
      // 2. Map to Archetype ID using Logic Matrix
      // Format: Identity-Usage-Style-Trend (each is + or -)
      const archetypeKey = [
        identityPositive ? '+' : '-',
        usagePositive ? '+' : '-',
        stylePositive ? '+' : '-',
        trendPositive ? '+' : '-'
      ].join('');
      
      // Mapping table: Identity-Usage-Style-Trend -> Archetype ID
      const archetypeMap: Record<string, string> = {
        '++++': '01', // Auth+Formal+Sharp+Classic -> The Sovereign
        '+++-': '02', // Auth+Formal+Sharp+Modern -> The Modernist Leader
        '++-+': '03', // Auth+Formal+Soft+Classic -> The Aristocrat
        '++--': '04', // Auth+Formal+Soft+Modern -> The Futurist Executive
        '+-++': '05', // Auth+Active+Sharp+Classic -> The Iron Commander
        '+--+': '06', // Auth+Active+Sharp+Modern -> The Tech Strategist
        '+-+-': '07', // Auth+Active+Soft+Classic -> The Heritage Hunter
        '+---': '08', // Auth+Active+Soft+Modern -> The Urban Maverick
        '-+++': '09', // Aff+Formal+Sharp+Classic -> The Classic Gentleman
        '-++-': '10', // Aff+Formal+Sharp+Modern -> The Mode Icon
        '-+-+': '11', // Aff+Formal+Soft+Classic -> The Elegant Dandy
        '-+--': '12', // Aff+Formal+Soft+Modern -> The Neo Classicist
        '--++': '13', // Aff+Active+Sharp+Classic -> The Artisan
        '---+': '14', // Aff+Active+Sharp+Modern -> The Street Smart
        '--+-': '15', // Aff+Active+Soft+Classic -> The Naturalist
        '----': '16'  // Aff+Active+Soft+Modern -> The Creative Minimalist
      };
      
      const archetypeId = archetypeMap[archetypeKey] || '01'; // Default to The Sovereign
      const archetypeData = ARCHETYPE_DEFINITIONS[archetypeId as keyof typeof ARCHETYPE_DEFINITIONS];
      const archetype = {
        ...archetypeData,
        imageUrl: ARCHETYPE_IMAGES[archetypeId] || getArchetypeImagePath('01'), // MBTIコードベースの画像パス
        palette: COLOR_PALETTES.traditionalist // Default palette, can be customized per archetype
      };
      
      // 3. Physical Logic (simplified for now - can be enhanced with optional questions)
      let physicalType = PHYSICAL_TYPES.A;

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

      // Use new axis scores for fabric selection
      const isSoft = !stylePositive; // Soft if Style is negative
      const isGlossy = trendScore > 0 && usageScore > 0; // Glossy if Trend is Classic and Usage is Formal
      
      const valueFabric = FABRIC_PLANS.omc;
      const milestoneFabric = isGlossy ? FABRIC_PLANS.reda_silky : FABRIC_PLANS.vbc_n;
      const authenticFabric = isSoft ? FABRIC_PLANS.zegna : FABRIC_PLANS.dormeuil;

      const plans = {
        value: createPlanData(valueFabric, "Best Value", "圧倒的コストパフォーマンス"),
        milestone: createPlanData(milestoneFabric, "Milestone", "日常〜オフィシャルの最適解"),
        authentic: createPlanData(authenticFabric, "Authentic", "最高峰の格式と品質")
      };

      // 4. Corrections
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
      setResult({ 
        archetype, 
        physicalType, 
        plans, 
        corrections, 
        identityId,
        axisScores: {
          identity: identityScore,
          usage: usageScore,
          style: styleScore,
          trend: trendScore
        },
        axisResults: {
          identity: identityPositive ? 'Authority' : 'Affinity',
          usage: usagePositive ? 'Formal' : 'Active',
          style: stylePositive ? 'Sharp' : 'Soft',
          trend: trendPositive ? 'Classic' : 'Modern'
        }
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
  if (appState === 'optional_prompt') return <OptionalPromptScreen onYes={startOptional} onNo={skipOptional} />;
  if (appState === 'diagnosis') return (
    <ClickableQuestionScreen 
      question={currentQuestions[currentStep]} 
      currentStep={currentStep} 
      totalSteps={currentQuestions.length}
      onAnswer={handleAnswer}
      onBack={() => {
        if (currentStep > 0) setCurrentStep(c => c - 1);
        else if (isOptionalPhase) {
          setIsOptionalPhase(false);
          setCurrentStep(MANDATORY_QUESTIONS.length - 1);
        } else {
          setAppState('welcome');
        }
      }}
      progress={phaseProgress}
      phase={isOptionalPhase ? "ADVANCED" : "BASIC"}
    />
  );
  if (appState === 'result') return <ResultScreen result={result} selectedPlan={selectedPlan} setSelectedPlan={setSelectedPlan} onBook={() => setAppState('booking')} />;
  if (appState === 'booking') return <BookingForm result={result} selectedPlan={selectedPlan} onSubmit={startLottery} onBack={() => setAppState('result')} />;
  if (appState === 'lottery_spin' || appState === 'lottery_result') return <LotteryScreen result={lotteryResult} isSpinning={appState === 'lottery_spin'} bookingData={bookingData} diagnosisResult={result} selectedPlan={selectedPlan} />;

  return null;
};

// --- Components ---
const Header = ({ progress, phase }: { progress?: number, phase?: string }) => (
  <header className="fixed top-[80px] left-0 w-full bg-[#151515]/95 backdrop-blur-sm z-50 border-b border-[#333]">
    {progress !== undefined && (
      <div className="absolute bottom-0 left-0 h-[1px] w-full bg-[#222]">
        <div className="h-full bg-[#C5A059] transition-all duration-700 ease-out shadow-[0_0_8px_rgba(197,160,89,0.5)]" style={{ width: `${progress}%` }} />
      </div>
    )}
    <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 border border-[#C5A059] flex items-center justify-center rounded-sm">
          <Scissors className="w-4 h-4 text-[#C5A059]" />
        </div>
        <span className="font-serif text-lg tracking-[0.2em] text-[#E5E5E5]">REGALIS</span>
      </div>
      <div className="flex items-center space-x-4">
        {phase && <span className="text-[10px] font-sans tracking-widest text-[#666] border border-[#333] px-2 py-1 rounded-sm uppercase">{phase} PHASE</span>}
        <span className="text-[10px] font-sans tracking-widest text-[#C5A059] hidden md:block">RAT DIAGNOSIS v1.0</span>
      </div>
    </div>
  </header>
);

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
          <span className="tracking-[0.3em] text-xs font-bold uppercase text-[#C5A059]">EST. TIME: 2 MIN</span>
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

const OptionalPromptScreen = ({ onYes, onNo }: any) => (
  <div className={`min-h-screen ${THEME.bg} ${THEME.text} flex flex-col items-center justify-center p-6 text-center`}>
    <div className="w-16 h-[2px] bg-[#C5A059] mb-8"></div>
    <h2 className="text-3xl font-serif mb-6 tracking-wide">基本診断が完了しました。</h2>
    <p className="text-[#888] mb-12 max-w-md mx-auto leading-relaxed text-sm font-light">
      より精度の高い補正（袖丈、O脚補正、時計の干渉など）をご希望の場合、
      追加の10問（約1分）にお答えください。
    </p>
    <div className="flex flex-col md:flex-row gap-6 w-full max-w-md">
      <button onClick={onYes} className="flex-1 bg-[#C5A059] text-[#151515] py-4 font-bold hover:bg-[#DCC07A] transition-all shadow-[0_0_20px_rgba(197,160,89,0.1)] flex items-center justify-center font-serif tracking-widest text-xs">
        <CheckSquare className="w-4 h-4 mr-2" /> 詳細診断へ (+1分)
      </button>
      <button onClick={onNo} className="flex-1 border border-[#444] text-[#888] py-4 font-bold hover:border-[#C5A059] hover:text-[#C5A059] transition-all font-serif tracking-widest text-xs">
        結果を見る
      </button>
    </div>
  </div>
);

// --- CLICKABLE OPTION (Luxury Style) ---
const ClickableOption = ({ value, label, onClick }: { value: number, label: string, onClick: (v: number) => void }) => {
  return (
    <button
      onClick={() => onClick(value)}
      className={`
        group relative w-full p-6 border border-[#333] transition-all duration-500
        hover:border-[#C5A059] hover:bg-[#1A1A1A]
        active:scale-[0.98]
        flex items-center justify-between bg-[#151515] overflow-hidden
      `}
    >
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#C5A059]/0 via-[#C5A059]/5 to-[#C5A059]/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
      
      {/* Left Bar */}
      <div className={`absolute left-0 top-0 bottom-0 w-[2px] bg-[#C5A059] transition-all duration-300 h-0 group-hover:h-full opacity-0 group-hover:opacity-100`}></div>
      
      <span className="font-serif text-sm tracking-wider text-[#888] group-hover:text-[#F5F5F5] z-10 transition-colors pl-4">
        {label}
      </span>
      
      {/* Custom Radio Graphic */}
      <div className={`w-3 h-3 border border-[#444] rotate-45 transition-all duration-300 group-hover:border-[#C5A059] group-hover:bg-[#C5A059] z-10 flex items-center justify-center`}>
      </div>
    </button>
  );
};

const ClickableQuestionScreen = ({ question, currentStep, totalSteps, onAnswer, onBack, progress, phase }: any) => {
  return (
    <div className={`min-h-screen ${THEME.bg} ${THEME.text} font-sans pt-24 pb-10`}>
      <Header progress={progress} phase={phase} />
      <main className="max-w-xl mx-auto px-6 flex flex-col min-h-[70vh]">
        <div className="flex-1 flex flex-col justify-center">
          <div className="mb-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="inline-block px-3 py-1 border border-[#333] rounded-full mb-6">
              <span className="text-[10px] font-bold tracking-[0.2em] text-[#C5A059] uppercase">
                Q{currentStep + 1} / {totalSteps} — {question.category}
            </span>
            </div>
            <h2 className="text-2xl md:text-4xl font-serif font-medium text-[#F5F5F5] leading-relaxed">{question.text}</h2>
          </div>
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
            {/* New 2-choice system: +1 for right, -1 for left */}
            <ClickableOption value={-1} label={question.left} onClick={onAnswer} />
            <ClickableOption value={1} label={question.right} onClick={onAnswer} />
          </div>
        </div>
        <div className="mt-12 flex justify-center">
          <button onClick={onBack} disabled={currentStep === 0} className={`flex items-center text-[10px] tracking-[0.2em] text-[#444] hover:text-[#C5A059] transition-colors uppercase ${currentStep === 0 ? 'opacity-0' : ''}`}>
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
  return (
    <div className={`min-h-screen ${THEME.bg} ${THEME.text} font-sans pb-20 overflow-x-hidden`}>
      <Header />
      
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
          このプランで予約に進む <ArrowRight className="ml-3 w-4 h-4" />
          </button>
      </div>

      {/* Instagram Story Share Section - 最下部に配置 */}
      <div className="mt-24 px-6 mb-12">
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
