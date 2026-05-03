# 🛡️ Obfusi-Bob - LLVM-Based Obfuscation Framework

**IBM Bob Dev Day Hackathon 2026**

---

## ⚠️ IMPORTANT: Current Implementation Status

### ✅ What's Working (Production Ready):
- **Authentication System** - Full JWT-based auth with bcrypt
- **User Interface** - Professional login and dashboard
- **API Server** - All 8 endpoints functional
- **File Upload** - Drag & drop .ll file support
- **Basic IR Parsing** - Function and instruction counting
- **Mock Obfuscation** - Simulated transformations for demo
- **Mock AI Recommendations** - Pre-defined suggestions

### ⚠️ What Needs Real Implementation:
- **Real LLVM Integration** - Currently uses mock data, needs actual LLVM opt integration
- **Actual Obfuscation Passes** - Needs C++ LLVM passes compiled as native modules
- **Full IR Parser** - Current parser is basic, needs complete LLVM IR grammar support
- **Terminal Emulator** - Needs xterm.js + WebSocket for real terminal
- **Dynamic Analysis** - All .ll files work for upload, but transformations are simulated

---

## 🚀 Quick Start

### Prerequisites
```bash
Node.js 20.x or higher
npm or yarn
```

### Installation & Run
```bash
# Install dependencies
npm install

# Start server
node api-server-standalone.js

# Open browser
http://localhost:3000

# Login
Username: demo
Password: demo123
```

---

## 📁 Clean Project Structure

```
obfusi-bob/
├── 📄 Core Application
│   ├── index.html                    # Login page
│   ├── dashboard.html                # Main dashboard
│   ├── api-server-standalone.js      # API server
│   └── .env                          # Configuration
│
├── 🔧 Backend
│   ├── integrations/
│   │   └── watsonx-ai.js            # IBM watsonx.ai integration
│   ├── utils/
│   │   ├── animations.js            # GSAP animations
│   │   ├── accessibility.js         # WCAG 2.1 AA
│   │   └── export.js                # Export functionality
│   └── database/
│       └── init.sql                 # Database schema
│
├── 🤖 MCP Server (TypeScript)
│   └── mcp-server/
│       ├── src/
│       │   ├── server.ts            # MCP core
│       │   ├── tools/               # 4 MCP tools
│       │   ├── types/               # TypeScript definitions
│       │   └── utils/               # Validation & execution
│       └── test-samples/            # Sample LLVM IR files
│
├── 📚 Documentation
│   ├── README.md                    # This file
│   ├── AGENTS.md                    # Development guidelines
│   └── bob_sessions/                # Development history
│
└── 🧪 Testing
    ├── test-page.html               # Connection tester
    ├── test-server.js               # Automated tests
    └── tests/api.test.js            # API tests
```

---

## 🎯 Features

### Current Features (Working)
1. **User Authentication**
   - JWT-based authentication
   - bcrypt password hashing
   - Session management
   - Remember me functionality

2. **File Management**
   - Upload .ll files (drag & drop)
   - Paste LLVM IR code directly
   - File validation
   - Size limits (100MB)

3. **Basic Analysis**
   - Function counting
   - Instruction counting
   - Basic block detection
   - Loop and conditional detection

4. **Mock Obfuscation**
   - Simulated transformations
   - Download results
   - Multiple technique selection

5. **Mock AI Recommendations**
   - Pre-defined suggestions
   - Confidence scores
   - Research paper references

### Features Needing Real Implementation

#### 1. Real LLVM Integration
**Current:** Mock data and simulated transformations
**Needed:** 
- Actual LLVM opt command execution
- Real IR validation with `opt -verify`
- Native LLVM bindings or child process execution
- Error handling for malformed IR

**Implementation Path:**
```javascript
// Example: Real LLVM execution
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

async function realLLVMAnalysis(irPath) {
    try {
        // Verify IR
        await execPromise(`opt -verify -S "${irPath}" -o /dev/null`);
        
        // Get function list
        const { stdout } = await execPromise(`opt -print-function-list "${irPath}"`);
        
        // Parse output
        return parseLLVMOutput(stdout);
    } catch (error) {
        throw new Error(`LLVM analysis failed: ${error.message}`);
    }
}
```

#### 2. Actual Obfuscation Passes
**Current:** Text manipulation, no real transformation
**Needed:**
- C++ LLVM passes (FunctionPass, ModulePass)
- Compilation as shared libraries (.so/.dll)
- Loading via opt -load
- Real control flow flattening
- Real bogus control flow insertion
- Real string encryption

**Implementation Path:**
```cpp
// Example: Real LLVM Pass (C++)
#include "llvm/Pass.h"
#include "llvm/IR/Function.h"

namespace {
  struct ControlFlowFlattening : public FunctionPass {
    static char ID;
    ControlFlowFlattening() : FunctionPass(ID) {}
    
    bool runOnFunction(Function &F) override {
      // Implement real control flow flattening
      // 1. Create dispatcher basic block
      // 2. Convert all blocks to switch cases
      // 3. Add state variable
      // 4. Redirect all branches through dispatcher
      return true;
    }
  };
}

char ControlFlowFlattening::ID = 0;
static RegisterPass<ControlFlowFlattening> X("flatten", "Control Flow Flattening");
```

#### 3. Full IR Parser
**Current:** Regex-based basic parsing
**Needed:**
- Complete LLVM IR grammar parser
- AST generation
- Type system support
- Metadata preservation
- Debug info handling

**Implementation Path:**
- Use LLVM's own IR parser via bindings
- Or implement full grammar parser with PEG.js
- Support all LLVM IR constructs

#### 4. Browser Terminal Emulator
**Current:** Static log display
**Needed:**
- xterm.js integration
- WebSocket backend
- Real command execution
- PTY (pseudo-terminal) support

**Implementation Path:**
```javascript
// Frontend: xterm.js
import { Terminal } from 'xterm';
const term = new Terminal();
term.open(document.getElementById('terminal'));

const ws = new WebSocket('ws://localhost:3001');
ws.onmessage = (event) => term.write(event.data);
term.onData((data) => ws.send(data));

// Backend: WebSocket + PTY
const pty = require('node-pty');
const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 3001 });
wss.on('connection', (ws) => {
    const shell = pty.spawn('bash', [], {
        name: 'xterm-color',
        cwd: process.cwd(),
        env: process.env
    });
    
    shell.on('data', (data) => ws.send(data));
    ws.on('message', (msg) => shell.write(msg));
});
```

---

## 🔧 API Endpoints

| Endpoint | Method | Description | Status |
|----------|--------|-------------|--------|
| `/health` | GET | Server health | ✅ Working |
| `/api/auth/login` | POST | Authentication | ✅ Working |
| `/api/auth/register` | POST | Registration | ✅ Working |
| `/api/analyze` | POST | IR analysis | ⚠️ Mock data |
| `/api/obfuscate` | POST | Obfuscation | ⚠️ Mock transformation |
| `/api/recommendations` | POST | AI suggestions | ⚠️ Pre-defined |
| `/api/profile` | GET | User profile | ✅ Working |
| `/api/stats` | GET | Statistics | ✅ Working |

---

## 🛠️ Development Roadmap

### Phase 1: Core LLVM Integration (2-3 weeks)
- [ ] Install and configure LLVM 18+
- [ ] Implement real opt command execution
- [ ] Add IR validation
- [ ] Parse LLVM output
- [ ] Handle errors properly

### Phase 2: Obfuscation Passes (3-4 weeks)
- [ ] Write C++ LLVM passes
- [ ] Implement control flow flattening
- [ ] Implement bogus control flow
- [ ] Implement string encryption
- [ ] Compile and test passes
- [ ] Integrate with Node.js backend

### Phase 3: Advanced Features (2-3 weeks)
- [ ] Full IR parser
- [ ] Terminal emulator (xterm.js)
- [ ] Real-time progress updates
- [ ] Advanced metrics
- [ ] Performance profiling

### Phase 4: AI Integration (2-3 weeks)
- [ ] Real watsonx.ai API integration
- [ ] RAG system with vector database
- [ ] Dynamic recommendation engine
- [ ] Learning from user feedback

### Phase 5: Production Hardening (1-2 weeks)
- [ ] Comprehensive testing
- [ ] Security audit
- [ ] Performance optimization
- [ ] Documentation
- [ ] Deployment scripts

**Total Estimated Time: 10-15 weeks for full production system**

---

## 🔒 Security

### Implemented
- ✅ JWT authentication
- ✅ bcrypt password hashing (10 rounds)
- ✅ Rate limiting (100 req/15min)
- ✅ CORS configuration
- ✅ Input validation
- ✅ Path traversal prevention
- ✅ File size limits
- ✅ Session management

### Needed for Production
- [ ] HTTPS/TLS
- [ ] API key management
- [ ] Role-based access control
- [ ] Audit logging
- [ ] Intrusion detection
- [ ] DDoS protection

---

## 📊 Current Limitations

1. **Mock Obfuscation** - Transformations are simulated, not real LLVM passes
2. **Limited IR Support** - Parser handles basic constructs only
3. **No Real Terminal** - Terminal display is static, not interactive
4. **Pre-defined Recommendations** - AI suggestions are hardcoded
5. **Single File Processing** - No batch processing
6. **No Persistence** - In-memory storage only (no database)

---

## 🎓 For IBM Bob Dev Day Hackathon

### What to Demonstrate
1. **Working UI** - Professional login and dashboard
2. **File Upload** - Drag & drop .ll files
3. **Basic Analysis** - Show function/instruction counts
4. **Mock Obfuscation** - Demonstrate the concept
5. **Architecture** - Explain MCP integration and RAG strategy

### What to Explain
- This is a **proof of concept** demonstrating the architecture
- Real LLVM integration requires native C++ passes
- Full implementation needs 10-15 weeks
- Current system shows the **vision and potential**

---

## 📞 Support & Development

### Current Status
- ✅ Authentication: Production ready
- ✅ UI/UX: Production ready
- ⚠️ LLVM Integration: Proof of concept
- ⚠️ Obfuscation: Simulated
- ⚠️ Terminal: Static display

### To Make Production Ready
1. Implement real LLVM integration
2. Write actual obfuscation passes in C++
3. Add terminal emulator
4. Integrate real watsonx.ai API
5. Add comprehensive testing
6. Deploy with proper infrastructure

---

## 📄 License

MIT License - See LICENSE file

---

## 👥 Team

IBM Bob Dev Day Hackathon 2026

---

**Built with ❤️ for IBM Bob Dev Day Hackathon 2026**  
*Powered by watsonx.ai* ✨

---

## 🎯 Bottom Line

This is a **high-quality proof of concept** with:
- ✅ Production-ready authentication and UI
- ✅ Clean, professional codebase
- ✅ Solid architecture and design
- ⚠️ Mock obfuscation (needs real LLVM passes)
- ⚠️ Simulated AI (needs real watsonx.ai integration)

**For a complete production system, budget 10-15 weeks for full LLVM integration and real obfuscation passes.**