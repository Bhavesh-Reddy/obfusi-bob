// read_ir_file MCP tool implementation
// Reads LLVM IR files from local filesystem with security validation

import * as fs from 'fs';
import * as crypto from 'crypto';
import { validatePath, isValidIRFile, sanitizeError } from '../utils/validation.js';
import { verifyIR } from '../utils/executor.js';
import type { ToolResponse, ReadIRFileInput, ReadIRFileOutput } from '../types/index.js';

/**
 * Read and parse LLVM IR file from local filesystem
 * Implements strict security validation as per AGENTS.md
 */
export async function readIRFile(input: ReadIRFileInput): Promise<ToolResponse<ReadIRFileOutput>> {
  try {
    console.log(`[read_ir_file] Reading file: ${input.path}`);
    
    // Validate path to prevent directory traversal
    const validatedPath = validatePath(input.path);
    
    // Validate IR file extension
    if (!isValidIRFile(validatedPath)) {
      throw new Error('Invalid file type: must be .ll or .bc file');
    }
    
    // Read file content
    const content = fs.readFileSync(validatedPath, 'utf-8');
    
    // Calculate file hash for caching
    const hash = crypto.createHash('sha256').update(content).digest('hex');
    
    // Get file size
    const stats = fs.statSync(validatedPath);
    const size = stats.size;
    
    // Extract metadata from IR content
    const metadata = extractIRMetadata(content);
    
    // Optionally verify IR validity
    if (input.validate !== false) {
      console.log(`[read_ir_file] Verifying IR validity...`);
      const verifyResult = await verifyIR(validatedPath);
      
      if (verifyResult.exitCode !== 0) {
        throw new Error(`IR verification failed: ${verifyResult.stderr}`);
      }
    }
    
    console.log(`[read_ir_file] Successfully read ${size} bytes (hash: ${hash.substring(0, 16)}...)`);
    
    return {
      success: true,
      data: {
        content,
        size,
        hash,
        metadata,
      },
    };
  } catch (error) {
    console.error(`[read_ir_file] Error:`, error);
    return {
      success: false,
      error: sanitizeError(error),
    };
  }
}

/**
 * Extract metadata from IR content
 * Parses target triple, data layout, and source filename
 */
function extractIRMetadata(content: string): ReadIRFileOutput['metadata'] {
  const metadata: ReadIRFileOutput['metadata'] = {};
  
  // Extract target triple
  const tripleMatch = content.match(/target triple = "([^"]+)"/);
  if (tripleMatch) {
    metadata.targetTriple = tripleMatch[1];
  }
  
  // Extract data layout
  const layoutMatch = content.match(/target datalayout = "([^"]+)"/);
  if (layoutMatch) {
    metadata.dataLayout = layoutMatch[1];
  }
  
  // Extract source filename
  const sourceMatch = content.match(/source_filename = "([^"]+)"/);
  if (sourceMatch) {
    metadata.sourceFilename = sourceMatch[1];
  }
  
  return metadata;
}

/**
 * MCP tool definition for read_ir_file
 */
export const readIRFileTool = {
  name: 'read_ir_file',
  description: 'Read and parse LLVM IR file from local filesystem with security validation',
  inputSchema: {
    type: 'object',
    properties: {
      path: {
        type: 'string',
        description: 'Path to .ll or .bc IR file (relative to workspace root)',
      },
      validate: {
        type: 'boolean',
        description: 'Run LLVM verification on the IR (default: true)',
        default: true,
      },
    },
    required: ['path'],
  },
};

// Made with Bob
