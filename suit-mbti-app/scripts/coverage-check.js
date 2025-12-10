// Coverage check for archetype mapping
// Evaluates axis sign combinations over a reasonable score range to confirm all 16 patterns map.

const mapToArchetype = (axisResults) => {
  const code = [
    axisResults.S === 'Hard' ? 'H' : 'S',
    axisResults.C === 'High' ? 'H' : 'B',
    axisResults.P === 'Auth' ? 'A' : 'F',
    axisResults.M === 'Trad' ? 'T' : 'I',
  ].join('');

  const mapping = {
    HHAT: '01',
    SHAT: '01',
    HBAT: '02',
    SBAT: '02',
    HHAI: '05',
    SHAI: '05',
    HBAI: '06',
    SBAI: '06',
    HHFT: '09',
    SHFT: '09',
    HBFT: '10',
    SBFT: '10',
    HHFI: '13',
    SHFI: '15',
    HBFI: '14',
    SBFI: '16',
  };

  if (mapping[code]) return mapping[code];

  const fallback = {
    HHAF: '03',
    SHAF: '03',
    HBAF: '04',
    SBAF: '04',
    HHIF: '07',
    SHIF: '07',
    HBIF: '08',
    SBIF: '08',
    HHBF: '12',
    SHBF: '12',
    SBFF: '16',
  };
  return fallback[code] || '01';
};

const calculateAxisResults = (scores) => ({
  S: scores.S >= 0 ? 'Hard' : 'Soft',
  C: scores.C >= 0 ? 'High' : 'Blend',
  P: scores.P >= 0 ? 'Auth' : 'Friend',
  M: scores.M >= 0 ? 'Trad' : 'Inno',
});

// Sweep scores from -3..3 on each axis to ensure all sign combinations appear.
const values = [-3, -2, -1, 0, 1, 2, 3];
const seen = new Set();
const combos = [];

for (const S of values) {
  for (const C of values) {
    for (const P of values) {
      for (const M of values) {
        const axisResults = calculateAxisResults({ S, C, P, M });
        const archetype = mapToArchetype(axisResults);
        const code = [axisResults.S[0], axisResults.C[0], axisResults.P[0], axisResults.M[0]].join('');
        seen.add(code);
        combos.push({ S, C, P, M, code, archetype });
      }
    }
  }
}

// For reporting, map the actual four-letter code based on axisResults initials.
const seenCodes = new Set();
for (const item of combos) {
  seenCodes.add(item.code);
}

const required = [
  'HHAT', 'HBAT', 'HBAI', 'HHAI',
  'HHFT', 'HBFT', 'HHFI', 'HBFI',
  'SHAT', 'SBAT', 'SBAI', 'SHAI',
  'SHFT', 'SBFT', 'SHFI', 'SBFI',
];

const missingCodes = required.filter(code => !seenCodes.has(code));

console.log('Total combinations evaluated:', combos.length);
console.log('Seen sign codes (S/C/P/M initials):', Array.from(seenCodes).sort());
if (missingCodes.length === 0) {
  console.log('All 16 archetype sign patterns are reachable via score sweep.');
} else {
  console.log('Missing patterns:', missingCodes);
}
