/**
 * Validates file path to prevent directory traversal attacks
 * MUST be called before any file operations
 * @param inputPath - User-provided file path
 * @returns Absolute path within workspace
 * @throws Error if path is invalid or outside workspace
 */
export declare function validatePath(inputPath: string): string;
/**
 * Validates IR file extension
 * @param filePath - File path to validate
 * @returns true if valid IR file extension
 */
export declare function isValidIRFile(filePath: string): boolean;
/**
 * Sanitizes error messages to prevent information leakage
 * Removes file paths and internal details
 * @param error - Error object or message
 * @returns Sanitized error message
 */
export declare function sanitizeError(error: any): string;
/**
 * Validates pass name to prevent command injection
 * @param passName - LLVM pass name
 * @returns true if valid pass name
 */
export declare function isValidPassName(passName: string): boolean;
/**
 * Validates output path for writing
 * @param outputPath - Desired output path
 * @returns Validated absolute path
 */
export declare function validateOutputPath(outputPath: string): string;
//# sourceMappingURL=validation.d.ts.map