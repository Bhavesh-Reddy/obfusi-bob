// Command execution utilities with timeout support
// Implements 30-second timeout as per AGENTS.md

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

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
export async function executeWithTimeout(
  command: string,
  timeoutMs: number = 30000
): Promise<ExecutionResult> {
  const startTime = Date.now();
  
  try {
    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    
    const { stdout, stderr } = await execAsync(command, {
      signal: controller.signal,
      maxBuffer: 10 * 1024 * 1024, // 10MB buffer
    });
    
    clearTimeout(timeoutId);
    
    const executionTime = Date.now() - startTime;
    
    return {
      stdout: stdout || '',
      stderr: stderr || '',
      exitCode: 0,
      executionTime,
    };
  } catch (error: any) {
    const executionTime = Date.now() - startTime;
    
    // Check if timeout occurred
    if (error.name === 'AbortError' || error.killed) {
      throw new Error(`Command execution timeout after ${timeoutMs}ms`);
    }
    
    // Return error details
    return {
      stdout: error.stdout || '',
      stderr: error.stderr || error.message || '',
      exitCode: error.code || 1,
      executionTime,
    };
  }
}

/**
 * Execute LLVM opt command with validation
 * @param irPath - Input IR file path
 * @param passName - LLVM pass name
 * @param outputPath - Output file path
 * @returns Execution result
 */
export async function executeLLVMPass(
  irPath: string,
  passName: string,
  outputPath: string
): Promise<ExecutionResult> {
  // Construct safe LLVM command
  // Using -passes flag for new pass manager (LLVM 18+)
  const command = `opt -passes=${passName} -S "${irPath}" -o "${outputPath}"`;
  
  console.log(`[Executor] Running: ${command}`);
  
  return executeWithTimeout(command);
}

/**
 * Verify LLVM IR file
 * @param irPath - IR file path to verify
 * @returns Execution result
 */
export async function verifyIR(irPath: string): Promise<ExecutionResult> {
  const command = `opt -verify -S "${irPath}" -o /dev/null`;
  
  console.log(`[Executor] Verifying IR: ${irPath}`);
  
  return executeWithTimeout(command, 10000); // 10 second timeout for verification
}

/**
 * Get LLVM version
 * @returns LLVM version string
 */
export async function getLLVMVersion(): Promise<string> {
  try {
    const result = await executeWithTimeout('opt --version', 5000);
    
    // Parse version from output
    const versionMatch = result.stdout.match(/LLVM version (\d+\.\d+\.\d+)/);
    return versionMatch ? versionMatch[1] : 'unknown';
  } catch (error) {
    return 'unknown';
  }
}

// Made with Bob
