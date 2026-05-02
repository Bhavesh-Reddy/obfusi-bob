import type { ToolResponse, AnalyzeIRInput, AnalyzeIROutput } from '../types/index.js';
/**
 * Analyze IR structure and identify obfuscation opportunities
 * Parses functions, basic blocks, and instructions
 */
export declare function analyzeIR(input: AnalyzeIRInput): Promise<ToolResponse<AnalyzeIROutput>>;
/**
 * MCP tool definition for analyze_ir_structure
 */
export declare const analyzeIRTool: {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            irContent: {
                type: string;
                description: string;
            };
            irPath: {
                type: string;
                description: string;
            };
        };
        oneOf: {
            required: string[];
        }[];
    };
};
//# sourceMappingURL=analyze-ir.d.ts.map