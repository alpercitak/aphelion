import { type IUniform, ShaderMaterial, type ShaderMaterialParameters } from 'three';
import type { TypedShaderMaterial } from '@/types';

/** ShaderMaterial whose uniforms keep their declared type, so callers need no cast. */
export const createShaderMaterial = <U extends Record<string, IUniform>>(
  params: ShaderMaterialParameters & { uniforms: U },
): TypedShaderMaterial<U> => Object.assign(new ShaderMaterial(params), { uniforms: params.uniforms });
