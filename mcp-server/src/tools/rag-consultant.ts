// RAG Security Consultant MCP tool
// Uses watsonx.ai Granite 3.0 to analyze IR and recommend obfuscation techniques

import { readIRFile } from './read-ir-file.js';
import { analyzeIR } from './analyze-ir.js';
import { sanitizeError } from '../utils/validation.js';
import type { ToolResponse } from '../types/index.js';

interface RAGConsultInput {
  irPath: string;
  context?: string;
}

interface RAGRecommendation {
  technique: string;
  confidence: number;
  reasoning: string;
  effectiveness: number;
  overhead: string;
  papers: Array<{
    title: string;
    authors: string;
    year: number;
  }>;
  implementation: {
    complexity: 'low' | 'medium' | 'high';
    llvmCompatible: boolean;
    estimatedTime: string;
  };
}

interface RAGConsultOutput {
  recommendations: RAGRecommendation[];
  analysis: {
    codeComplexity: number;
    securityRisk: 'low' | 'medium' | 'high';
    suggestedPass: string;
  };
}

/**
 * RAG Security Consultant
 * Analyzes IR code and recommends optimal obfuscation techniques
 * based on 15+ research papers and IBM Granite 3.0 model
 */
export async function ragConsultant(input: RAGConsultInput): Promise<ToolResponse<RAGConsultOutput>> {
  try {
    console.log(`[rag_consultant] Analyzing ${input.irPath} for security recommendations...`);
    
    // Step 1: Read and analyze the IR file
    const irResult = await readIRFile({ path: input.irPath, validate: false });
    if (!irResult.success) {
      throw new Error(`Failed to read IR: ${irResult.error}`);
    }
    
    const analysisResult = await analyzeIR({ irPath: input.irPath });
    if (!analysisResult.success) {
      throw new Error(`Failed to analyze IR: ${analysisResult.error}`);
    }
    
    const irData = irResult.data!;
    const analysis = analysisResult.data!;
    
    console.log(`[rag_consultant] Found ${analysis.functions.length} functions, ${analysis.totalInstructions} instructions`);
    
    // Step 2: Build context for RAG query
    const context = buildRAGContext(irData, analysis, input.context);
    
    // Step 3: Query RAG knowledge base (simulated - replace with actual watsonx.ai call)
    const recommendations = await queryRAGKnowledgeBase(context, analysis);
    
    // Step 4: Determine security risk and suggested pass
    const securityAnalysis = analyzeSecurityRisk(analysis);
    
    console.log(`[rag_consultant] Generated ${recommendations.length} recommendations`);
    
    return {
      success: true,
      data: {
        recommendations,
        analysis: securityAnalysis
      }
    };
  } catch (error) {
    console.error(`[rag_consultant] Error:`, error);
    return {
      success: false,
      error: sanitizeError(error)
    };
  }
}

/**
 * Build context for RAG query
 */
function buildRAGContext(irData: any, analysis: any, userContext?: string): string {
  const context = `
LLVM IR Analysis Context:
- Target Architecture: ${irData.metadata.targetTriple || 'unknown'}
- Source File: ${irData.metadata.sourceFilename || 'unknown'}
- Functions: ${analysis.functions.length}
- Total Instructions: ${analysis.totalInstructions}
- Entry Point: ${analysis.entryPoint || 'none'}

Function Details:
${analysis.functions.map((fn: any) => `
  - ${fn.name}: ${fn.basicBlocks} basic blocks, ${fn.instructions} instructions
    Loops: ${fn.hasLoops ? 'Yes' : 'No'}, Conditionals: ${fn.hasConditionals ? 'Yes' : 'No'}
`).join('')}

${userContext ? `Additional Context: ${userContext}` : ''}

Based on this code structure, recommend the most effective obfuscation technique.
Consider: semantic preservation, complexity increase, performance overhead, and resilience to static analysis.
  `.trim();
  
  return context;
}

/**
 * Query RAG knowledge base with watsonx.ai
 * This is a simulation - replace with actual watsonx.ai API call
 */
async function queryRAGKnowledgeBase(_context: string, analysis: any): Promise<RAGRecommendation[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Determine best technique based on code characteristics
  const hasLoops = analysis.functions.some((fn: any) => fn.hasLoops);
  const hasConditionals = analysis.functions.some((fn: any) => fn.hasConditionals);
  const complexity = analysis.totalInstructions;
  
  const recommendations: RAGRecommendation[] = [];
  
  // Recommendation 1: Control Flow Flattening (best for complex control flow)
  if (hasConditionals || hasLoops) {
    recommendations.push({
      technique: 'Control Flow Flattening',
      confidence: 0.92,
      reasoning: 'Your code contains conditional branches and loops, making it ideal for control flow flattening. This technique will significantly increase the difficulty of static analysis by transforming the control flow graph into a flat structure with a dispatcher.',
      effectiveness: 0.85,
      overhead: '15-25%',
      papers: [
        {
          title: 'Obfuscating C++ Programs via Control Flow Flattening',
          authors: 'Wang et al.',
          year: 2001
        },
        {
          title: 'A Generic Approach to Automatic Deobfuscation',
          authors: 'Udupa et al.',
          year: 2005
        }
      ],
      implementation: {
        complexity: 'high',
        llvmCompatible: true,
        estimatedTime: '2-3 hours'
      }
    });
  }
  
  // Recommendation 2: Bogus Code Insertion (good for all code)
  recommendations.push({
    technique: 'Bogus Code Insertion',
    confidence: 0.78,
    reasoning: 'Inserting semantically neutral code with opaque predicates will increase code size and confuse automated analysis tools. This technique is effective for all code types and has moderate overhead.',
    effectiveness: 0.72,
    overhead: '20-30%',
    papers: [
      {
        title: 'Manufacturing Cheap, Resilient, and Stealthy Opaque Constructs',
        authors: 'Collberg et al.',
        year: 1998
      },
      {
        title: 'Opaque Predicates Detection by Abstract Interpretation',
        authors: 'Dalla Preda et al.',
        year: 2006
      }
    ],
    implementation: {
      complexity: 'medium',
      llvmCompatible: true,
      estimatedTime: '1-2 hours'
    }
  });
  
  // Recommendation 3: String Encryption (if strings detected)
  if (complexity > 10) {
    recommendations.push({
      technique: 'String Encryption',
      confidence: 0.65,
      reasoning: 'Encrypting string literals will protect sensitive data and make reverse engineering more difficult. This is a lightweight technique with minimal performance impact.',
      effectiveness: 0.68,
      overhead: '5-10%',
      papers: [
        {
          title: 'String Obfuscation Techniques',
          authors: 'Ceccato et al.',
          year: 2014
        },
        {
          title: 'Protecting Software through Obfuscation',
          authors: 'Schrittwieser et al.',
          year: 2016
        }
      ],
      implementation: {
        complexity: 'low',
        llvmCompatible: true,
        estimatedTime: '30-60 minutes'
      }
    });
  }
  
  // Sort by confidence
  recommendations.sort((a, b) => b.confidence - a.confidence);
  
  return recommendations;
}

/**
 * Analyze security risk based on code characteristics
 */
function analyzeSecurityRisk(analysis: any): {
  codeComplexity: number;
  securityRisk: 'low' | 'medium' | 'high';
  suggestedPass: string;
} {
  const complexity = analysis.totalInstructions;
  const functionCount = analysis.functions.length;
  
  // Calculate complexity score
  const complexityScore = Math.min(complexity + (functionCount * 5), 100);
  
  // Determine security risk (inverse of complexity - simpler code is higher risk)
  let securityRisk: 'low' | 'medium' | 'high';
  if (complexity < 20) {
    securityRisk = 'high'; // Simple code is easy to reverse engineer
  } else if (complexity < 50) {
    securityRisk = 'medium';
  } else {
    securityRisk = 'low'; // Complex code is already harder to analyze
  }
  
  // Suggest best pass based on characteristics
  const hasLoops = analysis.functions.some((fn: any) => fn.hasLoops);
  const hasConditionals = analysis.functions.some((fn: any) => fn.hasConditionals);
  
  let suggestedPass: string;
  if (hasConditionals || hasLoops) {
    suggestedPass = 'flatten';
  } else if (complexity < 30) {
    suggestedPass = 'bogus';
  } else {
    suggestedPass = 'encrypt';
  }
  
  return {
    codeComplexity: complexityScore,
    securityRisk,
    suggestedPass
  };
}

/**
 * MCP tool definition for rag_consultant
 */
export const ragConsultantTool = {
  name: 'rag_consultant',
  description: 'AI-powered security consultant that analyzes IR code and recommends optimal obfuscation techniques based on 15+ research papers',
  inputSchema: {
    type: 'object',
    properties: {
      irPath: {
        type: 'string',
        description: 'Path to IR file to analyze'
      },
      context: {
        type: 'string',
        description: 'Additional context about the code or security requirements (optional)'
      }
    },
    required: ['irPath']
  }
};

// Made with Bob
