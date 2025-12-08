// 学術的根拠データベース
// フロントエンドには表示しないが、診断ロジックの基盤となる学問的根拠を定義

/**
 * 心理学の系譜
 * 人の心理を体現する学問として、主に心理学を指す
 */
export const PSYCHOLOGY_SCHOOLS = {
  structuralism: {
    name: '構成主義',
    nameEn: 'Structuralism',
    founder: 'ヴィルヘルム・ヴント',
    year: 1879,
    principle: '意識の構成要素を分析。内観法を用いて意識の構成要素を分析',
    application: '細部へのこだわり、ディテールの重視。スーツの各パーツへの注目',
    relevantAxis: 'S', // Structure軸に関連
  },
  functionalism: {
    name: '機能主義',
    nameEn: 'Functionalism',
    founder: 'ウィリアム・ジェームズ',
    year: 1890,
    principle: '意識の内容ではなく、心がどのような機能や目的を持っているかに焦点',
    application: '実用性、機能性を重視したスタイル。TPOに応じた適切な選択',
    relevantAxis: 'M', // Mindset軸に関連
  },
  behaviorism: {
    name: '行動主義',
    nameEn: 'Behaviorism',
    founder: 'ワトソン、スキナー',
    year: 1913,
    principle: '内的な心や意識は直接観察できないとし、外部から観察可能な「行動」のみを研究対象',
    application: '社会的な印象、他者からの評価を重視。刺激（S）と反応（R）の関係',
    relevantAxis: 'P', // Presence軸に関連
  },
  gestalt: {
    name: 'ゲシュタルト心理学',
    nameEn: 'Gestalt Psychology',
    founder: 'ヴェルトハイマー、ケーラー',
    year: 1912,
    principle: '「全体は部分の総和以上である」という原則。知覚や認知における「全体性」や「まとまり」の法則性',
    application: '全体のバランス、シルエットの調和。パーツではなく全体としての印象',
    relevantAxis: 'S', // Structure軸に関連
  },
  psychoanalysis: {
    name: '精神分析学',
    nameEn: 'Psychoanalysis',
    founder: 'フロイト',
    year: 1896,
    principle: '意識だけでなく、「無意識」の領域に焦点。人の行動や性格が幼少期の経験や抑圧された欲求によって形成',
    application: '深層心理、本能的な好み。無意識的な色彩選択やスタイル嗜好',
    relevantAxis: 'C', // Contrast軸に関連
  },
  cognitive: {
    name: '認知心理学',
    nameEn: 'Cognitive Psychology',
    founder: '情報処理モデル',
    year: 1960,
    principle: '人の内部で起こる「認知（知覚、記憶、思考、言語など）」のプロセスを情報処理モデルで解明',
    application: '色彩認知、パターン認識。視覚情報の処理と好みの形成',
    relevantAxis: 'C', // Contrast軸に関連
  },
  humanistic: {
    name: '人間性心理学',
    nameEn: 'Humanistic Psychology',
    founder: 'ロジャーズ、マズロー',
    year: 1950,
    principle: '精神分析や行動主義とは異なり、人の潜在的な成長力や自己実現の欲求、主体性を重視',
    application: '個性の表現、自己アイデンティティ。自己実現としてのファッション選択',
    relevantAxis: 'P', // Presence軸に関連
  },
  social: {
    name: '社会心理学',
    nameEn: 'Social Psychology',
    year: 1908,
    principle: '社会の中での人の行動、集団の影響、対人関係を研究',
    application: 'リーダーシップスタイル、社会的地位の表現、集団内での役割',
    relevantAxis: 'P', // Presence軸に関連
  },
  developmental: {
    name: '発達心理学',
    nameEn: 'Developmental Psychology',
    principle: '生涯にわたる心の発達、年齢に応じた心理的変化',
    application: '年齢に応じたスタイル選択、ライフステージとファッション',
    relevantAxis: 'M', // Mindset軸に関連
  },
  evolutionary: {
    name: '進化心理学',
    nameEn: 'Evolutionary Psychology',
    year: 1992,
    principle: '人の心理や行動を進化の観点から解明。恋愛行動とパートナー選択',
    application: '資源保持能力の誇示、庇護欲のアピール。配偶者選択における装飾',
    relevantAxis: 'P', // Presence軸に関連
  },
};

/**
 * ファッション理論
 * 世界の主要な生地産地とその特性
 */
export const FASHION_THEORIES = {
  italian: {
    name: 'イタリア系',
    nameEn: 'Italian Style',
    keywords: ['色気', '柔らかさ', '芸術品', '身に纏う芸術品'],
    philosophy: '見た目の美しさ、手触りの良さ、軽さを最優先',
    climate: '温暖な地中海気候が生んだ、流れるようなドレープ',
    characteristics: {
      texture: '滑らか、しっとり、ヌメリ感',
      drape: '流れるようなドレープ',
      color: '鮮やかな発色、美しい光沢',
      weight: '軽量（240-280g/m）',
    },
    brands: {
      major: ['Ermenegildo Zegna', 'Loro Piana', 'CANONICO', 'REDA'],
      niche: ['DRAPERS', 'Caccioppoli', 'ARISTON'],
    },
    suitableFor: ['パーティー', '勝負服', '美しさ重視'],
  },
  british: {
    name: 'ブリティッシュ系',
    nameEn: 'British Style',
    keywords: ['堅牢', '伝統', '鎧（アーマー）'],
    philosophy: '湿気が多く曇りの多い英国気候に耐えうる、太い糸でしっかりと織り込まれた生地',
    climate: '湿気が多く曇りの多い英国気候',
    characteristics: {
      texture: '硬い、ハリがある、打ち込みが良い',
      drape: 'マット、構築的シルエット',
      color: '深い色合い、端正',
      weight: '重厚（300-350g/m）',
    },
    brands: {
      major: ['DORMEUIL', 'Fox Brothers', 'Harrisons of Edinburgh'],
      niche: ['Scabal', 'Holland & Sherry'],
    },
    suitableFor: ['ビジネス', '長寿命', '耐久性重視'],
  },
  american: {
    name: 'アメリカン系',
    nameEn: 'American Style',
    keywords: ['実用性', '合理性', '既製服文化の象徴'],
    philosophy: '大量生産の既製服が発展。耐久性と扱いやすさが重視',
    characteristics: {
      texture: 'ざっくり、ドライ、マット',
      drape: '素朴、機能的',
      color: 'ナチュラル、実用的',
      weight: '中重量（280-320g/m）',
    },
    brands: {
      major: ['American Woolen Company'],
      style: ['Brooks Brothers', 'J.Press (アメトラ)'],
    },
    suitableFor: ['日常着', '扱いやすさ', '実用性重視'],
  },
  japanese: {
    name: '日本系（尾州）',
    nameEn: 'Japanese Style (Bishu)',
    keywords: ['技術', '緻密', 'ハイブリッド', '世界一の品質管理'],
    philosophy: 'イタリアのような艶と英国のような耐久性を、日本の気候（高温多湿）に合わせてハイブリッド',
    location: '愛知県一宮市を中心とする尾州（びしゅう）。世界三大毛織物産地の一つ',
    characteristics: {
      texture: 'ふっくら、バランス型、滑らか',
      drape: '深い色合い、端正、復元力高',
      color: '深い黒（漆黒）の表現が世界最高レベル',
      weight: '中重量（260-300g/m）',
      special: '湿度調整機能に優れる',
    },
    brands: {
      major: ['御幸毛織 (Miyuki)', '葛利毛織 (Kuzuri)', '日本毛織 (Nikke)'],
    },
    suitableFor: ['日本の気候', '機能性と品質', 'ハイブリッド'],
  },
};

/**
 * クラシックスタイルの鉄則
 */
export const CLASSIC_STYLE_RULES = {
  sleeve: {
    name: '袖の長さ（The Cuff Exposure）',
    rule: 'シャツの袖がジャケットから 1.0cm 〜 1.5cm 見えていること',
    reasoning: {
      aesthetic: 'ジャケットの袖口（重い色）と手（肌色）の間にシャツ（白や淡色）が入ることで、視覚的な区切りができ、腕が長く綺麗に見える',
      practical: 'ジャケットの袖口が直接肌に触れて皮脂汚れが付くのを防ぐ（シャツは洗濯できるが、スーツは毎回洗えない）',
    },
    note: 'イタリア系など袖が細いスーツの場合、シャツのカフス周りが太いと中で詰まってしまい、綺麗に出ない',
  },
  pocketChief: {
    name: 'ポケットチーフ（Pocket Square）',
    rule: '挿すか挿さないか迷ったら、挿す',
    materials: {
      linen: {
        name: 'リネン（麻）',
        occasion: '昼・ビジネス',
        note: '最もフォーマルかつ基本。白いリネンチーフは万能',
      },
      silk: {
        name: 'シルク（絹）',
        occasion: '夜・パーティ',
        note: '光沢があり華やか。ビジネスでは少し派手に見えることがある',
      },
    },
    folds: {
      tvFold: {
        name: 'TVフォールド（スクエア）',
        method: '四角く畳んで、1cmだけ顔を出す',
        occasion: 'ビジネス、厳粛な式典',
        material: 'リネン素材推奨',
      },
      puff: {
        name: 'パフドスタイル',
        method: 'ふんわりと無造作に入れる',
        occasion: 'パーティ、ノーネクタイの時',
        material: 'シルク素材推奨',
      },
    },
  },
};

/**
 * TPO別の最適マトリクス
 */
export const SCENE_MATRIX = {
  business: {
    name: 'ビジネス（信頼・威厳）',
    recommendedStyle: '英国生地（ドーメル、ハリソンズ）',
    colors: ['ダークネイビー', 'チャコールグレー'],
    goal: '揺るがない信頼感。構築的なショルダーラインで、相手に安心感と威圧感を与える',
    fabrics: ['dormeuil', 'harrisons', 'miyuki'],
  },
  party: {
    name: 'パーティ（華やか・個性的）',
    recommendedStyle: '伊ニッチ（アリストン、ドラッパーズ）、伊コーデュロイ（ヴィスコンティ）',
    colors: ['明るい色', '光沢のある色'],
    goal: '会話のきっかけになる服。照明映えする光沢感や、珍しい素材感でセンスをアピール',
    fabrics: ['ariston', 'drapers', 'corduroy_italian', 'zegna'],
  },
  casual: {
    name: '日常・デート（リラックス・知的）',
    recommendedStyle: 'ウールデニム、バンブー、英コーデュロイ',
    colors: ['ブラウン', 'オリーブ', 'ベージュ'],
    goal: '頑張りすぎないお洒落。あえてタイドアップせず、ニットやTシャツと合わせても様になる素材',
    fabrics: ['wool_denim', 'bamboo', 'corduroy_british', 'jersey'],
  },
};

/**
 * 学術的根拠を生成する関数
 */
export const generateAcademicBasis = (params: {
  archetype: any;
  axisScores: any;
  answers: any;
}) => {
  const { axisScores } = params;

  // S軸（構造）の学術的根拠
  const morphologyBasis =
    axisScores.S >= 0
      ? `ゲシュタルト心理学の「全体は部分の総和以上である」という原則に基づき、あなたの骨格は直線的（Linear）な構造を持ちます。英国サヴィル・ロウの伝統的な「ドレープカット」が最適です。パッドで肩を強調し、ウェストを絞った砂時計型のシルエットが、あなたの権威（Authority）を物理的に拡張します。`
      : `服飾形態学の観点から、あなたの骨格は曲線的（Curved）な構造を持ちます。ナポリ仕立てのような柔らかなドレープが、あなたの自然な体のラインを美しく見せます。構築的なパッドではなく、自然な肩のラインを活かすことで、親和性（Friendliness）を高めます。`;

  // C軸（コントラスト）の学術的根拠
  const colorTheoryBasis =
    axisScores.C >= 0
      ? `認知心理学の色彩認知理論に基づき、あなたの瞳や肌色は高彩度カラー（High Contrast）と調和します。ビビッドな赤やロイヤルブルーなど、はっきりとした色が、あなたの存在感を強調し、視覚的インパクトを与えます。`
      : `色彩学の調和理論に基づき、あなたの瞳や肌色は低彩度カラー（Blend）と調和します。キャメルやモスグリーンなど、アースカラーが、あなたの穏やかな雰囲気を引き立て、自然な美しさを演出します。`;

  // P軸（プレゼンス）の学術的根拠
  const psychologyBasis =
    axisScores.P >= 0
      ? `社会心理学のリーダーシップ理論において、あなたは「権威的リーダーシップ（Authoritative Leadership）」を持ちます。先頭に立ち、明確な決断を下すスタイルは、行動主義心理学の「刺激と反応」の観点から、周囲に強い影響を与えます。フォーマルなスーツスタイルが、この権威性を視覚的に強化します。`
      : `人間性心理学のロジャーズが提唱する「共感的理解」に基づき、あなたは「親和的リーダーシップ（Affiliative Leadership）」を持ちます。チームメンバーの意見を聞き、調和を図るスタイルは、社会心理学の「集団凝集性」を高めます。柔らかなスーツスタイルが、この親和性を視覚的に表現します。`;

  // M軸（マインドセット）の学術的根拠
  const fashionBasis =
    axisScores.M >= 0
      ? `美学における「伝統主義（Traditionalism）」の観点から、あなたは歴史と格式を重んじる価値観を持ちます。英国の伝統的な生地（ドーメル、ハリソンズ）は、この価値観を物理的に体現します。実存主義哲学の「本質は存在に先立つ」という考えに基づき、伝統的なスタイルこそが、あなたの本質を表現します。`
      : `美学における「革新主義（Modernism）」の観点から、あなたは新しい価値や市場を創ることを重視します。イタリアの革新的な生地（REDA、バンブー、ウールデニム）は、この価値観を物理的に体現します。実存主義哲学の「存在は本質に先立つ」という考えに基づき、革新的なスタイルこそが、あなたの存在を表現します。`;

  return {
    psychology: psychologyBasis,
    fashion: fashionBasis,
    morphology: morphologyBasis,
    colorTheory: colorTheoryBasis,
  };
};

/**
 * 心理学の学派を軸スコアに基づいて選択
 */
export const selectPsychologySchool = (axis: 'S' | 'C' | 'P' | 'M', score: number) => {
  const schoolMap = {
    S: score >= 0 ? PSYCHOLOGY_SCHOOLS.gestalt : PSYCHOLOGY_SCHOOLS.structuralism,
    C: score >= 0 ? PSYCHOLOGY_SCHOOLS.cognitive : PSYCHOLOGY_SCHOOLS.psychoanalysis,
    P: score >= 0 ? PSYCHOLOGY_SCHOOLS.social : PSYCHOLOGY_SCHOOLS.humanistic,
    M: score >= 0 ? PSYCHOLOGY_SCHOOLS.developmental : PSYCHOLOGY_SCHOOLS.functionalism,
  };

  return schoolMap[axis];
};

/**
 * ファッション理論を軸スコアに基づいて選択
 */
export const selectFashionTheory = (axisScores: any) => {
  // S軸とM軸の組み合わせで判定
  if (axisScores.S >= 0 && axisScores.M >= 0) {
    return FASHION_THEORIES.british; // 直線的 + 伝統 = 英国
  } else if (axisScores.S < 0 && axisScores.M >= 0) {
    return FASHION_THEORIES.italian; // 曲線的 + 伝統 = イタリア
  } else if (axisScores.S >= 0 && axisScores.M < 0) {
    return FASHION_THEORIES.american; // 直線的 + 革新 = アメリカ
  } else {
    return FASHION_THEORIES.japanese; // 曲線的 + 革新 = 日本（ハイブリッド）
  }
};
