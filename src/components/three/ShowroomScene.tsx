'use client';

import { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, ContactShadows, RoundedBox, Text } from '@react-three/drei';
import * as THREE from 'three';

function createCabShape() {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.lineTo(0, 1.45);
  shape.lineTo(0.45, 1.95);
  shape.lineTo(1.45, 2.25);
  shape.lineTo(2.35, 2.25);
  shape.lineTo(2.8, 1.75);
  shape.lineTo(2.8, 0);
  shape.closePath();
  return shape;
}

const cabShape = createCabShape();
const trailerPanels = [
  { x: 1.25, y: 1.3, color: '#d1fae5' },
];

function RoadSurface() {
  const laneMarks = Array.from({ length: 9 }, (_, index) => -9.5 + index * 2.4);

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.18, 0]} receiveShadow>
        <planeGeometry args={[36, 4.2]} />
        <meshStandardMaterial color="#4b5563" roughness={0.92} metalness={0.02} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.16, 1.92]}>
        <planeGeometry args={[30, 0.08]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.5} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.16, -1.92]}>
        <planeGeometry args={[30, 0.08]} />
        <meshStandardMaterial color="#f8fafc" roughness={0.5} />
      </mesh>
      {laneMarks.map((x) => (
        <mesh key={x} rotation={[-Math.PI / 2, 0, 0]} position={[x, -1.155, 1.2]}>
          <planeGeometry args={[1.25, 0.12]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.5} />
        </mesh>
      ))}
    </group>
  );
}

function TruckLoadAssembly() {
  const groupRef = useRef<THREE.Group>(null);
  const wheelRefs = useRef<Array<THREE.Group | null>>([]);
  const scrollRef = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      scrollRef.current = window.scrollY;
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useFrame(({ clock, camera, pointer }) => {
    const t = clock.getElapsedTime();

    if (groupRef.current) {
      const scrollProgress = THREE.MathUtils.clamp(scrollRef.current / 520, 0, 1);
      const roadTravel = -scrollProgress * 5.5;
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, 2.5 + roadTravel, 0.06);
      groupRef.current.position.y = Math.sin(t * 0.9) * 0.035;
    }

    wheelRefs.current.forEach((wheel) => {
      if (wheel) wheel.rotation.z = THREE.MathUtils.lerp(wheel.rotation.z, -scrollRef.current * 0.035, 0.08);
    });

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, 2.4 + pointer.x * 0.12, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, 2.2 + pointer.y * 0.12, 0.05);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, 10.8, 0.05);
    camera.lookAt(0, 1.05, 0);
  });

  return (
    <group ref={groupRef} position={[2.5, -0.78, 0]} scale={0.93}>
      <mesh position={[-3.9, 0.65, -1.175]} rotation={[0, 0, 0]} castShadow>
        <extrudeGeometry args={[cabShape, { depth: 2.35, bevelEnabled: true, bevelSegments: 3, bevelSize: 0.08, bevelThickness: 0.08 }]} />
        <meshStandardMaterial color="#f8fafc" metalness={0.22} roughness={0.28} />
      </mesh>

      <RoundedBox args={[1.5, 0.52, 2.42]} radius={0.12} smoothness={4} position={[-2.65, 0.25, 0]} castShadow>
        <meshStandardMaterial color="#e2e8f0" metalness={0.32} roughness={0.26} />
      </RoundedBox>

      <mesh position={[-3.38, 1.82, 1.19]} rotation={[0, 0, -0.04]}>
        <planeGeometry args={[0.68, 0.38]} />
        <meshStandardMaterial color="#1f2937" roughness={0.25} />
      </mesh>
      <mesh position={[-3.38, 1.82, -1.19]} rotation={[0, 0, -0.04]}>
        <planeGeometry args={[0.68, 0.38]} />
        <meshStandardMaterial color="#1f2937" roughness={0.25} />
      </mesh>

      <mesh position={[-2.58, 1.18, 1.205]}>
        <planeGeometry args={[0.72, 0.62]} />
        <meshStandardMaterial color="#020617" metalness={0.42} roughness={0.14} />
      </mesh>
      <mesh position={[-2.58, 1.18, -1.205]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[0.72, 0.62]} />
        <meshStandardMaterial color="#020617" metalness={0.42} roughness={0.14} />
      </mesh>
      <RoundedBox args={[0.82, 0.56, 0.06]} radius={0.08} smoothness={4} position={[-2.58, 1.18, 1.24]}>
        <meshStandardMaterial color="#000000" metalness={0.45} roughness={0.12} />
      </RoundedBox>
      <RoundedBox args={[0.82, 0.56, 0.06]} radius={0.08} smoothness={4} position={[-2.58, 1.18, -1.24]}>
        <meshStandardMaterial color="#000000" metalness={0.45} roughness={0.12} />
      </RoundedBox>
      <RoundedBox args={[1.55, 0.92, 0.08]} radius={0.1} smoothness={4} position={[-2.05, 1.46, 1.28]}>
        <meshStandardMaterial color="#0b1220" metalness={0.38} roughness={0.16} />
      </RoundedBox>
      <mesh position={[-2.05, 1.46, 1.33]}>
        <boxGeometry args={[1.34, 0.06, 0.025]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.5} roughness={0.2} />
      </mesh>

      <RoundedBox args={[7.8, 2.7, 2.55]} radius={0.1} smoothness={4} position={[1.25, 1.3, 0]} castShadow>
        <meshStandardMaterial color="#064e3b" metalness={0.35} roughness={0.32} />
      </RoundedBox>

      <mesh position={[1.25, 2.68, 0]} castShadow>
        <boxGeometry args={[8.1, 0.08, 2.68]} />
        <meshStandardMaterial color="#047857" metalness={0.48} roughness={0.28} />
      </mesh>
      <mesh position={[1.25, -0.05, 0]} castShadow>
        <boxGeometry args={[8.1, 0.12, 2.68]} />
        <meshStandardMaterial color="#022c22" metalness={0.55} roughness={0.28} />
      </mesh>
      <mesh position={[1.25, 0.66, 1.3]}>
        <boxGeometry args={[7.85, 0.1, 0.05]} />
        <meshStandardMaterial color="#34d399" emissive="#047857" emissiveIntensity={0.3} metalness={0.35} roughness={0.28} />
      </mesh>

      {trailerPanels.map((panel) => (
        <group key={`${panel.x}-${panel.y}`} position={[panel.x, panel.y, 1.31]}>
          <RoundedBox args={[7.35, 1.55, 0.08]} radius={0.12} smoothness={4} castShadow>
            <meshStandardMaterial color={panel.color} metalness={0.05} roughness={0.5} />
          </RoundedBox>
          <Text position={[0, 0, 0.1]} fontSize={0.42} color="#064e3b" anchorX="center" anchorY="middle" maxWidth={6.8}>
            RECYCLE WASTE
          </Text>
        </group>
      ))}

      <mesh position={[-0.15, -0.42, 0]} castShadow>
        <boxGeometry args={[0.18, 0.85, 2.25]} />
        <meshStandardMaterial color="#f1f5f9" metalness={0.62} roughness={0.24} />
      </mesh>
      <mesh position={[5.3, 1.3, 0]} castShadow>
        <boxGeometry args={[0.16, 3.25, 2.68]} />
        <meshStandardMaterial color="#047857" metalness={0.48} roughness={0.3} />
      </mesh>
      <mesh position={[5.22, 1.3, 0]} castShadow>
        <boxGeometry args={[0.08, 2.55, 2.25]} />
        <meshStandardMaterial color="#10b981" metalness={0.35} roughness={0.34} />
      </mesh>
      <mesh position={[5.42, 0.18, 0]} castShadow>
        <boxGeometry args={[0.18, 0.2, 2.7]} />
        <meshStandardMaterial color="#f8fafc" metalness={0.35} roughness={0.3} />
      </mesh>
      <mesh position={[5.55, -0.2, 0]} castShadow>
        <boxGeometry args={[0.12, 0.45, 2.7]} />
        <meshStandardMaterial color="#f8fafc" metalness={0.35} roughness={0.3} />
      </mesh>

      {[[-3.15, -0.45], [-1.95, -0.45], [3.45, -0.45], [4.45, -0.45]].map(([x, y], index) => (
        <group key={x} position={[x, y, 1.35]}>
          <group
            ref={(node) => {
              wheelRefs.current[index] = node;
            }}
          >
            <group rotation={[Math.PI / 2, 0, 0]}>
              <mesh castShadow>
                <cylinderGeometry args={[0.55, 0.55, 0.34, 32]} />
                <meshStandardMaterial color="#15191e" metalness={0.72} roughness={0.3} />
              </mesh>
              <mesh position={[0, 0.18, 0]}>
                <cylinderGeometry args={[0.25, 0.25, 0.36, 24]} />
                <meshStandardMaterial color="#b9c0c5" metalness={0.85} roughness={0.22} />
              </mesh>
            </group>
          </group>
        </group>
      ))}

      <mesh position={[0.1, -0.45, 0]}>
        <boxGeometry args={[0.9, 0.1, 0.1]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.65} roughness={0.24} />
      </mesh>
      <mesh position={[5.55, -0.55, 0]}>
        <boxGeometry args={[0.1, 0.9, 0.1]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.65} roughness={0.24} />
      </mesh>
    </group>
  );
}

function SceneContent() {
  return (
    <>
      <color attach="background" args={['#dbe2ea']} />
      <ambientLight intensity={1.15} />
      <directionalLight
        position={[8, 10, 6]}
        intensity={1.45}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />
      <directionalLight position={[-4, 4, -5]} intensity={0.55} color="#bfdbfe" />
      <directionalLight position={[0, 2, 8]} intensity={0.45} color="#d1fae5" />

      <TruckLoadAssembly />
      <RoadSurface />

      <ContactShadows position={[0, -1.25, 0]} opacity={0.32} scale={18} blur={2.5} far={5} />
      <Environment preset="city" background={false} />
    </>
  );
}

export default function ShowroomScene() {
  return (
    <Canvas
      camera={{ position: [2.4, 2.2, 10.8], fov: 45 }}
      gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      shadows
      style={{ background: '#dbe2ea' }}
    >
      <SceneContent />
    </Canvas>
  );
}
