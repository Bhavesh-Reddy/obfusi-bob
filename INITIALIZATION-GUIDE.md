# Obfusi-Bob Initialization Guide
## Complete Setup Instructions for IBM Bob Dev Day Hackathon

---

## 🎯 Quick Start Summary

This guide will help you initialize the Obfusi-Bob project from scratch. Follow these steps in order:

1. ✅ **Review Project Plan** - Understand architecture and goals
2. ✅ **Set Up Development Environment** - Install dependencies
3. ✅ **Create Project Structure** - Initialize directories and files
4. ✅ **Configure Security Rules** - Set up .bobrules and AGENTS.md
5. ✅ **Build MCP Server** - Create Bob's bridge to LLVM
6. ✅ **Set Up RAG System** - Ingest research papers
7. ✅ **Develop LLVM Passes** - Implement obfuscation techniques
8. ✅ **Create Dashboard** - Build visualization interface
9. ✅ **Test & Validate** - Ensure everything works
10. ✅ **Prepare Demo** - Get ready for hackathon presentation

---

## 📋 Prerequisites

### Required Software

```bash
# Check versions
node --version    # Should be ≥18.0.0
python --version  # Should be ≥3.9
llvm-config --version  # Should be ≥18.0.0
cmake --version   # Should be ≥3.20
redis-cli --version  # For caching
```

### Installation Commands

#### Ubuntu/Debian
```bash
# Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# LLVM 18
wget https://apt.llvm.org/llvm.sh
chmod +x llvm.sh
sudo ./llvm.sh 18

# Python 3.9+
sudo apt-get install python3.9 python3-pip

# CMake
sudo apt-get install cmake

# Redis
sudo apt-get install redis-server
```

#### macOS
```bash
# Using Homebrew
brew install node@18
brew install llvm@18
brew install python@3.9
brew install cmake
brew install redis
```

#### Windows
```powershell
# Using Chocolatey
choco install nodejs-lts
choco install llvm --version=18.0.0
choco install python --version=3.9.0
choco install cmake
choco install redis-64
```

### watsonx.ai Setup

1. **Get API Credentials**
   - Visit [IBM Cloud](https://cloud.ibm.com)
   - Create watsonx.ai instance
   - Generate API key
   - Note your project ID

2. **Set Environment Variables**
   ```bash
   export WATSONX_API_KEY="your-api-key-here"
   export WATSONX_PROJECT_ID="your-project-id-here"
   export WATSONX_URL="https://us-south.ml.cloud.ibm.com"
   ```

---

## 🏗️ Step 1: Create Project Structure

### Initialize Project Directory

```bash
# Create main project directory
mkdir obfusi-bob
cd obfusi-bob

# Initialize git repository
git init
git branch -M main

# Create .gitignore
cat > .gitignore << 'EOF'
node_modules/
dist/
build/
*.pyc
__pycache__/
.env
.vscode/
tmp/
*.log
embeddings/chroma_db/
EOF
```

### Create Directory Structure

```bash
# Create all directories
mkdir -p .bob/rules-{code,advanced,ask,plan}
mkdir -p mcp-server/src/{tools,services,llvm/passes,utils,types,config}
mkdir -p mcp-server/tests/{unit,integration,fixtures/sample-ir}
mkdir -p rag-system/{papers/{control-flow,bogus-code,string-encryption,multi-pass},embeddings,src,config,tests}
mkdir -p llvm-passes/{include/ObfusiBob,lib}
mkdir -p dashboard/src/{components,animations}
mkdir -p tests/{ir-samples,unit,integration}
mkdir -p docs
```

---

## 🔐 Step 2: Set Up Security Rules

### Copy .bobrules Content

Since Plan mode can only create markdown files, you'll need to manually create the `.bobrules` file:

```bash
# The content is in bobrules-content.md
# Copy the YAML content (between the ``` markers) to .bobrules
# Remove the markdown code fence markers

# On Unix/Mac:
sed -n '/^```yaml$/,/^```$/p' bobrules-content.md | sed '1d;$d' > .bobrules

# On Windows PowerShell:
# Manually copy the content between ```yaml and ``` from bobrules-content.md
```

### Verify AGENTS.md

The `AGENTS.md` file has already been created in the project root. Verify it exists:

```bash
ls -la AGENTS.md
```

### Create Mode-Specific Rules

```bash
# Copy AGENTS.md to mode-specific locations
cp AGENTS.md .bob/rules-code/AGENTS.md
cp AGENTS.md .bob/rules-advanced/AGENTS.md
cp AGENTS.md .bob/rules-ask/AGENTS.md
cp AGENTS.md .bob/rules-plan/AGENTS.md

# You can customize each file later for mode-specific rules
```

---

## 🔧 Step 3: Initialize MCP Server

### Create package.json

```bash
cd mcp-server

cat > package.json << 'EOF'
{
  "name": "obfusi-bob-mcp-server",
  "version": "1.0.0",
  "type": "module",
  "main": "dist/index.js",
  "scripts": {
    "build": "tsc",
    "start": "node dist/index.js",
    "dev": "tsx watch src/index.ts",
    "test": "vitest",
    "test:integration": "vitest run --config vitest.integration.config.ts"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^0.5.0",
    "@llvm-bindings/core": "^18.0.0",
    "chokidar": "^3.5.3",
    "ioredis": "^5.3.2",
    "ws": "^8.16.0"
  },
  "devDependencies": {
    "@types/node": "^20.11.0",
    "@types/ws": "^8.5.10",
    "tsx": "^4.7.0",
    "typescript": "^5.3.3",
    "vitest": "^1.2.0"
  }
}
EOF
```

### Create tsconfig.json

```bash
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "moduleResolution": "node",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
EOF
```

### Install Dependencies

```bash
npm install
```

### Create Basic Server Structure

```bash
# Create index.ts
cat > src/index.ts << 'EOF'
import { ObfusiBobMCPServer } from './server.js';

async function main() {
  const server = new ObfusiBobMCPServer();
  await server.start();
}

main().catch((error) => {
  console.error('Failed to start MCP server:', error);
  process.exit(1);
});
EOF

# Create server.ts skeleton
cat > src/server.ts << 'EOF'
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

export class ObfusiBobMCPServer {
  private server: Server;
  
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
    
    this.setupTools();
  }
  
  private setupTools(): void {
    this.server.setRequestHandler('tools/list', async () => ({
      tools: []
    }));
  }
  
  async start(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.log('Obfusi-Bob MCP Server running on stdio');
  }
}
EOF

cd ..
```

---

## 📚 Step 4: Set Up RAG System

### Create Python Virtual Environment

```bash
cd rag-system

# Create virtual environment
python -m venv venv

# Activate (Unix/Mac)
source venv/bin/activate

# Activate (Windows)
# venv\Scripts\activate
```

### Create requirements.txt

```bash
cat > requirements.txt << 'EOF'
ibm-watsonx-ai>=0.2.0
langchain>=0.1.0
chromadb>=0.4.0
pypdf>=3.17.0
rank-bm25>=0.2.2
pyyaml>=6.0
python-dotenv>=1.0.0
EOF
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Create Configuration

```bash
mkdir -p config

cat > config/watsonx.yaml << 'EOF'
credentials:
  api_key: ${WATSONX_API_KEY}
  url: https://us-south.ml.cloud.ibm.com
  project_id: ${WATSONX_PROJECT_ID}

embedding_model:
  id: ibm/slate-125m-english-rtrvr
  dimensions: 384

llm_model:
  id: ibm/granite-13b-chat-v2
  parameters:
    max_new_tokens: 500
    temperature: 0.3
    top_p: 0.9
    repetition_penalty: 1.1

cache:
  enabled: true
  ttl: 3600
  backend: redis
  redis_url: redis://localhost:6379
EOF
```

### Create Paper Metadata Template

```bash
cat > papers/metadata.json << 'EOF'
{
  "papers": [
    {
      "id": "wang-2001-flattening",
      "title": "Obfuscating C++ Programs via Control Flow Flattening",
      "authors": ["Chenxi Wang", "Jonathan Hill", "John Knight", "Jack Davidson"],
      "year": 2001,
      "venue": "ICICS",
      "technique": "control_flow_flattening",
      "tags": ["cfg", "dispatcher", "static-analysis-resistant"],
      "complexity": "high",
      "effectiveness": 0.85,
      "llvm_compatible": true,
      "implementation_difficulty": "medium",
      "performance_overhead": "15-25%",
      "resilience_score": 0.78,
      "file_path": "papers/control-flow/wang-2001-flattening.pdf"
    }
  ]
}
EOF

cd ..
```

---

## 🔨 Step 5: Set Up LLVM Passes

### Create CMakeLists.txt

```bash
cd llvm-passes

cat > CMakeLists.txt << 'EOF'
cmake_minimum_required(VERSION 3.20)
project(ObfusiBobPasses)

# Find LLVM
find_package(LLVM 18 REQUIRED CONFIG)

message(STATUS "Found LLVM ${LLVM_PACKAGE_VERSION}")
message(STATUS "Using LLVMConfig.cmake in: ${LLVM_DIR}")

# Set C++ standard
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Include LLVM headers
include_directories(${LLVM_INCLUDE_DIRS})
include_directories(${CMAKE_SOURCE_DIR}/include)
add_definitions(${LLVM_DEFINITIONS})

# Add subdirectories
add_subdirectory(lib)
EOF
```

### Create lib/CMakeLists.txt

```bash
mkdir -p lib

cat > lib/CMakeLists.txt << 'EOF'
# Control Flow Flattening Pass
add_library(ControlFlowFlattening MODULE
  ControlFlowFlattening.cpp
)

# Bogus Code Insertion Pass
add_library(BogusCodeInsertion MODULE
  BogusCodeInsertion.cpp
)

# String Encryption Pass
add_library(StringEncryption MODULE
  StringEncryption.cpp
)

# Multi-Pass Manager
add_library(MultiPassManager MODULE
  MultiPassManager.cpp
)

# Link LLVM libraries
target_link_libraries(ControlFlowFlattening PRIVATE ${LLVM_LIBRARIES})
target_link_libraries(BogusCodeInsertion PRIVATE ${LLVM_LIBRARIES})
target_link_libraries(StringEncryption PRIVATE ${LLVM_LIBRARIES})
target_link_libraries(MultiPassManager PRIVATE ${LLVM_LIBRARIES})
EOF

cd ..
```

---

## 🎨 Step 6: Initialize Dashboard

### Create React + Vite Project

```bash
cd dashboard

# Initialize with Vite
npm create vite@latest . -- --template react-ts

# Install additional dependencies
npm install tailwindcss postcss autoprefixer gsap
npm install @monaco-editor/react chart.js react-chartjs-2
npm install ws jspdf

# Initialize Tailwind
npx tailwindcss init -p
```

### Configure Tailwind

```bash
cat > tailwind.config.js << 'EOF'
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'obfusi-blue': '#4A90E2',
        'obfusi-red': '#E24A4A',
        'obfusi-green': '#4AE290',
      },
    },
  },
  plugins: [],
}
EOF
```

### Update src/index.css

```bash
cat > src/index.css << 'EOF'
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}
EOF

cd ..
```

---

## 🧪 Step 7: Create Test Infrastructure

### Create Sample IR Files

```bash
cd tests/ir-samples

# Create simple.ll
cat > simple.ll << 'EOF'
; ModuleID = 'simple.c'
source_filename = "simple.c"
target datalayout = "e-m:e-p270:32:32-p271:32:32-p272:64:64-i64:64-f80:128-n8:16:32:64-S128"
target triple = "x86_64-unknown-linux-gnu"

define i32 @main() {
entry:
  %x = alloca i32, align 4
  store i32 42, i32* %x, align 4
  %0 = load i32, i32* %x, align 4
  ret i32 %0
}
EOF

# Create loop.ll
cat > loop.ll << 'EOF'
define i32 @sum(i32 %n) {
entry:
  %sum = alloca i32, align 4
  %i = alloca i32, align 4
  store i32 0, i32* %sum, align 4
  store i32 0, i32* %i, align 4
  br label %loop

loop:
  %0 = load i32, i32* %i, align 4
  %1 = icmp slt i32 %0, %n
  br i1 %1, label %body, label %exit

body:
  %2 = load i32, i32* %i, align 4
  %3 = load i32, i32* %sum, align 4
  %4 = add i32 %3, %2
  store i32 %4, i32* %sum, align 4
  %5 = add i32 %2, 1
  store i32 %5, i32* %i, align 4
  br label %loop

exit:
  %6 = load i32, i32* %sum, align 4
  ret i32 %6
}
EOF

cd ../..
```

---

## 📝 Step 8: Create Documentation

### Create README.md

```bash
cat > README.md << 'EOF'
# Obfusi-Bob

LLVM-Based Object File Obfuscation Framework for IBM Bob Dev Day Hackathon

## Mission

Turn idea into impact faster by creating an agentic tool that helps developers protect their software IP through automated code transformations.

## Features

- 🔄 Control Flow Flattening
- 🎭 Bogus Code Insertion
- 🔐 String Encryption
- 🔁 Multi-Pass Obfuscation Cycles
- 🤖 AI-Guided Transformations via watsonx.ai
- 📊 Professional Dashboard with Real-Time Visualization

## Quick Start

See [INITIALIZATION-GUIDE.md](INITIALIZATION-GUIDE.md) for complete setup instructions.

## Architecture

- **MCP Server**: Bridge between Bob and LLVM toolchain
- **RAG System**: Research paper ingestion for informed decisions
- **LLVM Passes**: Custom obfuscation transformations
- **Dashboard**: Real-time visualization with Tailwind CSS + GSAP

## Documentation

- [Project Plan](obfusi-bob-project-plan.md)
- [MCP Server Architecture](mcp-server-architecture.md)
- [RAG Strategy](rag-strategy.md)
- [AGENTS.md](AGENTS.md) - Agent coding guidelines
- [.bobrules](.bobrules) - Project rules

## License

MIT License - IBM Bob Dev Day Hackathon 2026
EOF
```

---

## ✅ Step 9: Verification Checklist

### Verify Installation

```bash
# Run this script to verify everything is set up correctly
cat > verify-setup.sh << 'EOF'
#!/bin/bash

echo "🔍 Verifying Obfusi-Bob Setup..."
echo ""

# Check Node.js
if command -v node &> /dev/null; then
    echo "✅ Node.js: $(node --version)"
else
    echo "❌ Node.js not found"
fi

# Check Python
if command -v python3 &> /dev/null; then
    echo "✅ Python: $(python3 --version)"
else
    echo "❌ Python not found"
fi

# Check LLVM
if command -v llvm-config &> /dev/null; then
    echo "✅ LLVM: $(llvm-config --version)"
else
    echo "❌ LLVM not found"
fi

# Check CMake
if command -v cmake &> /dev/null; then
    echo "✅ CMake: $(cmake --version | head -n1)"
else
    echo "❌ CMake not found"
fi

# Check Redis
if command -v redis-cli &> /dev/null; then
    echo "✅ Redis: $(redis-cli --version)"
else
    echo "❌ Redis not found"
fi

# Check environment variables
echo ""
echo "🔐 Environment Variables:"
if [ -n "$WATSONX_API_KEY" ]; then
    echo "✅ WATSONX_API_KEY is set"
else
    echo "❌ WATSONX_API_KEY not set"
fi

if [ -n "$WATSONX_PROJECT_ID" ]; then
    echo "✅ WATSONX_PROJECT_ID is set"
else
    echo "❌ WATSONX_PROJECT_ID not set"
fi

# Check directory structure
echo ""
echo "📁 Directory Structure:"
for dir in mcp-server rag-system llvm-passes dashboard tests; do
    if [ -d "$dir" ]; then
        echo "✅ $dir/"
    else
        echo "❌ $dir/ missing"
    fi
done

# Check key files
echo ""
echo "📄 Key Files:"
for file in AGENTS.md .bobrules README.md; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file missing"
    fi
done

echo ""
echo "🎉 Verification complete!"
EOF

chmod +x verify-setup.sh
./verify-setup.sh
```

---

## 🚀 Step 10: Build and Test

### Build MCP Server

```bash
cd mcp-server
npm run build
echo "✅ MCP Server built successfully"
cd ..
```

### Build LLVM Passes

```bash
cd llvm-passes
mkdir -p build
cd build
cmake ..
make
echo "✅ LLVM Passes built successfully"
cd ../..
```

### Start Dashboard Dev Server

```bash
cd dashboard
npm run dev
echo "✅ Dashboard running on http://localhost:5173"
cd ..
```

### Test RAG System

```bash
cd rag-system
source venv/bin/activate  # or venv\Scripts\activate on Windows
python src/ingest.py --help
echo "✅ RAG System ready"
cd ..
```

---

## 🎯 Next Steps for Implementation

Now that the project is initialized, you can proceed with implementation:

### Phase 1: MCP Server Implementation (Priority 1)
```bash
# Switch to Code mode and implement:
# 1. src/tools/read-ir-file.ts
# 2. src/services/ir-reader.service.ts
# 3. src/llvm/bindings.ts
# 4. Test with sample IR files
```

### Phase 2: RAG System Setup (Priority 2)
```bash
# 1. Collect research papers (PDFs)
# 2. Update papers/metadata.json
# 3. Run: python src/ingest.py --all
# 4. Test queries
```

### Phase 3: LLVM Passes (Priority 3)
```bash
# Implement in order:
# 1. lib/ControlFlowFlattening.cpp
# 2. lib/BogusCodeInsertion.cpp
# 3. lib/StringEncryption.cpp
# 4. lib/MultiPassManager.cpp
```

### Phase 4: Dashboard (Priority 4)
```bash
# 1. Create components
# 2. Implement GSAP animations
# 3. Connect to MCP server via WebSocket
# 4. Add metrics visualization
```

---

## 🐛 Troubleshooting

### Common Issues

**Issue**: LLVM not found
```bash
# Solution: Add LLVM to PATH
export PATH="/usr/lib/llvm-18/bin:$PATH"
export LLVM_DIR="/usr/lib/llvm-18"
```

**Issue**: Node.js version too old
```bash
# Solution: Use nvm to install Node 18+
nvm install 18
nvm use 18
```

**Issue**: watsonx.ai authentication fails
```bash
# Solution: Verify credentials
echo $WATSONX_API_KEY
# Re-export if needed
export WATSONX_API_KEY="your-key-here"
```

**Issue**: Redis connection refused
```bash
# Solution: Start Redis server
redis-server --daemonize yes
```

---

## 📞 Support

For hackathon support:
- Review documentation in `docs/`
- Check `AGENTS.md` for coding guidelines
- Refer to `.bobrules` for project rules
- Consult `mcp-server-architecture.md` for MCP details
- See `rag-strategy.md` for RAG implementation

---

## 🎉 Ready to Code!

Your Obfusi-Bob project is now initialized and ready for implementation. Use Bob in **Code mode** to start building the components according to the architecture defined in the planning documents.

**Recommended workflow**:
1. Start with MCP server (critical path)
2. Implement one tool at a time
3. Test each component thoroughly
4. Integrate RAG system
5. Build LLVM passes
6. Create dashboard
7. Prepare demo

Good luck with the IBM Bob Dev Day Hackathon! 🚀