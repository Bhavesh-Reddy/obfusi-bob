# Obfusi-Bob MCP Server

MCP (Model Context Protocol) Server for LLVM-based obfuscation framework.

## Overview

This MCP server provides Bob (AI agent) with secure access to LLVM IR files and obfuscation passes. It implements strict security validation, 30-second timeouts, and follows all guidelines from AGENTS.md.

## Features

- **read_ir_file**: Read and validate LLVM IR files from local filesystem
- **analyze_ir_structure**: Parse IR to identify functions, basic blocks, and entry points
- **execute_obfuscation_pass**: Execute LLVM passes with timeout protection

## Security

- ✅ Path validation prevents directory traversal attacks
- ✅ 30-second timeout on all LLVM operations
- ✅ Sanitized error messages (no internal paths exposed)
- ✅ File size limits (100MB max)
- ✅ Pass name validation (prevents command injection)

## Installation

```bash
npm install
```

## Build

```bash
npm run build
```

## Usage

### Start Server

```bash
npm start
```

### Development Mode

```bash
npm run dev
```

## MCP Tools

### 1. read_ir_file

Read and parse LLVM IR file with validation.

**Input:**
```json
{
  "path": "test-samples/simple.ll",
  "validate": true
}
```

**Output:**
```json
{
  "success": true,
  "data": {
    "content": "...",
    "size": 1234,
    "hash": "abc123...",
    "metadata": {
      "targetTriple": "x86_64-unknown-linux-gnu",
      "dataLayout": "...",
      "sourceFilename": "simple.c"
    }
  }
}
```

### 2. analyze_ir_structure

Analyze IR structure to identify obfuscation opportunities.

**Input:**
```json
{
  "irPath": "test-samples/simple.ll"
}
```

**Output:**
```json
{
  "success": true,
  "data": {
    "functions": [
      {
        "name": "main",
        "basicBlocks": 1,
        "instructions": 10,
        "hasLoops": false,
        "hasConditionals": false
      }
    ],
    "globalVariables": [],
    "totalInstructions": 10,
    "entryPoint": "main"
  }
}
```

### 3. execute_obfuscation_pass

Execute LLVM obfuscation pass with timeout.

**Input:**
```json
{
  "irPath": "test-samples/simple.ll",
  "passName": "mem2reg",
  "outputPath": "test-samples/simple.optimized.ll",
  "dryRun": false
}
```

**Output:**
```json
{
  "success": true,
  "data": {
    "outputPath": "test-samples/simple.optimized.ll",
    "executionTime": 150,
    "success": true,
    "stdout": "...",
    "stderr": ""
  }
}
```

## Testing

Create a test IR file in `test-samples/simple.ll` and use Bob to interact with the server:

```
Bob, use the read_ir_file tool to read test-samples/simple.ll
```

## Architecture

```
mcp-server/
├── src/
│   ├── index.ts           # Entry point
│   ├── server.ts          # MCP server setup
│   ├── tools/             # MCP tool implementations
│   │   ├── read-ir-file.ts
│   │   ├── analyze-ir.ts
│   │   └── execute-pass.ts
│   ├── utils/             # Utility modules
│   │   ├── validation.ts  # Security validation
│   │   └── executor.ts    # Command execution
│   └── types/             # TypeScript types
│       └── index.ts
├── dist/                  # Compiled JavaScript
├── package.json
└── tsconfig.json
```

## Requirements

- Node.js ≥18.0.0
- LLVM ≥18.0.0 (with `opt` command available)
- TypeScript ≥5.3.3

## Environment

The server runs in the workspace directory and validates all paths relative to it. This prevents access to files outside the project.

## Error Handling

All errors are sanitized before being returned to prevent information leakage:
- File paths are replaced with `[PATH]`
- Stack traces are removed
- Only user-friendly error messages are shown

## Performance

- File reading uses streaming for files >10MB
- 30-second timeout on all LLVM operations
- AbortController for graceful cancellation

## License

MIT - IBM Bob Dev Day Hackathon 2026