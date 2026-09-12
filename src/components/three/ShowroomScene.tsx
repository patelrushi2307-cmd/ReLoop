'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Float, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { WoodenCrate } from './meshes/WoodenCrate';
import { SteelDrum } from './meshes/SteelDrum';
import { PlasticPallet } from './meshes/PlasticPallet';
import { IBCContainer } from './meshes/IBCContainer';
import { CardboardBundle } from './meshes/CardboardBundle';
import { MetalStrapping } from './meshes/MetalStrapping';

function GridFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
      <planeGeometry args={[50, 50]} />
      <meshStandardMaterial
        color="#0f172a"
        transparent
        opacity={0.8}
        roughness={0.9}
      />
    </mesh>
  );
}

function FloatingParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 200;
  
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#10b981"
        transparent
        opacity={0.4}
        sizeAttenuation
      />
    </points>
  );
}

interface ShowroomContentProps {
  onProductClick?: (productId: string) => void;
}

function ShowroomContent({ onProductClick }: ShowroomContentProps) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={0.8}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight position={[-5, 5, -5]} intensity={0.3} />
      <spotLight
        position={[0, 10, 0]}
        angle={0.3}
        penumbra={1}
        intensity={0.5}
        castShadow
      />

      {/* Floating Products arranged in arc */}
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
        <WoodenCrate
          position={[-4, 0.5, -1]}
          color="#8B6914"
          scale={0.9}
          onClick={() => onProductClick?.('prod-001')}
        />
      </Float>

      <Float speed={2} rotationIntensity={0.2} floatIntensity={1}>
        <SteelDrum
          position={[-1.5, 0, 1]}
          color="#4A5568"
          scale={0.8}
          onClick={() => onProductClick?.('prod-003')}
        />
      </Float>

      <Float speed={1.8} rotationIntensity={0.4} floatIntensity={0.6}>
        <PlasticPallet
          position={[1.5, -0.5, 0]}
          color="#2563EB"
          scale={0.7}
          onClick={() => onProductClick?.('prod-005')}
        />
      </Float>

      <Float speed={1.2} rotationIntensity={0.2} floatIntensity={0.9}>
        <IBCContainer
          position={[4, 0.3, -1]}
          color="#E2E8F0"
          scale={0.6}
          onClick={() => onProductClick?.('prod-006')}
        />
      </Float>

      <Float speed={2.2} rotationIntensity={0.3} floatIntensity={0.7}>
        <CardboardBundle
          position={[-2.5, -0.8, 2.5]}
          color="#92400E"
          scale={0.8}
          onClick={() => onProductClick?.('prod-007')}
        />
      </Float>

      <Float speed={1.6} rotationIntensity={0.5} floatIntensity={0.5}>
        <MetalStrapping
          position={[3, 0.8, 2]}
          color="#6B7280"
          scale={0.7}
          onClick={() => onProductClick?.('prod-008')}
        />
      </Float>

      <FloatingParticles />
      <GridFloor />

      <ContactShadows
        position={[0, -2, 0]}
        opacity={0.3}
        scale={20}
        blur={2}
        far={4}
      />

      <Environment preset="warehouse" />

      <OrbitControls
        enableZoom={true}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.5}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2.2}
        minDistance={5}
        maxDistance={15}
      />

      <fog attach="fog" args={['#0f172a', 10, 30]} />
    </>
  );
}

interface ShowroomSceneProps {
  onProductClick?: (productId: string) => void;
}

export default function ShowroomScene({ onProductClick }: ShowroomSceneProps) {
  return (
    <Canvas
      camera={{ position: [0, 2, 10], fov: 45 }}
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      shadows
      style={{ background: '#0f172a' }}
    >
      <ShowroomContent onProductClick={onProductClick} />
    </Canvas>
  );
}
