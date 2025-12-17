import React from 'react';
import { CalculationInputs, CalculationResult, Language } from '../types';
import { BYTES_PER_PARAM, TRANSLATIONS } from '../constants';
import { MemoryCube3D } from './MemoryCube3D';

interface EducationalViewProps {
  inputs: CalculationInputs;
  result: CalculationResult;
  lang: Language;
}

export const EducationalView: React.FC<EducationalViewProps> = ({ inputs, result, lang }) => {
  const t = TRANSLATIONS[lang];
  const paramBytes = BYTES_PER_PARAM[inputs.precision];
  const kvBytes = BYTES_PER_PARAM[inputs.kvPrecision];

  return (
    <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-slate-200 mt-6 relative z-10">
      <h3 className="text-lg font-bold text-slate-800 mb-6">{t.visualLogic}</h3>

      <div className="flex flex-col 2xl:flex-row gap-8">
        
        {/* Left: Interactive Equation */}
        <div className="space-y-8 flex-1 min-w-0">
          
          {/* Weights Logic */}
          <div className="relative pl-4 border-l-4 border-blue-500">
            <h4 className="font-semibold text-blue-600 mb-2 text-sm uppercase tracking-wide">{t.modelWeights}</h4>
            <div className="bg-slate-50 p-4 rounded-md font-mono text-sm border border-slate-100 overflow-x-auto">
               <div className="flex flex-wrap items-baseline gap-2">
                 <span className="text-slate-500">{t.memFormula}</span> 
                 <span className="text-purple-600 font-bold whitespace-nowrap">{inputs.paramCount}B Params</span> 
                 <span>×</span>
                 <span className="text-orange-600 font-bold whitespace-nowrap">{paramBytes} Bytes</span>
               </div>
               <div className="mt-3 text-slate-800 font-bold text-xl border-t border-slate-200 pt-2 inline-block">
                 = {result.weightMemory} GB
               </div>
            </div>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              {t.baseCost}
            </p>
          </div>

          {/* KV Cache Logic */}
          <div className="relative pl-4 border-l-4 border-violet-500">
            <h4 className="font-semibold text-violet-600 mb-2 text-sm uppercase tracking-wide">{t.kvCache}</h4>
            <div className="bg-slate-50 p-4 rounded-md font-mono text-sm border border-slate-100 overflow-x-auto">
               <div className="flex flex-wrap items-baseline gap-1.5 leading-7">
                 <span>2 ×</span>
                 <span className="bg-slate-100 px-1 rounded">{inputs.layers}L</span> × 
                 <span className="bg-slate-100 px-1 rounded">{inputs.hiddenSize}H</span> × 
                 <span className="text-green-600 font-bold bg-green-50 px-1 rounded">{inputs.seqLength} Seq</span> × 
                 <span className="text-pink-600 font-bold bg-pink-50 px-1 rounded">{inputs.batchSize} B</span> ×
                 <span className="text-orange-600 font-bold">{kvBytes} B</span>
               </div>
               <div className="mt-3 text-slate-800 font-bold text-xl border-t border-slate-200 pt-2 inline-block">
                 ≈ {result.kvCacheMemory} GB
               </div>
            </div>
             <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              {t.kvFormula}
            </p>
          </div>

        </div>

        {/* Right: 3D Visualization */}
        <div className="flex-1 min-h-[400px]">
          <MemoryCube3D result={result} lang={lang} />
        </div>
      </div>
    </div>
  );
};