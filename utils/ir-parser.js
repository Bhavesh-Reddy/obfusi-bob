/**
 * Advanced LLVM IR Parser
 * Parses LLVM IR files and extracts detailed structural information
 */

export class IRParser {
    constructor(irContent) {
        this.content = irContent;
        this.lines = irContent.split('\n');
        this.functions = [];
        this.globalVariables = [];
        this.metadata = {};
    }

    parse() {
        this.extractMetadata();
        this.extractGlobalVariables();
        this.extractFunctions();
        return this.getAnalysis();
    }

    extractMetadata() {
        for (const line of this.lines) {
            const trimmed = line.trim();
            
            if (trimmed.startsWith('source_filename')) {
                this.metadata.sourceFilename = trimmed.match(/"([^"]+)"/)?.[1] || 'unknown';
            } else if (trimmed.startsWith('target datalayout')) {
                this.metadata.dataLayout = trimmed.match(/"([^"]+)"/)?.[1] || '';
            } else if (trimmed.startsWith('target triple')) {
                this.metadata.targetTriple = trimmed.match(/"([^"]+)"/)?.[1] || '';
            } else if (trimmed.startsWith('; ModuleID')) {
                this.metadata.moduleId = trimmed.replace('; ModuleID = ', '').replace(/'/g, '');
            }
        }
    }

    extractGlobalVariables() {
        for (const line of this.lines) {
            const trimmed = line.trim();
            // Match global variables and string constants
            if (trimmed.startsWith('@') && trimmed.includes('=') && !trimmed.includes('define') && !trimmed.includes('declare')) {
                const match = trimmed.match(/@([\w.]+)\s*=/);
                if (match) {
                    this.globalVariables.push({
                        name: match[1],
                        line: trimmed,
                        isConstant: trimmed.includes('constant'),
                        isGlobal: trimmed.includes('global'),
                        isString: trimmed.includes('c"') || trimmed.includes('[') && trimmed.includes('x i8]')
                    });
                }
            }
        }
    }

    extractFunctions() {
        let currentFunction = null;
        let braceDepth = 0;
        let lineNumber = 0;

        for (const line of this.lines) {
            lineNumber++;
            const trimmed = line.trim();

            // Function definition start
            if (trimmed.startsWith('define')) {
                const match = trimmed.match(/define\s+(\S+)\s+@(\w+)\s*\(([^)]*)\)/);
                if (match) {
                    currentFunction = {
                        name: match[2],
                        returnType: match[1],
                        parameters: this.parseParameters(match[3]),
                        startLine: lineNumber,
                        instructions: [],
                        basicBlocks: [],
                        calls: [],
                        branches: [],
                        loops: [],
                        allocations: [],
                        loads: [],
                        stores: []
                    };
                }
            }

            if (currentFunction) {
                // Track basic blocks
                if (trimmed.endsWith(':') && !trimmed.includes(';')) {
                    currentFunction.basicBlocks.push({
                        label: trimmed.slice(0, -1),
                        line: lineNumber
                    });
                }

                // Track instructions
                if (trimmed && !trimmed.startsWith(';') && !trimmed.startsWith('define') && !trimmed.endsWith(':')) {
                    currentFunction.instructions.push({
                        line: lineNumber,
                        content: trimmed,
                        type: this.getInstructionType(trimmed)
                    });

                    // Track specific instruction types
                    if (trimmed.includes('call')) {
                        const callMatch = trimmed.match(/call\s+\S+\s+@(\w+)/);
                        if (callMatch) {
                            currentFunction.calls.push(callMatch[1]);
                        }
                    }

                    if (trimmed.includes('br ')) {
                        currentFunction.branches.push(trimmed);
                    }

                    if (trimmed.includes('alloca')) {
                        currentFunction.allocations.push(trimmed);
                    }

                    if (trimmed.includes('load')) {
                        currentFunction.loads.push(trimmed);
                    }

                    if (trimmed.includes('store')) {
                        currentFunction.stores.push(trimmed);
                    }
                }

                // Track braces
                braceDepth += (line.match(/{/g) || []).length;
                braceDepth -= (line.match(/}/g) || []).length;

                // Function end
                if (braceDepth === 0 && trimmed === '}') {
                    currentFunction.endLine = lineNumber;
                    currentFunction.lineCount = currentFunction.endLine - currentFunction.startLine + 1;
                    this.detectLoops(currentFunction);
                    this.functions.push(currentFunction);
                    currentFunction = null;
                }
            }
        }
    }

    parseParameters(paramString) {
        if (!paramString || paramString.trim() === '') return [];
        
        return paramString.split(',').map(param => {
            const trimmed = param.trim();
            const match = trimmed.match(/(\S+)\s+(%\w+)?/);
            return {
                type: match?.[1] || trimmed,
                name: match?.[2] || ''
            };
        });
    }

    getInstructionType(instruction) {
        const types = {
            'alloca': 'memory',
            'load': 'memory',
            'store': 'memory',
            'add': 'arithmetic',
            'sub': 'arithmetic',
            'mul': 'arithmetic',
            'div': 'arithmetic',
            'icmp': 'comparison',
            'fcmp': 'comparison',
            'br': 'control',
            'switch': 'control',
            'call': 'function',
            'ret': 'terminator',
            'phi': 'phi',
            'getelementptr': 'pointer'
        };

        for (const [keyword, type] of Object.entries(types)) {
            if (instruction.includes(keyword)) {
                return type;
            }
        }
        return 'other';
    }

    detectLoops(func) {
        // Enhanced loop detection
        const blockLabels = new Map();
        func.basicBlocks.forEach((bb, index) => {
            blockLabels.set(bb.label, index);
        });
        
        // Detect backward branches (loops)
        for (let i = 0; i < func.branches.length; i++) {
            const branch = func.branches[i];
            const labels = branch.match(/label %([.\w]+)/g);
            
            if (labels) {
                for (const label of labels) {
                    const targetLabel = label.replace('label %', '');
                    const targetIndex = blockLabels.get(targetLabel);
                    
                    // If we branch to an earlier block or same block, it's a loop
                    if (targetIndex !== undefined) {
                        // Find current block index by checking which block this branch belongs to
                        let currentBlockIndex = -1;
                        for (let j = 0; j < func.basicBlocks.length; j++) {
                            if (func.basicBlocks[j].label.includes('cond') ||
                                func.basicBlocks[j].label.includes('body') ||
                                func.basicBlocks[j].label.includes('inc')) {
                                currentBlockIndex = j;
                            }
                        }
                        
                        // Backward branch indicates loop
                        if (targetIndex <= currentBlockIndex ||
                            targetLabel.includes('cond') ||
                            targetLabel.includes('loop') ||
                            targetLabel.includes('while')) {
                            func.loops.push({
                                type: 'detected',
                                target: targetLabel
                            });
                        }
                    }
                }
            }
        }
        
        // Also detect by common loop patterns
        const loopPatterns = ['for.cond', 'while.cond', 'loop', 'do.cond'];
        for (const bb of func.basicBlocks) {
            if (loopPatterns.some(pattern => bb.label.includes(pattern))) {
                if (!func.loops.find(l => l.target === bb.label)) {
                    func.loops.push({
                        type: 'pattern',
                        target: bb.label
                    });
                }
            }
        }
    }

    calculateComplexity(func) {
        // McCabe Cyclomatic Complexity: M = E - N + 2P
        // Simplified: M = number of decision points + 1
        let complexity = 1;
        
        // Count branches (if statements, switches)
        complexity += func.branches.filter(b => b.includes('br i1')).length;
        
        // Count loops
        complexity += func.loops.length * 2;
        
        // Count function calls (adds complexity)
        complexity += Math.floor(func.calls.length / 3);
        
        return complexity;
    }

    getAnalysis() {
        const totalInstructions = this.functions.reduce((sum, f) => sum + f.instructions.length, 0);
        const totalBasicBlocks = this.functions.reduce((sum, f) => sum + f.basicBlocks.length, 0);
        const totalComplexity = this.functions.reduce((sum, f) => sum + this.calculateComplexity(f), 0);

        return {
            metadata: this.metadata,
            globalVariables: this.globalVariables,
            functions: this.functions.map(f => ({
                name: f.name,
                returnType: f.returnType,
                parameters: f.parameters,
                lineCount: f.lineCount,
                instructionCount: f.instructions.length,
                basicBlockCount: f.basicBlocks.length,
                complexity: this.calculateComplexity(f),
                hasLoops: f.loops.length > 0,
                hasConditionals: f.branches.some(b => b.includes('br i1')),
                callCount: f.calls.length,
                memoryOps: f.allocations.length + f.loads.length + f.stores.length,
                calls: f.calls,
                startLine: f.startLine,
                endLine: f.endLine
            })),
            summary: {
                totalFunctions: this.functions.length,
                totalInstructions,
                totalBasicBlocks,
                totalComplexity,
                avgComplexity: this.functions.length > 0 ? Math.round(totalComplexity / this.functions.length) : 0,
                hasGlobals: this.globalVariables.length > 0,
                architecture: this.metadata.targetTriple || 'unknown'
            }
        };
    }
}

export function parseIR(irContent) {
    try {
        // Validate input type
        if (typeof irContent !== 'string') {
            throw new Error('Invalid IR content: must be a string');
        }
        
        // Check for basic IR structure
        const trimmed = irContent.trim();
        if (trimmed.length === 0) {
            // Return empty but valid structure for empty input
            return {
                metadata: {},
                globalVariables: [],
                functions: [],
                summary: {
                    totalFunctions: 0,
                    totalInstructions: 0,
                    totalBasicBlocks: 0,
                    totalComplexity: 0,
                    avgComplexity: 0,
                    hasGlobals: false,
                    architecture: 'unknown'
                }
            };
        }
        
        // Check if it looks like LLVM IR
        const hasIRMarkers = trimmed.includes('define') ||
                            trimmed.includes('declare') ||
                            trimmed.includes('target') ||
                            trimmed.includes('@') ||
                            trimmed.includes('%');
        
        if (!hasIRMarkers) {
            throw new Error('Content does not appear to be valid LLVM IR');
        }
        
        const parser = new IRParser(irContent);
        return parser.parse();
    } catch (error) {
        console.error('IR parsing error:', error);
        throw new Error(`Failed to parse IR: ${error.message}`);
    }
}

// Made with Bob
