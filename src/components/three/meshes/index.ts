'use client';

import { WoodenCrate, MeshProps } from './WoodenCrate';
import { SteelDrum } from './SteelDrum';
import { PlasticPallet } from './PlasticPallet';
import { IBCContainer } from './IBCContainer';
import { CardboardBundle } from './CardboardBundle';
import { MetalStrapping } from './MetalStrapping';

export {
  WoodenCrate,
  SteelDrum,
  PlasticPallet,
  IBCContainer,
  CardboardBundle,
  MetalStrapping
};

export type { MeshProps };

export type SupportedMeshType = 
  | 'crate' | 'drum' | 'pallet' | 'ibc' | 'cardboard' | 'strapping'
  | string;

export function getProductMesh(meshType: SupportedMeshType) {
  switch (meshType) {
    case 'crate':
      return WoodenCrate;
    case 'drum':
      return SteelDrum;
    case 'pallet':
      return PlasticPallet;
    case 'ibc':
      return IBCContainer;
    case 'cardboard':
      return CardboardBundle;
    case 'strapping':
      return MetalStrapping;
    default:
      return WoodenCrate;
  }
}
