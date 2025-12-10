// 3D fitment type definitions (engine-agnostic)
// These types describe how diagnosis results map to avatar morphs, suit parameters, and materials.

import type { AxisResults, AxisScoreDetail } from '../diagnosisLogic';

export type Engine = 'three';

export interface ViewerSpec {
  engine: Engine;
  gltfVersion: '2.0';
  compression: {
    geometry: 'draco';
    texture: 'ktx2';
  };
  supportsClothSim: boolean;
}

export interface AvatarMorphs {
  height?: number; // meters
  weight?: number; // kg
  shoulderSlope?: number; // -1..1
  chest?: number; // cm
  waist?: number; // cm
  hip?: number; // cm
  sleeve?: number; // cm
  inseam?: number; // cm
  posture?: 'front' | 'neutral' | 'back';
  legShape?: 'o' | 'x' | 'neutral';
}

export interface SuitParameters {
  structure: 'hard' | 'soft';
  contrast: 'high' | 'blend';
  presence: 'auth' | 'friend';
  mindset: 'trad' | 'inno';
  lapel: 'narrow' | 'standard' | 'wide';
  vent: 'center' | 'side';
  buttons: '2b' | '3b';
  pocketAngle: 'straight' | 'slanted';
  vest: boolean;
  drape: 'light' | 'standard' | 'heavy';
  gloss: 'low' | 'mid' | 'high';
  lining: 'half' | 'full';
}

export interface MaterialSelection {
  fabricId: string;
  liningId: string;
  accentButtons?: string;
  textureSet?: 'value' | 'milestone' | 'authentic';
}

export interface ClothSimulation {
  enable: boolean;
  quality: 'low' | 'medium' | 'high';
}

export interface Suit3DConfig {
  viewer: ViewerSpec;
  avatar: AvatarMorphs;
  suit: SuitParameters;
  materials: MaterialSelection;
  cloth: ClothSimulation;
  debug?: {
    subtype?: Record<string, string>;
    axisScores?: AxisScoreDetail;
    axisResults?: AxisResults;
  };
}

export interface Diagnosis3DInput {
  axisResults: AxisResults;
  axisDetail: AxisScoreDetail;
  subtypeTag?: Record<string, string>;
  stylePreference?: number;
  corrections?: { code: string }[];
  usageRecommendations?: { code: string }[];
}
