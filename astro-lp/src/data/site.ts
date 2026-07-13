/**
 * LP全体のコンテンツデータ。
 * コピー・事例・FAQはここを編集すれば全セクションに反映される。
 * 「活用事例」「導入事例」は正式コンテンツ確定までダミーデータ。
 */

export const site = {
  name: '法人AI導入支援',
  title: '法人向けAI導入支援｜1分で無料AI診断',
  description:
    '企業のAI活用を診断から研修・開発・運用まで一気通貫で支援。まずは1分の無料AI診断で、自社のAI活用余地を可視化しませんか。',
  cta: {
    primary: { label: '1分で無料AI診断', href: '#contact' },
    secondary: { label: '資料請求はこちら', href: '#contact' },
  },
} as const;

export const navItems = [
  { label: 'サービス', href: '#services' },
  { label: '活用事例', href: '#use-cases' },
  { label: 'カリキュラム', href: '#curriculum' },
  { label: '導入事例', href: '#case-studies' },
  { label: 'FAQ', href: '#faq' },
] as const;

/** サービス（5本柱） */
export const services = [
  {
    icon: '🔍',
    title: 'AI活用診断・アセスメント',
    description:
      '業務フローを棚卸しし、AIで自動化・効率化できる領域と投資対効果を診断レポートとして可視化します。',
  },
  {
    icon: '🎓',
    title: 'AI研修・人材育成',
    description:
      '経営層向けリテラシー研修から現場向けプロンプト実践研修まで、階層別のカリキュラムを提供します。',
  },
  {
    icon: '⚙️',
    title: 'AIシステム・ツール開発',
    description:
      '生成AIを組み込んだ業務システムや社内チャットボットなど、御社専用のAIツールを設計・開発します。',
  },
  {
    icon: '📈',
    title: 'AI検索最適化（AIO）',
    description:
      'ChatGPT等のAI検索で自社が推薦される状態をつくる、コンテンツ・構造化データの最適化を支援します。',
  },
  {
    icon: '🤝',
    title: '運用・内製化伴走支援',
    description:
      '導入して終わりにしない月次伴走。KPI設計・効果測定・社内展開まで、内製化の定着を支援します。',
  },
] as const;

/** 活用事例（※ダミーデータ — 正式コンテンツ確定後に差し替え） */
export const useCases = [
  {
    category: '営業',
    title: '提案書ドラフトの自動生成',
    description: '過去の提案資料をもとにAIが初稿を生成。作成時間を大幅に短縮。',
    tag: 'ダミー',
  },
  {
    category: 'カスタマーサポート',
    title: '問い合わせ一次対応の自動化',
    description: 'FAQを学習したチャットボットが一次対応を担当。応答品質を均一化。',
    tag: 'ダミー',
  },
  {
    category: '経理・バックオフィス',
    title: '請求書処理のAI-OCR化',
    description: '紙・PDFの請求書を自動読取・仕訳。月次締めの負荷を軽減。',
    tag: 'ダミー',
  },
  {
    category: 'マーケティング',
    title: 'コンテンツ制作の効率化',
    description: '記事・SNS投稿の下書きをAIが量産。レビューに集中できる体制へ。',
    tag: 'ダミー',
  },
  {
    category: '人事',
    title: '採用スクリーニング支援',
    description: '応募書類の要約・スキルマッチングをAIが補助。選考リードタイムを短縮。',
    tag: 'ダミー',
  },
  {
    category: '開発',
    title: 'コーディング支援の全社導入',
    description: 'AIコーディング支援ツールの導入・ガイドライン整備で開発速度を向上。',
    tag: 'ダミー',
  },
] as const;

/** カリキュラム（研修プログラム） */
export const curriculum = [
  {
    step: '01',
    title: 'AIリテラシー基礎',
    duration: '半日',
    target: '全社員向け',
    points: ['生成AIの仕組みと限界', '情報セキュリティ・ガイドライン', '業務での安全な使い方'],
  },
  {
    step: '02',
    title: 'プロンプト実践',
    duration: '1日',
    target: '現場実務者向け',
    points: ['業務別プロンプト設計', '文書作成・要約・分析の実践', '自業務への適用ワーク'],
  },
  {
    step: '03',
    title: '業務プロセス改善',
    duration: '2日',
    target: 'リーダー・推進担当向け',
    points: ['業務棚卸しとAI適用判断', '自動化ワークフロー設計', '効果測定とKPI設計'],
  },
  {
    step: '04',
    title: '内製化・展開',
    duration: '伴走型',
    target: '推進チーム向け',
    points: ['社内展開ロードマップ', 'ガバナンス体制構築', '月次レビューと改善サイクル'],
  },
] as const;

/** 導入事例（※ダミーデータ — 掲載許諾取得後に差し替え） */
export const caseStudies = [
  {
    company: '製造業 A社',
    industry: '製造業 / 従業員300名',
    title: '全社AI研修と業務診断で改善テーマを特定',
    result: '対象部門の定型業務時間を削減し、改善プロジェクトが継続的に立ち上がる体制へ。',
    tag: 'ダミー',
  },
  {
    company: 'サービス業 B社',
    industry: 'サービス業 / 従業員80名',
    title: '問い合わせ対応チャットボットを開発・導入',
    result: '一次対応の自動化により、担当者は高付加価値な対応へシフト。',
    tag: 'ダミー',
  },
  {
    company: '卸売業 C社',
    industry: '卸売業 / 従業員150名',
    title: 'AI検索最適化（AIO)で指名流入を強化',
    result: 'AI検索経由の問い合わせが発生し、新たなリード獲得チャネルを確立。',
    tag: 'ダミー',
  },
] as const;

/** FAQ（FAQPage構造化データにも使用） */
export const faqs = [
  {
    question: '無料AI診断では何がわかりますか？',
    answer:
      '簡単な質問にお答えいただくだけで、自社のAI活用成熟度と、優先的に着手すべき領域の目安がわかります。診断結果をもとに、詳細なご相談も無料で承ります。',
  },
  {
    question: 'AIの知識がない状態でも依頼できますか？',
    answer:
      'はい。多くのお客様がAI未経験の状態からスタートしています。診断・研修を通じて基礎から伴走しますので、専門知識は不要です。',
  },
  {
    question: '費用はどのくらいかかりますか？',
    answer:
      'AI診断は無料です。研修・開発・伴走支援の費用は、規模とご要望に応じて個別にお見積もりします。まずは無料診断・無料相談をご利用ください。',
  },
  {
    question: '小規模な会社でも対応してもらえますか？',
    answer:
      'はい。従業員数十名規模の企業様から大企業まで、規模に応じたプランをご用意しています。',
  },
  {
    question: '導入までどのくらいの期間がかかりますか？',
    answer:
      '研修は最短で数週間、システム開発を伴う場合は内容に応じて数ヶ月が目安です。診断時に概算スケジュールをご提示します。',
  },
] as const;
