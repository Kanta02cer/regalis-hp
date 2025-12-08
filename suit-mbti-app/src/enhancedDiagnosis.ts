// 強化された診断ロジック
// 生地、スタイル、ディテールの包括的な推奨を生成

import { ALL_FABRICS, FabricData } from './fabricDatabase';
import { generateAcademicBasis } from './academicBasis';

export interface AxisScores {
  S: number; // Structure
  C: number; // Contrast
  P: number; // Presence
  M: number; // Mindset
}

export interface AxisResults {
  S: 'Hard' | 'Soft';
  C: 'High' | 'Blend';
  P: 'Auth' | 'Friend';
  M: 'Trad' | 'Inno';
}

export interface FabricRecommendation {
  primary: FabricData;
  alternatives: FabricData[];
  reasoning: string;
}

export interface ButtonRecommendation {
  count: number;
  type: string;
  material: string;
  reasoning: string;
}

export interface LapelRecommendation {
  type: 'ノッチドラペル' | 'ピークドラペル' | 'ショールカラー';
  width: 'ナロー' | 'スタンダード' | 'ワイド';
  reasoning: string;
}

export interface SleeveRecommendation {
  functional: boolean;
  buttonCount: number;
  reasoning: string;
}

export interface TrouserRecommendation {
  cuff: boolean;
  pleats: 'ノープリーツ' | 'ワンプリーツ' | 'ツープリーツ';
  reasoning: string;
}

export interface LiningRecommendation {
  type: string;
  color: string;
  reasoning: string;
}

export interface StyleRecommendations {
  suitStyle: '3ピース' | 'ダブルジャケット' | 'シングル2つボタン' | 'シングル3つボタン';
  reasoning: string;
  buttons: ButtonRecommendation;
  lapel: LapelRecommendation;
  sleeves: SleeveRecommendation;
  trousers: TrouserRecommendation;
  lining: LiningRecommendation;
}

export interface ColorData {
  name: string;
  hex: string;
  type: string;
}

export interface ColorPalette {
  primary: ColorData[];
  accent: ColorData[];
  avoid: ColorData[];
  reasoning: string;
}

export interface EnhancedDiagnosisResult {
  archetype: any;
  axisScores: AxisScores;
  axisResults: AxisResults;
  fabricRecommendations: FabricRecommendation;
  styleRecommendations: StyleRecommendations;
  colorPalette: ColorPalette;
  academicBasis: {
    psychology: string;
    fashion: string;
    morphology: string;
    colorTheory: string;
  };
}

/**
 * 生地推奨ロジック
 */
export const determineFabricRecommendations = (params: {
  archetype: any;
  axisScores: AxisScores;
  axisResults: AxisResults;
  stylePreference: number;
}): FabricRecommendation => {
  const { axisResults } = params;

  // 軸スコアに基づく生地フィルタリング
  const suitableFabrics = Object.values(ALL_FABRICS).map((fabric) => {
    let score = 0;

    // S軸: 骨格に合う生地
    if (axisResults.S === 'Soft' && fabric.bodyType.includes('柔らかな骨格')) {
      score += 3;
    }
    if (axisResults.S === 'Hard' && fabric.bodyType.includes('直線的骨格')) {
      score += 3;
    }
    if (fabric.bodyType.includes('どの体型でも')) {
      score += 1;
    }

    // C軸: 光沢の好み
    if (axisResults.C === 'High' && fabric.characteristics.shine.includes('光沢')) {
      score += 2;
    }
    if (axisResults.C === 'Blend' && fabric.characteristics.shine.includes('マット')) {
      score += 2;
    }

    // P軸: シーンの適合性
    if (axisResults.P === 'Auth' && fabric.suitableFor.includes('フォーマル')) {
      score += 2;
    }
    if (axisResults.P === 'Friend' && fabric.suitableFor.includes('カジュアル')) {
      score += 2;
    }

    // M軸: 伝統vs革新
    if (axisResults.M === 'Trad' && fabric.origin.includes('UK')) {
      score += 2;
    }
    if (axisResults.M === 'Inno' && (fabric.type || fabric.category === 'special')) {
      score += 2;
    }

    // イタリア系は柔らかな骨格に追加ポイント
    if (axisResults.S === 'Soft' && fabric.origin.includes('Italy')) {
      score += 1;
    }

    return { fabric, score };
  });

  // スコアでソート
  const sortedFabrics = suitableFabrics.sort((a, b) => b.score - a.score);

  // 推奨理由を生成
  const primary = sortedFabrics[0].fabric;
  const reasoning = generateFabricReasoning(primary, params);

  return {
    primary,
    alternatives: sortedFabrics.slice(1, 6).map((f) => f.fabric),
    reasoning,
  };
};

/**
 * 生地推奨理由の生成
 */
const generateFabricReasoning = (
  fabric: FabricData,
  params: { axisResults: AxisResults }
): string => {
  const { axisResults } = params;

  let reasoning = `${fabric.name}（${fabric.collection}）をメインに推奨します。\n\n`;

  // 骨格に基づく理由
  if (axisResults.S === 'Soft') {
    reasoning += `あなたの骨格は曲線的（Soft）なため、${fabric.characteristics.drape}が特徴の${fabric.name}が最適です。`;
  } else {
    reasoning += `あなたの骨格は直線的（Hard）なため、${fabric.characteristics.texture}が特徴の${fabric.name}が最適です。`;
  }

  reasoning += `\n\n`;

  // 光沢に基づく理由
  if (axisResults.C === 'High') {
    reasoning += `高彩度カラーとの調和を重視するあなたには、${fabric.characteristics.shine}が存在感を強調します。`;
  } else {
    reasoning += `低彩度カラーとの調和を重視するあなたには、${fabric.characteristics.shine}が落ち着いた雰囲気を演出します。`;
  }

  reasoning += `\n\n`;

  // シーンに基づく理由
  reasoning += `${fabric.suitableFor.join('、')}などのシーンで、あなたの個性を最大限に引き出します。`;

  return reasoning;
};

/**
 * スタイル推奨ロジック
 */
export const determineStyleRecommendations = (params: {
  archetype: any;
  axisScores: AxisScores;
  axisResults: AxisResults;
  stylePreference: number;
}): StyleRecommendations => {
  const { axisResults, stylePreference } = params;
  // axisScoresは現在未使用だが、将来的に使用する可能性があるため型定義には残す

  // スーツスタイルの決定
  const suitStyle = stylePreference < 0 ? '3ピース' : 'ダブルジャケット';

  // スタイル推奨理由
  let styleReasoning = '';
  if (suitStyle === '3ピース') {
    styleReasoning = `3ピーススーツは、フォーマルを極めたスタイルです。ベストを加えることで、格式高い印象を与え、「格好いい」を体現します。`;
    if (axisResults.M === 'Trad') {
      styleReasoning += `\n\n伝統を重んじるあなたには、クラシックな3ピーススーツが最適です。`;
    }
  } else {
    styleReasoning = `ダブルジャケットは、カジュアルな中にフォーマルを混ぜた、こなれたスタイルです。6つボタンまたは4つボタンのダブルブレストが、個性的な印象を与えます。`;
    if (axisResults.M === 'Inno') {
      styleReasoning += `\n\n革新を重視するあなたには、モダンなダブルジャケットが最適です。`;
    }
  }

  // ボタンの推奨
  const buttons = determineButtonRecommendation(suitStyle, axisResults);

  // 襟の推奨
  const lapel = determineLapelRecommendation(suitStyle, axisResults);

  // 袖の推奨
  const sleeves = determineSleeveRecommendation(axisResults);

  // スラックスの推奨
  const trousers = determineTrouserRecommendation(axisResults);

  // 裏地の推奨
  const lining = determineLiningRecommendation(axisResults);

  return {
    suitStyle,
    reasoning: styleReasoning,
    buttons,
    lapel,
    sleeves,
    trousers,
    lining,
  };
};

/**
 * ボタン推奨
 */
const determineButtonRecommendation = (
  suitStyle: string,
  axisResults: AxisResults
): ButtonRecommendation => {
  let count = 2;
  let type = 'シングル2つボタン';
  let material = '本水牛釦';
  let reasoning = '';

  if (suitStyle === '3ピース') {
    count = 2;
    type = 'シングル2つボタン';
    material = axisResults.M === 'Trad' ? '本水牛釦' : 'ナット釦';
    reasoning = `3ピーススーツには、クラシックなシングル2つボタンが最適です。${material}を使用することで、${
      axisResults.M === 'Trad' ? '伝統的な格式' : '自然な温かみ'
    }を演出します。`;
  } else if (suitStyle === 'ダブルジャケット') {
    count = 6;
    type = 'ダブル6つボタン';
    material = axisResults.M === 'Trad' ? '本水牛釦' : 'メタル釦';
    reasoning = `ダブルジャケットには、6つボタン（2つ掛け）が最も格式高いスタイルです。${material}を使用することで、${
      axisResults.M === 'Trad' ? '英国的な重厚感' : 'モダンな輝き'
    }を演出します。`;
  }

  return { count, type, material, reasoning };
};

/**
 * 襟推奨
 */
const determineLapelRecommendation = (
  suitStyle: string,
  axisResults: AxisResults
): LapelRecommendation => {
  let type: LapelRecommendation['type'] = 'ノッチドラペル';
  let width: LapelRecommendation['width'] = 'スタンダード';
  let reasoning = '';

  if (suitStyle === '3ピース') {
    if (axisResults.P === 'Auth') {
      type = 'ピークドラペル';
      width = 'ワイド';
      reasoning = `権威的な存在感を重視するあなたには、ピークドラペル（剣襟）が最適です。ワイド幅にすることで、より格式高い印象を与えます。`;
    } else {
      type = 'ノッチドラペル';
      width = 'スタンダード';
      reasoning = `親和的な雰囲気を重視するあなたには、ノッチドラペル（刻み襟）が最適です。スタンダード幅で、バランスの取れた印象を与えます。`;
    }
  } else {
    type = 'ピークドラペル';
    width = axisResults.P === 'Auth' ? 'ワイド' : 'スタンダード';
    reasoning = `ダブルジャケットには、ピークドラペル（剣襟）が伝統的です。${
      axisResults.P === 'Auth' ? 'ワイド幅で権威的な' : 'スタンダード幅でバランスの取れた'
    }印象を与えます。`;
  }

  return { type, width, reasoning };
};

/**
 * 袖推奨
 */
const determineSleeveRecommendation = (axisResults: AxisResults): SleeveRecommendation => {
  const functional = axisResults.M === 'Trad' || axisResults.P === 'Auth';
  const buttonCount = 4;

  let reasoning = '';
  if (functional) {
    reasoning = `本切羽（袖ボタンが開く仕様）を推奨します。これは、最高級のオーダースーツの証であり、${
      axisResults.M === 'Trad' ? '伝統的な格式' : '権威的な存在感'
    }を示します。袖ボタンは4つが最もクラシックです。`;
  } else {
    reasoning = `飾りボタン（開かない仕様）で十分です。実用性を重視し、コストを抑えることができます。袖ボタンは4つが標準的です。`;
  }

  return { functional, buttonCount, reasoning };
};

/**
 * スラックス推奨
 */
const determineTrouserRecommendation = (axisResults: AxisResults): TrouserRecommendation => {
  const cuff = axisResults.M === 'Trad' || axisResults.S === 'Hard';
  const pleats: TrouserRecommendation['pleats'] =
    axisResults.S === 'Soft' ? 'ノープリーツ' : 'ワンプリーツ';

  let reasoning = '';
  if (cuff) {
    reasoning = `ダブル（折り返し）を推奨します。${
      axisResults.M === 'Trad' ? 'クラシックな英国スタイル' : '直線的な骨格に合う重厚感'
    }を演出します。`;
  } else {
    reasoning = `シングル（折り返しなし）を推奨します。${
      axisResults.S === 'Soft' ? '柔らかな骨格に合うすっきりとした' : 'モダンな'
    }印象を与えます。`;
  }

  reasoning += `\n\nプリーツは${pleats}が最適です。`;
  if (pleats === 'ノープリーツ') {
    reasoning += `すっきりとしたシルエットで、現代的な印象を与えます。`;
  } else {
    reasoning += `適度なゆとりを持たせ、動きやすさと格式を両立します。`;
  }

  return { cuff, pleats, reasoning };
};

/**
 * 裏地推奨
 */
const determineLiningRecommendation = (axisResults: AxisResults): LiningRecommendation => {
  let type = '総裏';
  let color = 'ネイビー';
  let reasoning = '';

  if (axisResults.M === 'Trad') {
    type = '総裏';
    color = axisResults.C === 'High' ? 'ロイヤルブルー' : 'ネイビー';
    reasoning = `伝統を重んじるあなたには、総裏（フル裏地）が最適です。耐久性が高く、格式を保ちます。カラーは${color}で、${
      axisResults.C === 'High' ? '華やかな印象' : 'クラシックな印象'
    }を与えます。`;
  } else {
    type = '背抜き';
    color = axisResults.C === 'High' ? 'レッド' : 'グレー';
    reasoning = `革新を重視するあなたには、背抜き（背中部分に裏地なし）が最適です。通気性が高く、軽快な着心地です。カラーは${color}で、${
      axisResults.C === 'High' ? '個性的な印象' : 'モダンな印象'
    }を与えます。`;
  }

  return { type, color, reasoning };
};

/**
 * カラーパレット推奨
 */
export const determineColorPalette = (params: {
  archetype: any;
  axisScores: AxisScores;
  axisResults: AxisResults;
}): ColorPalette => {
  const { axisResults } = params;

  let primary: ColorData[] = [];
  let accent: ColorData[] = [];
  let avoid: ColorData[] = [];
  let reasoning = '';

  if (axisResults.C === 'High') {
    // 高彩度カラー
    primary = [
      { name: 'ネイビー', hex: '#001F3F', type: 'スーツ' },
      { name: 'チャコールグレー', hex: '#36454F', type: 'スーツ' },
      { name: 'ブラック', hex: '#000000', type: 'スーツ' },
    ];
    accent = [
      { name: 'ロイヤルブルー', hex: '#4169E1', type: 'ネクタイ' },
      { name: 'バーガンディ', hex: '#800020', type: 'ネクタイ' },
      { name: 'クリスプホワイト', hex: '#FFFFFF', type: 'シャツ' },
    ];
    avoid = [
      { name: 'ベージュ', hex: '#F5F5DC', type: '避ける' },
      { name: 'カーキ', hex: '#C3B091', type: '避ける' },
    ];
    reasoning = `高彩度カラー（High Contrast）との調和を重視するあなたには、はっきりとした色が最適です。ネイビーやチャコールグレーのスーツに、ロイヤルブルーやバーガンディのネクタイを合わせることで、存在感を強調します。`;
  } else {
    // 低彩度カラー
    primary = [
      { name: 'ブラウン', hex: '#654321', type: 'スーツ' },
      { name: 'オリーブグレー', hex: '#6B8E23', type: 'スーツ' },
      { name: 'ベージュ', hex: '#F5F5DC', type: 'スーツ' },
    ];
    accent = [
      { name: 'キャメル', hex: '#C19A6B', type: 'ネクタイ' },
      { name: 'モスグリーン', hex: '#8A9A5B', type: 'ネクタイ' },
      { name: 'ベージュオックスフォード', hex: '#F5F5DC', type: 'シャツ' },
    ];
    avoid = [
      { name: 'ビビッドレッド', hex: '#FF0000', type: '避ける' },
      { name: 'ロイヤルブルー', hex: '#4169E1', type: '避ける' },
    ];
    reasoning = `低彩度カラー（Blend）との調和を重視するあなたには、アースカラーが最適です。ブラウンやオリーブグレーのスーツに、キャメルやモスグリーンのネクタイを合わせることで、落ち着いた雰囲気を演出します。`;
  }

  return { primary, accent, avoid, reasoning };
};

/**
 * 包括的な診断結果の生成
 */
export const generateEnhancedDiagnosisResult = (params: {
  archetype: any;
  axisScores: AxisScores;
  axisResults: AxisResults;
  stylePreference: number;
  answers: any;
}): EnhancedDiagnosisResult => {
  const { archetype, axisScores, axisResults, stylePreference, answers } = params;

  // 生地推奨
  const fabricRecommendations = determineFabricRecommendations({
    archetype,
    axisScores,
    axisResults,
    stylePreference,
  });

  // スタイル推奨
  const styleRecommendations = determineStyleRecommendations({
    archetype,
    axisScores,
    axisResults,
    stylePreference,
  });

  // カラーパレット
  const colorPalette = determineColorPalette({
    archetype,
    axisScores,
    axisResults,
  });

  // 学術的根拠
  const academicBasis = generateAcademicBasis({
    archetype,
    axisScores,
    answers,
  });

  return {
    archetype,
    axisScores,
    axisResults,
    fabricRecommendations,
    styleRecommendations,
    colorPalette,
    academicBasis,
  };
};
