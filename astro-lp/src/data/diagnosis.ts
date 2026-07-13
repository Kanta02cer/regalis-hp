/**
 * 無料AI診断（8問）の設問と判定ロジック。
 * 各選択肢のpoints（0〜3）の合計でAI活用成熟度レベルを判定する。
 */

export interface DiagnosisOption {
  label: string;
  points: number;
}

export interface DiagnosisQuestion {
  question: string;
  options: DiagnosisOption[];
}

export const diagnosisQuestions: DiagnosisQuestion[] = [
  {
    question: '社内での生成AI（ChatGPT等）の利用状況は？',
    options: [
      { label: 'ほとんど使われていない', points: 0 },
      { label: '一部の社員が個人的に使っている', points: 1 },
      { label: '特定の部署で業務利用している', points: 2 },
      { label: '全社的にルールを整備して活用している', points: 3 },
    ],
  },
  {
    question: 'AI利用のルール・ガイドラインはありますか？',
    options: [
      { label: 'ない／検討していない', points: 0 },
      { label: '必要性は感じているが未着手', points: 1 },
      { label: '簡易的なルールがある', points: 2 },
      { label: '明文化されたガイドラインを運用中', points: 3 },
    ],
  },
  {
    question: '経営層はAI活用にどの程度関与していますか？',
    options: [
      { label: 'ほぼ関心がない', points: 0 },
      { label: '関心はあるが方針は未定', points: 1 },
      { label: '方針はあるが現場任せ', points: 2 },
      { label: '経営戦略にAI活用を組み込んでいる', points: 3 },
    ],
  },
  {
    question: '定型業務（資料作成・転記・集計など）の自動化状況は？',
    options: [
      { label: 'ほぼすべて手作業', points: 0 },
      { label: '一部をツールで効率化している', points: 1 },
      { label: '主要業務は自動化済み', points: 2 },
      { label: 'AIを含めた自動化を継続的に改善している', points: 3 },
    ],
  },
  {
    question: '業務データ（顧客情報・文書など）の整備状況は？',
    options: [
      { label: '紙や個人PCに散在している', points: 0 },
      { label: '共有フォルダにはあるが未整理', points: 1 },
      { label: 'システムで一元管理している', points: 2 },
      { label: 'AIで活用できる形に構造化されている', points: 3 },
    ],
  },
  {
    question: 'AIを使いこなせる人材・研修体制はありますか？',
    options: [
      { label: '社内にいない／研修もない', points: 0 },
      { label: '独学で詳しい社員が数名いる', points: 1 },
      { label: '社内勉強会や研修を実施したことがある', points: 2 },
      { label: '育成計画に基づき継続的に研修している', points: 3 },
    ],
  },
  {
    question: '社内システムと外部ツールの連携・開発体制は？',
    options: [
      { label: 'システム開発の体制がない', points: 0 },
      { label: '外部ベンダーに都度依頼している', points: 1 },
      { label: '一部内製またはパートナーと継続開発している', points: 2 },
      { label: '内製チームがAI連携まで対応できる', points: 3 },
    ],
  },
  {
    question: '今後1年のAI投資への意向は？',
    options: [
      { label: '予算化の予定はない', points: 0 },
      { label: '効果が見えれば検討したい', points: 1 },
      { label: '小規模な予算を確保している', points: 2 },
      { label: '重点投資領域として予算化済み', points: 3 },
    ],
  },
];

export interface DiagnosisLevel {
  min: number;
  max: number;
  name: string;
  headline: string;
  advice: string;
}

/** 合計点（0〜24）による判定。resolveLevel で参照する */
export const diagnosisLevels: DiagnosisLevel[] = [
  {
    min: 0,
    max: 6,
    name: 'スタート期',
    headline: 'AI活用はこれから。伸びしろが最も大きい段階です。',
    advice:
      'まずは経営層・現場のAIリテラシー研修と、効果の出やすい定型業務の診断から始めるのがおすすめです。小さな成功体験づくりが最初の一歩になります。',
  },
  {
    min: 7,
    max: 12,
    name: '試行期',
    headline: '個人・部署単位の活用が始まっている段階です。',
    advice:
      '利用ルールの整備と、部署を横断したユースケースの棚卸しが次の課題です。全社展開の前に、AI活用診断で優先領域を特定することをおすすめします。',
  },
  {
    min: 13,
    max: 18,
    name: '展開期',
    headline: '組織的なAI活用の土台ができつつある段階です。',
    advice:
      '業務プロセスへのAI組み込み（システム開発・ワークフロー自動化）と、効果測定のKPI設計が次のテーマです。内製化に向けた推進チームの育成も有効です。',
  },
  {
    min: 19,
    max: 24,
    name: '先進期',
    headline: 'AI活用が組織に定着している先進的な段階です。',
    advice:
      'さらなる差別化として、AI検索最適化（AIO）による外部発信の強化や、独自AIツールの開発・事業化が視野に入ります。伴走型の高度な支援をご提案できます。',
  },
];

export function resolveLevel(score: number): DiagnosisLevel {
  return (
    diagnosisLevels.find((level) => score >= level.min && score <= level.max) ??
    diagnosisLevels[0]!
  );
}

export const MAX_SCORE = diagnosisQuestions.length * 3;
