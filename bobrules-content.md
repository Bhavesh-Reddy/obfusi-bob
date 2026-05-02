# .bobrules File Content for Obfusi-Bob

**Note**: This content should be saved as `.bobrules` in the project root. Plan mode can only create markdown files, so you'll need to copy this content to `.bobrules` when switching to Code mode.

---

```yaml
# .bobrules - Obfusi-Bob Project Rules
# IBM Bob Dev Day Hackathon - LLVM-Based Obfuscation Framework

project:
  name: "Obfusi-Bob"
  type: "security-compiler-framework"
  hackathon: "IBM Bob Dev Day"
  mission: "Turn idea into impact faster through automated code obfuscation"
  
  tech_stack:
    agentic_ai: "watsonx Orchestrate"
    rag: "watsonx.ai"
    mcp: "Model Context Protocol"
    llvm: "18+"
    frontend: ["Tailwind CSS", "GSAP", "React", "TypeScript"]
    backend: ["Node.js", "TypeScript", "Python"]

# ============================================================================
# SECURITY RULES - HIGHEST PRIORITY
# ============================================================================

security:
  priority: "critical"
  
  semantic_preservation:
    - "All LLVM IR transformations MUST preserve program semantics"
    - "Run 'opt -verify' before and after every transformation pass"
    - "Test obfuscated binaries produce identical output to originals"
    - "Maintain exception handling integrity through all transformations"
    - "Preserve debug information when possible for reversibility"
  
  cryptographic_security:
    - "String encryption keys MUST use crypto.randomBytes(32) from Node.js crypto module"
    - "NEVER use Math.random() for any security-critical operations"
    - "Key derivation must use PBKDF2 with minimum 10000 iterations"
    - "Store encryption keys in secure memory, never in plaintext files"
    - "Implement key rotation mechanism for long-running processes"
  
  input_validation:
    - "All file paths MUST be validated against workspace root"
    - "Prevent directory traversal attacks with path.resolve() and path.relative()"
    - "Sanitize all user inputs before LLVM operations"
    - "Validate IR file format before parsing (check magic bytes)"
    - "Reject files larger than 100MB to prevent DoS"
  
  error_handling:
    - "Never expose internal IR structure in error messages"
    - "Sanitize all error outputs before returning to user"
    - "Log detailed errors internally, return generic messages externally"
    - "Include error codes for debugging without exposing internals"
    - "Implement rate limiting on error responses"
  
  resource_management:
    - "MCP server tools MUST timeout after 30 seconds"
    - "Use AbortController for all long-running LLVM operations"
    - "Temporary IR files in ./tmp/ MUST be deleted in finally blocks"
    - "Implement memory limits for IR parsing (max 500MB per file)"
    - "Clean up zombie processes from failed transformations"
  
  vulnerability_prevention:
    - "Obfuscation passes MUST NOT introduce exploitable vulnerabilities"
    - "Avoid creating buffer overflows through code insertion"
    - "Ensure control flow modifications don't bypass security checks"
    - "Test for timing side-channels in obfuscated code"
    - "Verify no information leakage through obfuscation metadata"

# ============================================================================
# LLVM COMPILER RULES
# ============================================================================

compiler:
  llvm_version: "18+"
  supported_architectures: ["x86_64", "aarch64", "arm", "riscv64"]
  optimization_levels: ["O0", "O1", "O2", "O3", "Os", "Oz"]
  
  ir_validation:
    - "Always verify IR validity before and after transformations"
    - "Use verifyModule() from LLVM's Verifier.h"
    - "Check for undefined behavior with UBSan integration"
    - "Validate SSA form is maintained throughout passes"
    - "Ensure dominance relationships are preserved"
  
  pass_management:
    - "Use PassManager from @llvm-bindings/core for orchestration"
    - "Register passes in correct dependency order"
    - "Custom passes MUST extend FunctionPass or ModulePass base classes"
    - "Implement getAnalysisUsage() to declare dependencies"
    - "Use PassManagerBuilder for standard optimization pipelines"
  
  architecture_handling:
    - "Check Module.getTargetTriple() before arch-specific passes"
    - "Ensure passes are architecture-agnostic unless explicitly targeted"
    - "Test obfuscation on all supported architectures"
    - "Handle endianness differences in string encryption"
    - "Verify pointer size assumptions (32-bit vs 64-bit)"
  
  debug_information:
    - "Preserve debug info when possible using DIBuilder"
    - "Maintain source location metadata through transformations"
    - "Update debug info after control flow modifications"
    - "Strip debug info only when explicitly requested"
    - "Document which passes preserve vs. destroy debug info"
  
  optimization_interaction:
    - "Test obfuscation at all optimization levels (O0-O3)"
    - "Ensure obfuscation survives aggressive optimizations"
    - "Document which optimizations may undo obfuscation"
    - "Apply obfuscation after optimization when possible"
    - "Measure complexity increase at each optimization level"

# ============================================================================
# CODE QUALITY RULES
# ============================================================================

code_quality:
  
  testing:
    - "All LLVM passes MUST have unit tests in tests/unit/passes/"
    - "Include before/after IR snapshots for each test case"
    - "Integration tests MUST execute obfuscated binaries"
    - "Compare obfuscated output to original for correctness"
    - "Use llvm-lit test framework for pass testing, NOT Jest"
    - "Metrics tests verify cyclomatic complexity increases ≥30%"
    - "Performance benchmarks ensure overhead <50%"
    - "Test multi-pass combinations for semantic preservation"
    - "Include adversarial deobfuscation tests"
  
  error_handling:
    - "MCP tools MUST have error handling for malformed IR files"
    - "Return structured error responses with context"
    - "Include rollback mechanisms for failed transformations"
    - "Log all transformation decisions for audit trail"
    - "Implement graceful degradation for partial failures"
  
  type_safety:
    - "Use TypeScript strict mode for all MCP server code"
    - "Enable strictNullChecks, strictFunctionTypes, noImplicitAny"
    - "Define explicit interfaces for all MCP tool parameters"
    - "Use discriminated unions for transformation results"
    - "Avoid 'any' type except for LLVM FFI boundaries"
  
  documentation:
    - "Document time/space complexity for each obfuscation pass"
    - "Include algorithm descriptions in pass header comments"
    - "Provide usage examples for each MCP tool"
    - "Maintain changelog for transformation techniques"
    - "Document known limitations and edge cases"
  
  code_organization:
    - "Separate concerns: parsing, analysis, transformation, validation"
    - "Use dependency injection for testability"
    - "Keep functions under 50 lines when possible"
    - "Extract magic numbers to named constants"
    - "Follow single responsibility principle for passes"

# ============================================================================
# MCP INTEGRATION RULES
# ============================================================================

mcp_integration:
  
  tool_design:
    - "All tools return structured responses: { success: boolean, data?: any, error?: string }"
    - "Include progress callbacks for operations >5 seconds"
    - "Support batch processing of multiple IR files"
    - "Provide dry-run mode for all transformation tools"
    - "Include undo/rollback capability for reversible operations"
  
  performance:
    - "MCP tools MUST timeout after 30 seconds"
    - "Cache parsed IR structures in Map<string, IRModule> keyed by file hash"
    - "Use streaming for IR files >10MB: fs.createReadStream() with chunked parsing"
    - "Implement connection pooling for watsonx.ai requests"
    - "Debounce file watching events (500ms delay)"
  
  file_operations:
    - "Implement file watching via chokidar library, NOT native fs.watch"
    - "Support automatic IR reload on file changes"
    - "Validate file permissions before read/write operations"
    - "Use atomic writes for output files (write to temp, then rename)"
    - "Implement file locking to prevent concurrent modifications"
  
  error_recovery:
    - "Retry failed operations with exponential backoff"
    - "Maximum 3 retry attempts with 1s, 2s, 4s delays"
    - "Preserve partial results on timeout"
    - "Provide detailed error context for debugging"
    - "Implement circuit breaker for repeated failures"

# ============================================================================
# RAG SYSTEM RULES
# ============================================================================

rag_system:
  
  paper_management:
    - "Store paper metadata in rag-system/papers/metadata.json"
    - "Update embeddings when new papers are added"
    - "Include technique, complexity, effectiveness in metadata"
    - "Tag papers with LLVM compatibility flag"
    - "Version control paper database for reproducibility"
  
  query_optimization:
    - "Query watsonx.ai with IR context limited to 2000 tokens"
    - "Truncate function bodies if needed, preserve signatures"
    - "Include architecture and optimization level in context"
    - "Add previous transformation history to queries"
    - "Use semantic chunking for long IR files"
  
  caching:
    - "Cache RAG responses in Redis with 1-hour TTL"
    - "Key format: hash(context + technique + llvm_version)"
    - "Invalidate cache when paper database updates"
    - "Implement cache warming for common queries"
    - "Monitor cache hit rate (target >70%)"
  
  embedding_strategy:
    - "Use ibm/slate-125m-english-rtrvr for technical content"
    - "Hybrid search: vector similarity (70%) + BM25 (30%)"
    - "Chunk papers with 1000 char chunks, 200 char overlap"
    - "Preserve code examples as complete chunks"
    - "Include algorithm pseudocode in metadata"
  
  response_quality:
    - "Include paper citations in transformation decisions"
    - "Provide confidence scores for recommendations"
    - "Return top 3 relevant papers per query"
    - "Extract implementation hints from retrieved chunks"
    - "Validate recommendations against LLVM constraints"
  
  rate_limiting:
    - "watsonx.ai rate limit: 10 requests/second"
    - "Implement exponential backoff on rate limit errors"
    - "Queue requests during high load periods"
    - "Monitor API quota usage"
    - "Fallback to cached responses when quota exceeded"

# ============================================================================
# OBFUSCATION TECHNIQUE RULES
# ============================================================================

obfuscation:
  
  control_flow_flattening:
    - "Preserve exception handling with landingpad instructions"
    - "Maintain loop semantics and termination conditions"
    - "Use switch-based dispatcher for flattened blocks"
    - "Ensure all paths remain reachable after flattening"
    - "Test with recursive functions and nested loops"
    - "Complexity increase target: 40-60%"
  
  bogus_code_insertion:
    - "Inserted code MUST be semantically neutral (no side effects)"
    - "Use opaque predicates that are hard to analyze statically"
    - "Vary bogus code patterns to avoid signature detection"
    - "Ensure bogus code doesn't dominate execution time"
    - "Test that bogus code doesn't trigger compiler warnings"
    - "Code size increase target: 20-30%"
  
  string_encryption:
    - "Handle wide strings (wchar_t) differently than char strings"
    - "Encrypt at compile time, decrypt at runtime"
    - "Use unique keys per string to prevent pattern analysis"
    - "Implement constant-time decryption to prevent timing attacks"
    - "Support Unicode and multi-byte character encodings"
    - "Performance overhead target: <10%"
  
  multi_pass_orchestration:
    - "Limit to maximum 3 passes to prevent exponential complexity"
    - "Apply passes in order: flatten → bogus → encrypt"
    - "Validate IR after each pass before proceeding"
    - "Track cumulative complexity increase"
    - "Provide option to skip passes that fail validation"
    - "Total overhead target: <50%"
  
  metrics_tracking:
    - "Measure cyclomatic complexity before/after"
    - "Calculate code size increase percentage"
    - "Estimate execution time overhead"
    - "Compute resilience score against deobfuscation"
    - "Track memory usage during transformation"
    - "Generate detailed metrics report for each run"

# ============================================================================
# DASHBOARD DEVELOPMENT RULES
# ============================================================================

dashboard:
  
  visualization:
    - "Use GSAP timeline() for IR transformation animations"
    - "Animate control flow graph changes with smooth transitions"
    - "Show real-time progress during long transformations"
    - "Highlight modified IR sections with color coding"
    - "Provide zoom/pan controls for large IR graphs"
  
  ui_components:
    - "IR diff view uses monaco-editor with LLVM IR syntax highlighting"
    - "Custom syntax highlighting for obfuscated constructs"
    - "Side-by-side comparison of original vs obfuscated IR"
    - "Collapsible sections for large functions"
    - "Search functionality within IR code"
  
  metrics_display:
    - "Tailwind classes: bg-red-500 (high overhead), bg-green-500 (low overhead)"
    - "Use gradient colors for complexity scale"
    - "Display metrics as interactive charts (Chart.js)"
    - "Show historical metrics for comparison"
    - "Export metrics as CSV or JSON"
  
  real_time_updates:
    - "WebSocket connection to MCP server on port 3001"
    - "Reconnect automatically on connection loss"
    - "Show connection status indicator"
    - "Buffer updates during disconnection"
    - "Implement heartbeat mechanism (30s interval)"
  
  export_functionality:
    - "Export reports as PDF using jsPDF"
    - "Include embedded metrics charts in PDF"
    - "Generate markdown summary of transformations"
    - "Export obfuscated IR to file"
    - "Create shareable links for transformation results"
  
  accessibility:
    - "Follow WCAG 2.1 Level AA guidelines"
    - "Keyboard navigation for all controls"
    - "Screen reader support for metrics"
    - "High contrast mode option"
    - "Configurable font sizes"

# ============================================================================
# BUILD AND DEPLOYMENT RULES
# ============================================================================

build:
  
  commands:
    mcp_server: "cd mcp-server && npm run build && npm start"
    llvm_passes: "cd llvm-passes && mkdir -p build && cd build && cmake .. && make"
    dashboard: "cd dashboard && npm run dev"
    rag_system: "cd rag-system && python ingest.py --papers ./papers/"
    integration_test: "npm run test:integration"
  
  requirements:
    node_version: ">=18.0.0"
    llvm_version: ">=18.0.0"
    python_version: ">=3.9"
    cmake_version: ">=3.20"
  
  dependencies:
    - "LLVM C++ bindings require N-API v8+"
    - "Install LLVM development headers: llvm-dev"
    - "Python packages: langchain, chromadb, watsonx-ai"
    - "Node packages: @llvm-bindings/core, chokidar, ws"
  
  environment_variables:
    - "WATSONX_API_KEY: watsonx.ai authentication"
    - "WATSONX_PROJECT_ID: watsonx.ai project identifier"
    - "MCP_SERVER_PORT: default 3001"
    - "RAG_CACHE_TTL: default 3600 seconds"
    - "LLVM_INSTALL_DIR: path to LLVM installation"

# ============================================================================
# COMMON PITFALLS AND SOLUTIONS
# ============================================================================

pitfalls:
  
  llvm_bindings:
    problem: "LLVM C++ bindings require N-API v8+"
    solution: "Ensure Node.js version ≥18, check with 'node --version'"
  
  control_flow_flattening:
    problem: "Breaks exception handling if not careful"
    solution: "Use landingpad preservation, test with try-catch blocks"
  
  string_encryption:
    problem: "Wide strings (wchar_t) handled incorrectly"
    solution: "Detect string type, use appropriate encryption for each"
  
  multi_pass_complexity:
    problem: "Exponential complexity growth with multiple passes"
    solution: "Limit to 3 passes maximum, validate after each pass"
  
  watsonx_rate_limits:
    problem: "10 requests/second rate limit"
    solution: "Implement exponential backoff, use caching aggressively"
  
  file_watching:
    problem: "Native fs.watch has cross-platform issues"
    solution: "Always use chokidar library for file watching"
  
  memory_leaks:
    problem: "LLVM contexts not properly released"
    solution: "Use RAII pattern, ensure cleanup in finally blocks"
  
  ir_parsing:
    problem: "Large IR files cause memory issues"
    solution: "Use streaming for files >10MB, implement chunked parsing"

# ============================================================================
# HACKATHON SUCCESS CRITERIA
# ============================================================================

success_criteria:
  
  functionality:
    - "All 4 obfuscation techniques working correctly"
    - "MCP server responds in <2 seconds for typical operations"
    - "RAG retrieval accuracy >80% for relevant papers"
    - "Dashboard loads in <1 second"
    - "Obfuscated binaries execute correctly"
  
  security:
    - "No semantic bugs introduced by obfuscation"
    - "All transformations pass LLVM verification"
    - "Resilient to basic deobfuscation attempts"
    - "No exploitable vulnerabilities created"
    - "Proper input validation throughout"
  
  usability:
    - "Clear visualization of transformation process"
    - "Intuitive pass selection interface"
    - "Helpful error messages for failures"
    - "Comprehensive metrics display"
    - "Easy export of results"
  
  innovation:
    - "RAG-guided transformation decisions"
    - "Agentic workflow automation"
    - "Real-time obfuscation feedback"
    - "Multi-architecture support"
    - "Novel visualization techniques"
  
  performance:
    - "Obfuscation overhead <50%"
    - "Transformation time <30 seconds for typical files"
    - "Dashboard responsive on standard hardware"
    - "RAG queries return in <2 seconds"
    - "Memory usage <2GB for typical workloads"

# ============================================================================
# DEVELOPMENT WORKFLOW
# ============================================================================

workflow:
  
  feature_development:
    - "Create feature branch from main"
    - "Write tests before implementation (TDD)"
    - "Implement feature with security in mind"
    - "Run full test suite before commit"
    - "Update documentation as needed"
    - "Request code review from team"
  
  testing_strategy:
    - "Unit tests for individual passes"
    - "Integration tests for full pipeline"
    - "Performance benchmarks for overhead"
    - "Security tests for vulnerability detection"
    - "Usability tests for dashboard"
  
  code_review_checklist:
    - "Security rules followed?"
    - "Tests included and passing?"
    - "Documentation updated?"
    - "Performance acceptable?"
    - "Error handling comprehensive?"
    - "Code style consistent?"
  
  deployment:
    - "Build all components"
    - "Run integration tests"
    - "Verify MCP server connectivity"
    - "Test RAG system queries"
    - "Check dashboard functionality"
    - "Deploy to demo environment"

# ============================================================================
# END OF .bobrules
# ============================================================================