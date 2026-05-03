/**
 * Quick Server Test Script
 * Tests if the API server is working correctly
 */

const API_BASE = 'http://localhost:3000';

async function testServer() {
    console.log('🧪 Testing Obfusi-Bob API Server...\n');
    
    // Test 1: Health Check
    console.log('1️⃣ Testing health endpoint...');
    try {
        const response = await fetch(`${API_BASE}/health`);
        const data = await response.json();
        console.log('✅ Health check passed:', data);
    } catch (error) {
        console.log('❌ Health check failed:', error.message);
        console.log('⚠️  Make sure the server is running: node api-server-standalone.js');
        return;
    }
    
    // Test 2: Login
    console.log('\n2️⃣ Testing login endpoint...');
    try {
        const response = await fetch(`${API_BASE}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: 'demo',
                password: 'demo123',
                rememberMe: false
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            console.log('✅ Login successful!');
            console.log('   Token:', data.token.substring(0, 20) + '...');
            console.log('   User:', data.user.username);
            
            // Test 3: Authenticated endpoint
            console.log('\n3️⃣ Testing authenticated endpoint...');
            const profileResponse = await fetch(`${API_BASE}/api/profile`, {
                headers: {
                    'Authorization': `Bearer ${data.token}`
                }
            });
            
            const profileData = await profileResponse.json();
            if (profileResponse.ok) {
                console.log('✅ Profile fetch successful:', profileData.username);
            } else {
                console.log('❌ Profile fetch failed:', profileData.error);
            }
        } else {
            console.log('❌ Login failed:', data.error);
        }
    } catch (error) {
        console.log('❌ Login test failed:', error.message);
    }
    
    console.log('\n✨ Server tests complete!');
}

// Run tests
testServer().catch(console.error);

// Made with Bob
