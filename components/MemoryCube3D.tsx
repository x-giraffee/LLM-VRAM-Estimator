import React, { useState, useRef, useEffect } from 'react';
import { CalculationResult, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface MemoryCube3DProps {
  result: CalculationResult;
  lang: Language;
}

// Helper component for a single HBM-style Chip
const HBMChip = ({ 
  width, 
  height, 
  depth, 
  xPos,
  zPos,
  color, 
  label, 
  value, 
  subLabel,
  delay
}: any) => {
  const [hover, setHover] = useState(false);

  // HBM side texture (layered look)
  // Using repeating linear gradient to simulate stacked dies
  const layerPattern = `repeating-linear-gradient(
    0deg,
    ${color} 0px,
    ${color} 4px,
    rgba(0,0,0,0.3) 4px,
    rgba(0,0,0,0.3) 5px
  )`;

  const topFaceStyle: React.CSSProperties = {
    position: 'absolute',
    width: width,
    height: depth,
    background: color, // Top is solid color
    transform: `rotateX(90deg) translateZ(${depth / 2}px)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '1px solid rgba(255,255,255,0.4)',
    boxShadow: hover ? `0 0 15px ${color}` : 'none',
    transition: 'all 0.3s ease',
  };

  const sideFaceBase: React.CSSProperties = {
    position: 'absolute',
    background: layerPattern, // Layered look
    border: '1px solid rgba(255,255,255,0.1)',
    backfaceVisibility: 'hidden',
    transition: 'filter 0.3s ease',
    filter: hover ? 'brightness(1.3)' : 'brightness(1)',
  };

  return (
    <div 
      className="absolute preserve-3d transition-transform duration-500 ease-out"
      style={{
        width: width,
        height: height,
        transform: `translateX(${xPos}px) translateZ(${zPos}px) translateY(${-height/2}px)`, // Sit on floor
        cursor: 'pointer',
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Front */}
      <div style={{ ...sideFaceBase, width: width, height: height, transform: `rotateY(0deg) translateZ(${depth / 2}px)` }} />
      {/* Back */}
      <div style={{ ...sideFaceBase, width: width, height: height, transform: `rotateY(180deg) translateZ(${depth / 2}px)` }} />
      {/* Right */}
      <div style={{ ...sideFaceBase, width: depth, height: height, transform: `rotateY(90deg) translateZ(${width / 2}px)` }} />
      {/* Left */}
      <div style={{ ...sideFaceBase, width: depth, height: height, transform: `rotateY(-90deg) translateZ(${width / 2}px)` }} />
      
      {/* Top Cap */}
      <div style={topFaceStyle}>
         <div className="text-[10px] font-bold text-white/90 tracking-widest uppercase rotate-180" style={{writingMode: 'vertical-lr'}}>HBM</div>
      </div>
      
      {/* Bottom (Shadow/Base) */}
      <div style={{ 
        position: 'absolute', 
        width: width, 
        height: depth, 
        background: 'rgba(0,0,0,0.8)',
        transform: `rotateX(-90deg) translateZ(${height - (depth / 2)}px)`,
        boxShadow: `0 0 20px rgba(0,0,0,0.5)`
      }} />

      {/* Floating Info Card */}
      <div 
        className={`absolute left-1/2 -translate-x-1/2 -top-12 transition-all duration-300 pointer-events-none whitespace-nowrap z-50
          ${hover ? 'opacity-100 -translate-y-2' : 'opacity-80 translate-y-0'}
        `}
      >
         <div className="bg-slate-900/90 backdrop-blur border border-slate-600 px-3 py-2 rounded shadow-xl flex flex-col items-center">
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">{label}</div>
            <div className="text-white font-mono font-bold text-sm" style={{ color: color }}>{value} GB</div>
            <div className="text-[9px] text-slate-500">{subLabel}</div>
         </div>
         {/* Connector line */}
         <div className="w-[1px] h-4 bg-slate-500/50 mx-auto"></div>
      </div>
    </div>
  );
};

export const MemoryCube3D: React.FC<MemoryCube3DProps> = ({ result, lang }) => {
  const t = TRANSLATIONS[lang];
  
  // Interactive Rotation State
  const [rotation, setRotation] = useState({ x: -30, y: 30 });
  const isDragging = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    lastMouse.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const deltaX = e.clientX - lastMouse.current.x;
    const deltaY = e.clientY - lastMouse.current.y;
    
    setRotation(prev => ({
      x: Math.max(-60, Math.min(0, prev.x - deltaY * 0.5)),
      y: prev.y + deltaX * 0.5
    }));

    lastMouse.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, []);

  // Dimensions
  const MAX_HEIGHT = 150;
  // Normalize heights based on the largest component to ensure they are visible but proportional relative to each other?
  // Or relative to Total? Relative to Total is better for accurate comparison.
  const scale = MAX_HEIGHT / (result.totalMemory || 1);
  
  // Minimum visual height so small buffers don't disappear
  const wH = Math.max(result.weightMemory * scale, 5);
  const kvH = Math.max(result.kvCacheMemory * scale, 5);
  const actH = Math.max(result.activationMemory * scale, 5);

  // HBM Chips are usually rectangular (e.g. 11mm x 8mm). Let's simulate that ratio.
  const chipWidth = 40; 
  const chipDepth = 60; 
  const gap = 20;

  // Center alignment offsets
  const totalWidth = (chipWidth * 3) + (gap * 2);
  const startX = -totalWidth / 2 + chipWidth / 2;

  return (
    <div 
      className="w-full h-[400px] bg-slate-950 rounded-xl overflow-hidden relative shadow-inner cursor-move select-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      style={{
        background: 'radial-gradient(circle at center, #1e293b 0%, #0f172a 100%)'
      }}
    >
       <div className="absolute top-4 left-4 z-10 pointer-events-none">
         <h4 className="text-white/90 font-bold text-sm flex items-center gap-2">
           <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
           Memory Breakdown (HBM View)
         </h4>
         <p className="text-slate-500 text-xs mt-1">Drag to inspect stacks</p>
      </div>

      <div 
        className="w-full h-full flex items-center justify-center"
        style={{ perspective: '1200px' }}
      >
        <div 
          className="preserve-3d relative"
          style={{ 
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
          }}
        >
          {/* Substrate / Interposer (Base) */}
          <div 
             className="absolute preserve-3d"
             style={{ 
               width: 260, height: 160, 
               background: '#334155', // Silicon Grey
               transform: 'translate(-50%, -50%) rotateX(90deg) translateZ(0px)',
               border: '1px solid #475569',
               boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
             }} 
          >
             {/* Circuit Patterns */}
             <div className="w-full h-full opacity-30" style={{ 
               backgroundImage: `
                 linear-gradient(90deg, transparent 50%, #000 50%),
                 linear-gradient(0deg, transparent 50%, #000 50%)
               `,
               backgroundSize: '4px 4px'
             }}></div>
             
             {/* GPU Core (The logic center, though we aren't visualizing logic size, just a placeholder) */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-20 bg-slate-800 border border-slate-600 flex items-center justify-center">
                <span className="text-slate-600 font-bold text-xs tracking-widest">GPU CORE</span>
             </div>
          </div>

          {/* HBM Stacks positioned around or on the substrate */}
          {/* We will place them in front of the "Core" area for visibility, or simply aligned 3 in a row */}
          
          {/* 1. Model Weights */}
          <HBMChip 
             width={chipWidth} depth={chipDepth} height={wH}
             xPos={startX}
             zPos={0}
             color="#3b82f6" // Blue
             label={t.weights}
             value={result.weightMemory}
             subLabel="Static Data"
          />

          {/* 2. KV Cache */}
          <HBMChip 
             width={chipWidth} depth={chipDepth} height={kvH}
             xPos={startX + chipWidth + gap}
             zPos={0}
             color="#8b5cf6" // Purple
             label={t.cache}
             value={result.kvCacheMemory}
             subLabel="Context Data"
          />

          {/* 3. Overhead */}
          <HBMChip 
             width={chipWidth} depth={chipDepth} height={actH}
             xPos={startX + (chipWidth + gap) * 2}
             zPos={0}
             color="#94a3b8" // Slate/Gray
             label={t.buffer}
             value={result.activationMemory}
             subLabel="Runtime Buffer"
          />

        </div>
      </div>
    </div>
  );
};