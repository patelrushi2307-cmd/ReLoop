'use client';
import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { Product } from '@/lib/types';
import { Environment, OrbitControls, Html } from '@react-three/drei';

const Canvas = dynamic(() => import('@react-three/fiber').then((mod) => mod.Canvas), {
  ssr: false,
});

// A temporary placeholder mesh based on meshType until real meshes are available
function ProductMesh({ meshType, color }: { meshType: string; color?: string }) {
  const meshColor = color || '#10b981';
  switch (meshType) {
    case 'box':
      return (
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1.5, 1.5, 1.5]} />
          <meshStandardMaterial color={meshColor} />
        </mesh>
      );
    case 'cylinder':
      return (
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.8, 0.8, 2, 32]} />
          <meshStandardMaterial color={meshColor} />
        </mesh>
      );
    default:
      return (
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial color={meshColor} />
        </mesh>
      );
  }
}

function ProductScene({ product }: { product: Product }) {
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      
      <Environment preset="warehouse" />
      
      <OrbitControls 
        enableZoom={true} 
        autoRotate={true} 
        autoRotateSpeed={1}
      />
      
      <ProductMesh meshType={product.meshType || 'box'} color={product.meshColor} />

      {product.defects?.map((defect, i) => (
        <Html key={i} position={[defect.position.x, defect.position.y, defect.position.z] as [number, number, number]} center>
          <div className="group relative cursor-help">
            <div 
              className={`w-3 h-3 rounded-full border-2 border-white shadow-lg ${
                defect.grade === 'A' ? 'bg-green-500' :
                defect.grade === 'B' ? 'bg-yellow-500' : 'bg-red-500'
              }`}
            />
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden w-max max-w-xs rounded bg-black/80 px-2 py-1 text-xs text-white backdrop-blur group-hover:block">
              {defect.description} (Grade {defect.grade})
            </div>
          </div>
        </Html>
      ))}
    </>
  );
}

export default function ProductViewer3D({ product }: { product: Product }) {
  return (
    <div className="h-full w-full min-h-[500px] bg-slate-950 relative">
      <div className="absolute top-6 left-6 z-10 bg-slate-800/80 backdrop-blur text-white px-3 py-1 rounded-full text-xs font-medium border border-slate-700">
        {product.category}
      </div>
      
      {product.location && (
        <div className="absolute top-6 right-6 z-10 bg-slate-800/80 backdrop-blur text-white px-3 py-1 rounded-full text-xs font-medium border border-slate-700 flex items-center">
          <span className="mr-1">📍</span> {product.location.city}, {product.location.state}
        </div>
      )}

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-slate-400 text-xs md:hidden">
        Use ← → to switch
      </div>

      <Canvas
        camera={{ position: [0, 1, 4], fov: 45 }}
        shadows
      >
        <Suspense fallback={null}>
          <ProductScene product={product} />
        </Suspense>
      </Canvas>
    </div>
  );
}
