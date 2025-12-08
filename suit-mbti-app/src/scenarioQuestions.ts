export type ScenarioTone = 'formal' | 'creative' | 'romantic' | 'business';

export interface ScenarioQuestion {
  id: string;
  prompt: string;
  tone: ScenarioTone;
  options: { id: string; label: string; rationale: string }[];
}

export const scenarioQuestions: ScenarioQuestion[] = [
  {
    id: 'dinner_style',
    prompt: '好きな人と個室レストランを使うなら、3ピースで格好良さを極める or ダブルでカジュアルにフォーマルを混ぜる？',
    tone: 'romantic',
    options: [
      { id: 'three_piece', label: '3ピースで格好良さを極める', rationale: 'ベストでVゾーンを締めて威厳と安心感を演出' },
      { id: 'double', label: 'ダブルでフォーマル×カジュアル', rationale: '肩の力を抜きつつ、ピークドラペルで華やかさを足す' }
    ]
  },
  {
    id: 'presentation',
    prompt: '重要プレゼンの日、英国調の構築美と伊ニッチの柔らかさ、どちらで自分を表現したい？',
    tone: 'business',
    options: [
      { id: 'british', label: '英国調で威厳重視', rationale: 'ドーメルやハリソンズの打ち込みで信頼を可視化' },
      { id: 'italian', label: '伊ニッチで柔らかさ重視', rationale: 'カチョッポリやドラッパーズで会話のきっかけを作る' }
    ]
  },
  {
    id: 'travel',
    prompt: '長距離移動の日は、伸縮性重視 or 通気性重視のどちらを選ぶ？',
    tone: 'creative',
    options: [
      { id: 'jersey', label: '伸縮性重視（ジャージー）', rationale: '移動中でも皺を気にせずリラックスできる' },
      { id: 'bamboo', label: '通気性重視（バンブー）', rationale: '蒸れにくく、春夏でも軽快な着心地を維持' }
    ]
  }
];
