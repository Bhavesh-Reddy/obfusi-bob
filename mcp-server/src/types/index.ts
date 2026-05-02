// Type definitions for Obfusi-Bob MCP Server

export interface ToolResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ReadIRFileInput {
  path: string;
  validate?: boolean;
}

export interface ReadIRFileOutput {
  content: string;
  size: number;
  hash: string;
  metadata: {
    targetTriple?: string;
    dataLayout?: string;
    sourceFilename?: string;
  };
}

export interface AnalyzeIRInput {
  irContent?: string;
  irPath?: string;
}

export interface FunctionInfo {
  name: string;
  basicBlocks: number;
  instructions: number;
  hasLoops: boolean;
  hasConditionals: boolean;
}

export interface AnalyzeIROutput {
  functions: FunctionInfo[];
  globalVariables: string[];
  totalInstructions: number;
  entryPoint?: string;
}

export interface ExecutePassInput {
  irPath: string;
  passName: 'flatten' | 'bogus' | 'encrypt';
  outputPath?: string;
  dryRun?: boolean;
}

export interface ExecutePassOutput {
  outputPath: string;
  executionTime: number;
  success: boolean;
  stdout?: string;
  stderr?: string;
}

// Made with Bob
