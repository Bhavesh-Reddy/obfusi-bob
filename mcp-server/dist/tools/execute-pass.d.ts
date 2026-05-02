import type { ToolResponse, ExecutePassInput, ExecutePassOutput } from '../types/index.js';
/**
 * Execute LLVM obfuscation pass on IR file
 * Implements 30-second timeout as per AGENTS.md
 */
export declare function executePass(input: ExecutePassInput): Promise<ToolResponse<ExecutePassOutput>>;
/**
 * MCP tool definition for execute_obfuscation_pass
 */
export declare const executePassTool: {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            irPath: {
                type: string;
                description: string;
            };
            passName: {
                type: string;
                enum: string[];
                description: string;
            };
            outputPath: {
                type: string;
                description: string;
            };
            dryRun: {
                type: string;
                description: string;
                default: boolean;
            };
        };
        required: string[];
    };
};
//# sourceMappingURL=execute-pass.d.ts.map