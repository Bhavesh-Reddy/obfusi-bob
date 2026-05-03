# 🚀 Obfusi-Bob - Quick Start Guide

## ✅ Current Status: FULLY FUNCTIONAL

Your Obfusi-Bob application is **ready to use**! All components are connected and working.

---

## 📁 Project Structure (Consolidated)

```
obfusi-bob/
├── index.html                    # ✅ LOGIN PAGE (Start here!)
├── dashboard.html                # ✅ MAIN DASHBOARD (Functional)
├── api-server-standalone.js      # ✅ API SERVER (Running on port 3000)
├── package.json                  # Dependencies
├── .env                          # Configuration
│
├── utils/                        # Utility modules
│   ├── animations.js            # GSAP animations
│   ├── accessibility.js         # WCAG 2.1 compliance
│   └── export.js                # Export functionality
│
├── integrations/
│   └── watsonx-ai.js            # IBM watsonx.ai integration
│
├── mcp-server/                   # MCP Server (TypeScript)
│   ├── src/
│   │   ├── server.ts
│   │   └── tools/
│   └── package.json
│
├── test-samples/                 # Sample LLVM IR files
├── database/                     # Database schemas
└── tests/                        # Test suites
```

---

## 🎯 How to Use (3 Simple Steps)

### Step 1: Server is Already Running ✅
The API server is running on `http://localhost:3000`

### Step 2: Open the Application
Open your browser and go to:
```
http://localhost:3000/index.html
```

### Step 3: Login
Use these demo credentials:
- **Username:** `demo`
- **Password:** `demo123`

---

## 🎨 Features Available

### 1. **Analyze Code** 📊
- Upload `.ll` files (drag & drop)
- Paste LLVM IR code directly
- Get detailed analysis:
  - Function count
  - Instruction count
  - Complexity metrics
  - Loop detection

### 2. **Obfuscate** 🔒
- Apply obfuscation techniques:
  - ✅ Control Flow Flattening
  - ✅ Bogus Control Flow
  - ✅ String Encryption
- Download obfuscated code

### 3. **AI Recommendations** 💡
- Get AI-powered suggestions
- Confidence scores
- Effectiveness metrics
- Performance overhead analysis

### 4. **History** 📜
- Track all operations
- View past analyses
- Review obfuscation results

---

## 🔧 API Endpoints (All Working)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Server health check |
| `/api/auth/login` | POST | User authentication |
| `/api/analyze` | POST | Analyze LLVM IR code |
| `/api/obfuscate` | POST | Apply obfuscation |
| `/api/recommendations` | POST | Get AI recommendations |
| `/api/profile` | GET | User profile |
| `/api/stats` | GET | Usage statistics |

---

## 📝 Sample LLVM IR Code

Try this sample code in the Analyze page:

```llvm
define i32 @factorial(i32 %n) {
entry:
  %cmp = icmp sle i32 %n, 1
  br i1 %cmp, label %base, label %recursive

base:
  ret i32 1

recursive:
  %n_minus_1 = sub i32 %n, 1
  %result = call i32 @factorial(i32 %n_minus_1)
  %final = mul i32 %n, %result
  ret i32 %final
}

define i32 @main() {
  %result = call i32 @factorial(i32 5)
  ret i32 %result
}
```

---

## 🐛 Troubleshooting

### Issue: Login not working
**Solution:** 
1. Check if server is running (you should see "Server running on port 3000")
2. Open browser console (F12) to see any errors
3. Make sure you're using: username=`demo`, password=`demo123`

### Issue: Can't upload files
**Solution:**
1. Make sure file has `.ll` extension
2. Try pasting code directly instead
3. Check browser console for errors

### Issue: API calls failing
**Solution:**
1. Verify server is running on port 3000
2. Check browser console for CORS errors
3. Make sure you're logged in (token in sessionStorage)

---

## 📊 File Organization

### ✅ Active Files (Use These)
- `index.html` - Login page
- `dashboard.html` - Main dashboard
- `api-server-standalone.js` - API server

### 📦 Legacy Files (Can be ignored)
- `login.html` - Old login (replaced by index.html)
- `login-functional.html` - Old functional login (replaced by index.html)
- `dashboard-functional.html` - Old dashboard (replaced by dashboard.html)
- `api-server.js` - Old API server (replaced by api-server-standalone.js)

---

## 🎓 For Hackathon Demo

### Demo Flow:
1. **Start:** Show login page with beautiful gradient design
2. **Login:** Use demo credentials
3. **Analyze:** Upload sample LLVM IR file
4. **Show Results:** Display analysis metrics
5. **Obfuscate:** Apply techniques and show transformed code
6. **Download:** Download obfuscated file
7. **AI Recommendations:** Show AI-powered suggestions

### Key Talking Points:
- ✅ Agentic AI via watsonx Orchestrate
- ✅ RAG via watsonx.ai for intelligent recommendations
- ✅ MCP integration for LLVM toolchain
- ✅ Real-time code analysis
- ✅ Multiple obfuscation techniques
- ✅ Professional UI/UX with GSAP animations
- ✅ WCAG 2.1 AA accessibility compliance

---

## 🔐 Security Features

- JWT-based authentication
- bcrypt password hashing
- Rate limiting (100 req/15min)
- CORS enabled
- Session management
- Token expiration

---

## 📞 Need Help?

1. Check browser console (F12) for errors
2. Check server terminal for API logs
3. Review QUICK-START.md for detailed usage
4. Check PROJECT-COMPLETE.md for architecture details

---

## 🎉 You're All Set!

Everything is connected and working. Just open:
```
http://localhost:3000/index.html
```

And start using Obfusi-Bob! 🛡️

---

**IBM Bob Dev Day Hackathon 2026**  
*Powered by watsonx.ai*