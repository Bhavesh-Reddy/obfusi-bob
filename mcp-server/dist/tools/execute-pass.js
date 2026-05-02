// execute_obfuscation_pass MCP tool implementation
// Executes LLVM obfuscation passes with timeout and security validation
import * as path from 'path';
import { validatePath, validateOutputPath, isValidPassName, sanitizeError } from '../utils/validation.js';
import { executeLLVMPass } from '../utils/executor.js';
/**
 * Execute LLVM obfuscation pass on IR file
 * Implements 30-second timeout as per AGENTS.md
 */
export async function executePass(input) {
    try {
        console.log(`[execute_pass] Executing ${input.passName} pass on ${input.irPath}`);
        // Validate input path
        const validatedInputPath = validatePath(input.irPath);
        // Validate pass name to prevent command injection
        if (!isValidPassName(input.passName)) {
            throw new Error(`Invalid pass name: ${input.passName}`);
        }
        // Determine output path
        let outputPath;
        if (input.outputPath) {
            outputPath = validateOutputPath(input.outputPath);
        }
        else {
            // Generate default output path
            const inputDir = path.dirname(validatedInputPath);
            const inputName = path.basename(validatedInputPath, '.ll');
            outputPath = path.join(inputDir, `${inputName}.${input.passName}.ll`);
        }
        // Dry run mode - just validate without executing
        if (input.dryRun) {
            console.log(`[execute_pass] Dry run mode - would execute: ${input.passName}`);
            return {
                success: true,
                data: {
                    outputPath,
                    executionTime: 0,
                    success: true,
                    stdout: 'Dry run - no execution performed',
                },
            };
        }
        // Execute LLVM pass with timeout
        const startTime = Date.now();
        const result = await executeLLVMPass(validatedInputPath, input.passName, outputPath);
        const executionTime = Date.now() - startTime;
        // Check if execution was successful
        const success = result.exitCode === 0;
        if (!success) {
            console.error(`[execute_pass] Pass execution failed:`, result.stderr);
        }
        else {
            console.log(`[execute_pass] Pass completed successfully in ${executionTime}ms`);
        }
        return {
            success: true,
            data: {
                outputPath,
                executionTime,
                success,
                stdout: result.stdout,
                stderr: result.stderr,
            },
        };
    }
    catch (error) {
        console.error(`[execute_pass] Error:`, error);
        return {
            success: false,
            error: sanitizeError(error),
        };
    }
}
/**
 * MCP tool definition for execute_obfuscation_pass
 */
export const executePassTool = {
    name: 'execute_obfuscation_pass',
    description: 'Execute LLVM obfuscation pass on IR file with 30-second timeout',
    inputSchema: {
        type: 'object',
        properties: {
            irPath: {
                type: 'string',
                description: 'Path to input IR file',
            },
            passName: {
                type: 'string',
                enum: ['flatten', 'bogus', 'encrypt', 'mem2reg', 'instcombine'],
                description: 'LLVM pass name to execute',
            },
            outputPath: {
                type: 'string',
                description: 'Path for output IR file (optional, auto-generated if not provided)',
            },
            dryRun: {
                type: 'boolean',
                description: 'Validate without executing (default: false)',
                default: false,
            },
        },
        required: ['irPath', 'passName'],
    },
};
// Made with Bob
//# sourceMappingURL=execute-pass.js.map