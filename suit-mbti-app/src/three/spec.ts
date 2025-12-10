// 3D viewer/spec configuration
// Decision: Three.js + glTF 2.0 (Draco + KTX2) as baseline.

import type { ViewerSpec } from './types';

export const VIEWER_SPEC: ViewerSpec = {
  engine: 'three',
  gltfVersion: '2.0',
  compression: {
    geometry: 'draco',
    texture: 'ktx2',
  },
  supportsClothSim: true, // enable for high-end devices; fallback to static if needed
};

export const ASSET_SPEC = {
  avatar: {
    gltf: '/3d/avatar/base-avatar.glb',
    morphs: ['height', 'weight', 'shoulderSlope', 'chest', 'waist', 'hip', 'sleeve', 'inseam', 'posture', 'legShape'],
  },
  suit: {
    gltf: '/3d/suits/base-suit.glb',
    morphs: ['lapel', 'vent', 'buttons', 'pocketAngle', 'drape', 'structure'],
    materials: {
      fabric: {
        value: '/3d/materials/fabric/value.ktx2',
        milestone: '/3d/materials/fabric/milestone.ktx2',
        authentic: '/3d/materials/fabric/authentic.ktx2',
      },
      lining: {
        half: '/3d/materials/lining/half.ktx2',
        full: '/3d/materials/lining/full.ktx2',
      },
      buttons: {
        dark: '/3d/materials/buttons/dark.ktx2',
        brass: '/3d/materials/buttons/brass.ktx2',
      },
    },
  },
} as const;
