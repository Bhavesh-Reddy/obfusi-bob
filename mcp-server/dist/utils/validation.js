// Security validation utilities for Obfusi-Bob MCP Server
// Follows AGENTS.md security rules
import * as path from 'path';
import * as fs from 'fs';
/**
 * Validates file path to prevent directory traversal attacks
 * MUST be called before any file operations
 * @param inputPath - User-provided file path
 * @returns Absolute path within workspace
 * @throws Error if path is invalid or outside workspace
 */
export function validatePath(inputPath) {
    // Get workspace root (current working directory)
    const workspaceRoot = process.cwd();
    // Resolve to absolute path
    const absolutePath = path.resolve(workspaceRoot, inputPath);
    // Check if path is within workspace using relative path
    const relativePath = path.relative(workspaceRoot, absolutePath);
    // Detect directory traversal attempts
    if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
        throw new Error('Path traversal detected: path must be within workspace');
    }
    // Check if file exists
    if (!fs.existsSync(absolutePath)) {
        throw new Error(`File not found: ${inputPath}`);
    }
    // Check file size (max 100MB to prevent DoS)
    const stats = fs.statSync(absolutePath);
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (stats.size > maxSize) {
        throw new Error('File too large: maximum size is 100MB');
    }
    // Ensure it's a file, not a directory
    if (!stats.isFile()) {
        throw new Error('Path must point to a file, not a directory');
    }
    return absolutePath;
}
/**
 * Validates IR file extension
 * @param filePath - File path to validate
 * @returns true if valid IR file extension
 */
export function isValidIRFile(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    return ext === '.ll' || ext === '.bc';
}
/**
 * Sanitizes error messages to prevent information leakage
 * Removes file paths and internal details
 * @param error - Error object or message
 * @returns Sanitized error message
 */
export function sanitizeError(error) {
    const message = error.message || error.toString() || 'Unknown error';
    // Remove absolute file paths
    let sanitized = message.replace(/[A-Z]:[\\\/][^\s]+/g, '[PATH]');
    sanitized = sanitized.replace(/\/[^\s]+/g, '[PATH]');
    // Remove internal stack traces
    sanitized = sanitized.replace(/at .+/g, '');
    // Remove line numbers that might reveal internal structure
    sanitized = sanitized.replace(/:\d+:\d+/g, '');
    return sanitized.trim();
}
/**
 * Validates pass name to prevent command injection
 * @param passName - LLVM pass name
 * @returns true if valid pass name
 */
export function isValidPassName(passName) {
    const validPasses = ['flatten', 'bogus', 'encrypt', 'mem2reg', 'instcombine'];
    return validPasses.includes(passName);
}
/**
 * Validates output path for writing
 * @param outputPath - Desired output path
 * @returns Validated absolute path
 */
export function validateOutputPath(outputPath) {
    const workspaceRoot = process.cwd();
    const absolutePath = path.resolve(workspaceRoot, outputPath);
    // Check if within workspace
    const relativePath = path.relative(workspaceRoot, absolutePath);
    if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
        throw new Error('Output path must be within workspace');
    }
    // Ensure parent directory exists
    const parentDir = path.dirname(absolutePath);
    if (!fs.existsSync(parentDir)) {
        throw new Error('Output directory does not exist');
    }
    return absolutePath;
}
// Made with Bob
//# sourceMappingURL=validation.js.map