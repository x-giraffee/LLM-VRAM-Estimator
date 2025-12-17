import React, { useState, useEffect } from 'react';
import { ControlPanel } from './components/ControlPanel';
import { Visualizer } from './components/Visualizer';
import { EducationalView } from './components/EducationalView';
import { ParticleBackground } from './components/ParticleBackground';
import { calculateVRAM, calculateDeployment } from './services/memoryService';
import { CalculationInputs, CalculationResult, Precision, DeploymentResult, Language } from './types';
import { MODEL_PRESETS, TRANSLATIONS } from './constants';
import { Calculator, ExternalLink, Languages } from 'lucide-react';

const INITIAL_INPUTS: CalculationInputs = {
  paramCount: MODEL_PRESETS[0].params,
  precision: Precision.FP16,
  kvPrecision: Precision.FP16,
  seqLength: 8192,
  batchSize: 1,
  layers: MODEL_PRESETS[0].layers,
  hiddenSize: MODEL_PRESETS[0].hiddenSize,
  isGQA: false,
  selectedGPU: '',
  gpusPerNode: 8,
};

const App: React.FC = () => {
  const [lang, setLang] = useState<Language>('zh'); // Default to Chinese
  const [inputs, setInputs] = useState<CalculationInputs>(INITIAL_INPUTS);
  const [result, setResult] = useState<CalculationResult>(calculateVRAM(INITIAL_INPUTS));
  const [deployment, setDeployment] = useState<DeploymentResult | null>(null);

  const t = TRANSLATIONS[lang];

  useEffect(() => {
    const newResult = calculateVRAM(inputs);
    setResult(newResult);

    if (inputs.selectedGPU) {
      const deploy = calculateDeployment(newResult.totalMemory, inputs.selectedGPU, inputs.gpusPerNode);
      setDeployment(deploy);
    } else {
      setDeployment(null);
    }
  }, [inputs]);

  const toggleLang = () => {
    setLang(prev => prev === 'en' ? 'zh' : 'en');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 relative overflow-x-hidden">
      
      {/* Background Effect */}
      <ParticleBackground />

      <div className="relative z-10 p-4 md:p-8">
        {/* Header */}
        <header className="max-w-7xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3 bg-white/50 backdrop-blur-md p-3 rounded-xl border border-white/50 shadow-sm">
            <div className="bg-blue-600 p-2 rounded-lg text-white shadow-md shadow-blue-200">
              <Calculator size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 leading-none">{t.title}</h1>
              <p className="text-sm text-slate-500 mt-1">{t.subtitle}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={toggleLang}
              className="flex items-center gap-2 text-xs md:text-sm font-medium text-slate-600 bg-white/50 hover:bg-white px-4 py-2 rounded-full transition-colors border border-slate-200 shadow-sm"
            >
              <Languages size={16} />
              {lang === 'en' ? '中文' : 'English'}
            </button>
            <a 
              href="https://help.aliyun.com/zh/pai/getting-started/estimation-of-the-required-video-memory-for-the-model" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-xs md:text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-full transition-colors border border-blue-100"
            >
              {t.algoSource}
              <ExternalLink size={14} />
            </a>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Controls (4/12) */}
          <div className="lg:col-span-4 lg:h-[calc(100vh-8rem)] lg:sticky lg:top-8 z-20">
            <ControlPanel inputs={inputs} setInputs={setInputs} lang={lang} />
          </div>

          {/* Right Column: Visualization & Education (8/12) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <Visualizer result={result} deployment={deployment} lang={lang} />
            <EducationalView inputs={inputs} result={result} lang={lang} />
          </div>

        </main>

        <footer className="max-w-7xl mx-auto mt-16 text-center text-slate-400 text-xs pb-8 relative z-10">
          <div className="inline-block bg-white/50 backdrop-blur-sm px-6 py-3 rounded-full border border-slate-100">
            <p>{t.footerDisclaimer}</p>
            <p className="mt-1 opacity-70">{t.builtWith}</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default App;