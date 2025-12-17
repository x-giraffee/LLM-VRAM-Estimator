import { CalculationInputs, CalculationResult, DeploymentResult, GPUModel } from '../types';
import { BYTES_PER_PARAM, BASE_SYSTEM_OVERHEAD, BUFFER_PERCENTAGE, GPU_LIST } from '../constants';

/**
 * Calculates VRAM requirements based on standard Transformer inference architecture.
 * Reference: https://help.aliyun.com/zh/pai/getting-started/estimation-of-the-required-video-memory-for-the-model
 */
export const calculateVRAM = (inputs: CalculationInputs): CalculationResult => {
  const {
    paramCount,
    precision,
    kvPrecision,
    seqLength,
    batchSize,
    layers,
    hiddenSize,
    isGQA,
    kvHeads = 1,
    attentionHeads = 1
  } = inputs;

  const bytesPerWeight = BYTES_PER_PARAM[precision];
  const bytesPerKV = BYTES_PER_PARAM[kvPrecision];

  const weightMemory = paramCount * bytesPerWeight;

  let kvFactor = 1;
  if (isGQA && attentionHeads > 0 && kvHeads > 0) {
    kvFactor = kvHeads / attentionHeads;
  }

  const totalKVBytes = 
    2 * 
    layers * 
    hiddenSize * 
    seqLength * 
    batchSize * 
    bytesPerKV * 
    kvFactor;

  const kvCacheMemory = totalKVBytes / 1e9;

  const activationMemoryEstimate = (batchSize * seqLength * hiddenSize * layers * bytesPerWeight) / 100 / 1e9;
  const bufferMemory = (weightMemory + kvCacheMemory) * BUFFER_PERCENTAGE;
  
  const activationMemory = BASE_SYSTEM_OVERHEAD + activationMemoryEstimate + bufferMemory;

  const totalMemory = weightMemory + kvCacheMemory + activationMemory;

  return {
    weightMemory: parseFloat(weightMemory.toFixed(2)),
    kvCacheMemory: parseFloat(kvCacheMemory.toFixed(2)),
    activationMemory: parseFloat(activationMemory.toFixed(2)),
    totalMemory: parseFloat(totalMemory.toFixed(2)),
    breakdown: [
      { name: 'Model Weights', value: parseFloat(weightMemory.toFixed(2)), color: '#3b82f6', desc: 'Static memory for params' },
      { name: 'KV Cache', value: parseFloat(kvCacheMemory.toFixed(2)), color: '#8b5cf6', desc: 'Dynamic context memory' },
      { name: 'Overhead & Buffer', value: parseFloat(activationMemory.toFixed(2)), color: '#94a3b8', desc: 'System overhead' },
    ]
  };
};

export const calculateDeployment = (totalMemory: number, gpuName: string, gpusPerNode: number): DeploymentResult | null => {
  const gpu = GPU_LIST.find(g => g.name === gpuName);
  if (!gpu) return null;

  // 1. Calculate Minimum Cards purely by VRAM
  const minCardsByVRAM = Math.ceil(totalMemory / gpu.memory);

  // 2. Adjust for TP (Tensor Parallelism) Constraints
  let recommendedCards = minCardsByVRAM;
  let reason = "Fits within total VRAM";

  // Standard TP check: avoid 3, 5, 6, 7 unless we are strictly filling nodes
  if (recommendedCards === 3 && gpusPerNode >= 4) {
    recommendedCards = 4;
    reason = "Optimized for TP=4 (avoiding 3 cards)";
  } else if (recommendedCards > 4 && recommendedCards < 8 && gpusPerNode >= 8) {
    recommendedCards = 8;
    reason = "Optimized for TP=8 (avoiding irregular splits)";
  }

  // 3. Calculate Nodes
  // We assume we fill nodes linearly or based on buying full units.
  // The prompt implies "How many units to buy".
  const numNodes = Math.ceil(recommendedCards / gpusPerNode);
  
  // If we have to buy full nodes, the total cards available is numNodes * gpusPerNode
  // But strictly speaking, for INFERENCE, we might only use X cards inside the last node.
  // However, "How many units to buy" implies purchasing full chassis.
  
  // Let's ensure recommendedCards reflects the deployment topology if it spans multiple nodes.
  // Usually, if you need 1.5 nodes, you run 2 nodes, effectively having capacity for 2 full nodes.
  
  const totalCards = recommendedCards; // The actual number of ACTIVE GPUs needed for the model.

  return {
    gpu,
    totalCards,
    numNodes,
    cardsPerNode: gpusPerNode,
    reason,
    totalVRAM: numNodes * gpusPerNode * gpu.memory // Total Capacity of the purchased hardware
  };
};