'use client';
import React, { useRef, useState } from 'react';
import * as THREE from 'three';
import { MeshProps } from './WoodenCrate';

export const MetalStrapping = React.forwardRef<THREE.Group, MeshProps>(
  ({ color, grade = 'A', scale = 1, position = [0, 0, 0], onClick }, ref) => {
    const localRef = useRef<THREE.Group>(null);
    const [hovered, setHovered] = useState(false);

    React.useImperativeHandle(ref, () => localRef.current as THREE.Group);

    const getGradeColor = () => {
      if (color) return color;
      switch (grade) {
        case 'C': return '#8b4513'; // Rusty
        case 'B': return '#696969'; // Dull
        case 'A': default: return '#c0c0c0'; // Shiny silver
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
        {[0, 0.05, 0.1, 0.15, 0.2].map((yOffset, i) => (
          <mesh key={i} position={[0, yOffset - 0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.5, 0.02, 16, 64]} />
            <meshStandardMaterial
              color={getGradeColor()}
              roughness={grade === 'C' ? 0.6 : 0.2}
              metalness={grade === 'C' ? 0.5 : 0.9}
            />
          </mesh>
        ))}
      </group>
    );
  }
);
MetalStrapping.displayName = 'MetalStrapping';
export default MetalStrapping;
