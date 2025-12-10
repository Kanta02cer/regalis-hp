import type { Diagnosis3DInput, Suit3DConfig, SuitParameters, AvatarMorphs, MaterialSelection, ClothSimulation } from './types';
import { VIEWER_SPEC } from './spec';

const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(max, val));

const pickLapel = (mindset: SuitParameters['mindset']): SuitParameters['lapel'] =>
  mindset === 'trad' ? 'standard' : 'narrow';

const pickGloss = (usageCodes: string[]): MaterialSelection['textureSet'] => {
  if (usageCodes.includes('formal_gloss')) return 'authentic';
  if (usageCodes.includes('biz_daily')) return 'value';
  return 'milestone';
};

const pickLining = (usageCodes: string[]): SuitParameters['lining'] => {
  if (usageCodes.includes('freq_high')) return 'full';
  if (usageCodes.includes('freq_low')) return 'half';
  return 'half';
};

const pickVent = (corrections: string[]): SuitParameters['vent'] => {
  if (corrections.includes('big_watch')) return 'side';
  return 'center';
};

export const mapDiagnosisTo3DConfig = (input: Diagnosis3DInput): Suit3DConfig => {
  const { axisResults, axisDetail, subtypeTag, stylePreference = 0, corrections = [], usageRecommendations = [] } = input;

  const usageCodes = usageRecommendations.map(u => u.code);
  const correctionCodes = corrections.map(c => c.code);

  // Avatar morphs (placeholder ranges)
  const avatar: AvatarMorphs = {
    shoulderSlope: clamp(axisDetail.total.S / 4, -1, 1),
    posture: correctionCodes.includes('front_lean') ? 'front' : correctionCodes.includes('back_lean') ? 'back' : 'neutral',
    legShape: correctionCodes.includes('o_leg') ? 'o' : correctionCodes.includes('x_leg') ? 'x' : 'neutral',
    sleeve: correctionCodes.includes('sleeve_long') ? 2 : correctionCodes.includes('sleeve_short') ? -2 : 0,
    inseam: correctionCodes.includes('o_leg') || correctionCodes.includes('x_leg') ? -1 : 0,
  };

  // Suit parameters
  const suit: SuitParameters = {
    structure: axisResults.S === 'Hard' ? 'hard' : 'soft',
    contrast: axisResults.C === 'High' ? 'high' : 'blend',
    presence: axisResults.P === 'Auth' ? 'auth' : 'friend',
    mindset: axisResults.M === 'Trad' ? 'trad' : 'inno',
    lapel: pickLapel(axisResults.M === 'Trad' ? 'trad' : 'inno'),
    vent: pickVent(correctionCodes),
    buttons: stylePreference < 0 ? '3b' : '2b',
    pocketAngle: 'straight',
    vest: stylePreference < 0,
    drape: axisResults.S === 'Soft' ? 'light' : 'standard',
    gloss: axisResults.C === 'High' ? 'high' : 'mid',
    lining: pickLining(usageCodes),
  };

  // Materials
  const materials: MaterialSelection = {
    fabricId: pickGloss(usageCodes) || 'milestone',
    liningId: suit.lining === 'full' ? 'lining-full' : 'lining-half',
    textureSet: pickGloss(usageCodes),
  };

  // Cloth simulation level
  const cloth: ClothSimulation = {
    enable: true,
    quality: usageCodes.includes('formal_gloss') ? 'high' : usageCodes.includes('biz_daily') ? 'medium' : 'low',
  };

  return {
    viewer: VIEWER_SPEC,
    avatar,
    suit,
    materials,
    cloth,
    debug: {
      subtype: subtypeTag,
      axisScores: axisDetail,
      axisResults,
    },
  };
};
