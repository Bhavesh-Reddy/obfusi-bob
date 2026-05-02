#!/usr/bin/env node
// Obfusi-Bob MCP Server Entry Point
// Main entry point for the LLVM obfuscation MCP server
import { ObfusiBobMCPServer } from './server.js';
async function main() {
    console.log('='.repeat(60));
    console.log('  Obfusi-Bob MCP Server');
    console.log('  LLVM-Based Obfuscation Framework');
    console.log('  IBM Bob Dev Day Hackathon 2026');
    console.log('='.repeat(60));
    console.log('');
    try {
        const server = new ObfusiBobMCPServer();
        await server.start();
    }
    catch (error) {
        console.error('Failed to start MCP server:', error);
        process.exit(1);
    }
}
// Start the server
main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
});
// Made with Bob
//# sourceMappingURL=index.js.map