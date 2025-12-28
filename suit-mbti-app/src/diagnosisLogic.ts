// 診断アルゴリズムの完全実装
// 4軸分析システム（S-C-P-M）に基づく16種類のアーキタイプ判定

import { ARCHETYPE_DEFINITIONS } from './archetypeDefinitions';

export interface AxisScores {
  S: number; // Structure
  C: number; // Contrast
  P: number; // Presence
  M: number; // Mindset
}

export interface AxisScoreDetail {
  base: AxisScores;
  adjust: AxisScores;
  total: AxisScores;
  strength: Record<keyof AxisScores, 'strong' | 'medium' | 'light'>;
}

export interface AxisResults {
  S: 'Hard' | 'Soft';
  C: 'High' | 'Blend';
  P: 'Auth' | 'Friend';
  M: 'Trad' | 'Inno';
}

export interface CorrectionItem {
  code: string;
  label: string;
  reason: string;
}

export interface UsageRecommendation {
  code: string;
  label: string;
  reason: string;
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
 * 軸スコアの調整 (ファッション好み/使用用途/バイナリ質問から微調整)
 * より多様な診断結果を生み出すため、全軸に調整を追加
 */
export const calculateAdjustedAxisScores = (answers: DiagnosisAnswers): AxisScoreDetail => {
  const base = calculateAxisScores(answers);

  // ファッション好み: f2/f3 はM軸の微調整
  const fashionAdjustM = (answers.f2?.M || 0) + (answers.f3?.M || 0);

  // 使用用途: u1/u2 はM軸、u3 はS軸に寄与
  const usageAdjustM = (answers.u1?.M || 0) + (answers.u2?.M || 0);
  const usageAdjustS = (answers.u3?.S || 0);

  // バイナリ質問を診断ロジックに組み込む
  // b1 (ベント): M軸に寄与（センターベント=伝統的、サイドベンツ=革新的）
  const binaryAdjustM = (answers.b1?.M || 0);
  
  // b2 (ラペル幅): C軸に寄与（細め=高コントラスト、太め=ブレンド）
  const binaryAdjustC = (answers.b2?.C || 0);
  
  // b3 (ボタン数): P軸に寄与（2ボタン=現代的/親和的、3ボタン=伝統的/権威的）
  const binaryAdjustP = (answers.b3?.P || 0);

  // 補正質問（c1-c4）もS軸の微調整として考慮（既にbaseに含まれているが、追加の微調整として）
  // c1, c2, c3, c4は全てS軸に寄与するが、補正アイテムとして扱うため、ここでは軽微な調整のみ
  const correctionAdjustS = 0; // 補正はderiveCorrectionsで別途処理

  const adjust: AxisScores = {
    S: usageAdjustS + correctionAdjustS,
    C: binaryAdjustC, // C軸にも調整を追加
    P: binaryAdjustP, // P軸にも調整を追加
    M: fashionAdjustM + usageAdjustM + binaryAdjustM,
  };

  const total: AxisScores = {
    S: base.S + adjust.S,
    C: base.C + adjust.C,
    P: base.P + adjust.P,
    M: base.M + adjust.M,
  };

  // 強度タグ: 絶対値2以上=strong, 1=medium, 0=light
  const strength: Record<keyof AxisScores, 'strong' | 'medium' | 'light'> = {
    S: Math.abs(total.S) >= 2 ? 'strong' : Math.abs(total.S) === 1 ? 'medium' : 'light',
    C: Math.abs(total.C) >= 2 ? 'strong' : Math.abs(total.C) === 1 ? 'medium' : 'light',
    P: Math.abs(total.P) >= 2 ? 'strong' : Math.abs(total.P) === 1 ? 'medium' : 'light',
    M: Math.abs(total.M) >= 2 ? 'strong' : Math.abs(total.M) === 1 ? 'medium' : 'light',
  };

  return { base, adjust, total, strength };
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
 * サブタイプタグ生成（強度をラベル化）
 */
export const buildSubtypeTag = (axisResults: AxisResults, strength: AxisScoreDetail['strength']) => {
  const tag = (axis: keyof AxisResults, label: AxisResults[keyof AxisResults]) => {
    const power = strength[axis as keyof AxisScores];
    return `${label}-${power === 'strong' ? 'strong' : power === 'medium' ? 'plus' : 'soft'}`;
  };

  return {
    S: tag('S', axisResults.S),
    C: tag('C', axisResults.C),
    P: tag('P', axisResults.P),
    M: tag('M', axisResults.M),
  };
};

/**
 * スタイル好みの判定
 * ファッション好み質問（f1）に基づく（旧q_styleと互換性を保持）
 */
export const determineStylePreference = (answers: DiagnosisAnswers): number => {
  // f1（新）またはq_style（旧）が-1（左: 3ピース）なら負の値、1（右: ダブル）なら正の値
  return answers.f1?.STYLE || answers.q_style?.STYLE || 0;
};

/**
 * 診断結果の生成
 */
export const generateDiagnosisResult = (answers: DiagnosisAnswers) => {
  const axisDetail = calculateAdjustedAxisScores(answers);
  const axisScores = axisDetail.total;
  const axisResults = calculateAxisResults(axisScores);
  const subtypeTag = buildSubtypeTag(axisResults, axisDetail.strength);
  const archetypeId = mapToArchetype(axisResults);
  const stylePreference = determineStylePreference(answers);
  const corrections = deriveCorrections(answers);
  const usageRecommendations = deriveUsageRecommendations(answers);

  const archetypeData = ARCHETYPE_DEFINITIONS[archetypeId];
  if (!archetypeData) {
    throw new Error(`Archetype ${archetypeId} not found`);
  }

  return {
    archetype: archetypeData,
    axisScores,
    axisResults,
    axisDetail,
    subtypeTag,
    stylePreference,
    corrections,
    usageRecommendations,
  };
};

/**
 * 補正アイテム生成
 */
export const deriveCorrections = (answers: DiagnosisAnswers): CorrectionItem[] => {
  const items: CorrectionItem[] = [];

  const pushUnique = (code: string, label: string, reason: string) => {
    if (!items.find(i => i.code === code)) items.push({ code, label, reason });
  };

  // c1 姿勢
  if (answers.c1?.S) {
    if (answers.c1.S < 0) pushUnique('front_lean', '前肩補正', '前傾姿勢による前肩調整');
    if (answers.c1.S > 0) pushUnique('back_lean', '後肩補正', '後傾姿勢による後肩調整');
  }

  // c2 首
  if (answers.c2?.S) {
    if (answers.c2.S < 0) pushUnique('neck_short', 'カラー低寸', '首が詰まって見えるため襟低め');
    if (answers.c2.S > 0) pushUnique('neck_long', 'カラー高寸', '首が長く見えるため襟高め');
  }

  // c3 裄丈
  if (answers.c3?.S) {
    if (answers.c3.S < 0) pushUnique('sleeve_short', '裄丈詰め', '短めの腕に合わせ裄丈を詰める');
    if (answers.c3.S > 0) pushUnique('sleeve_long', '裄丈出し', '長めの腕に合わせ裄丈を出す');
  }

  // c4 脚
  if (answers.c4?.S) {
    if (answers.c4.S < 0) pushUnique('o_leg', 'O脚補正', 'O脚ラインを補正');
    if (answers.c4.S > 0) pushUnique('x_leg', 'X脚補正', 'X脚ラインを補正');
  }

  return items;
};

/**
 * 使用用途に基づく推奨
 */
export const deriveUsageRecommendations = (answers: DiagnosisAnswers): UsageRecommendation[] => {
  const recs: UsageRecommendation[] = [];
  const pushUnique = (code: string, label: string, reason: string) => {
    if (!recs.find(r => r.code === code)) recs.push({ code, label, reason });
  };

  // u1 主シーン
  if (answers.u1?.M) {
    if (answers.u1.M < 0) pushUnique('biz_daily', '耐久・シワ耐性重視', 'ビジネス日常使用のため耐久性を優先');
    if (answers.u1.M > 0) pushUnique('formal_gloss', '光沢・フォーマル重視', 'フォーマル使用のため光沢感を優先');
  }

  // u2 着用頻度
  if (answers.u2?.M) {
    if (answers.u2.M < 0) pushUnique('freq_high', '耐久裏地/総裏推奨', '高頻度使用のため耐久裏地を推奨');
    if (answers.u2.M > 0) pushUnique('freq_low', '軽量/背抜き推奨', '低頻度使用のため軽量仕様で快適性を確保');
  }

  // u3 時計サイズ
  if (answers.u3?.S) {
    if (answers.u3.S > 0) pushUnique('big_watch', '袖口ゆとり調整', '大きな時計に合わせ袖口ゆとりを確保');
  }

  return recs;
};
