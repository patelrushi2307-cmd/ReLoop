'use client';
import dynamic from 'next/dynamic';

const LazyCanvas = dynamic(
  () => import('@react-three/fiber').then((mod) => ({ default: mod.Canvas })),
  { ssr: false }
);

export { LazyCanvas as Canvas };
