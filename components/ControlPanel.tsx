import React from 'react';
import { CalculationInputs, Precision, Language } from '../types';
import { MODEL_PRESETS, GPU_LIST, TRANSLATIONS } from '../constants';
import { Settings2, Cpu, Database, Server, Box } from 'lucide-react';

interface ControlPanelProps {
  inputs: CalculationInputs;
  setInputs: React.Dispatch<React.SetStateAction<CalculationInputs>>;
  lang: Language;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({ inputs, setInputs, lang }) => {
  const t = TRANSLATIONS[lang];

  const handlePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const presetName = e.target.value;
    const preset = MODEL_PRESETS.find(p => p.name === presetName);
    if (preset) {
      setInputs(prev => ({
        ...prev,
        paramCount: preset.params,
        layers: preset.layers,
        hiddenSize: preset.hiddenSize
      }));
    }
  };

  const handleChange = (field: keyof CalculationInputs, value: any) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-full overflow-y-auto">
      <div className="flex items-center gap-2 mb-6 text-slate-800">
        <Settings2 className="w-5 h-5" />
        <h2 className="text-xl font-bold">{t.config}</h2>
      </div>

      <div className="space-y-6">
        
        {/* Model Selection */}
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
          <label className="block text-sm font-medium text-slate-700 mb-2">{t.modelPreset}</label>
          <select 
            className="w-full p-2 rounded-md border border-slate-300 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={handlePresetChange}
            defaultValue="Llama-3-8B"
          >
            {MODEL_PRESETS.map(p => (
              <option key={p.name} value={p.name}>{p.name} ({p.params}B Params)</option>
            ))}
          </select>
        </div>

        {/* Hardware Target */}
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 space-y-4">
           <h3 className="text-sm font-semibold text-blue-800 uppercase tracking-wider mb-2 flex items-center gap-2">
            <Server className="w-4 h-4" /> {t.hardwareTarget}
          </h3>
          
          <div>
            <label className="block text-xs text-blue-600 mb-2">{t.selectGPU}</label>
            <select 
              className="w-full p-2 rounded-md border border-blue-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              value={inputs.selectedGPU || ''}
              onChange={(e) => handleChange('selectedGPU', e.target.value)}
            >
              <option value="">{t.autoRec}</option>
              {GPU_LIST.map(g => (
                <option key={g.name} value={g.name}>{g.name} ({g.memory}GB)</option>
              ))}
            </select>
          </div>

          <div>
             <label className="block text-xs text-blue-600 mb-2 flex items-center gap-1">
               <Box className="w-3 h-3" /> {t.gpusPerNode}
             </label>
             <select 
                className="w-full p-2 rounded-md border border-blue-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                value={inputs.gpusPerNode}
                onChange={(e) => handleChange('gpusPerNode', parseInt(e.target.value))}
             >
               <option value="1">1 GPU / Node (Workstation)</option>
               <option value="2">2 GPUs / Node</option>
               <option value="4">4 GPUs / Node</option>
               <option value="8">8 GPUs / Node (Server)</option>
               <option value="16">16 GPUs / Node (High Density)</option>
             </select>
          </div>
        </div>

        {/* Model Specs */}
        <div>
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Cpu className="w-4 h-4" /> {t.modelSpecs}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">{t.params}</label>
              <input 
                type="number" 
                step="0.1"
                value={inputs.paramCount}
                onChange={(e) => handleChange('paramCount', parseFloat(e.target.value))}
                className="w-full p-2 border border-slate-200 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">{t.precision}</label>
              <select 
                value={inputs.precision}
                onChange={(e) => handleChange('precision', e.target.value)}
                className="w-full p-2 border border-slate-200 rounded text-sm"
              >
                {Object.values(Precision).map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">{t.layers}</label>
              <input 
                type="number" 
                value={inputs.layers}
                onChange={(e) => handleChange('layers', parseInt(e.target.value))}
                className="w-full p-2 border border-slate-200 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">{t.hiddenSize}</label>
              <input 
                type="number" 
                value={inputs.hiddenSize}
                onChange={(e) => handleChange('hiddenSize', parseInt(e.target.value))}
                className="w-full p-2 border border-slate-200 rounded text-sm"
              />
            </div>
          </div>
        </div>

        {/* Inference Settings */}
        <div>
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Database className="w-4 h-4" /> {t.inferenceSettings}
          </h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between">
                <label className="block text-xs text-slate-500 mb-1">{t.contextWindow}</label>
                <span className="text-xs font-bold text-blue-600">{inputs.seqLength.toLocaleString()}</span>
              </div>
              <input 
                type="range" 
                min="512" 
                max="131072" 
                step="512"
                value={inputs.seqLength}
                onChange={(e) => handleChange('seqLength', parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            <div>
               <div className="flex justify-between">
                <label className="block text-xs text-slate-500 mb-1">{t.batchSize}</label>
                <span className="text-xs font-bold text-blue-600">{inputs.batchSize}</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="128" 
                step="1"
                value={inputs.batchSize}
                onChange={(e) => handleChange('batchSize', parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

             <div>
              <label className="block text-xs text-slate-500 mb-1">{t.kvPrecision}</label>
              <select 
                value={inputs.kvPrecision}
                onChange={(e) => handleChange('kvPrecision', e.target.value)}
                className="w-full p-2 border border-slate-200 rounded text-sm"
              >
                {Object.values(Precision).map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};