'use client';
import React, { useRef, useState } from 'react';
import { Edges } from '@react-three/drei';
import * as THREE from 'three';
import { MeshProps } from './WoodenCrate';

export const IBCContainer = React.forwardRef<THREE.Group, MeshProps>(
  ({ color, grade = 'A', scale = 1, position = [0, 0, 0], onClick }, ref) => {
    const localRef = useRef<THREE.Group>(null);
    const [hovered, setHovered] = useState(false);

    React.useImperativeHandle(ref, () => localRef.current as THREE.Group);

    const getTankColor = () => {
      if (color) return color;
      switch (grade) {
        case 'C': return '#9ca3af'; // Murky
        case 'B': return '#d1d5db'; // Slightly cloudy
        case 'A': default: return '#e0f2fe'; // Clean transparent
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
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[1.05, 1.05, 1.05]} />
          <meshBasicMaterial color="#000" transparent opacity={0} />
          <Edges linewidth={2} color={grade === 'C' ? '#6b7280' : '#d1d5db'} />
        </mesh>
        <mesh position={[0, 0.5, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshPhysicalMaterial
            color={getTankColor()}
            opacity={0.3}
            transparent={true}
            transmission={0.6}
            roughness={grade === 'A' ? 0.1 : 0.4}
            thickness={0.05}
          />
        </mesh>
        <mesh position={[0, -0.075, 0]}>
          <boxGeometry args={[1.1, 0.15, 1.1]} />
          <meshStandardMaterial color="#374151" roughness={0.8} metalness={0.2} />
        </mesh>
      </group>
    );
  }
);
IBCContainer.displayName = 'IBCContainer';
export default IBCContainer;
