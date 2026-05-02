// Obfusi-Bob MCP Server
// Provides secure gateway to LLVM obfuscation toolchain

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

// Import tools
import { readIRFile, readIRFileTool } from './tools/read-ir-file.js';
import { analyzeIR, analyzeIRTool } from './tools/analyze-ir.js';
import { executePass, executePassTool } from './tools/execute-pass.js';
import { ragConsultant, ragConsultantTool } from './tools/rag-consultant.js';
import { getLLVMVersion } from './utils/executor.js';

export class ObfusiBobMCPServer {
  private server: Server;
  private llvmVersion: string = 'unknown';

  constructor() {
    this.server = new Server(
      {
        name: 'obfusi-bob-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
    this.setupErrorHandling();
  }

  /**
   * Set up MCP request handlers
   */
  private setupHandlers(): void {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      console.log('[Server] Listing available tools');
      return {
        tools: [
          readIRFileTool,
          analyzeIRTool,
          executePassTool,
          ragConsultantTool,
        ],
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      
      console.log(`[Server] Tool called: ${name}`);
      console.log(`[Server] Arguments:`, JSON.stringify(args, null, 2));

      try {
        let result: any;
        
        switch (name) {
          case 'read_ir_file':
            result = await readIRFile(args as any);
            break;

          case 'analyze_ir_structure':
            result = await analyzeIR(args as any);
            break;

          case 'execute_obfuscation_pass':
            result = await executePass(args as any);
            break;

          case 'rag_consultant':
            result = await ragConsultant(args as any);
            break;

          default:
            result = {
              success: false,
              error: `Unknown tool: ${name}`,
            };
        }
        
        // Return in MCP format
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2)
            }
          ]
        };
      } catch (error: any) {
        console.error(`[Server] Tool execution error:`, error);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: false,
                error: error.message || 'Tool execution failed'
              }, null, 2)
            }
          ],
          isError: true
        };
      }
    });
  }

  /**
   * Set up error handling and cleanup
   */
  private setupErrorHandling(): void {
    this.server.onerror = (error) => {
      console.error('[Server] MCP Error:', error);
    };

    // Graceful shutdown on SIGINT
    process.on('SIGINT', async () => {
      console.log('\n[Server] Shutting down gracefully...');
      await this.server.close();
      process.exit(0);
    });

    // Handle uncaught errors
    process.on('uncaughtException', (error) => {
      console.error('[Server] Uncaught exception:', error);
      process.exit(1);
    });

    process.on('unhandledRejection', (reason, promise) => {
      console.error('[Server] Unhandled rejection at:', promise, 'reason:', reason);
      process.exit(1);
    });
  }

  /**
   * Start the MCP server
   */
  async start(): Promise<void> {
    try {
      // Check LLVM version
      this.llvmVersion = await getLLVMVersion();
      console.log(`[Server] LLVM version: ${this.llvmVersion}`);

      // Connect to stdio transport
      const transport = new StdioServerTransport();
      await this.server.connect(transport);

      console.log('[Server] Obfusi-Bob MCP Server running on stdio');
      console.log('[Server] Workspace:', process.cwd());
      console.log('[Server] Available tools: read_ir_file, analyze_ir_structure, execute_obfuscation_pass');
      console.log('[Server] Ready to receive requests...');
    } catch (error) {
      console.error('[Server] Failed to start:', error);
      throw error;
    }
  }
}

// Made with Bob
