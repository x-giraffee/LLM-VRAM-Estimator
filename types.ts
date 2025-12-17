export type Language = 'en' | 'zh';

export enum Precision {
  FP32 = 'FP32',
  FP16 = 'FP16',
  BF16 = 'BF16',
  INT8 = 'INT8',
  INT4 = 'INT4',
}

export interface ModelPreset {
  name: string;
  params: number; // in Billions
  layers: number;
  hiddenSize: number;
  description: string;
}

export interface GPUModel {
  name: string;
  memory: number; // GB
  vendor: string;
}

export interface CalculationInputs {
  paramCount: number; // Billions
  precision: Precision;
  kvPrecision: Precision;
  seqLength: number; // Context window
  batchSize: number;
  layers: number;
  hiddenSize: number;
  isGQA: boolean; // Grouped Query Attention optimization
  kvHeads?: number; // Needed if GQA
  attentionHeads?: number; // Needed if GQA
  selectedGPU?: string; // Name of the selected GPU
  gpusPerNode: number; // Topology density (e.g., 8 cards per server)
}

export interface CalculationResult {
  weightMemory: number; // GB
  kvCacheMemory: number; // GB
  activationMemory: number; // GB
  totalMemory: number; // GB
  breakdown: {
    name: string;
    value: number;
    color: string;
    desc: string;
  }[];
}

export interface DeploymentResult {
  gpu: GPUModel;
  totalCards: number; // Total GPUs required
  numNodes: number; // Number of servers/nodes
  cardsPerNode: number; // User preference
  totalVRAM: number;
  reason: string;
}