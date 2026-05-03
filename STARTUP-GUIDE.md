# 🚀 Obfusi-Bob Startup Guide

## Quick Start (3 Steps)

### Step 1: Start the Server

Open a terminal in the project directory and run:

```bash
node api-server-standalone.js
```

You should see:
```
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🛡️  Obfusi-Bob API Server (Standalone Mode)           ║
║                                                           ║
║   Status: ✅ Running                                     ║
║   Port: 3000                                              ║
║   Mode: Standalone (No Database Required)                ║
║                                                           ║
║   📍 Endpoints:                                          ║
║   • Dashboard: http://localhost:3000/dashboard           ║
║   • Login: http://localhost:3000/                        ║
║   • API: http://localhost:3000/api                       ║
║   • Health: http://localhost:3000/health                 ║
║                                                           ║
║   👤 Demo Credentials:                                   ║
║   • Username: demo                                        ║
║   • Password: demo123                                     ║
║                                                           ║
║   🚀 Ready for IBM Bob Dev Day Hackathon 2026!          ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

**Keep this terminal open!** The server must be running for the application to work.

### Step 2: Open Your Browser

Open your web browser and navigate to:
```
http://localhost:3000
```

Or directly to the login page:
```
http://localhost:3000/index.html
```

### Step 3: Login

Use the demo credentials:
- **Username:** `demo`
- **Password:** `demo123`

---

## Troubleshooting

### Problem: "Cannot GET /"

**Cause:** Server is not running or wrong URL

**Solution:**
1. Make sure the server is running (see Step 1)
2. Check the terminal for any error messages
3. Try accessing: `http://localhost:3000/index.html`

### Problem: "Failed to fetch" or "Network Error"

**Cause:** CORS issue or server not accessible

**Solution:**
1. Verify server is running on port 3000
2. Check if another application is using port 3000
3. Try closing and restarting the server
4. Clear browser cache (Ctrl+Shift+Delete)

### Problem: Login button doesn't work

**Cause:** JavaScript not loading or GSAP library issue

**Solution:**
1. Open browser console (F12)
2. Check for any JavaScript errors
3. Verify internet connection (GSAP loads from CDN)
4. Try hard refresh (Ctrl+F5)

### Problem: "Invalid credentials"

**Cause:** Wrong username or password

**Solution:**
- Use exactly: `demo` / `demo123`
- Check for extra spaces
- Username and password are case-sensitive

### Problem: Animations not working

**Cause:** GSAP library not loaded

**Solution:**
1. Check internet connection (GSAP loads from CDN)
2. Open browser console (F12) and look for errors
3. Try accessing: https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js
4. If blocked, check firewall/antivirus settings

### Problem: Port 3000 already in use

**Error:** `EADDRINUSE: address already in use :::3000`

**Solution:**

**Windows:**
```powershell
# Find process using port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

**Linux/Mac:**
```bash
# Find and kill process using port 3000
lsof -ti:3000 | xargs kill -9
```

Or change the port in `.env` file:
```env
PORT=3001
```

---

## Testing the Server

Run the test script to verify everything is working:

```bash
node test-server.js
```

Expected output:
```
🧪 Testing Obfusi-Bob API Server...

1️⃣ Testing health endpoint...
✅ Health check passed: { status: 'healthy', ... }

2️⃣ Testing login endpoint...
✅ Login successful!
   Token: eyJhbGciOiJIUzI1NiIs...
   User: demo

3️⃣ Testing authenticated endpoint...
✅ Profile fetch successful: demo

✨ Server tests complete!
```

---

## Browser Console Debugging

Open browser console (F12) and check for:

### Successful Login:
```
Attempting login to: http://localhost:3000/api/auth/login
Response status: 200
Response data: {token: "...", user: {...}}
```

### Failed Login:
```
Login error: Error: Invalid credentials
```

### Network Error:
```
Login error: TypeError: Failed to fetch
```

---

## Features to Test

Once logged in, test these features:

### 1. Analyze Code
- Click "📊 Analyze Code" in sidebar
- Paste sample LLVM IR code or upload `.ll` file
- Click "Analyze Code" button
- Verify results display with metrics

### 2. Obfuscate
- Click "🔒 Obfuscate" in sidebar
- Paste LLVM IR code
- Select obfuscation techniques
- Click "Apply Obfuscation"
- Verify obfuscated code appears
- Click "Download" to save

### 3. AI Recommendations
- First analyze some code
- Click "💡 AI Recommendations" in sidebar
- Click "Get Recommendations"
- Verify recommendations appear with confidence scores

### 4. History
- Click "📜 History" in sidebar
- Verify previous operations are listed

---

## Sample LLVM IR Code

Use this for testing:

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

## Advanced: Running with MCP Server

If you want to use the full MCP server:

```bash
# Build MCP server
cd mcp-server
npm install
npm run build

# Start MCP server (in separate terminal)
npm start

# Start API server (in another terminal)
cd ..
node api-server-standalone.js
```

---

## Environment Variables

Edit `.env` file to customize:

```env
# Server port
PORT=3000

# JWT secret (change in production!)
JWT_SECRET=your-secret-key-here

# watsonx.ai (optional)
WATSONX_API_KEY=your-api-key
WATSONX_PROJECT_ID=your-project-id
```

---

## Browser Compatibility

Tested and working on:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Edge 90+
- ✅ Safari 14+

---

## Need Help?

1. Check [`BUG-FIXES-REPORT.md`](BUG-FIXES-REPORT.md) for known issues
2. Check [`README.md`](README.md) for full documentation
3. Check [`START-HERE.md`](START-HERE.md) for quick reference
4. Run `node test-server.js` to diagnose server issues

---

## Success Checklist

- [ ] Server starts without errors
- [ ] Can access http://localhost:3000
- [ ] Login page loads with animations
- [ ] Can login with demo/demo123
- [ ] Dashboard loads successfully
- [ ] Can analyze LLVM IR code
- [ ] Can apply obfuscation
- [ ] Can get AI recommendations
- [ ] Can view history
- [ ] Can logout

---

**Ready to go! 🎉**

If all checks pass, your Obfusi-Bob installation is working perfectly!