import { ModelPreset, Precision, GPUModel, Language } from './types';

export const BYTES_PER_PARAM: Record<Precision, number> = {
  [Precision.FP32]: 4,
  [Precision.FP16]: 2,
  [Precision.BF16]: 2,
  [Precision.INT8]: 1,
  [Precision.INT4]: 0.5,
};

// Common Activation/System Overhead buffer (GB)
export const BASE_SYSTEM_OVERHEAD = 0.5; 
// Percentage of extra buffer often recommended
export const BUFFER_PERCENTAGE = 0.05; 

export const TRANSLATIONS: Record<Language, any> = {
  en: {
    title: "LLM VRAM Estimator",
    subtitle: "Visualize GPU memory requirements for transformer inference",
    algoSource: "Algorithm Source",
    config: "Configuration",
    modelPreset: "Model Preset",
    hardwareTarget: "Hardware Target",
    selectGPU: "Select GPU Model",
    autoRec: "-- Auto Recommendation --",
    gpusPerNode: "GPUs Per Node (Density)",
    modelSpecs: "Model Specs",
    params: "Parameters (Billions)",
    precision: "Weight Precision",
    layers: "Layers",
    hiddenSize: "Hidden Size",
    inferenceSettings: "Inference Settings",
    contextWindow: "Context Window (Seq Len)",
    batchSize: "Batch Size (Concurrent Users)",
    kvPrecision: "KV Cache Precision",
    resultTitle: "Estimation Result",
    totalUsage: "Total estimated VRAM usage",
    deploymentPlan: "Specific Deployment Plan",
    genericRec: "Generic Recommendation",
    nodes: "Nodes",
    gpus: "GPUs",
    capacity: "Capacity",
    visualLogic: "Visual Calculation Logic",
    modelWeights: "1. Model Weights (Static)",
    kvCache: "2. KV Cache (Dynamic)",
    memFormula: "Mem =",
    baseCost: "Base memory cost required to load the model parameters.",
    kvFormula: "Grows linearly with Context Window (Seq) and Batch Size.",
    overhead: "System Overhead & Buffers",
    footerDisclaimer: "Estimations are theoretical. Actual usage varies by inference engine (vLLM, Ollama, TGI) and quantization method details.",
    builtWith: "Built with React, Tailwind & Recharts.",
    weights: "Weights",
    cache: "Cache",
    buffer: "Buffer",
    gpuCount: "GPU Count"
  },
  zh: {
    title: "大模型显存计算器",
    subtitle: "可视化 Transformer 推理所需的 GPU 显存",
    algoSource: "算法来源",
    config: "配置参数",
    modelPreset: "模型预设",
    hardwareTarget: "硬件目标",
    selectGPU: "选择 GPU 型号",
    autoRec: "-- 自动推荐 --",
    gpusPerNode: "单机卡数 (密度)",
    modelSpecs: "模型规格",
    params: "参数量 (十亿/B)",
    precision: "权重精度",
    layers: "层数 (Layers)",
    hiddenSize: "隐藏层大小 (Hidden Size)",
    inferenceSettings: "推理设置",
    contextWindow: "上下文长度 (Seq Len)",
    batchSize: "批处理大小 (Batch Size)",
    kvPrecision: "KV Cache 精度",
    resultTitle: "估算结果",
    totalUsage: "预计显存总占用",
    deploymentPlan: "具体部署方案",
    genericRec: "通用推荐",
    nodes: "台服务器",
    gpus: "张显卡",
    capacity: "总容量",
    visualLogic: "计算原理可视化",
    modelWeights: "1. 模型权重 (静态)",
    kvCache: "2. KV 缓存 (动态)",
    memFormula: "显存 =",
    baseCost: "加载模型参数所需的基础显存。",
    kvFormula: "随上下文长度和 Batch Size 线性增长。",
    overhead: "系统开销与缓冲",
    footerDisclaimer: "估算仅供参考。实际使用情况因推理引擎 (vLLM, Ollama, TGI) 和量化方法的不同而异。",
    builtWith: "基于 React, Tailwind & Recharts 构建。",
    weights: "权重",
    cache: "缓存",
    buffer: "缓冲",
    gpuCount: "显卡数量"
  }
};

export const GPU_LIST: GPUModel[] = [
  // NVIDIA High-End / Data Center
  { name: 'NVIDIA B300', memory: 288, vendor: 'NVIDIA' },
  { name: 'NVIDIA B200', memory: 192, vendor: 'NVIDIA' },
  { name: 'NVIDIA H200', memory: 141, vendor: 'NVIDIA' },
  { name: 'NVIDIA H100', memory: 80, vendor: 'NVIDIA' },
  { name: 'NVIDIA H800', memory: 80, vendor: 'NVIDIA' },
  { name: 'NVIDIA A100', memory: 80, vendor: 'NVIDIA' },
  { name: 'NVIDIA A800-80GB', memory: 80, vendor: 'NVIDIA' },
  { name: 'NVIDIA A800-40GB', memory: 40, vendor: 'NVIDIA' },
  { name: 'NVIDIA A30', memory: 24, vendor: 'NVIDIA' },
  
  // NVIDIA China Specific / L-Series
  { name: 'NVIDIA H20-141GB', memory: 141, vendor: 'NVIDIA' },
  { name: 'NVIDIA H20-96GB', memory: 96, vendor: 'NVIDIA' },
  { name: 'NVIDIA L40S', memory: 48, vendor: 'NVIDIA' },
  { name: 'NVIDIA L40', memory: 48, vendor: 'NVIDIA' },
  { name: 'NVIDIA L20', memory: 48, vendor: 'NVIDIA' },
  
  // NVIDIA Workstation / Consumer
  { name: 'NVIDIA A6000', memory: 48, vendor: 'NVIDIA' },
  { name: 'RTX 4090 D', memory: 24, vendor: 'NVIDIA' },
  { name: 'RTX 4090', memory: 24, vendor: 'NVIDIA' },

  // Ascend (Huawei)
  { name: 'Ascend 910B3-64GB', memory: 64, vendor: 'Ascend' },
  { name: 'Ascend 910B4-64GB', memory: 64, vendor: 'Ascend' },
  { name: 'Ascend 910B4-32GB', memory: 32, vendor: 'Ascend' },

  // Hygon (Dhyana)
  { name: 'Hygon K100-AI', memory: 64, vendor: 'Hygon' },

  // MetaX (Muxi)
  { name: 'MetaX C550', memory: 64, vendor: 'MetaX' },
  { name: 'MetaX C500', memory: 64, vendor: 'MetaX' },
  { name: 'MetaX N260', memory: 64, vendor: 'MetaX' },

  // Tianshu
  { name: 'Tianshu MR-V100', memory: 32, vendor: 'Tianshu' },
];

export const MODEL_PRESETS: ModelPreset[] = [
  {
    name: 'DeepSeek-V3.2 (671B MoE)',
    params: 671,
    layers: 61,
    hiddenSize: 7168,
    description: 'DeepSeek V3 (MoE). Uses total params for weights. Activations lower due to sparse active params.'
  },
  {
    name: 'Qwen3-235B',
    params: 235,
    layers: 104, // Estimated
    hiddenSize: 12288, // Estimated
    description: 'Qwen 3 235B Model (Estimated Specs)'
  },
  {
    name: 'GPT-oss-120B',
    params: 120,
    layers: 96, // Estimated
    hiddenSize: 10240, // Estimated
    description: 'Open Source GPT 120B Variant'
  },
  {
    name: 'Qwen3-80B',
    params: 80,
    layers: 80, // Estimated
    hiddenSize: 8192,
    description: 'Qwen 3 80B Model (Estimated Specs)'
  },
  {
    name: 'Kimi-k2-Thinking',
    params: 1024,
    layers: 96, // Estimated for 1T scale
    hiddenSize: 16384, // Estimated for 1T scale
    description: 'Moonshot AI Kimi k2 (Thinking). Total Params: 1024B.'
  },
  {
    name: 'Minimax-M2',
    params: 100, // Estimated
    layers: 88,
    hiddenSize: 9126,
    description: 'Minimax M2 (Estimated 100B)'
  },
  {
    name: 'MImo-309B',
    params: 309,
    layers: 120, // Estimated
    hiddenSize: 14336,
    description: 'MImo 309B (Estimated)'
  },
  {
    name: 'Qwen3-32B',
    params: 32,
    layers: 64, // Estimated
    hiddenSize: 5120,
    description: 'Qwen 3 32B Model (Estimated)'
  },
  {
    name: 'GLM-4.6',
    params: 358,
    layers: 80, // Estimated for 300B+ scale
    hiddenSize: 12288, // Estimated for 300B+ scale
    description: 'GLM-4.6. Total Params: 358B.'
  }
];