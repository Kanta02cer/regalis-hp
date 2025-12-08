import React, { useState } from 'react';
import { 
  Ruler, ArrowRight, ChevronLeft, Loader2, Award, Sparkles,
  Zap, Anchor, Feather, Briefcase, UserCircle2, Gem, Ticket, CheckSquare,
  TrendingDown, Info, Check, BookOpen, Heart, Activity, MapPin, ChevronDown
} from 'lucide-react';
import InstagramStoryShare from './InstagramStoryShare';
import { buildBlueprint, selectFashionTheory } from './enhancedDiagnosis';
import { scenarioQuestions } from './scenarioQuestions';

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
  '01': { 
    id: '01', 
    name: "The Sovereign", 
    group: "Rulers", 
    desc: "権威と格式を極めた、最高の統治者。",
    catchphrase: "言葉よりも雄弁な、圧倒的風格。",
    icon: Briefcase, 
    color: "from-[#0a0f18] to-[#151515]", 
    recOptions: { button: { name: "本水牛釦", price: 4400 }, lining: { name: "キュプラ", price: 4400 } },
    details: {
      fashion: {
        title: "英国式構築美学 (Morphology)",
        text: "あなたの骨格（Linear）は、英国サヴィル・ロウの伝統的な『ドレープカット』と完全に調和します。パッドで肩を強調し、ウェストを絞った砂時計型のシルエットが、あなたの権威（Authority）を物理的に拡張します。",
        items: ["スリーピーススーツ", "ピークドラペル", "350g以上のヘビーウェイト生地"]
      },
      psychology: {
        title: "秩序と支配 (Identity)",
        text: "あなたは混沌とした状況に秩序をもたらす存在です。心理学的には『統制への欲求』が高く、不確実性を嫌います。自らのアイデンティティを『守護者』あるいは『導く者』と定義しており、その責任感こそが動力源です。",
        tag: "ENTJ / ESTJ (指揮官・幹部型)"
      },
      romance: {
        title: "ロマンティックな覇者 (Evol. Psych)",
        text: "恋愛においても主導権を握る傾向があります。進化心理学的に言えば、あなたは『資源保持能力』と『庇護欲』をアピールすることでパートナーを獲得します。相性が良いのは、あなたを支える献身的なサポータータイプです。",
        lucky: "クラシックな革のIDケース"
      },
      philosophy: {
        title: "Noblesse Oblige (Theology)",
        text: "あなたの人生における神とは『正義』と『規律』です。カトリック神学のように、階層と役割が明確な世界でこそ、あなたは救済を見出します。無秩序な自由よりも、高潔な義務に生きることに美を感じるでしょう。"
      }
    }
  },
  '02': { 
    id: '02', 
    name: "The Strategist", 
    group: "Rulers", 
    desc: "冷徹な戦略家。静寂の中に宿る、鋭利な知性。",
    catchphrase: "静寂の中に宿る、鋭利な知性。",
    icon: Zap, 
    color: "from-[#374151] via-[#4b5563] to-[#1f2937]", 
    recOptions: { button: { name: "メタル釦", price: 5500 }, lining: { name: "柄裏地", price: 6600 } },
    details: {
      fashion: {
        title: "モダニズムと機能美",
        text: "装飾を排除したミニマリズムこそが至高。直線的（Linear）なラインに、彩度を抑えた（Blend）グレーやチャコールを合わせることで、あなたの知性（Intellect）へのノイズを遮断します。",
        items: ["比翼仕立てのコート", "チャコールグレースーツ", "シルバータイ"]
      },
      psychology: {
        title: "論理的完結 (Analyst)",
        text: "あなたは世界の構造を理解したいと願う『解析者』です。感情よりも論理的整合性を重視し、独りで思考する時間をエネルギー源とします。対人関係ではクールに見えますが、内面には熱い理論体系を持っています。",
        tag: "INTJ / ISTJ (建築家・管理者)"
      },
      romance: {
        title: "慎重なる契約者",
        text: "恋愛を『コストとリターン』や『将来の安定性』で評価しがちです。失敗を恐れるあまり奥手になりますが、一度信頼関係（契約）を結ぶと、誰よりも誠実で浮気をしません。",
        lucky: "万年筆"
      },
      philosophy: {
        title: "Stoicism (Philosophy)",
        text: "ストア派哲学があなたの指針です。「変えられるものと変えられないものを区別せよ」。感情の揺らぎを理性で統御することに、人生の平安（アパテイア）があります。神は数式の中にいます。"
      }
    }
  },
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
  '16': { 
    id: '16', 
    name: "The Gentle Creator", 
    group: "Innovators", 
    desc: "穏やかな創造者。風のように軽やかに、常識を超える。",
    catchphrase: "風のように軽やかに、常識を超える。",
    icon: Zap, 
    color: "from-[#3f6212] via-[#65a30d] to-[#1a2e05]", 
    recOptions: { button: { name: "メタル釦", price: 5500 }, lining: { name: "赤裏地", price: 4400 } },
    details: {
      fashion: {
        title: "Natural Harmony (Ecology)",
        text: "ナポリ仕立てのような柔らかさと自由な発想。ルールに縛られないアースカラーやリネン素材が、あなたの内なる感性を解放し、周囲との調和（Blend）を生み出します。",
        items: ["リネン混ジャケット", "ニットタイ", "アースカラー"]
      },
      psychology: {
        title: "内なる調和 (Artist)",
        text: "あなたは独自の価値観を大切にする『芸術家』です。競争よりも調和を好み、感受性が豊かです。言葉にできない微細なニュアンスを感じ取る力を持っています。",
        tag: "ISFP / INFP (冒険家・仲介者)"
      },
      romance: {
        title: "魂の共鳴者",
        text: "言葉にしなくても通じ合える、精神的なつながりを重視します。派手なデートよりも、静かな場所で互いの価値観を共有する時間を大切にします。",
        lucky: "アンティークの時計"
      },
      philosophy: {
        title: "Taoism (Eastern Thought)",
        text: "老荘思想の「無為自然」があなたの生き方です。無理に流れに逆らわず、あるがままを受け入れる姿勢に、真の強さと美しさが宿ります。"
      }
    }
  }
};


// --- Fabric Plans ---
const FABRIC_PLANS = {
  omc: {
    id: 'omc', name: "Order Made Collection", origin: "Japan/Global",
    desc: "機能性と耐久性を兼ね備えた、賢いエントリーモデル。",
    basePrice: 96000, marketPrice: 120000,
    type: "Value",
    palette: { base: "#0f172a", accent: "#c5a059" },
    features: [
      "防シワ加工で移動が多い日も型崩れしにくい",
      "ポリエステル混紡による耐摩耗性",
      "毎日の稼働を支えるコストパフォーマンス"
    ]
  },
  vbc_n: {
    id: 'vbc_n', name: "V.B. Canonico (Perennial)", origin: "Italy",
    desc: "世界中で愛されるイタリアの定番。コストと品質の黄金比。",
    basePrice: 130900, marketPrice: 165000,
    type: "Value/Milestone",
    palette: { base: "#1c1f2b", accent: "#8ab4f8" },
    features: [
      "Super110sのしなやかさで長時間の着用も疲れにくい",
      "オールシーズン対応でワードローブを圧縮",
      "発色が良く、写真映えする艶感"
    ]
  },
  reda_silky: {
    id: 'reda', name: "REDA (Silky Effect)", origin: "Italy",
    desc: "シルクのような光沢加工を施した、モダンな一着。",
    basePrice: 135900, marketPrice: 160000,
    type: "Milestone",
    palette: { base: "#0a0f18", accent: "#6bd8ff" },
    features: [
      "ドルフィン加工による柔らかな光沢で非日常感を演出",
      "形態安定で出張や移動中もシワになりにくい",
      "モード寄りのVゾーンを組みやすい艶感"
    ]
  },
  dormeuil: {
    id: 'dormeuil', name: "Dormeuil (Amadeus)", origin: "UK",
    desc: "英国の伝統とフランスの感性。重厚な輝き。",
    basePrice: 185000, marketPrice: 240000,
    type: "Authentic",
    palette: { base: "#111827", accent: "#c084fc" },
    features: [
      "ヘビーウェイトで肩線が崩れず威厳が出る",
      "ペーパープレス仕上げの艶で格式を可視化",
      "長時間の着座でも膝抜けしにくい強い打ち込み"
    ]
  },
  zegna: {
    id: 'zegna', name: "Ermenegildo Zegna (Trofeo)", origin: "Italy",
    desc: "成功者の証。最高級の原毛が生むドレープ。",
    basePrice: 198000, marketPrice: 280000,
    type: "Authentic",
    palette: { base: "#0b1120", accent: "#f59e0b" },
    features: [
      "極細原毛のドレープで肩〜胸の立体感を強調",
      "復元力が高く撮影や会食後も美しいシルエットを維持",
      "ブランド認知が高くステータスを示せる"
    ]
  }
};

const FABRIC_LIBRARY = [
  { id: 'canonico', name: 'Canonico Perennial', origin: 'Italy', hand: 'soft', mood: 'trad', sheen: 'mid', scenario: 'デイリーから会食', color: '#1c1f2b', fit: 'Soft Trad', why: '発色が良く、しなやかさで日本人の体型にも馴染みやすい定番。' },
  { id: 'reda', name: 'REDA Silky Effect', origin: 'Italy', hand: 'soft', mood: 'inno', sheen: 'high', scenario: '華やかな会食や登壇', color: '#0a0f18', fit: 'Soft Inno', why: '光沢を活かしてモード寄りのVゾーンを作りたい人向け。' },
  { id: 'dormeuil', name: 'Dormeuil Amadeus', origin: 'UK', hand: 'hard', mood: 'trad', sheen: 'mid', scenario: '役員会・重要商談', color: '#111827', fit: 'Hard Trad', why: '重厚な目付と艶で威厳を可視化し、肩線を端正に保つ。' },
  { id: 'zegna', name: 'Zegna Trofeo', origin: 'Italy', hand: 'soft', mood: 'trad', sheen: 'mid', scenario: '記念撮影・ラグジュアリー', color: '#0b1120', fit: 'Soft Trad', why: '極上ドレープが写真映えし、柔らかさと気品を両立。' },
  { id: 'drapers', name: 'DRAPERS Special Order', origin: 'Italy', hand: 'soft', mood: 'inno', sheen: 'high', scenario: 'パーティ・個性派', color: '#1f2937', fit: 'Soft Inno', why: '大胆な色柄とカシミア混で、会話のきっかけになる。' },
  { id: 'caccioppoli', name: 'Caccioppoli Napoli', origin: 'Italy', hand: 'soft', mood: 'inno', sheen: 'mid', scenario: 'リゾートウェディング', color: '#0f766e', fit: 'Soft Inno', why: '軽量なコットン/リネンでナポリらしい抜け感を作れる。' },
  { id: 'ariston', name: 'ARISTON Avantgarde', origin: 'Italy', hand: 'soft', mood: 'inno', sheen: 'high', scenario: 'クリエイティブ業界', color: '#7c3aed', fit: 'Soft Inno', why: 'ネオンカラーや拡大チェックで「他人と同じ」を回避。' },
  { id: 'duca', name: 'Duca Visconti Corduroy', origin: 'Italy', hand: 'soft', mood: 'trad', sheen: 'mid', scenario: '冬の街着・パーティ', color: '#3a2d1f', fit: 'Soft Trad', why: '細畝でベルベットのような艶。セットアップで色気を演出。' },
  { id: 'brisbane', name: 'Brisbane Moss Corduroy', origin: 'UK', hand: 'hard', mood: 'trad', sheen: 'low', scenario: 'カントリー/カジュアル', color: '#1f2a16', fit: 'Hard Trad', why: '太畝で耐久性抜群。エイジングを楽しむ一生モノ。' },
  { id: 'bamboo', name: 'Bamboo by Harrisons', origin: 'UK', hand: 'soft', mood: 'inno', sheen: 'high', scenario: '春夏の涼感', color: '#065f46', fit: 'Soft Inno', why: '竹繊維の通気性とシルクのような光沢で涼しく上品。' },
  { id: 'wooldenim', name: 'Wool Denim by Zegna', origin: 'Italy', hand: 'soft', mood: 'inno', sheen: 'low', scenario: 'IT/クリエイティブ', color: '#0f172a', fit: 'Soft Inno', why: 'デニム見えだが色落ちせず、レストランにも通用する品格。' },
  { id: 'jersey', name: 'Technical Jersey', origin: 'Global', hand: 'soft', mood: 'inno', sheen: 'low', scenario: '長距離移動・リモート', color: '#1f2937', fit: 'Soft Blend', why: '高い伸縮性で「パジャマのような着心地」の移動特化。' }
];

// --- Questions (New 4-Axis System: 8 Questions) ---
// S: Structure (Physical), C: Contrast (Visual), P: Presence (Social), M: Mindset (Aesthetic)
// すべて「シーンを想像でき、即答できる」問いに刷新
const MANDATORY_QUESTIONS = [
  // S: Structure (Physical) - Q1-Q2
  { id: 'q1', category: 'PHYSICAL', text: '好きな人と個室レストラン。3ピースでベストまで揃え「格好いい」を極める？それともダブルジャケットで軽快にフォーマルを混ぜる？', left: 'ダブルジャケットで軽快にしたい', right: '3ピースで重厚にまとめたい', factor: 'S' },
  { id: 'q2', category: 'PHYSICAL', text: '一日の動き方をイメージすると？', left: '長時間の移動やPC作業で肩をリラックスさせたい', right: '壇上や会議で直立したシルエットを強調したい', factor: 'S' },

  // C: Contrast (Visual) - Q3-Q4
  { id: 'q3', category: 'VISUAL', text: '夜のレストラン照明で映えたい色は？', left: 'キャメル・オリーブなど肌と馴染むブレンドカラー', right: 'ロイヤルブルーやディープバーガンディなど高コントラスト', factor: 'C' },
  { id: 'q4', category: 'VISUAL', text: '写真を撮られるときの自分像は？', left: 'ナチュラルで柔らかい陰影', right: '輪郭がくっきりしたシャープな陰影', factor: 'C' },

  // P: Presence (Social) - Q5-Q6
  { id: 'q5', category: 'SOCIAL', text: '初対面の場での振る舞いは？', left: '場の空気を読みながら静かに観察する', right: '自分から挨拶し議題を前に進める', factor: 'P' },
  { id: 'q6', category: 'SOCIAL', text: '部下やパートナーにどう見られたい？', left: '親しみやすく相談しやすい', right: '決断力があり任せられる', factor: 'P' },

  // M: Mindset (Aesthetic) - Q7-Q8
  { id: 'q7', category: 'AESTHETIC', text: '旅先で惹かれる建築は？', left: 'ガラスや金属を使ったミニマル/モダン', right: '石造りや木造のクラシック', factor: 'M' },
  { id: 'q8', category: 'AESTHETIC', text: '装いで叶えたいのは？', left: '新しい価値観や遊び心を示したい', right: '伝統と格式を体現したい', factor: 'M' },
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

const buildStyleBlueprint = (axis: { S: string, C: string, P: string, M: string }) => {
  const isHard = axis.S === 'Hard';
  const isHigh = axis.C === 'High';
  const isAuth = axis.P === 'Auth';
  const isTrad = axis.M === 'Trad';

  return {
    suitStyle: {
      label: isHard || isAuth ? '3ピース' : 'ダブルジャケット',
      reason: isHard || isAuth
        ? 'ベストを重ねることで胸周りに装甲感を足し、意思決定力を視覚化します。'
        : '前開きでも絵になるダブルは、肩の力を抜きつつフォーマルの骨格をキープします。'
    },
    buttons: {
      count: isHard ? '2ボタン' : '6ボタン(段返り)',
      material: isTrad ? '本水牛釦' : 'メタル/ナット釦',
      reason: isHard
        ? '2ボタンはVゾーンを深くし、胸板を強調。伝統派は本水牛で重厚感を足します。'
        : '段返りの6ボタンなら閉じても開けてもバランスが良く、光る素材で遊び心を足せます。'
    },
    sleeve: {
      surgeon: isAuth,
      reason: isAuth
        ? '本切羽で「仕立ての良さ」を示し、腕をまくっても絵になる。'
        : '飾り切羽でコストを抑えつつ、軽快に袖口のラインを保ちます。'
    },
    lapel: {
      shape: isAuth ? 'ピークドラペル' : 'ノッチ/ワイドノッチ',
      reason: isAuth
        ? 'ピークは上方向に視線を流し、権威と存在感を強めます。'
        : 'ノッチは親しみやすく、ワイド幅ならモード感も足せる。'
    },
    trouser: {
      cuff: isHard ? 'ダブル' : 'シングル',
      reason: isHard
        ? '裾に重さを出して直立姿勢を安定させるためダブル推奨。'
        : '軽快さを優先するならシングルでクリーンに。'
    },
    lining: {
      style: isTrad ? 'キュプラ/柄裏地（総裏）' : '背抜き/アンコン',
      reason: isTrad
        ? '総裏＋キュプラで滑りと耐久を確保し、格式をキープします。'
        : '背抜きなら通気性と軽さを優先し、室内外の移動に適応。'
    },
    color: {
      palette: isTrad ? 'ミッドナイトネイビー〜チャコール' : 'オリーブ/バーガンディ/ディープグリーン',
      reason: isHigh
        ? '高コントラスト派はネイビー×白シャツやバーガンディを合わせ、輪郭を明確に。'
        : 'ブレンド派はオリーブやグレーでグラデーションを作り、柔らかな印象に。'
    }
  };
};

const getFabricSuggestions = (axis: { S: string, C: string, P: string, M: string }) => {
  const isHard = axis.S === 'Hard';
  const isHigh = axis.C === 'High';
  const isTrad = axis.M === 'Trad';

  const scored = FABRIC_LIBRARY.map(fabric => {
    let score = 0;
    if ((isHard && fabric.hand === 'hard') || (!isHard && fabric.hand === 'soft')) score += 2;
    if ((isTrad && fabric.mood === 'trad') || (!isTrad && fabric.mood === 'inno')) score += 2;
    if ((isHigh && fabric.sheen === 'high') || (!isHigh && fabric.sheen !== 'high')) score += 1;
    return { ...fabric, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);
};

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
  const [isOptionalPhase, setIsOptionalPhase] = useState(false);
  const [answers, setAnswers] = useState<Record<string, {S?: number, C?: number, P?: number, M?: number}>>({});
  const [result, setResult] = useState<any>(null);
  const [selectedPlan, setSelectedPlan] = useState<string>('milestone');
  const [bookingData, setBookingData] = useState<any>({});
  const [lotteryResult, setLotteryResult] = useState<any>(null);

  const currentQuestions = isOptionalPhase ? OPTIONAL_QUESTIONS : MANDATORY_QUESTIONS;
  const phaseProgress = ((currentStep + 1) / currentQuestions.length) * 100;

  const handleAnswer = (value: number) => {
    const question = currentQuestions[currentStep];
    const factor = question.factor; // 'S', 'C', 'P', or 'M'
    // value is -1 (left) or 1 (right), convert to appropriate score
    // Q1, Q3, Q5, Q7 use ±2, Q2, Q4, Q6, Q8 use ±1
    const isFirstQuestion = (currentStep === 0 || currentStep === 2 || currentStep === 4 || currentStep === 6);
    const score = isFirstQuestion ? (value > 0 ? 2 : -2) : (value > 0 ? 1 : -1);
    setAnswers(prev => ({ 
      ...prev, 
      [question.id]: { [factor]: score }
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
      // 1. Calculate 4-Axis Scores (New System: S, C, P, M)
      // S: Structure (Physical) - Hard (+) / Soft (-)
      const sScore = (answers.q1?.S || 0) + (answers.q2?.S || 0);
      const sPositive = sScore >= 0; // Hard if positive/zero, Soft if negative
      
      // C: Contrast (Visual) - High (+) / Blend (-)
      const cScore = (answers.q3?.C || 0) + (answers.q4?.C || 0);
      const cPositive = cScore >= 0; // High if positive/zero, Blend if negative
      
      // P: Presence (Social) - Auth (+) / Friend (-)
      const pScore = (answers.q5?.P || 0) + (answers.q6?.P || 0);
      const pPositive = pScore >= 0; // Auth if positive/zero, Friend if negative
      
      // M: Mindset (Aesthetic) - Trad (+) / Inno (-)
      const mScore = (answers.q7?.M || 0) + (answers.q8?.M || 0);
      const mPositive = mScore >= 0; // Trad if positive/zero, Inno if negative

      const axisResults = {
        S: sPositive ? 'Hard' : 'Soft',
        C: cPositive ? 'High' : 'Blend',
        P: pPositive ? 'Auth' : 'Friend',
        M: mPositive ? 'Trad' : 'Inno'
      };
      const styleBlueprint = buildStyleBlueprint(axisResults);
      const fabricSuggestions = getFabricSuggestions(axisResults);

      // 2. Map to Archetype ID using Logic Matrix
      // Format: S-C-P-M (each is H/S, H/B, A/F, T/I)
      const code = [
        sPositive ? 'H' : 'S',
        cPositive ? 'H' : 'B',
        pPositive ? 'A' : 'F',
        mPositive ? 'T' : 'I'
      ].join('');
      
      // Mapping table: S-C-P-M -> Archetype ID (参考資料のマッピングロジック)
      const mapping: Record<string, string> = {
        // Sovereign Group (Tradition & Authority dominant)
        "HHAT": "01", "SHAT": "01", "HBAT": "02", "SBAT": "02",
        // Dandy/Maverick Group (Innovation & Friendliness dominant)
        "HHFI": "11", "SHFI": "11", "HBFI": "16", "SBFI": "16",
        // Cross Types (Mix)
        "HHFT": "01", "HBFT": "02", // Tradition wins
        "HHAI": "11", "HBAI": "02", // Innovation wins
        // Additional mappings (fallback to closest)
        "HHAF": "01", "HHBF": "02", "SHBF": "11", "SBFF": "16",
      };
      
      const archetypeId = mapping[code] || '01'; // Default to The Sovereign
      const archetypeData = ARCHETYPE_DEFINITIONS[archetypeId as keyof typeof ARCHETYPE_DEFINITIONS];
      const archetype = {
        ...archetypeData,
        imageUrl: ARCHETYPE_IMAGES[archetypeId] || getArchetypeImagePath('01'), // MBTIコードベースの画像パス
        palette: COLOR_PALETTES.traditionalist // Default palette, can be customized per archetype
      };
      
      // 3. Physical Logic (simplified for now - can be enhanced with optional questions)
      let physicalType = PHYSICAL_TYPES.A;

      // 3. Plans Logic
      const vestPref = (answers as any).vest_pref;
      const vestCostRate = (typeof vestPref === 'number' && vestPref > 0) ? 0.35 : 0;
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
        const fitReason = axisResults.S === 'Hard'
          ? '肩線を崩さず直立シルエットを作りたい'
          : '長時間着ても疲れにくい柔らかさを求めたい';
        const moodReason = axisResults.M === 'Trad' ? 'クラシックな威厳を帯びたい' : '遊び心と抜け感を出したい';
        const reason = `${fabric.name}は${fabric.desc}。${fitReason}あなたに対し、${moodReason}意図を叶えます。`;
        return { title, subtitle, fabric, total, marketTotal, diff, discountRate, vestCost, reason };
      };

      // Use new axis scores for fabric selection
      const isSoft = !sPositive; // Soft if S is negative
      const isGlossy = mPositive && pPositive; // Glossy if M is Trad and P is Auth
      
      const valueFabric = FABRIC_PLANS.omc;
      const milestoneFabric = isGlossy ? FABRIC_PLANS.reda_silky : FABRIC_PLANS.vbc_n;
      const authenticFabric = isSoft ? FABRIC_PLANS.zegna : FABRIC_PLANS.dormeuil;

      const plans = {
        value: createPlanData(valueFabric, "Best Value", "圧倒的コストパフォーマンス"),
        milestone: createPlanData(milestoneFabric, "Milestone", "日常〜オフィシャルの最適解"),
        authentic: createPlanData(authenticFabric, "Authentic", "最高峰の格式と品質")
      };

      // 4. Corrections (simplified - optional questions are skipped in new 8-question system)
      let corrections: string[] = [];
      // Optional corrections are not available in 8-question system
      if (physicalType.code === 'A' && corrections.length === 0) corrections.push("基本体型補正");

      const identityId = `${archetype.id}-${physicalType.code}`;
      setResult({ 
        archetype, 
        physicalType, 
        plans, 
        corrections, 
        identityId,
        axisScores: {
          S: sScore,
          C: cScore,
          P: pScore,
          M: mScore
        },
        axisResults,
        styleBlueprint,
        fabricSuggestions
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
    <div className="fixed top-[80px] left-0 w-full h-[1px] bg-[#222] z-50">
      <div className="h-full bg-[#C5A059] transition-all duration-700 ease-out" style={{ width: `${progress}%` }} />
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

const ClickableQuestionScreen = ({ question, currentStep, totalSteps, onAnswer, onBack, progress }: any) => {
  return (
    <div className={`min-h-screen ${THEME.bg} ${THEME.text} font-sans pt-24 pb-10`}>
      <ProgressBar progress={progress} />
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
  const cardStyle = plan?.fabric?.palette ? {
    background: `linear-gradient(140deg, ${plan.fabric.palette.base} 0%, #0f0f0f 70%)`
  } : undefined;

  return (
    <div
      onClick={onSelect}
      className={`relative cursor-pointer p-8 transition-all duration-500 border flex flex-col h-full group overflow-hidden
        ${isSelected
          ? 'border-[#C5A059] bg-[#1A1A1A] shadow-[0_0_30px_rgba(197,160,89,0.15)] z-10'
          : 'border-[#333] bg-[#1A1A1A] hover:border-[#666] opacity-60 hover:opacity-100'
        }
      `}
      style={cardStyle}
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
        <p className="text-[10px] text-[#d0d0d0] leading-relaxed mb-2">{plan.subtitle}</p>
        <p className="text-[11px] text-[#bbb] leading-relaxed">{plan.reason}</p>
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
  const scenarioAxis = { value: 2, authentic: 2, innovative: 3, functional: 1 };
  const scenarioFabric = selectFashionTheory(scenarioAxis);
  const scenarioBlueprint = buildBlueprint(scenarioFabric, scenarioAxis);
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

      {/* Fabric & Styling Reasoning */}
      <div className="max-w-7xl mx-auto px-6 mt-16 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#1A1A1A] border border-[#333] p-8 shadow-2xl">
          <div className="flex items-center mb-4 text-[#666] text-[10px] font-bold tracking-[0.2em] uppercase">
            <Feather className="w-4 h-4 mr-3 text-[#C5A059]" /> Fabric Suggestion Matrix
          </div>
          <p className="text-xs text-[#AAA] mb-6">実際の取扱い生地（カノニコ・REDA・ドーメル中心）に加え、相性の良いニッチ素材を優先順位付きで最大4件提示します。</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {result.fabricSuggestions.map((fab: any, idx: number) => (
              <div key={fab.id} className="border border-[#333] bg-[#111] p-4 flex flex-col" style={{ background: `linear-gradient(120deg, ${fab.color}22 0%, #0f0f0f 90%)` }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-[#666]">#{idx + 1} {fab.origin}</span>
                  <span className="text-[10px] text-[#C5A059] font-mono">{fab.fit}</span>
                </div>
                <h4 className="text-sm text-[#F5F5F5] font-serif mb-1">{fab.name}</h4>
                <p className="text-[11px] text-[#d0d0d0] mb-1">シーン: {fab.scenario}</p>
                <p className="text-[11px] text-[#9AA0A6]">理由: {fab.why}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#1A1A1A] border border-[#333] p-8 shadow-2xl">
          <div className="flex items-center mb-4 text-[#666] text-[10px] font-bold tracking-[0.2em] uppercase">
            <MapPin className="w-4 h-4 mr-3 text-[#C5A059]" /> Styling Blueprint
          </div>
          <p className="text-xs text-[#AAA] mb-6">心理軸（S/C/P/M）を服飾学へ翻訳し、各要素に理由を付与しました。</p>
          <div className="space-y-3 text-sm text-[#DDD]">
            <div className="border border-[#333] p-3">
              <div className="text-[11px] text-[#888] uppercase tracking-[0.2em] mb-1">Style</div>
              <div className="font-serif text-[#F5F5F5]">{result.styleBlueprint.suitStyle.label}</div>
              <p className="text-[11px] text-[#9AA0A6]">理由: {result.styleBlueprint.suitStyle.reason}</p>
            </div>
            <div className="border border-[#333] p-3">
              <div className="text-[11px] text-[#888] uppercase tracking-[0.2em] mb-1">Buttons</div>
              <div className="font-serif text-[#F5F5F5]">{result.styleBlueprint.buttons.count} / {result.styleBlueprint.buttons.material}</div>
              <p className="text-[11px] text-[#9AA0A6]">理由: {result.styleBlueprint.buttons.reason}</p>
            </div>
            <div className="border border-[#333] p-3">
              <div className="text-[11px] text-[#888] uppercase tracking-[0.2em] mb-1">Lapel & Sleeve</div>
              <div className="font-serif text-[#F5F5F5]">{result.styleBlueprint.lapel.shape} / {result.styleBlueprint.sleeve.surgeon ? '本切羽' : '飾り切羽'}</div>
              <p className="text-[11px] text-[#9AA0A6]">理由: {result.styleBlueprint.lapel.reason} / {result.styleBlueprint.sleeve.reason}</p>
            </div>
            <div className="border border-[#333] p-3">
              <div className="text-[11px] text-[#888] uppercase tracking-[0.2em] mb-1">Trousers & Lining</div>
              <div className="font-serif text-[#F5F5F5]">{result.styleBlueprint.trouser.cuff} / {result.styleBlueprint.lining.style}</div>
              <p className="text-[11px] text-[#9AA0A6]">理由: {result.styleBlueprint.trouser.reason} / {result.styleBlueprint.lining.reason}</p>
            </div>
            <div className="border border-[#333] p-3">
              <div className="text-[11px] text-[#888] uppercase tracking-[0.2em] mb-1">Color</div>
              <div className="font-serif text-[#F5F5F5]">{result.styleBlueprint.color.palette}</div>
              <p className="text-[11px] text-[#9AA0A6]">理由: {result.styleBlueprint.color.reason}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scenario-based prompts and quick blueprint */}
      <div className="max-w-7xl mx-auto px-6 mt-16 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#1A1A1A] border border-[#333] p-8 shadow-2xl">
          <div className="flex items-center mb-4 text-[#666] text-[10px] font-bold tracking-[0.2em] uppercase">
            <Heart className="w-4 h-4 mr-3 text-[#C5A059]" /> Scene-based Questions
          </div>
          <p className="text-xs text-[#AAA] mb-6">シーンを即座にイメージできる問いかけで、回答しやすく本音を引き出す設計です。</p>
          <div className="space-y-4">
            {scenarioQuestions.map((q) => (
              <div key={q.id} className="border border-[#333] bg-[#111] p-4">
                <div className="text-[10px] text-[#666] uppercase tracking-[0.2em] mb-1">{q.tone}</div>
                <div className="text-sm text-[#F5F5F5] font-serif mb-2 leading-relaxed">{q.prompt}</div>
                <ul className="space-y-2">
                  {q.options.map((opt) => (
                    <li key={opt.id} className="text-[11px] text-[#9AA0A6] leading-snug">
                      <span className="text-[#C5A059] mr-2">•</span>
                      <strong className="text-[#F5F5F5] mr-1">{opt.label}</strong>
                      <span className="text-[#AAA]">{opt.rationale}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#1A1A1A] border border-[#333] p-8 shadow-2xl flex flex-col">
          <div className="flex items-center mb-4 text-[#666] text-[10px] font-bold tracking-[0.2em] uppercase">
            <Sparkles className="w-4 h-4 mr-3 text-[#C5A059]" /> Quick Styling Blueprint
          </div>
          <p className="text-xs text-[#AAA] mb-6">心理軸スコアから瞬時に導くサンプル提案。背景カラーは推奨生地パレットを反映。</p>
          <div
            className="border border-[#333] bg-[#111] p-6 flex-1"
            style={{ background: `linear-gradient(135deg, ${scenarioFabric.palette[0]}33 0%, ${scenarioFabric.palette[1]}11 100%)` }}
          >
            <div className="text-[10px] text-[#666] uppercase tracking-[0.2em] mb-2">{scenarioFabric.name}</div>
            <div className="text-lg text-[#F5F5F5] font-serif mb-4">{scenarioBlueprint.jacketStyle === 'double-breasted' ? 'ダブルブレスト' : 'スリーピース'} / {scenarioBlueprint.lapel === 'peak' ? 'ピークドラペル' : 'ノッチドラペル'}</div>
            <ul className="text-[11px] text-[#AAA] space-y-2 mb-4">
              <li>ボタン: {scenarioBlueprint.buttonCount}個 / 袖口: {scenarioBlueprint.cuffStyle === 'open' ? '本切羽' : '開き見せ'}</li>
              <li>裾: {scenarioBlueprint.trouserHem === 'double' ? 'ダブル' : 'シングル'} / 裏地: {scenarioBlueprint.lining === 'patterned' ? '柄裏地' : 'キュプラ'}</li>
              <li>{scenarioBlueprint.colorNotes}</li>
            </ul>
            <p className="text-[11px] text-[#9AA0A6] leading-relaxed">革新的スコアが高い場合はダブルブレストとピークドラペルで華やかに、価値重視ではダブル裾で安定感を演出するサンプルです。</p>
          </div>
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
          無料採寸を依頼する <ArrowRight className="ml-3 w-4 h-4" />
          </button>
      </div>

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
                  <h4 className="text-[#C5A059] text-sm font-bold mb-2">{result.archetype.details.psychology.title}</h4>
                  <p className="text-gray-300 text-xs leading-relaxed mb-2">{result.archetype.details.psychology.text}</p>
                  <p className="text-[10px] text-gray-500 mt-2">Ref: {result.archetype.details.psychology.tag}</p>
                </DetailAccordion>

                {/* Philosophy */}
                <DetailAccordion
                  icon={<MapPin className="w-4 h-4 text-green-400" />}
                  title="PHILOSOPHY & THEOLOGY"
                  subtitle="神学・哲学・人生論"
                  isOpen={openDetail === 'philosophy'}
                  onClick={() => setOpenDetail(openDetail === 'philosophy' ? null : 'philosophy')}
                >
                  <h4 className="text-[#C5A059] text-sm font-bold mb-2">{result.archetype.details.philosophy.title}</h4>
                  <p className="text-gray-300 text-xs leading-relaxed italic border-l-2 border-[#C5A059]/30 pl-3">
                    {result.archetype.details.philosophy.text}
                  </p>
                </DetailAccordion>

                {/* Romance */}
                <DetailAccordion
                  icon={<Heart className="w-4 h-4 text-red-400" />}
                  title="ROMANCE & FORTUNE"
                  subtitle="恋愛社会学・運勢"
                  isOpen={openDetail === 'romance'}
                  onClick={() => setOpenDetail(openDetail === 'romance' ? null : 'romance')}
                >
                  <h4 className="text-[#C5A059] text-sm font-bold mb-2">{result.archetype.details.romance.title}</h4>
                  <p className="text-gray-300 text-xs leading-relaxed mb-3">{result.archetype.details.romance.text}</p>
                  <div className="bg-white/5 p-3 rounded flex items-center gap-3">
                    <Sparkles className="w-4 h-4 text-[#C5A059]" />
                    <div>
                      <span className="text-[9px] text-gray-500 block uppercase tracking-wider">Lucky Item</span>
                      <span className="text-xs text-gray-200">{result.archetype.details.romance.lucky}</span>
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
