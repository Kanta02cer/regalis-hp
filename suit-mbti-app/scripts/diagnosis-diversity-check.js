// 診断結果の多様性チェックスクリプト
// 実際の質問回答パターンをシミュレートして、診断結果の分布を確認

const getQuestionScore = (questionId, value) => {
  // バイナリ質問（b1, b2, b3）は-1または+1のみ
  if (['b1', 'b2', 'b3'].includes(questionId)) {
    return value > 0 ? 1 : -1;
  }
  
  // 5段階入力に対応
  // 奇数（q1, q3, q5, q7）: 強い重み（-2〜+2）をそのまま反映
  // 偶数（q2, q4, q6, q8）: より明確な寄与のため、スコアを拡張
  const isFirstQuestion = ['q1', 'q3', 'q5', 'q7'].includes(questionId);
  if (isFirstQuestion) {
    return Math.max(-2, Math.min(2, value));
  }
  
  // 偶数質問: より明確な寄与のため、スコアを拡張
  if (value === 0) return 0;
  return value > 0 ? Math.min(2, Math.abs(value)) : -Math.min(2, Math.abs(value));
};

const calculateAxisScores = (answers) => {
  const sScore = (answers.q1?.S || 0) + (answers.q2?.S || 0);
  const cScore = (answers.q3?.C || 0) + (answers.q4?.C || 0);
  const pScore = (answers.q5?.P || 0) + (answers.q6?.P || 0);
  const mScore = (answers.q7?.M || 0) + (answers.q8?.M || 0);
  return { S: sScore, C: cScore, P: pScore, M: mScore };
};

const calculateAdjustedAxisScores = (answers) => {
  const base = calculateAxisScores(answers);
  
  // ファッション好み: f2/f3 はM軸の微調整
  const fashionAdjustM = (answers.f2?.M || 0) + (answers.f3?.M || 0);
  
  // 使用用途: u1/u2 はM軸、u3 はS軸に寄与
  const usageAdjustM = (answers.u1?.M || 0) + (answers.u2?.M || 0);
  const usageAdjustS = (answers.u3?.S || 0);
  
  // バイナリ質問を診断ロジックに組み込む
  // b1 (ベント): M軸に寄与
  const binaryAdjustM = (answers.b1?.M || 0);
  
  // b2 (ラペル幅): C軸に寄与
  const binaryAdjustC = (answers.b2?.C || 0);
  
  // b3 (ボタン数): P軸に寄与
  const binaryAdjustP = (answers.b3?.P || 0);
  
  const adjust = {
    S: usageAdjustS,
    C: binaryAdjustC, // C軸にも調整を追加
    P: binaryAdjustP, // P軸にも調整を追加
    M: fashionAdjustM + usageAdjustM + binaryAdjustM,
  };
  
  const total = {
    S: base.S + adjust.S,
    C: base.C + adjust.C,
    P: base.P + adjust.P,
    M: base.M + adjust.M,
  };
  
  return { base, adjust, total };
};

const calculateAxisResults = (scores) => ({
  S: scores.S >= 0 ? 'Hard' : 'Soft',
  C: scores.C >= 0 ? 'High' : 'Blend',
  P: scores.P >= 0 ? 'Auth' : 'Friend',
  M: scores.M >= 0 ? 'Trad' : 'Inno',
});

const mapToArchetype = (axisResults) => {
  const code = [
    axisResults.S === 'Hard' ? 'H' : 'S',
    axisResults.C === 'High' ? 'H' : 'B',
    axisResults.P === 'Auth' ? 'A' : 'F',
    axisResults.M === 'Trad' ? 'T' : 'I',
  ].join('');
  
  const mapping = {
    HHAT: '01', SHAT: '01',
    HBAT: '02', SBAT: '02',
    HHAI: '05', SHAI: '05',
    HBAI: '06', SBAI: '06',
    HHFT: '09', SHFT: '09',
    HBFT: '10', SBFT: '10',
    HHFI: '13', SHFI: '15',
    HBFI: '14', SBFI: '16',
  };
  
  if (mapping[code]) return mapping[code];
  
  const fallback = {
    HHAF: '03', SHAF: '03',
    HBAF: '04', SBAF: '04',
    HHIF: '07', SHIF: '07',
    HBIF: '08', SBIF: '08',
    HHBF: '12', SHBF: '12',
    SBFF: '16',
  };
  return fallback[code] || '01';
};

// 実際の質問回答パターンをシミュレート
const simulateAnswers = () => {
  const results = new Map();
  const scoreDistributions = { S: [], C: [], P: [], M: [] };
  
  // 基本質問の可能な回答パターン（5段階: -2, -1, 0, 1, 2）
  const scaleValues = [-2, -1, 0, 1, 2];
  
  // サンプリング: ランダムな回答パターンを1000回生成
  for (let i = 0; i < 1000; i++) {
    const answers = {};
    
    // 基本質問（q1-q8）
    ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8'].forEach(qId => {
      const value = scaleValues[Math.floor(Math.random() * scaleValues.length)];
      const factor = qId.includes('q1') || qId.includes('q2') ? 'S' :
                    qId.includes('q3') || qId.includes('q4') ? 'C' :
                    qId.includes('q5') || qId.includes('q6') ? 'P' : 'M';
      const score = getQuestionScore(qId, value);
      answers[qId] = { [factor]: score };
    });
    
    // ファッション好み（f2, f3）
    ['f2', 'f3'].forEach(fId => {
      const value = scaleValues[Math.floor(Math.random() * scaleValues.length)];
      const score = getQuestionScore(fId, value);
      answers[fId] = { M: score };
    });
    
    // 使用用途（u1, u2, u3）
    ['u1', 'u2'].forEach(uId => {
      const value = scaleValues[Math.floor(Math.random() * scaleValues.length)];
      const score = getQuestionScore(uId, value);
      answers[uId] = { M: score };
    });
    const u3Value = scaleValues[Math.floor(Math.random() * scaleValues.length)];
    answers.u3 = { S: getQuestionScore('u3', u3Value) };
    
    // バイナリ質問（b1, b2, b3）
    // b1: M軸、b2: C軸、b3: P軸
    const b1Value = Math.random() > 0.5 ? 1 : -1;
    answers.b1 = { M: getQuestionScore('b1', b1Value) };
    const b2Value = Math.random() > 0.5 ? 1 : -1;
    answers.b2 = { C: getQuestionScore('b2', b2Value) };
    const b3Value = Math.random() > 0.5 ? 1 : -1;
    answers.b3 = { P: getQuestionScore('b3', b3Value) };
    
    // 診断結果を計算
    const axisDetail = calculateAdjustedAxisScores(answers);
    const axisResults = calculateAxisResults(axisDetail.total);
    const archetype = mapToArchetype(axisResults);
    
    // 統計を収集
    const key = `${axisResults.S[0]}${axisResults.C[0]}${axisResults.P[0]}${axisResults.M[0]}`;
    results.set(key, (results.get(key) || 0) + 1);
    
    scoreDistributions.S.push(axisDetail.total.S);
    scoreDistributions.C.push(axisDetail.total.C);
    scoreDistributions.P.push(axisDetail.total.P);
    scoreDistributions.M.push(axisDetail.total.M);
  }
  
  return { results, scoreDistributions };
};

// 実行
const { results, scoreDistributions } = simulateAnswers();

console.log('\n=== 診断結果の分布（1000回シミュレーション） ===\n');
const sortedResults = Array.from(results.entries()).sort((a, b) => b[1] - a[1]);
sortedResults.forEach(([code, count]) => {
  console.log(`${code}: ${count}回 (${(count/10).toFixed(1)}%)`);
});

console.log('\n=== スコア分布の統計 ===\n');
['S', 'C', 'P', 'M'].forEach(axis => {
  const scores = scoreDistributions[axis];
  const min = Math.min(...scores);
  const max = Math.max(...scores);
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  const stdDev = Math.sqrt(scores.reduce((sum, s) => sum + Math.pow(s - avg, 2), 0) / scores.length);
  
  console.log(`${axis}軸:`);
  console.log(`  範囲: ${min} 〜 ${max}`);
  console.log(`  平均: ${avg.toFixed(2)}`);
  console.log(`  標準偏差: ${stdDev.toFixed(2)}`);
  console.log(`  0付近の分布: ${scores.filter(s => Math.abs(s) <= 1).length}回 (${(scores.filter(s => Math.abs(s) <= 1).length/10).toFixed(1)}%)`);
  console.log('');
});

// 16パターンの到達可能性チェック
const required = [
  'HHAT', 'HBAT', 'HBAI', 'HHAI',
  'HHFT', 'HBFT', 'HHFI', 'HBFI',
  'SHAT', 'SBAT', 'SBAI', 'SHAI',
  'SHFT', 'SBFT', 'SHFI', 'SBFI',
];

const missing = required.filter(code => !results.has(code));
if (missing.length > 0) {
  console.log('⚠️  到達不可能なパターン:', missing);
} else {
  console.log('✅ 全16パターンが到達可能');
}
