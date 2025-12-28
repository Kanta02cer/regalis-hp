// シーンベースの質問システム
// 具体的なシーンをイメージできる質問に変更

export interface ScenarioQuestion {
  id: string;
  category: string;
  scene: string; // シーンの説明
  text: string; // 質問文
  left: string; // 左の選択肢（詳細な説明）
  right: string; // 右の選択肢（詳細な説明）
  factor: 'S' | 'C' | 'P' | 'M' | 'STYLE'; // 影響する軸
  academicBasis: string; // 学術的根拠
  psychologySchool: string; // 心理学の学派
  inputType?: 'scale' | 'binary'; // デフォルトはscale（5段階）
}

/**
 * 基本セクション（8問）
 * シーンベースで具体的にイメージできる質問
 */
export const BASIC_QUESTIONS: ScenarioQuestion[] = [
  // S軸（構造）- 服飾形態学
  {
    id: 'q1',
    category: 'LIFESTYLE',
    scene: 'ビジネスミーティング',
    text: '重要なビジネスミーティングで、どちらのスタイルで臨みたいですか？',
    left: '肩のラインがしっかりとした、英国式の構築的なスーツ',
    right: '柔らかなドレープが特徴の、イタリア式の優雅なスーツ',
    factor: 'S',
    academicBasis: '服飾形態学: 骨格構造とシルエットの科学的適合性',
    psychologySchool: 'ゲシュタルト心理学: 全体性と形態の知覚',
  },
  {
    id: 'q2',
    category: 'PHYSICAL',
    scene: '日常のスーツ着用',
    text: 'スーツを着た時、感じやすい悩みはどちらですか？',
    left: '肩が角張って見える、または肩周りに余裕がありすぎる',
    right: '着太りして見える、またはシワが入りやすい',
    factor: 'S',
    academicBasis: '服飾形態学: 骨格タイプとシルエットの適合性',
    psychologySchool: '構成主義: 身体感覚と意識の構成要素',
  },

  // C軸（コントラスト）- 色彩学
  {
    id: 'q3',
    category: 'SOCIAL',
    scene: 'カクテルパーティー',
    text: 'カクテルパーティーで選ぶネクタイの色は？',
    left: 'ビビッドな赤やロイヤルブルーで存在感を強調',
    right: 'キャメルやモスグリーンで落ち着いた雰囲気',
    factor: 'C',
    academicBasis: '色彩学: 肌色・瞳色とファッションカラーの調和',
    psychologySchool: '認知心理学: 色彩認知と感情の関係',
  },
  {
    id: 'q4',
    category: 'VISUAL',
    scene: '冬のコーディネート',
    text: '冬のコーディネートで似合うと感じる色は？',
    left: 'はっきりとしたビビッドカラー（鮮やかな赤、ロイヤルブルーなど）',
    right: 'アースカラー（キャメル、モスグリーン、ベージュなど）',
    factor: 'C',
    academicBasis: '色彩学: 高彩度vs低彩度の適合性分析',
    psychologySchool: '精神分析学: 無意識的な色彩選択',
  },

  // P軸（プレゼンス）- 社会心理学
  {
    id: 'q5',
    category: 'LEADERSHIP',
    scene: 'チームリーダーシップ',
    text: 'プロジェクトのリーダーとして、どのようなスタイルを好みますか？',
    left: '明確な指示を出し、先頭に立って決断を下す',
    right: 'チームメンバーの意見を聞き、調和を図りながら進める',
    factor: 'P',
    academicBasis: '社会心理学: リーダーシップスタイルと社会的影響',
    psychologySchool: '社会心理学: 権威と親和性の二元論',
  },
  {
    id: 'q6',
    category: 'SOCIAL',
    scene: 'パーティーでの振る舞い',
    text: 'パーティーに参加した時、どのように過ごしますか？',
    left: '少人数と深い話をする、または観察者として場を見渡す',
    right: '多くの人と挨拶を交わし、場を盛り上げる役割を担う',
    factor: 'P',
    academicBasis: '社会心理学: 内向性vs外向性、社会的存在感',
    psychologySchool: '人間性心理学: 自己実現と社会的役割',
  },

  // M軸（マインドセット）- 美学・哲学
  {
    id: 'q7',
    category: 'AESTHETIC',
    scene: 'デートの場所選び',
    text: '好きな人とのデートで選ぶレストランは？',
    left: '歴史ある格式高いクラシックなレストラン',
    right: 'モダンでスタイリッシュな新しいレストラン',
    factor: 'M',
    academicBasis: '美学: 伝統vs革新の美的価値観',
    psychologySchool: '実存主義哲学: 個人の価値観と選択',
  },
  {
    id: 'q8',
    category: 'AESTHETIC',
    scene: '仕事における成功',
    text: '仕事における「成功」とは何ですか？',
    left: '組織や伝統を盤石にし、継承していくこと',
    right: '新しい価値や市場を創造し、革新を起こすこと',
    factor: 'M',
    academicBasis: '哲学: 保守主義vs革新主義の価値観',
    psychologySchool: '発達心理学: 価値観の形成と変化',
  },
];

/**
 * 人体最適化に関わる質問（補正質問）- 4問
 * 重要な補正項目に絞って効率化
 */
export const CORRECTION_QUESTIONS: ScenarioQuestion[] = [
  {
    id: 'c1',
    category: 'CORRECTION',
    scene: 'デスクワーク',
    text: 'デスクワークの時の姿勢は？',
    left: '前傾姿勢でPC作業が多い',
    right: '後傾姿勢で会議や電話が多い',
    factor: 'S',
    academicBasis: '服飾形態学: 姿勢補正',
    psychologySchool: '行動主義: 行動パターンの観察',
  },
  {
    id: 'c2',
    category: 'CORRECTION',
    scene: '首の長さ',
    text: '首の長さの印象は？',
    left: '短め、または詰まって見える',
    right: '長め、または抜けて見える',
    factor: 'S',
    academicBasis: '服飾形態学: 首周りの補正',
    psychologySchool: '構成主義: 身体パーツの認識',
  },
  {
    id: 'c3',
    category: 'CORRECTION',
    scene: '腕の長さ',
    text: '腕の長さ（裄丈）は？',
    left: '短め',
    right: '長め',
    factor: 'S',
    academicBasis: '服飾形態学: 裄丈補正',
    psychologySchool: '構成主義: 身体比率の認識',
  },
  {
    id: 'c4',
    category: 'CORRECTION',
    scene: '脚の形',
    text: '脚の形は？',
    left: 'O脚気味',
    right: 'X脚気味',
    factor: 'S',
    academicBasis: '服飾形態学: 脚の形状補正',
    psychologySchool: '構成主義: 身体形状の認識',
  },
];

/**
 * ファッション好みに関する質問 - 3問
 */
export const FASHION_PREFERENCE_QUESTIONS: ScenarioQuestion[] = [
  {
    id: 'f1',
    category: 'FASHION_PREFERENCE',
    scene: '特別なディナー',
    text: '個室のレストランで選ぶスタイルは？',
    left: '3ピーススーツでベストを合わせたフォーマルなスタイル',
    right: 'ダブルジャケットでカジュアルとフォーマルを混ぜたスタイル',
    factor: 'STYLE',
    academicBasis: 'ファッション社会学: スタイルによる自己表現',
    psychologySchool: '自我同一性理論: アイデンティティの表現',
  },
  {
    id: 'f2',
    category: 'FASHION_PREFERENCE',
    scene: 'ポケットの選択',
    text: '好むポケットの角度は？',
    left: '水平（標準）',
    right: '斜め（スラント）',
    factor: 'M',
    academicBasis: '美学: ディテールの好み',
    psychologySchool: '認知心理学: 視覚的好み',
  },
  {
    id: 'f3',
    category: 'FASHION_PREFERENCE',
    scene: '裏地の選択',
    text: '重視する裏地の特性は？',
    left: '通気性（背抜き）',
    right: '耐久性（総裏）',
    factor: 'M',
    academicBasis: '機能主義: 機能性の重視',
    psychologySchool: '機能主義: 実用性の重視',
  },
];

/**
 * 使用用途についての質問 - 3問
 */
export const USAGE_QUESTIONS: ScenarioQuestion[] = [
  {
    id: 'u1',
    category: 'USAGE',
    scene: '主な使用シーン',
    text: '主にどのシーンで着用しますか？',
    left: 'ビジネス・オフィスでの日常着用',
    right: '冠婚葬祭・フォーマルイベント',
    factor: 'M',
    academicBasis: 'ファッション社会学: 使用シーンとスタイルの関係',
    psychologySchool: '社会心理学: 社会的役割と服装',
  },
  {
    id: 'u2',
    category: 'USAGE',
    scene: '着用頻度',
    text: '着用頻度はどの程度を想定していますか？',
    left: '週に数回、日常的に着用する',
    right: '月に数回、特別な機会に着用する',
    factor: 'M',
    academicBasis: '機能主義: 使用頻度と耐久性の関係',
    psychologySchool: '行動主義: 使用パターンの分析',
  },
  {
    id: 'u3',
    category: 'USAGE',
    scene: '時計の選択',
    text: '普段着用する時計のサイズは？',
    left: '着用しない、または薄型のドレスウォッチ',
    right: '大型のダイバーズウォッチやスポーツウォッチ',
    factor: 'S',
    academicBasis: '服飾形態学: アクセサリーとの調和',
    psychologySchool: '構成主義: 細部へのこだわり',
  },
];

/**
 * バイナリ質問（2択が本質のデザイン項目）
 * 診断ロジックの多様性向上のため、各軸に分散して寄与
 */
export const BINARY_DESIGN_QUESTIONS: ScenarioQuestion[] = [
  {
    id: 'b1',
    category: 'DESIGN',
    scene: 'ベントの選択',
    text: 'ベント（後ろスリット）の好みは？',
    left: 'センターベント（1本）',
    right: 'サイドベンツ（2本）',
    factor: 'M',
    academicBasis: 'テーラリング: 動きやすさとスタイルの好み',
    psychologySchool: '認知心理学: 視覚的バランス',
    inputType: 'binary',
  },
  {
    id: 'b2',
    category: 'DESIGN',
    scene: 'ラペル幅',
    text: '好みのラペル幅は？',
    left: '細め（モダンでシャープ）',
    right: '太め（クラシックで力強い）',
    factor: 'C', // C軸（コントラスト）に変更: 細め=高コントラスト、太め=ブレンド
    academicBasis: '美学: プロポーションと印象',
    psychologySchool: '知覚心理学: 顔・肩幅との調和',
    inputType: 'binary',
  },
  {
    id: 'b3',
    category: 'DESIGN',
    scene: 'ボタン数',
    text: '前ボタンの好みは？',
    left: '2ボタン（現代的・Vゾーン広め）',
    right: '3ボタン（クラシック・Vゾーン狭め）',
    factor: 'P', // P軸（プレゼンス）に変更: 2ボタン=親和的、3ボタン=権威的
    academicBasis: 'テーラリング: シルエットと動作性',
    psychologySchool: '意思決定心理学: 慣習と個性のバランス',
    inputType: 'binary',
  },
];

/**
 * 後方互換性のため、既存のSCENARIO_QUESTIONSとOPTIONAL_QUESTIONSを保持
 */
export const SCENARIO_QUESTIONS = BASIC_QUESTIONS;

/**
 * オプション質問（後方互換性のため保持）
 * 新しいシステムでは使用しないが、既存コードとの互換性のため残す
 */
export const OPTIONAL_QUESTIONS: ScenarioQuestion[] = [
  ...CORRECTION_QUESTIONS,
  ...FASHION_PREFERENCE_QUESTIONS,
  ...USAGE_QUESTIONS,
  ...BINARY_DESIGN_QUESTIONS,
];

/**
 * 質問のスコアリング
 * 各質問の重要度に応じてスコアを設定
 * より多様な診断結果を生み出すため、スコアの分散を改善
 */
export const getQuestionScore = (questionId: string, value: number): number => {
  // バイナリ質問（b1, b2, b3）は-1または+1のみ
  if (['b1', 'b2', 'b3'].includes(questionId)) {
    return value > 0 ? 1 : -1;
  }
  
  // 5段階入力に対応
  // 奇数（q1, q3, q5, q7）: 強い重み（-2〜+2）をそのまま反映
  // 偶数（q2, q4, q6, q8）: より明確な寄与のため、-1.5/0/+1.5に拡張
  //   ただし、整数値のみを返すため、-2/-1/0/+1/+2にマッピング
  const isFirstQuestion = ['q1', 'q3', 'q5', 'q7'].includes(questionId);
  if (isFirstQuestion) {
    return Math.max(-2, Math.min(2, value));
  }
  
  // 偶数質問: より明確な寄与のため、スコアを拡張
  // value: -2, -1, 0, 1, 2 → score: -2, -1, 0, 1, 2
  // これにより、偶数質問もより強い影響を持つ
  if (value === 0) return 0;
  // より明確な寄与のため、絶対値を拡大
  return value > 0 ? Math.min(2, Math.abs(value)) : -Math.min(2, Math.abs(value));
};

/**
 * 質問カテゴリのアイコンマッピング
 */
export const CATEGORY_ICONS = {
  LIFESTYLE: '🏢',
  PHYSICAL: '👔',
  SOCIAL: '🎉',
  VISUAL: '🎨',
  LEADERSHIP: '👑',
  AESTHETIC: '✨',
  STYLE_PREFERENCE: '💎',
  CORRECTION: '⚙️',
  FASHION_PREFERENCE: '💎',
  USAGE: '📅',
  DESIGN: '🪡',
  Advanced: '⚙️',
};

/**
 * 質問カテゴリの説明
 */
export const CATEGORY_DESCRIPTIONS = {
  LIFESTYLE: 'ライフスタイル',
  PHYSICAL: '身体的特徴',
  SOCIAL: '社会的場面',
  VISUAL: '視覚的好み',
  LEADERSHIP: 'リーダーシップ',
  AESTHETIC: '美的価値観',
  STYLE_PREFERENCE: 'スタイル選択',
  CORRECTION: '人体最適化',
  FASHION_PREFERENCE: 'ファッション好み',
  USAGE: '使用用途',
  DESIGN: 'デザイン選好',
  Advanced: '詳細補正',
};
