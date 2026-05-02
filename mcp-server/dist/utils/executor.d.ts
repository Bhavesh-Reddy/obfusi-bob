export interface ExecutionResult {
    stdout: string;
    stderr: string;
    exitCode: number;
    executionTime: number;
}
/**
 * Execute shell command with timeout
 * MUST timeout after 30 seconds to prevent resource exhaustion
 * @param command - Command to execute
 * @param timeoutMs - Timeout in milliseconds (default: 30000)
 * @returns Execution result
 */
export declare function executeWithTimeout(command: string, timeoutMs?: number): Promise<ExecutionResult>;
/**
 * Execute LLVM opt command with validation
 * @param irPath - Input IR file path
 * @param passName - LLVM pass name
 * @param outputPath - Output file path
 * @returns Execution result
 */
export declare function executeLLVMPass(irPath: string, passName: string, outputPath: string): Promise<ExecutionResult>;
/**
 * Verify LLVM IR file
 * @param irPath - IR file path to verify
 * @returns Execution result
 */
export declare function verifyIR(irPath: string): Promise<ExecutionResult>;
/**
 * Get LLVM version
 * @returns LLVM version string
 */
export declare function getLLVMVersion(): Promise<string>;
//# sourceMappingURL=executor.d.ts.map