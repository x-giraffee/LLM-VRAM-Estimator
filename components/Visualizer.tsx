import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { CalculationResult, DeploymentResult, Language } from '../types';
import { MemoryStick, Server, AlertTriangle, Box } from 'lucide-react';
import { TRANSLATIONS } from '../constants';

interface VisualizerProps {
  result: CalculationResult;
  deployment: DeploymentResult | null;
  lang: Language;
}

export const Visualizer: React.FC<VisualizerProps> = ({ result, deployment, lang }) => {
  const t = TRANSLATIONS[lang];
  
  const getGenericRec = (total: number) => {
    if (total <= 24) return lang === 'zh' ? "单张高端消费级显卡 (24GB)" : "Single High-End Consumer GPU (24GB)";
    if (total <= 48) return lang === 'zh' ? "工作站/专业卡 (48GB)" : "Prosumer/Workstation Card (48GB)";
    if (total <= 80) return lang === 'zh' ? "数据中心 A100/H100 (80GB)" : "Data Center A100/H100 (80GB)";
    if (total <= 160) return lang === 'zh' ? "2张数据中心卡 (160GB+)" : "2x Data Center Cards (160GB+)";
    return lang === 'zh' ? "需要多卡集群" : "Multi-GPU Cluster Required";
  };

  const gpuRec = deployment 
    ? `${deployment.numNodes}x ${t.nodes} (${t.gpus}: ${deployment.totalCards})`
    : getGenericRec(result.totalMemory);

  const isDanger = result.totalMemory > 80 && !deployment;

  return (
    <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col relative z-10">
      <div className="flex justify-between items-start mb-6">
        <div>
           <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <MemoryStick className="w-5 h-5 text-blue-600" />
            {t.resultTitle}
          </h2>
          <p className="text-sm text-slate-500 mt-1">{t.totalUsage}</p>
        </div>
        <div className="text-right">
          <span className={`text-4xl font-extrabold ${isDanger ? 'text-red-500' : 'text-slate-900'}`}>
            {result.totalMemory} <span className="text-lg text-slate-500 font-normal">GB</span>
          </span>
        </div>
      </div>

      {/* Deployment Recommendation Card */}
      <div className={`mb-6 p-4 rounded-lg border flex flex-col gap-2 transition-colors ${deployment ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-100'}`}>
        <div className="flex items-center gap-2">
           <Server className={`w-4 h-4 ${deployment ? 'text-blue-600' : 'text-slate-400'}`} />
           <span className="text-xs font-bold uppercase tracking-wide opacity-70">
             {deployment ? t.deploymentPlan : t.genericRec}
           </span>
        </div>
        
        <div className="flex justify-between items-end">
          <p className={`text-lg font-bold ${deployment ? 'text-blue-900' : 'text-slate-700'}`}>
            {gpuRec}
          </p>
          {deployment && (
            <span className="text-sm font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded">
              {t.capacity}: {deployment.totalVRAM} GB
            </span>
          )}
        </div>

        {deployment && (
          <div className="mt-4 text-xs text-blue-800 space-y-4">
             <div className="flex gap-2 items-start">
               {deployment.reason.includes("Optimized") ? (
                 <AlertTriangle className="w-3 h-3 text-amber-500 mt-0.5 flex-shrink-0" />
               ) : (
                 <div className="w-3 h-3 bg-blue-400 rounded-full mt-0.5 flex-shrink-0" />
               )}
               <span>{deployment.reason}</span>
             </div>
             
             {/* Server Rack Visualization */}
             <div className="flex flex-col gap-3">
               {Array.from({ length: deployment.numNodes }).map((_, nodeIdx) => {
                 // How many cards in this node?
                 // Simple logic: Fill all nodes except possibly the last one?
                 // No, requirement said "Make it clear how many units to buy". Usually means full populated.
                 // We will visualize full populated nodes, but highlight active GPUs.
                 
                 // If totalCards = 9, density = 8.
                 // Node 1: 8 Active. Node 2: 1 Active.
                 const cardsInThisNode = Math.min(
                    deployment.totalCards - (nodeIdx * deployment.cardsPerNode),
                    deployment.cardsPerNode
                 );

                 return (
                   <div key={nodeIdx} className="flex flex-col gap-1 p-2 bg-blue-100/50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-2 text-blue-900/60 font-bold uppercase tracking-widest text-[10px]">
                        <Box className="w-3 h-3" /> Node {nodeIdx + 1} ({deployment.cardsPerNode}x {deployment.gpu.name})
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {Array.from({ length: deployment.cardsPerNode }).map((_, slotIdx) => {
                          const isActive = slotIdx < cardsInThisNode;
                          return (
                            <div 
                              key={slotIdx} 
                              className={`
                                h-8 flex-1 min-w-[30px] rounded border flex items-center justify-center text-[10px] font-bold transition-all
                                ${isActive 
                                  ? 'bg-blue-600 border-blue-700 text-white shadow-sm' 
                                  : 'bg-slate-200 border-slate-300 text-slate-400 dashed opacity-50'
                                }
                              `}
                              title={isActive ? "Active GPU" : "Empty Slot"}
                            >
                              GPU {slotIdx + 1}
                            </div>
                          );
                        })}
                      </div>
                   </div>
                 );
               })}
             </div>
          </div>
        )}
      </div>

      <div className="flex-grow min-h-[300px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={result.breakdown}
              cx="50%"
              cy="50%"
              innerRadius={80}
              outerRadius={120}
              paddingAngle={5}
              dataKey="value"
            >
              {result.breakdown.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              itemStyle={{ color: '#1e293b', fontWeight: 600 }}
              formatter={(value: number) => [`${value} GB`, 'Memory']}
            />
            <Legend verticalAlign="bottom" height={36} 
               formatter={(value) => {
                 // Map English keys to translated values
                 if (value === 'Model Weights') return t.weights;
                 if (value === 'KV Cache') return t.cache;
                 if (value === 'Overhead & Buffer') return t.buffer;
                 return value;
               }}
            />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center Text */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none mb-8">
           <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Total</span>
           <div className="text-lg font-bold text-slate-700">{result.totalMemory} GB</div>
        </div>
      </div>
    </div>
  );
};