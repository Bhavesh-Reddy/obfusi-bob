# Obfusi-Bob MCP Server - Quick Start Guide

## 🚀 Getting Started in 3 Steps

### Step 1: Install Dependencies
```bash
cd obfusi-bob/mcp-server
npm install
```

### Step 2: Build the Server
```bash
npm run build
```

### Step 3: Start the Server
```bash
npm start
```

---

## 🧪 Testing the Server

### Run Test Suite
```bash
node test-mcp.js
```

Expected output:
```
✅ read_ir_file: Successfully read 771 bytes
✅ analyze_ir_structure: Found 2 functions
✅ All tests completed!
```

---

## 🛠️ Using with Bob

### Tool 1: Read IR File

**Command:**
```
Bob, use the read_ir_file tool with path "test-samples/simple.ll"
```

**What it does:**
- Reads the IR file from disk
- Validates the file path (security)
- Extracts metadata (target triple, data layout)
- Returns file content and hash

**Example Response:**
```json
{
  "success": true,
  "data": {
    "content": "; ModuleID = 'simple.c'...",
    "size": 771,
    "hash": "271aa70b7aaef059...",
    "metadata": {
      "targetTriple": "x86_64-unknown-linux-gnu",
      "dataLayout": "e-m:e-p270:32:32...",
      "sourceFilename": "simple.c"
    }
  }
}
```

---

### Tool 2: Analyze IR Structure

**Command:**
```
Bob, use the analyze_ir_structure tool with irPath "test-samples/simple.ll"
```

**What it does:**
- Parses IR to find functions
- Counts basic blocks and instructions
- Detects loops and conditionals
- Identifies entry point

**Example Response:**
```json
{
  "success": true,
  "data": {
    "functions": [
      {
        "name": "add",
        "basicBlocks": 2,
        "instructions": 2,
        "hasLoops": false,
        "hasConditionals": false
      },
      {
        "name": "main",
        "basicBlocks": 2,
        "instructions": 11,
        "hasLoops": false,
        "hasConditionals": false
      }
    ],
    "globalVariables": [],
    "totalInstructions": 13,
    "entryPoint": "main"
  }
}
```

---

### Tool 3: Execute Obfuscation Pass

**Command:**
```
Bob, use the execute_obfuscation_pass tool with:
- irPath: "test-samples/simple.ll"
- passName: "mem2reg"
- outputPath: "test-samples/simple.optimized.ll"
```

**What it does:**
- Executes LLVM opt command
- Applies the specified pass
- Saves output to file
- Returns execution metrics

**Example Response:**
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

**Available Passes:**
- `mem2reg` - Promote memory to registers
- `instcombine` - Combine instructions
- `flatten` - Control flow flattening (custom)
- `bogus` - Bogus code insertion (custom)
- `encrypt` - String encryption (custom)

---

## 🔐 Security Features

### ✅ Path Validation
All file paths are validated to prevent directory traversal:
```
✅ "test-samples/simple.ll" - Allowed
❌ "../../../etc/passwd" - Blocked
❌ "C:/Windows/System32/..." - Blocked
```

### ✅ Timeout Protection
All LLVM operations timeout after 30 seconds:
```typescript
// Prevents resource exhaustion
executeWithTimeout(command, 30000)
```

### ✅ Error Sanitization
Error messages never expose internal paths:
```
Before: "Error at C:/Users/bvnav/Desktop/..."
After:  "Error at [PATH]"
```

---

## 📁 File Structure

```
mcp-server/
├── src/
│   ├── index.ts              # Entry point
│   ├── server.ts             # MCP server
│   ├── tools/
│   │   ├── read-ir-file.ts   # Tool 1
│   │   ├── analyze-ir.ts     # Tool 2
│   │   └── execute-pass.ts   # Tool 3
│   ├── utils/
│   │   ├── validation.ts     # Security
│   │   └── executor.ts       # LLVM commands
│   └── types/
│       └── index.ts          # TypeScript types
├── dist/                     # Compiled JS
├── test-samples/
│   └── simple.ll             # Sample IR file
├── test-mcp.js               # Test suite
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🐛 Troubleshooting

### Issue: "Cannot find module"
**Solution:** Run `npm install` first

### Issue: "Path traversal detected"
**Solution:** Use relative paths within the workspace
```bash
# ✅ Correct
"test-samples/simple.ll"

# ❌ Wrong
"../test-samples/simple.ll"
```

### Issue: "LLVM not found"
**Solution:** Install LLVM 18+ and ensure `opt` is in PATH
```bash
# Check LLVM installation
opt --version
```

### Issue: "Timeout after 30 seconds"
**Solution:** The IR file or pass is too complex. Try:
- Smaller IR files
- Simpler passes
- Optimize the IR first

---

## 📊 Performance Tips

1. **Cache Results**: Use the file hash for caching
2. **Batch Operations**: Process multiple files in sequence
3. **Skip Validation**: Set `validate: false` for faster reads
4. **Use Dry Run**: Test passes with `dryRun: true` first

---

## 🎯 Next Steps

1. ✅ Server is running
2. ⏭️ Test with Bob in Advanced mode
3. ⏭️ Implement custom LLVM passes
4. ⏭️ Add more obfuscation techniques
5. ⏭️ Build dashboard for visualization

---

## 📞 Support

- **Documentation**: See `README.md` for detailed info
- **Architecture**: See `mcp-server-architecture.md`
- **Security Rules**: See `AGENTS.md`
- **Phase 2 Summary**: See `PHASE2-COMPLETION.md`

---

**Ready to obfuscate! 🎉**