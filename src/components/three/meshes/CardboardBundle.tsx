'use client';
import React, { useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { MeshProps } from './WoodenCrate';

export const CardboardBundle = React.forwardRef<THREE.Group, MeshProps>(
  ({ color, grade = 'A', scale = 1, position = [0, 0, 0], onClick }, ref) => {
    const localRef = useRef<THREE.Group>(null);
    const [hovered, setHovered] = useState(false);

    React.useImperativeHandle(ref, () => localRef.current as THREE.Group);

    const getGradeColor = () => {
      if (color) return color;
      switch (grade) {
        case 'C': return '#8b7355'; // Darker/dirty
        case 'B': return '#cdb38b'; // Normal
        case 'A': default: return '#e3cda4'; // Clean kraft
      }
    };

    const layers = useMemo(() => Array.from({ length: 8 }).map((_, i) => ({
      y: i * 0.05,
      rot: (Math.random() - 0.5) * 0.05,
      x: (Math.random() - 0.5) * 0.02,
      z: (Math.random() - 0.5) * 0.02
    })), []);

    return (
      <group
        ref={localRef}
        position={position}
        scale={hovered ? scale * 1.05 : scale}
        onClick={(e) => { e.stopPropagation(); onClick?.(); }}
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
        onPointerOut={(e) => { e.stopPropagation(); setHovered(false); }}
      >
        {layers.map((layer, i) => (
          <mesh
            key={i}
            position={[layer.x, layer.y - (8 * 0.05) / 2, layer.z]}
            rotation={[0, layer.rot, 0]}
          >
            <boxGeometry args={[1, 0.04, 1.2]} />
            <meshStandardMaterial
              color={getGradeColor()}
              roughness={0.9}
              metalness={0.0}
            />
          </mesh>
        ))}
      </group>
    );
  }
);
CardboardBundle.displayName = 'CardboardBundle';
export default CardboardBundle;
