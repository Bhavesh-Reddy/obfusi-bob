// analyze_ir_structure MCP tool implementation
// Analyzes LLVM IR structure to identify functions, basic blocks, and entry points
import * as fs from 'fs';
import { validatePath, sanitizeError } from '../utils/validation.js';
/**
 * Analyze IR structure and identify obfuscation opportunities
 * Parses functions, basic blocks, and instructions
 */
export async function analyzeIR(input) {
    try {
        console.log(`[analyze_ir] Starting IR analysis...`);
        let irContent;
        // Get IR content from path or direct input
        if (input.irPath) {
            const validatedPath = validatePath(input.irPath);
            irContent = fs.readFileSync(validatedPath, 'utf-8');
        }
        else if (input.irContent) {
            irContent = input.irContent;
        }
        else {
            throw new Error('Either irPath or irContent must be provided');
        }
        // Parse IR structure
        const functions = parseFunctions(irContent);
        const globalVariables = parseGlobalVariables(irContent);
        const entryPoint = findEntryPoint(functions);
        // Calculate total instructions
        const totalInstructions = functions.reduce((sum, fn) => sum + fn.instructions, 0);
        console.log(`[analyze_ir] Found ${functions.length} functions, ${globalVariables.length} globals`);
        return {
            success: true,
            data: {
                functions,
                globalVariables,
                totalInstructions,
                entryPoint,
            },
        };
    }
    catch (error) {
        console.error(`[analyze_ir] Error:`, error);
        return {
            success: false,
            error: sanitizeError(error),
        };
    }
}
/**
 * Parse function definitions from IR
 */
function parseFunctions(irContent) {
    const functions = [];
    // Match function definitions: define <return_type> @<name>(...) {
    const functionRegex = /define\s+(?:dso_local\s+)?(?:[\w\s*]+)\s+@(\w+)\s*\([^)]*\)\s*(?:#\d+\s*)?{([^}]+(?:{[^}]*}[^}]*)*)}/gs;
    let match;
    while ((match = functionRegex.exec(irContent)) !== null) {
        const functionName = match[1];
        const functionBody = match[2];
        // Count basic blocks (labels ending with :)
        const basicBlocks = (functionBody.match(/^\s*\w+:/gm) || []).length + 1; // +1 for entry block
        // Count instructions (lines that don't start with labels or are empty)
        const instructions = functionBody
            .split('\n')
            .filter(line => {
            const trimmed = line.trim();
            return trimmed && !trimmed.endsWith(':') && !trimmed.startsWith(';');
        }).length;
        // Detect loops (br instructions that jump backwards)
        const hasLoops = /br\s+(?:i1\s+%\w+,\s*)?label\s+%\w+/.test(functionBody);
        // Detect conditionals (br i1 instructions)
        const hasConditionals = /br\s+i1\s+%\w+/.test(functionBody);
        functions.push({
            name: functionName,
            basicBlocks,
            instructions,
            hasLoops,
            hasConditionals,
        });
    }
    return functions;
}
/**
 * Parse global variable declarations
 */
function parseGlobalVariables(irContent) {
    const globals = [];
    // Match global variables: @<name> = ...
    const globalRegex = /@([\w.]+)\s*=/g;
    let match;
    while ((match = globalRegex.exec(irContent)) !== null) {
        const globalName = match[1];
        // Filter out function names (they also start with @)
        if (!irContent.includes(`define`) || !irContent.includes(`@${globalName}(`)) {
            globals.push(globalName);
        }
    }
    return [...new Set(globals)]; // Remove duplicates
}
/**
 * Find entry point (main function or first function)
 */
function findEntryPoint(functions) {
    // Look for main function
    const mainFunc = functions.find(fn => fn.name === 'main');
    if (mainFunc) {
        return mainFunc.name;
    }
    // Return first function as fallback
    return functions.length > 0 ? functions[0].name : undefined;
}
/**
 * MCP tool definition for analyze_ir_structure
 */
export const analyzeIRTool = {
    name: 'analyze_ir_structure',
    description: 'Analyze LLVM IR structure to identify functions, basic blocks, and entry points',
    inputSchema: {
        type: 'object',
        properties: {
            irContent: {
                type: 'string',
                description: 'LLVM IR content as string',
            },
            irPath: {
                type: 'string',
                description: 'Path to IR file (alternative to irContent)',
            },
        },
        oneOf: [
            { required: ['irContent'] },
            { required: ['irPath'] },
        ],
    },
};
// Made with Bob
//# sourceMappingURL=analyze-ir.js.map