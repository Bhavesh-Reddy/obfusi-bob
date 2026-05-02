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
export declare function ragConsultant(input: RAGConsultInput): Promise<ToolResponse<RAGConsultOutput>>;
/**
 * MCP tool definition for rag_consultant
 */
export declare const ragConsultantTool: {
    name: string;
    description: string;
    inputSchema: {
        type: string;
        properties: {
            irPath: {
                type: string;
                description: string;
            };
            context: {
                type: string;
                description: string;
            };
        };
        required: string[];
    };
};
export {};
//# sourceMappingURL=rag-consultant.d.ts.map