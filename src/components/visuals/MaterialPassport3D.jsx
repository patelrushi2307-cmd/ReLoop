import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Rotate3D, AlertTriangle, CheckCircle2, Image as ImageIcon, Box } from 'lucide-react';

export default function MaterialPassport3D({
  materialType = 'rHDPE',
  hotspots = [],
  photos = [],
}) {
  const containerRef = useRef(null);
  const [viewMode, setViewMode] = useState('3d'); // '3d' | 'gallery'
  const [activeHotspot, setActiveHotspot] = useState(null);

  useEffect(() => {
    if (viewMode !== '3d') return;
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight || 380;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(2.5, 2.2, 3.2);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lights
    const ambLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
    dirLight.position.set(4, 8, 5);
    scene.add(dirLight);

    // 3D Parametric Archetype: Industrial Pallet / Gaylord Box
    const modelGroup = new THREE.Group();

    // Pallet Base (Wood / Polymer slats)
    const baseGeom = new THREE.BoxGeometry(1.6, 0.12, 1.3);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0xeaeaea,
      roughness: 0.4,
    });
    const base = new THREE.Mesh(baseGeom, baseMat);
    base.position.set(0, -0.4, 0);
    modelGroup.add(base);

    // Top Bulk Polymer Regrind / Pellets Container (Gaylord Box)
    const boxGeom = new THREE.BoxGeometry(1.5, 0.9, 1.2);
    const boxMat = new THREE.MeshStandardMaterial({
      color: 0x7201ff,
      roughness: 0.3,
      metalness: 0.1,
      transparent: true,
      opacity: 0.85,
    });
    const box = new THREE.Mesh(boxGeom, boxMat);
    box.position.set(0, 0.15, 0);
    modelGroup.add(box);

    // Edges Outline
    const edges = new THREE.EdgesGeometry(boxGeom);
    const edgeLine = new THREE.LineSegments(
      edges,
      new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 1.5 })
    );
    edgeLine.position.copy(box.position);
    modelGroup.add(edgeLine);

    // Hotspot Pins
    hotspots.forEach((h) => {
      const pinGeom = new THREE.SphereGeometry(0.06, 16, 16);
      const pinMat = new THREE.MeshBasicMaterial({
        color: h.severity === 'high' ? 0xff453a : h.severity === 'medium' ? 0xff9f0a : 0x8ffe01,
      });
      const pin = new THREE.Mesh(pinGeom, pinMat);
      pin.position.set(h.x, h.y + 0.15, h.z);
      modelGroup.add(pin);

      // Pulsing Halo Ring
      const haloGeom = new THREE.RingGeometry(0.08, 0.12, 24);
      const haloMat = new THREE.MeshBasicMaterial({
        color: pinMat.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.5,
      });
      const halo = new THREE.Mesh(haloGeom, haloMat);
      halo.position.copy(pin.position);
      halo.lookAt(camera.position);
      modelGroup.add(halo);
    });

    scene.add(modelGroup);

    // Orbit Controls via Drag
    let isDragging = false;
    let prevMouse = { x: 0, y: 0 };
    let spherical = { radius: 4.5, theta: 0.8, phi: 1.1 };

    const updateCamera = () => {
      camera.position.x = spherical.radius * Math.sin(spherical.phi) * Math.sin(spherical.theta);
      camera.position.y = spherical.radius * Math.cos(spherical.phi);
      camera.position.z = spherical.radius * Math.sin(spherical.phi) * Math.cos(spherical.theta);
      camera.lookAt(0, 0, 0);
    };
    updateCamera();

    const onMouseDown = (e) => {
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const dx = e.clientX - prevMouse.x;
      const dy = e.clientY - prevMouse.y;
      spherical.theta -= dx * 0.01;
      spherical.phi = Math.max(0.2, Math.min(Math.PI / 2 - 0.1, spherical.phi - dy * 0.01));
      prevMouse = { x: e.clientX, y: e.clientY };
      updateCamera();
    };

    const onMouseUp = () => (isDragging = false);

    const dom = renderer.domElement;
    dom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      modelGroup.rotation.y += 0.002;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      dom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      if (container.contains(dom)) {
        container.removeChild(dom);
      }
      renderer.dispose();
    };
  }, [viewMode, hotspots]);

  return (
    <div className="relative w-full h-[390px] rounded-3xl overflow-hidden bg-gradient-to-b from-[#F2F2F5] to-white border border-gray-200/80 shadow-xs flex flex-col justify-between">
      {/* View Switcher Controls */}
      <div className="relative z-10 p-4 flex items-center justify-between pointer-events-none">
        <div className="bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-gray-200/80 shadow-xs">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
            Digital Material Passport
          </span>
          <span className="text-xs font-bold text-black flex items-center gap-1.5">
            <Box className="w-3.5 h-3.5 text-[#7201FF]" />
            {materialType} Archetype Model
          </span>
        </div>

        <div className="pointer-events-auto flex items-center gap-1 bg-white/90 backdrop-blur-md p-1 rounded-full border border-gray-200/80 shadow-xs">
          <button
            onClick={() => setViewMode('3d')}
            className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              viewMode === '3d' ? 'bg-black text-white' : 'text-gray-600 hover:text-black'
            }`}
          >
            <Rotate3D className="w-3 h-3" />
            <span>3D Model</span>
          </button>
          <button
            onClick={() => setViewMode('gallery')}
            className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              viewMode === 'gallery' ? 'bg-black text-white' : 'text-gray-600 hover:text-black'
            }`}
          >
            <ImageIcon className="w-3 h-3" />
            <span>Photo Gallery</span>
          </button>
        </div>
      </div>

      {/* Main Display Area: 3D or Photo Gallery */}
      {viewMode === '3d' ? (
        <div ref={containerRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />
      ) : (
        <div className="absolute inset-0 p-14 flex items-center justify-center gap-3 overflow-x-auto bg-gray-50">
          {photos.map((p, idx) => (
            <img
              key={idx}
              src={p}
              alt={`Specimen ${idx + 1}`}
              className="h-56 w-56 object-cover rounded-2xl border border-gray-200 shadow-xs hover:scale-105 transition-transform"
            />
          ))}
        </div>
      )}

      {/* Bottom Hotspots Legend Overlay */}
      {viewMode === '3d' && hotspots.length > 0 && (
        <div className="relative z-10 p-4 pointer-events-auto">
          <div className="bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-gray-200/80 shadow-xs flex flex-wrap items-center gap-3 text-xs">
            <span className="font-bold text-black flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> Hotspots ({hotspots.length}):
            </span>
            {hotspots.map((h) => (
              <span
                key={h.id}
                className={`px-2.5 py-1 rounded-full font-semibold text-[11px] flex items-center gap-1.5 border ${
                  h.severity === 'high'
                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                    : h.severity === 'medium'
                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current" />
                {h.region}: {h.type}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
