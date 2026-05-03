# 📁 Obfusi-Bob File Structure Guide

## 🎯 Files You Should Use

### **Core Application Files** ✅

| File | Purpose | Status |
|------|---------|--------|
| [`index.html`](./index.html) | **LOGIN PAGE** - Entry point for the application | ✅ USE THIS |
| [`dashboard.html`](./dashboard.html) | **MAIN DASHBOARD** - All features (analyze, obfuscate, recommendations, history) | ✅ USE THIS |
| [`api-server-standalone.js`](./api-server-standalone.js) | **API SERVER** - Backend with all endpoints | ✅ USE THIS |

### **Configuration Files** ⚙️

| File | Purpose |
|------|---------|
| [`package.json`](./package.json) | Node.js dependencies and scripts |
| [`.env`](./.env) | Environment variables (JWT secret, ports, etc.) |

### **Utility Modules** 🛠️

| File | Purpose |
|------|---------|
| [`utils/animations.js`](./utils/animations.js) | GSAP animation system |
| [`utils/accessibility.js`](./utils/accessibility.js) | WCAG 2.1 AA compliance utilities |
| [`utils/export.js`](./utils/export.js) | Export functionality (CSV, JSON, HTML, MD) |

### **Integration Modules** 🔌

| File | Purpose |
|------|---------|
| [`integrations/watsonx-ai.js`](./integrations/watsonx-ai.js) | IBM watsonx.ai integration for AI recommendations |

### **Documentation** 📚

| File | Purpose |
|------|---------|
| [`START-HERE.md`](./START-HERE.md) | **Quick start guide** - Read this first! |
| [`QUICK-START.md`](./QUICK-START.md) | Detailed usage instructions |
| [`PROJECT-COMPLETE.md`](./PROJECT-COMPLETE.md) | Complete project overview |
| [`DEPLOYMENT.md`](./DEPLOYMENT.md) | Production deployment guide |
| [`README.md`](./README.md) | Project introduction |

---

## 🗑️ Legacy Files (Can Be Ignored)

These files are older versions that have been replaced. You can safely ignore them:

| File | Replaced By | Reason |
|------|-------------|--------|
| `login.html` | `index.html` | Old non-functional login |
| `login-functional.html` | `index.html` | Duplicate functional login |
| `dashboard-functional.html` | `dashboard.html` | Duplicate functional dashboard |
| `api-server.js` | `api-server-standalone.js` | Old API server with MCP dependencies |

---

## 📂 Directory Structure

```
obfusi-bob/
│
├── 🌐 FRONTEND (HTML Pages)
│   ├── index.html                    ✅ Login page (USE THIS)
│   ├── dashboard.html                ✅ Main dashboard (USE THIS)
│   ├── onboarding.html               ℹ️ Onboarding flow
│   ├── login.html                    ❌ Legacy (ignore)
│   └── login-functional.html         ❌ Legacy (ignore)
│
├── 🔧 BACKEND (API Server)
│   ├── api-server-standalone.js      ✅ Main API server (USE THIS)
│   └── api-server.js                 ❌ Legacy (ignore)
│
├── 🛠️ UTILITIES
│   └── utils/
│       ├── animations.js             ✅ GSAP animations
│       ├── accessibility.js          ✅ WCAG compliance
│       └── export.js                 ✅ Export features
│
├── 🔌 INTEGRATIONS
│   └── integrations/
│       └── watsonx-ai.js             ✅ AI integration
│
├── 🎯 MCP SERVER (TypeScript)
│   └── mcp-server/
│       ├── src/
│       │   ├── server.ts             MCP protocol server
│       │   └── tools/                LLVM tools
│       ├── package.json
│       └── tsconfig.json
│
├── 🗄️ DATABASE
│   └── database/
│       └── init.sql                  PostgreSQL schema
│
├── 🧪 TESTS
│   └── tests/
│       └── api.test.js               API test suite
│
├── 📦 DEPLOYMENT
│   ├── Dockerfile                    Docker configuration
│   ├── docker-compose.yml            Multi-container setup
│   └── .github/workflows/
│       └── ci-cd.yml                 CI/CD pipeline
│
├── 📝 DOCUMENTATION
│   ├── START-HERE.md                 ✅ Quick start (READ THIS FIRST!)
│   ├── QUICK-START.md                Detailed usage guide
│   ├── PROJECT-COMPLETE.md           Complete overview
│   ├── DEPLOYMENT.md                 Deployment guide
│   ├── README.md                     Project intro
│   ├── AGENTS.md                     AI agent rules
│   ├── FILE-STRUCTURE.md             This file
│   └── Various planning docs         Architecture & strategy
│
└── ⚙️ CONFIGURATION
    ├── package.json                  Dependencies
    ├── .env                          Environment variables
    └── .bobrules                     Project rules
```

---

## 🚀 Quick Access URLs

When server is running on `http://localhost:3000`:

| Page | URL | Purpose |
|------|-----|---------|
| **Login** | `http://localhost:3000/index.html` | Start here |
| **Dashboard** | `http://localhost:3000/dashboard.html` | Main app (after login) |
| **Health Check** | `http://localhost:3000/health` | Server status |
| **API Docs** | See QUICK-START.md | API endpoints |

---

## 🔄 Application Flow

```
1. User opens: index.html
   ↓
2. Enters credentials (demo/demo123)
   ↓
3. API call to: /api/auth/login
   ↓
4. Receives JWT token
   ↓
5. Redirects to: dashboard.html
   ↓
6. Dashboard loads with 4 pages:
   - Analyze Code
   - Obfuscate
   - AI Recommendations
   - History
```

---

## 📊 File Dependencies

### index.html depends on:
- Tailwind CSS (CDN)
- GSAP (CDN)
- api-server-standalone.js (running)

### dashboard.html depends on:
- Tailwind CSS (CDN)
- GSAP (CDN)
- api-server-standalone.js (running)
- JWT token (from sessionStorage)

### api-server-standalone.js depends on:
- express
- cors
- bcryptjs
- jsonwebtoken
- express-rate-limit

---

## 🎨 Styling & Assets

All styling is done via:
- **Tailwind CSS** (CDN) - Utility-first CSS
- **Custom CSS** (inline in HTML) - Animations, gradients, effects
- **GSAP** (CDN) - Professional animations

No separate CSS files needed!

---

## 🔐 Authentication Flow

```
Login (index.html)
  ↓
POST /api/auth/login
  ↓
Receive JWT token
  ↓
Store in sessionStorage
  ↓
Dashboard (dashboard.html)
  ↓
All API calls include:
Authorization: Bearer <token>
```

---

## 📝 Key Points

1. **Start with:** `index.html` (login page)
2. **Main app:** `dashboard.html` (after login)
3. **Backend:** `api-server-standalone.js` (must be running)
4. **Ignore:** All files marked with ❌ in this guide
5. **Documentation:** Start with `START-HERE.md`

---

## 🎯 For Development

### To modify login page:
Edit: `index.html`

### To modify dashboard:
Edit: `dashboard.html`

### To modify API:
Edit: `api-server-standalone.js`

### To add animations:
Edit: `utils/animations.js`

### To add AI features:
Edit: `integrations/watsonx-ai.js`

---

## 🐛 Debugging

### Check these files for logs:
1. Browser Console (F12) - Frontend errors
2. Terminal running `api-server-standalone.js` - Backend logs
3. Network tab (F12) - API calls

### Common issues:
- **Login fails:** Check server is running
- **API errors:** Check Authorization header
- **File upload fails:** Check file extension (.ll)

---

## ✅ Checklist for Hackathon

- [ ] Server running: `node api-server-standalone.js`
- [ ] Can access: `http://localhost:3000/index.html`
- [ ] Can login with: demo/demo123
- [ ] Dashboard loads successfully
- [ ] Can upload/analyze files
- [ ] Can apply obfuscation
- [ ] Can download results
- [ ] AI recommendations work

---

**Last Updated:** 2026-05-03  
**Version:** 1.0.0  
**Status:** Production Ready ✅