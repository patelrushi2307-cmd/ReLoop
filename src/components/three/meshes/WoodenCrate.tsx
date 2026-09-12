'use client';
import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Edges } from '@react-three/drei';
import * as THREE from 'three';

export interface MeshProps {
  color?: string;
  grade?: 'A' | 'B' | 'C';
  scale?: number;
  position?: [number, number, number];
  onClick?: () => void;
}

export const WoodenCrate = React.forwardRef<THREE.Group, MeshProps>(
  ({ color, grade = 'A', scale = 1, position = [0, 0, 0], onClick }, ref) => {
    const localRef = useRef<THREE.Group>(null);
    const [hovered, setHovered] = useState(false);

    React.useImperativeHandle(ref, () => localRef.current as THREE.Group);

    const getGradeColor = () => {
      if (color) return color;
      switch (grade) {
        case 'C': return '#6b4423'; // Dark/worn
        case 'B': return '#8b5a2b'; // Medium
        case 'A': default: return '#a0522d'; // Clean
      }
    };

    useFrame((state, delta) => {
      if (localRef.current) {
        localRef.current.rotation.y += delta * 0.1;
      }
    });

    return (
      <group
        ref={localRef}
        position={position}
        scale={hovered ? scale * 1.05 : scale}
        onClick={(e) => { e.stopPropagation(); onClick?.(); }}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
        onPointerOut={(e) => { e.stopPropagation(); setHovered(false); }}
      >
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            color={getGradeColor()}
            roughness={0.8}
            metalness={0.05}
          />
          <Edges linewidth={1} threshold={15} color="#3d2314" />
        </mesh>
      </group>
    );
  }
);
WoodenCrate.displayName = 'WoodenCrate';
export default WoodenCrate;
