// 拡張された生地データベース
// 実際に扱える生地とニッチブランド、レア素材を含む

export interface FabricCharacteristics {
  texture: string;
  weight: string;
  season: string;
  shine: string;
  drape: string;
  special?: string;
}

export interface FabricData {
  id: string;
  name: string;
  collection: string;
  origin: string;
  type?: string;
  history: string;
  philosophy: string;
  characteristics: FabricCharacteristics;
  features: string[];
  basePrice: number;
  marketPrice: number;
  suitableFor: string[];
  personality: string[];
  bodyType: string[];
  scene: string[];
  category: 'major' | 'milestone' | 'authentic' | 'niche' | 'special';
}

/**
 * メジャー生地（実際に扱える主要ブランド）
 */
export const MAJOR_FABRICS: Record<string, FabricData> = {
  omc: {
    id: 'omc',
    name: 'Order Made Collection',
    collection: 'OMC',
    origin: 'Japan/Global',
    history: '機能性と耐久性を兼ね備えた、賢いエントリーモデル',
    philosophy: '高品質を適正価格で提供',
    characteristics: {
      texture: '滑らかで扱いやすい',
      weight: '260-280g/m',
      season: 'オールシーズン',
      shine: '適度な光沢',
      drape: 'バランス型',
    },
    features: ['防シワ加工', 'ポリエステル混紡', '耐久性◎', 'コストパフォーマンス最強'],
    basePrice: 96000,
    marketPrice: 120000,
    suitableFor: ['ビジネス', '日常使い'],
    personality: ['実用的', 'コスト意識', 'バランス重視'],
    bodyType: ['標準体型', 'どの体型でも'],
    scene: ['日常のビジネス', '就職活動', '初めてのオーダー'],
    category: 'major',
  },

  canonico: {
    id: 'canonico',
    name: 'V.B. Canonico',
    collection: 'Perennial',
    origin: 'Italy',
    history: '1663年創業。世界中のテーラーやアパレルに生地を供給する歴史あるミル',
    philosophy: '高品質な生地を適正価格で',
    characteristics: {
      texture: 'しっとりとした質感、イタリアらしいヌメリ感',
      weight: '260-280g/m',
      season: 'オールシーズン',
      shine: '適度な光沢、美しい発色',
      drape: 'イタリアらしい柔らかなドレープ',
    },
    features: ['Super 110s', '発色が良い', 'コストパフォーマンス最強', '適度な耐久性'],
    basePrice: 130900,
    marketPrice: 165000,
    suitableFor: ['ビジネス', 'セミフォーマル', '日常使い'],
    personality: ['親和的', '実用的', 'バランス重視', 'イタリア好き'],
    bodyType: ['標準体型', '柔らかな骨格', 'どの体型でも'],
    scene: ['日常のビジネス', 'カジュアルな会食', 'セミフォーマル'],
    category: 'milestone',
  },

  reda: {
    id: 'reda',
    name: 'REDA',
    collection: 'Silky Effect',
    origin: 'Italy',
    history: '1865年創業。革新的な加工技術で知られるイタリアの名門',
    philosophy: 'イノベーションと伝統の融合',
    characteristics: {
      texture: 'ドルフィン加工による滑らかさ、シルクのような手触り',
      weight: '250-270g/m',
      season: 'オールシーズン',
      shine: '強い光沢',
      drape: 'モダンで形態安定',
    },
    features: ['ドルフィン加工', '強い光沢', '形態安定', 'Super 110s'],
    basePrice: 135900,
    marketPrice: 160000,
    suitableFor: ['ビジネス', 'パーティー', '華やかな場'],
    personality: ['モダン', '革新的', '光沢を好む', 'イタリア好き'],
    bodyType: ['標準体型', '直線的骨格'],
    scene: ['ビジネス', 'パーティー', '華やかな場', '夜の会食'],
    category: 'milestone',
  },

  dormeuil: {
    id: 'dormeuil',
    name: 'Dormeuil',
    collection: 'Amadeus',
    origin: 'UK (French Merchant)',
    history: '1842年創業。フランスの感性と英国の技術を融合させた現存する世界最古のマーチャント',
    philosophy: '伝統と革新の融合（英国の織機×フランスのデザイン）',
    characteristics: {
      texture: '重厚で打ち込みが良い、英国生地の重厚さと美しい光沢を両立',
      weight: '300-320g/m',
      season: '秋冬メイン、オールシーズン可',
      shine: '美しい光沢',
      drape: '構築的で型崩れしにくい',
    },
    features: ['ペーパープレス', '英国王室御用達', '極めて高い耐久性', '非常に仕立て映え'],
    basePrice: 185000,
    marketPrice: 240000,
    suitableFor: ['フォーマル', '重要な商談', '式典', '格式高い場'],
    personality: ['権威的', '伝統重視', '格式を重んじる', '英国好き'],
    bodyType: ['直線的骨格', '肩幅がしっかりしている'],
    scene: ['重要なプレゼン', '式典', '格式高い会食', 'VIPとの商談'],
    category: 'authentic',
  },

  zegna: {
    id: 'zegna',
    name: 'Ermenegildo Zegna',
    collection: 'Trofeo',
    origin: 'Italy',
    history: '1910年創業。原毛の買い付けから製品化まで自社一貫生産する世界最高峰のミル',
    philosophy: '最高の素材は最高の自然環境から生まれる',
    characteristics: {
      texture: 'シルクのような手触り、圧倒的な光沢',
      weight: '240-260g/m',
      season: 'オールシーズン',
      shine: '圧倒的な光沢',
      drape: '流れるようなドレープ、極上の着心地',
    },
    features: ['最高級原毛', '圧倒的知名度', '極上の着心地', '高品質なオーストラリア産スーパーファインウール'],
    basePrice: 198000,
    marketPrice: 280000,
    suitableFor: ['最高級フォーマル', 'エグゼクティブ', '特別な式典'],
    personality: ['成功者', '洗練された', '品質重視', 'イタリア好き'],
    bodyType: ['柔らかな骨格', '曲線的', 'どの体型でも'],
    scene: ['重要な商談', 'VIPとの会食', '特別な式典', '最高級の場'],
    category: 'authentic',
  },
};

/**
 * ニッチブランド（通好みのマーチャント）
 */
export const NICHE_FABRICS: Record<string, FabricData> = {
  drapers: {
    id: 'drapers',
    name: 'DRAPERS',
    collection: 'Lollipop Collection',
    origin: 'Italy (Bologna)',
    history: 'ボローニャの至宝。自社で織らず、カノニコ等に特注した「別注生地」を展開',
    philosophy: '人生を楽しむための服。ビジネスよりも、着る喜びを優先',
    characteristics: {
      texture: '大胆な色柄、カシミア混の柔らかさ',
      weight: '260-300g/m',
      season: 'オールシーズン',
      shine: '独特の発色',
      drape: 'カシミア混の柔らかさ',
    },
    features: ['別注生地', 'カシミア混', '大胆な色柄', 'ローリーポップなど独特のコレクション'],
    basePrice: 165000,
    marketPrice: 220000,
    suitableFor: ['パーティー', '個性的なビジネス', 'クリエイティブな場'],
    personality: ['個性的', '楽しむことを重視', 'イタリアンスタイル', 'ファッション感度高'],
    bodyType: ['柔らかな骨格', 'どの体型でも'],
    scene: ['パーティー', 'クリエイティブな場', '自己表現の場', 'ファッションイベント'],
    category: 'niche',
  },

  caccioppoli: {
    id: 'caccioppoli',
    name: 'Caccioppoli',
    collection: 'Napoli Collection',
    origin: 'Italy (Naples)',
    history: 'ナポリの王様。南イタリアらしい鮮やかな発色のコットンやリネン（麻）が主力',
    philosophy: 'ナポリの太陽を纏う。夏場のパーティやリゾートウェディングに最適',
    characteristics: {
      texture: '軽量で通気性抜群',
      weight: '220-240g/m',
      season: '春夏メイン',
      shine: '鮮やかな発色',
      drape: 'ナポリ仕立てとの相性抜群、非常に軽量',
    },
    features: ['軽量', 'リネン・コットン', '鮮やかな色', '通気性抜群'],
    basePrice: 145000,
    marketPrice: 190000,
    suitableFor: ['夏のパーティー', 'リゾートウェディング', '春夏のイベント'],
    personality: ['陽気', '開放的', '南イタリアスタイル', '夏好き'],
    bodyType: ['柔らかな骨格', '細身'],
    scene: ['夏のパーティー', 'リゾート', 'カジュアルな会食', '屋外イベント'],
    category: 'niche',
  },

  ariston: {
    id: 'ariston',
    name: 'ARISTON',
    collection: 'Avant-Garde',
    origin: 'Italy',
    history: 'アヴァンギャルド。伝統的なチェック柄を現代風に拡大したり、ネオンカラーを織り交ぜたりする前衛的なデザイン',
    philosophy: '他人と同じは退屈。ファッション業界人やクリエイター向け',
    characteristics: {
      texture: '前衛的なデザイン',
      weight: '260-280g/m',
      season: 'オールシーズン',
      shine: 'ネオンカラーを織り交ぜる',
      drape: 'モダンな構築',
    },
    features: ['前衛的デザイン', '拡大チェック', 'ネオンカラー', '独特の色柄'],
    basePrice: 155000,
    marketPrice: 200000,
    suitableFor: ['ファッション業界', 'クリエイティブ職', 'アート関連'],
    personality: ['前衛的', '個性重視', 'ファッション感度高', 'アーティスト'],
    bodyType: ['どの体型でも'],
    scene: ['ファッションイベント', 'クリエイティブな場', 'アート関連', 'パーティー'],
    category: 'niche',
  },
};

/**
 * 特殊素材（コーデュロイ、レア素材）
 */
export const SPECIAL_MATERIALS: Record<string, FabricData> = {
  corduroy_italian: {
    id: 'corduroy_italian',
    name: 'Duca Visconti',
    collection: 'Fine Corduroy',
    origin: 'Italy',
    type: 'コーデュロイ',
    history: 'イタリア系コーデュロイ。畝（うね）が細く、ベルベットのような光沢と柔らかさがある',
    philosophy: 'ドレッシーな「街着」として。パーティでも通用する艶',
    characteristics: {
      texture: 'ベルベットのような光沢、細い畝',
      weight: '320-350g/m',
      season: '秋冬',
      shine: '細い畝による光沢',
      drape: '柔らかく高級感',
    },
    features: ['細畝', 'ベルベット光沢', 'ドレッシー', '艶がある'],
    basePrice: 148000,
    marketPrice: 195000,
    suitableFor: ['パーティー', 'カジュアルフォーマル', '秋冬のイベント'],
    personality: ['個性的', '温かみ', 'イタリアンスタイル', 'ファッション感度高'],
    bodyType: ['柔らかな骨格', 'どの体型でも'],
    scene: ['秋冬のパーティー', 'カジュアルな会食', 'ファッションイベント'],
    category: 'special',
  },

  corduroy_british: {
    id: 'corduroy_british',
    name: 'Brisbane Moss',
    collection: 'Heavy Corduroy',
    origin: 'UK',
    type: 'コーデュロイ',
    history: 'ブリティッシュ系コーデュロイ。畝が太く、肉厚で非常に重い。元々は狩猟用',
    philosophy: '圧倒的な耐久性。エイジングを楽しむ「一生モノ」のカジュアルスーツ',
    characteristics: {
      texture: '太畝で肉厚',
      weight: '400-450g/m',
      season: '秋冬',
      shine: 'マット',
      drape: '重厚で耐久性抜群',
    },
    features: ['太畝', '極めて耐久性高', 'エイジング楽しめる', '一生モノ'],
    basePrice: 138000,
    marketPrice: 180000,
    suitableFor: ['カントリージェントルマン', 'カジュアル', 'アウトドア'],
    personality: ['伝統重視', '実用的', 'ブリティッシュスタイル', 'エイジング好き'],
    bodyType: ['直線的骨格', 'どの体型でも'],
    scene: ['カジュアルビジネス', 'カントリースタイル', 'アウトドア'],
    category: 'special',
  },

  bamboo: {
    id: 'bamboo',
    name: 'Harrisons Bamboo',
    collection: 'Eco Luxury',
    origin: 'UK',
    type: 'バンブー',
    history: '竹の繊維を使用。シルクのような光沢と、麻のような通気性を持つエコ素材',
    philosophy: 'SDGs的な観点と、日本の夏に対応する機能性を併せ持つ、ストーリー性のある商品',
    characteristics: {
      texture: 'シルクのような光沢',
      weight: '230-250g/m',
      season: '春夏',
      shine: '自然な光沢',
      drape: '麻のような通気性',
    },
    features: ['エコ素材', 'シルク光沢', '通気性抜群', 'SDGs対応'],
    basePrice: 152000,
    marketPrice: 198000,
    suitableFor: ['春夏のエレガンス', 'エコイベント', 'SDGs関連'],
    personality: ['環境意識', '革新的', '自然派', 'エコ意識'],
    bodyType: ['柔らかな骨格', 'どの体型でも'],
    scene: ['春夏のビジネス', 'エコイベント', 'SDGs関連イベント'],
    category: 'special',
  },

  wool_denim: {
    id: 'wool_denim',
    name: 'Zegna Wool Denim',
    collection: 'Urban Casual',
    origin: 'Italy',
    type: 'ウールデニム',
    history: '見た目はデニムだが、素材はウール100%。色落ちせず、ドレス感がある',
    philosophy: 'ジーンズのようなカジュアルさがありながら、レストランに入店できる品格を保つ',
    characteristics: {
      texture: 'デニム風だがウール100%',
      weight: '280-300g/m',
      season: 'オールシーズン',
      shine: 'マット',
      drape: 'カジュアルだがドレス感',
    },
    features: ['ウール100%', 'デニム風', '色落ちしない', 'IT・クリエイティブ向け'],
    basePrice: 168000,
    marketPrice: 215000,
    suitableFor: ['IT・クリエイティブ', 'カジュアルビジネス', 'スタートアップ'],
    personality: ['カジュアル', '革新的', 'IT系', 'クリエイティブ'],
    bodyType: ['どの体型でも'],
    scene: ['カジュアルビジネス', 'クリエイティブな場', 'IT企業', 'スタートアップ'],
    category: 'special',
  },

  jersey: {
    id: 'jersey',
    name: 'Travel Jersey',
    collection: 'Performance',
    origin: 'Japan/Italy',
    type: 'ジャージー',
    history: '編み物（ニット）素材。伸縮性が極めて高い',
    philosophy: '機内や新幹線移動に特化。「パジャマのような着心地のスーツ」',
    characteristics: {
      texture: 'ニット素材で伸縮性',
      weight: '250-270g/m',
      season: 'オールシーズン',
      shine: 'マット',
      drape: '極めて柔らかい',
    },
    features: ['伸縮性', 'シワになりにくい', '機能性', '移動に最適'],
    basePrice: 142000,
    marketPrice: 185000,
    suitableFor: ['移動の多いエグゼクティブ', '機能性重視', '出張が多い'],
    personality: ['実用的', '移動が多い', '快適性重視', 'エグゼクティブ'],
    bodyType: ['どの体型でも'],
    scene: ['出張', '移動の多いビジネス', '新幹線・飛行機', '機能性重視'],
    category: 'special',
  },
};

/**
 * 全生地データベース
 */
export const ALL_FABRICS: Record<string, FabricData> = {
  ...MAJOR_FABRICS,
  ...NICHE_FABRICS,
  ...SPECIAL_MATERIALS,
};

/**
 * カテゴリ別に生地を取得
 */
export const getFabricsByCategory = (category: FabricData['category']): FabricData[] => {
  return Object.values(ALL_FABRICS).filter((fabric) => fabric.category === category);
};

/**
 * 価格帯別に生地を取得
 */
export const getFabricsByPriceRange = (min: number, max: number): FabricData[] => {
  return Object.values(ALL_FABRICS).filter(
    (fabric) => fabric.basePrice >= min && fabric.basePrice <= max
  );
};

/**
 * シーン別に生地を取得
 */
export const getFabricsByScene = (scene: string): FabricData[] => {
  return Object.values(ALL_FABRICS).filter((fabric) => fabric.scene.includes(scene));
};

/**
 * 体型別に生地を取得
 */
export const getFabricsByBodyType = (bodyType: string): FabricData[] => {
  return Object.values(ALL_FABRICS).filter((fabric) => fabric.bodyType.includes(bodyType));
};
