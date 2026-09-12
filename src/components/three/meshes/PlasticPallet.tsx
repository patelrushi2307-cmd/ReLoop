'use client';
import React, { useRef, useState } from 'react';
import * as THREE from 'three';
import { MeshProps } from './WoodenCrate';

export const PlasticPallet = React.forwardRef<THREE.Group, MeshProps>(
  ({ color, grade = 'A', scale = 1, position = [0, 0, 0], onClick }, ref) => {
    const localRef = useRef<THREE.Group>(null);
    const [hovered, setHovered] = useState(false);

    React.useImperativeHandle(ref, () => localRef.current as THREE.Group);

    const getGradeColor = () => {
      if (color) return color;
      switch (grade) {
        case 'C': return '#1d4ed8'; // Worn blue
        case 'B': return '#2563eb'; // Medium blue
        case 'A': default: return '#3b82f6'; // Bright blue
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
        <mesh position={[0, 0.075, 0]}>
          <boxGeometry args={[2, 0.15, 2]} />
          <meshStandardMaterial
            color={getGradeColor()}
            roughness={0.5}
            metalness={0.1}
          />
        </mesh>
        {[-0.8, 0, 0.8].map((x, i) => (
          <mesh key={i} position={[x, -0.075, 0]}>
            <boxGeometry args={[0.2, 0.15, 2]} />
            <meshStandardMaterial color={getGradeColor()} roughness={0.5} metalness={0.1} />
          </mesh>
        ))}
      </group>
    );
  }
);
PlasticPallet.displayName = 'PlasticPallet';
export default PlasticPallet;
