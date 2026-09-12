'use client';
import React, { useRef, useState } from 'react';
import * as THREE from 'three';
import { MeshProps } from './WoodenCrate';

export const SteelDrum = React.forwardRef<THREE.Group, MeshProps>(
  ({ color, grade = 'A', scale = 1, position = [0, 0, 0], onClick }, ref) => {
    const localRef = useRef<THREE.Group>(null);
    const [hovered, setHovered] = useState(false);

    React.useImperativeHandle(ref, () => localRef.current as THREE.Group);

    const getGradeColor = () => {
      if (color) return color;
      switch (grade) {
        case 'C': return '#a65b4b'; // Rusty
        case 'B': return '#8a949e'; // Discolored
        case 'A': default: return '#b0c4de'; // Clean steel
      }
    };

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
          <cylinderGeometry args={[0.5, 0.5, 1.2, 32]} />
          <meshStandardMaterial
            color={getGradeColor()}
            roughness={grade === 'C' ? 0.7 : 0.3}
            metalness={grade === 'C' ? 0.4 : 0.8}
          />
        </mesh>
        <mesh position={[0, 0.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.51, 0.02, 16, 32]} />
          <meshStandardMaterial color={grade === 'C' ? '#663322' : '#8899aa'} roughness={0.4} metalness={0.7} />
        </mesh>
        <mesh position={[0, -0.4, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.51, 0.02, 16, 32]} />
          <meshStandardMaterial color={grade === 'C' ? '#663322' : '#8899aa'} roughness={0.4} metalness={0.7} />
        </mesh>
      </group>
    );
  }
);
SteelDrum.displayName = 'SteelDrum';
export default SteelDrum;
