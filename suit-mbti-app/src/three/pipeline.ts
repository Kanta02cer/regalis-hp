// High-level pipeline description for integrating 3D viewer into the app.
// This is engine-agnostic configuration that can be used by a future Three.js renderer.

import { VIEWER_SPEC, ASSET_SPEC } from './spec';
import { mapDiagnosisTo3DConfig } from './mapping';
import type { Diagnosis3DInput, Suit3DConfig } from './types';

export interface AssetLoaderConfig {
  gltfLoader: 'threejs-gltfloader';
  dracoDecoderPath: string;
  ktx2TranscoderPath: string;
}

export const LOADER_CONFIG: AssetLoaderConfig = {
  gltfLoader: 'threejs-gltfloader',
  dracoDecoderPath: '/libs/draco/',
  ktx2TranscoderPath: '/libs/basis/',
};

export interface RenderPipelineConfig {
  viewer: typeof VIEWER_SPEC;
  assets: typeof ASSET_SPEC;
  loader: AssetLoaderConfig;
}

export const PIPELINE_CONFIG: RenderPipelineConfig = {
  viewer: VIEWER_SPEC,
  assets: ASSET_SPEC,
  loader: LOADER_CONFIG,
};

export const build3DConfig = (input: Diagnosis3DInput): Suit3DConfig => {
  return mapDiagnosisTo3DConfig(input);
};
