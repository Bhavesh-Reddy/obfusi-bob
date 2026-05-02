import type { ToolResponse, ReadIRFileInput, ReadIRFileOutput } from '../types/index.js';
/**
 * Read and parse LLVM IR file from local filesystem
 * Implements strict security validation as per AGENTS.md
 */
export declare function readIRFile(input: ReadIRFileInput): Promise<ToolResponse<ReadIRFileOutput>>;
/**
 * MCP tool definition for read_ir_file
 */
export declare const readIRFileTool: {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            path: {
                type: string;
                description: string;
            };
            validate: {
                type: string;
                description: string;
                default: boolean;
            };
        };
        required: string[];
    };
};
//# sourceMappingURL=read-ir-file.d.ts.map