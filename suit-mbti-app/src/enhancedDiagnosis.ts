export type StyleAxis = 'value' | 'authentic' | 'innovative' | 'functional';
export type FabricHouse = 'canonico' | 'reda' | 'dormeuil' | 'ariston' | 'caccioppoli' | 'drapers' | 'harrisons' | 'zegna' | 'fox' | 'duca';

export interface FabricCandidate {
  id: FabricHouse;
  name: string;
  palette: string[];
  suitability: Partial<Record<StyleAxis, number>>;
  note: string;
}

export const fabricCandidates: FabricCandidate[] = [
  { id: 'canonico', name: 'Canonico Perennial', palette: ['#1c1f2b', '#e5e7eb'], suitability: { value: 3, authentic: 2 }, note: '汎用性が高く、コストパフォーマンスに優れる定番' },
  { id: 'reda', name: 'REDA Silky Effect', palette: ['#0a0f18', '#e0f2fe'], suitability: { innovative: 3, authentic: 1 }, note: '光沢と滑らかさでモード寄りの表情を作れる' },
  { id: 'dormeuil', name: 'Dormeuil Amadeus', palette: ['#111827', '#e5e7eb'], suitability: { value: 2, authentic: 3 }, note: '構築的なショルダーと相性の良い重厚さ' },
  { id: 'ariston', name: 'ARISTON Avantgarde', palette: ['#7c3aed', '#f3e8ff'], suitability: { innovative: 3 }, note: '大胆なチェックやネオンカラーで個性を演出' },
  { id: 'caccioppoli', name: 'Caccioppoli Napoli', palette: ['#0f766e', '#ccfbf1'], suitability: { innovative: 2, authentic: 1 }, note: '軽量なリネン/コットンで南イタリアの抜け感を再現' },
  { id: 'drapers', name: 'DRAPERS Special Order', palette: ['#1f2937', '#e5e7eb'], suitability: { innovative: 2, value: 1 }, note: '別注生地の色柄で「会話のきっかけ」を作る' },
  { id: 'harrisons', name: 'Bamboo by Harrisons', palette: ['#065f46', '#d1fae5'], suitability: { innovative: 2, functional: 2 }, note: '通気性の良い竹繊維で春夏の快適さを高める' },
  { id: 'zegna', name: 'Zegna Trofeo', palette: ['#0b1120', '#c7d2fe'], suitability: { value: 2, authentic: 2 }, note: '写真映えするドレープと艶が特徴のラグジュアリー生地' },
  { id: 'fox', name: 'FOX Brothers Flannel', palette: ['#292524', '#d6d3d1'], suitability: { value: 3, authentic: 3 }, note: '英国フランネルの重厚な暖かさで威厳を作る' },
  { id: 'duca', name: 'Duca Visconti Corduroy', palette: ['#3a2d1f', '#f5f5f4'], suitability: { authentic: 2, innovative: 1 }, note: '細畝でベルベットのような艶があり冬の街着に最適' }
];

export function selectFashionTheory(axisScores: Record<StyleAxis, number>): FabricCandidate {
  const ranked = fabricCandidates
    .map((fabric) => {
      const totalScore = Object.entries(fabric.suitability).reduce((sum, [axis, weight]) => {
        const axisKey = axis as StyleAxis;
        const axisValue = axisScores[axisKey] ?? 0;
        return sum + axisValue * (weight ?? 0);
      }, 0);
      return { fabric, totalScore };
    })
    .sort((a, b) => b.totalScore - a.totalScore);

  return ranked[0]?.fabric ?? fabricCandidates[0];
}

export interface StylingBlueprint {
  jacketStyle: 'three-piece' | 'double-breasted';
  buttonCount: 2 | 3 | 6;
  cuffStyle: 'open' | 'closed';
  lapel: 'notch' | 'peak' | 'shawl';
  trouserHem: 'double' | 'plain';
  lining: 'cupro' | 'patterned' | 'none';
  colorNotes: string;
}

export function buildBlueprint(fabric: FabricCandidate, axisScores: Record<StyleAxis, number>): StylingBlueprint {
  const isInnovative = (axisScores.innovative ?? 0) >= (axisScores.authentic ?? 0);
  const isValue = (axisScores.value ?? 0) >= (axisScores.functional ?? 0);

  return {
    jacketStyle: isInnovative ? 'double-breasted' : 'three-piece',
    buttonCount: isInnovative ? 6 : 3,
    cuffStyle: isInnovative ? 'open' : 'closed',
    lapel: isInnovative ? 'peak' : 'notch',
    trouserHem: isValue ? 'double' : 'plain',
    lining: isInnovative ? 'patterned' : 'cupro',
    colorNotes: `おすすめ色: ${fabric.palette.join(' / ')}`
  };
}
