// 診断アルゴリズムの完全実装
// 4軸分析システム（S-C-P-M）に基づく16種類のアーキタイプ判定

import { ARCHETYPE_DEFINITIONS } from './archetypeDefinitions';

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

export interface DiagnosisAnswers {
  [questionId: string]: {
    S?: number;
    C?: number;
    P?: number;
    M?: number;
    STYLE?: number;
  };
}

/**
 * 4軸スコアの計算
 */
export const calculateAxisScores = (answers: DiagnosisAnswers): AxisScores => {
  const sScore = (answers.q1?.S || 0) + (answers.q2?.S || 0);
  const cScore = (answers.q3?.C || 0) + (answers.q4?.C || 0);
  const pScore = (answers.q5?.P || 0) + (answers.q6?.P || 0);
  const mScore = (answers.q7?.M || 0) + (answers.q8?.M || 0);

  return { S: sScore, C: cScore, P: pScore, M: mScore };
};

/**
 * 4軸結果の判定
 */
export const calculateAxisResults = (scores: AxisScores): AxisResults => {
  return {
    S: scores.S >= 0 ? 'Hard' : 'Soft',
    C: scores.C >= 0 ? 'High' : 'Blend',
    P: scores.P >= 0 ? 'Auth' : 'Friend',
    M: scores.M >= 0 ? 'Trad' : 'Inno',
  };
};

/**
 * 完全なアーキタイプマッピングロジック
 * 全16パターン（2^4 = 16）をカバー
 */
export const mapToArchetype = (axisResults: AxisResults): string => {
  // コード生成: S-C-P-M (each is H/S, H/B, A/F, T/I)
  const code = [
    axisResults.S === 'Hard' ? 'H' : 'S',
    axisResults.C === 'High' ? 'H' : 'B',
    axisResults.P === 'Auth' ? 'A' : 'F',
    axisResults.M === 'Trad' ? 'T' : 'I',
  ].join('');

  // 完全なマッピングテーブル（全16パターン）
  // フォーマット: S-C-P-M (H/S, H/B, A/F, T/I)
  const mapping: Record<string, string> = {
    // Rulers Group (Authority + Tradition dominant) - P:Auth, M:Trad
    "HHAT": "01", // Hard / High / Auth / Trad
    "SHAT": "01",
    "HBAT": "02", // Hard / Blend / Auth / Trad
    "SBAT": "02",

    // Challengers Group (Authority + Innovation dominant) - P:Auth, M:Inno
    "HHAI": "05", // Hard / High / Auth / Inno
    "SHAI": "05",
    "HBAI": "06", // Hard / Blend / Auth / Inno
    "SBAI": "06",

    // Harmonizers Group (Friendliness + Tradition dominant) - P:Friend, M:Trad
    "HHFT": "09", // Hard / High / Friend / Trad
    "SHFT": "09",
    "HBFT": "10", // Hard / Blend / Friend / Trad
    "SBFT": "10",

    // Innovators Group (Friendliness + Innovation dominant) - P:Friend, M:Inno
    "HHFI": "13", // Hard / High / Friend / Inno
    "SHFI": "15", // Soft / High / Friend / Inno
    "HBFI": "14", // Hard / Blend / Friend / Inno
    "SBFI": "16", // Soft / Blend / Friend / Inno
  };

  // フォールバック: 完全一致がない場合の近似マッピング
  if (!mapping[code]) {
    // 近似ルール: PとMを優先し、次にC、最後にS
    const fallbackMapping: Record<string, string> = {
      "HHAF": "03",
      "SHAF": "03",
      "HBAF": "04",
      "SBAF": "04",
      "HHIF": "07",
      "SHIF": "07",
      "HBIF": "08",
      "SBIF": "08",
      "HHBF": "12",
      "SHBF": "12",
      "SBFF": "16",
    };
    return fallbackMapping[code] || '01'; // デフォルトはThe Sovereign
  }

  return mapping[code];
};

/**
 * スタイル好みの判定
 * STYLE質問（q_style）に基づく
 */
export const determineStylePreference = (answers: DiagnosisAnswers): number => {
  // q_styleが-1（左: 3ピース）なら負の値、1（右: ダブル）なら正の値
  return answers.q_style?.STYLE || 0;
};

/**
 * 診断結果の生成
 */
export const generateDiagnosisResult = (answers: DiagnosisAnswers) => {
  const axisScores = calculateAxisScores(answers);
  const axisResults = calculateAxisResults(axisScores);
  const archetypeId = mapToArchetype(axisResults);
  const stylePreference = determineStylePreference(answers);

  const archetypeData = ARCHETYPE_DEFINITIONS[archetypeId];
  if (!archetypeData) {
    throw new Error(`Archetype ${archetypeId} not found`);
  }

  return {
    archetype: archetypeData,
    axisScores,
    axisResults,
    stylePreference,
  };
};
