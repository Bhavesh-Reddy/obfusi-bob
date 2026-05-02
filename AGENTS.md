# AGENTS.md

This file provides guidance to agents when working with code in this repository.

## Project: Obfusi-Bob - LLVM-Based Obfuscation Framework

### Critical Security Rules
- LLVM IR transformations MUST preserve program semantics - verify with `opt -verify` after each pass
- Never expose internal IR structure in error messages - sanitize all outputs
- String encryption keys use `crypto.randomBytes(32)` from Node.js crypto module, NOT Math.random()
- All file paths MUST be validated against workspace root to prevent directory traversal
- MCP server tools timeout after 30 seconds - use `AbortController` for all LLVM operations
- Temporary IR files stored in `./tmp/` MUST be deleted in finally blocks

### LLVM-Specific Patterns
- Use `PassManager` from `@llvm-bindings/core` for all transformation orchestration
- IR validation: Always run `verifyModule()` before and after transformations
- Architecture detection: Check `Module.getTargetTriple()` before applying arch-specific passes
- Debug info preservation: Use `DIBuilder` to maintain metadata through transformations
- Pass registration: Custom passes MUST extend `FunctionPass` or `ModulePass` base classes

### MCP Server Implementation
- All tools return structured responses: `{ success: boolean, data?: any, error?: string }`
- IR file reading uses streaming for files > 10MB: `fs.createReadStream()` with chunked parsing
- Cache parsed IR structures in `Map<string, IRModule>` keyed by file hash
- File watching implemented via `chokidar` library, NOT native fs.watch (cross-platform issues)
- Progress callbacks for long operations: emit events every 100ms with percentage complete

### RAG Integration
- Query watsonx.ai with IR context limited to 2000 tokens - truncate function bodies if needed
- Cache RAG responses in Redis with 1-hour TTL, keyed by `hash(context + technique)`
- Paper metadata stored in `rag-system/papers/metadata.json` - update when adding new papers
- Embedding model: `ibm/slate-125m-english-rtrvr` for technical content
- Retrieval uses hybrid search: vector similarity (70%) + BM25 keyword matching (30%)

### Testing Requirements
- Each LLVM pass MUST have test in `tests/unit/passes/` with before/after IR snapshots
- Integration tests execute obfuscated binaries and compare output to original
- Use `llvm-lit` test framework for pass testing, NOT Jest (LLVM-specific assertions needed)
- Metrics tests verify complexity increase: cyclomatic complexity MUST increase by ≥30%
- Performance benchmarks in `tests/benchmarks/` - obfuscation overhead MUST be <50%

### Dashboard Development
- GSAP animations use `gsap.timeline()` for IR transformation visualization sequences
- Tailwind classes for obfuscation metrics: `bg-red-500` (high overhead), `bg-green-500` (low overhead)
- IR diff view uses `monaco-editor` with custom LLVM IR syntax highlighting
- Real-time updates via WebSocket connection to MCP server on port 3001
- Export reports as PDF using `jsPDF` with embedded metrics charts

### Build Commands
- MCP Server: `cd mcp-server && npm run build && npm start`
- LLVM Passes: `cd llvm-passes && mkdir build && cd build && cmake .. && make`
- Dashboard: `cd dashboard && npm run dev` (Vite dev server on port 5173)
- RAG System: `cd rag-system && python ingest.py --papers ./papers/`
- Full Integration Test: `npm run test:integration` (requires LLVM 18+ installed)

### Common Pitfalls
- LLVM C++ bindings require N-API v8+ - check Node.js version ≥18
- Control flow flattening breaks exception handling if not using `landingpad` preservation
- String encryption MUST handle wide strings (wchar_t) differently than char strings
- Multi-pass cycles can create exponential complexity - limit to 3 passes maximum
- watsonx.ai rate limits: 10 requests/second - implement exponential backoff