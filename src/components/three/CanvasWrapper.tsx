'use client';
import dynamic from 'next/dynamic';

interface CanvasWrapperProps {
  className?: string;
}

const ShowroomScene = dynamic(() => import('./ShowroomScene'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-slate-950">
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400 text-sm">Loading 3D Marketplace...</p>
      </div>
    </div>
  ),
});

export default function CanvasWrapper({ className = '' }: CanvasWrapperProps) {
  return (
    <div className={`relative w-full h-[85vh] overflow-hidden ${className}`}>
      <ShowroomScene />
    </div>
  );
}
