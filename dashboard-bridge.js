#!/usr/bin/env node

/**
 * Dashboard Bridge Script
 * Connects the HTML dashboard to the MCP server
 * Provides a simple HTTP server that proxies requests to MCP tools
 */

import http from 'http';
import { readIRFile } from './mcp-server/dist/tools/read-ir-file.js';
import { analyzeIR } from './mcp-server/dist/tools/analyze-ir.js';
import { executePass } from './mcp-server/dist/tools/execute-pass.js';
import { ragConsultant } from './mcp-server/dist/tools/rag-consultant.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3002;

// CORS headers for dashboard
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json'
};

/**
 * Handle MCP tool requests
 */
async function handleToolRequest(toolName, args) {
  console.log(`[Bridge] Handling tool request: ${toolName}`);
  console.log(`[Bridge] Arguments:`, JSON.stringify(args, null, 2));
  
  try {
    let result;
    
    switch (toolName) {
      case 'read_ir_file':
        result = await readIRFile(args);
        break;
      
      case 'analyze_ir_structure':
        result = await analyzeIR(args);
        break;
      
      case 'execute_obfuscation_pass':
        result = await executePass(args);
        break;
      
      case 'rag_consultant':
        result = await ragConsultant(args);
        break;
      
      default:
        result = {
          success: false,
          error: `Unknown tool: ${toolName}`
        };
    }
    
    console.log(`[Bridge] Tool result:`, result.success ? '✓ Success' : '✗ Failed');
    return result;
  } catch (error) {
    console.error(`[Bridge] Error:`, error);
    return {
      success: false,
      error: error.message || 'Unknown error'
    };
  }
}

/**
 * Create HTTP server
 */
const server = http.createServer(async (req, res) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(200, corsHeaders);
    res.end();
    return;
  }
  
  // Serve dashboard HTML
  if (req.method === 'GET' && req.url === '/') {
    try {
      const dashboardPath = path.join(__dirname, 'dashboard.html');
      const html = fs.readFileSync(dashboardPath, 'utf-8');
      
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(html);
    } catch (error) {
      res.writeHead(500, corsHeaders);
      res.end(JSON.stringify({ error: 'Failed to load dashboard' }));
    }
    return;
  }
  
  // Handle API requests
  if (req.method === 'POST' && req.url === '/api/tool') {
    let body = '';
    
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', async () => {
      try {
        const { tool, args } = JSON.parse(body);
        const result = await handleToolRequest(tool, args);
        
        res.writeHead(200, corsHeaders);
        res.end(JSON.stringify(result));
      } catch (error) {
        res.writeHead(400, corsHeaders);
        res.end(JSON.stringify({
          success: false,
          error: error.message || 'Invalid request'
        }));
      }
    });
    
    return;
  }
  
  // 404 for other routes
  res.writeHead(404, corsHeaders);
  res.end(JSON.stringify({ error: 'Not found' }));
});

// Start server
server.listen(PORT, () => {
  console.log('='.repeat(60));
  console.log('  Obfusi-Bob Dashboard Bridge');
  console.log('  Connecting Dashboard to MCP Server');
  console.log('='.repeat(60));
  console.log('');
  console.log(`✓ Server running at http://localhost:${PORT}`);
  console.log(`✓ Dashboard available at http://localhost:${PORT}/`);
  console.log(`✓ API endpoint: http://localhost:${PORT}/api/tool`);
  console.log('');
  console.log('Available tools:');
  console.log('  - read_ir_file');
  console.log('  - analyze_ir_structure');
  console.log('  - execute_obfuscation_pass');
  console.log('  - rag_consultant');
  console.log('');
  console.log('Press Ctrl+C to stop');
  console.log('');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\nShutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

// Made with Bob
