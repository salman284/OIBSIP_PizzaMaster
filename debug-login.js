// Simple test script to debug the login issue
// Run this in the browser console on http://localhost:5173

async function debugLogin() {
    console.log('🧪 Starting Login Debug Test');
    
    // Test 1: Check if we can reach the health endpoint
    try {
        console.log('1️⃣ Testing health endpoint...');
        const healthResponse = await fetch('http://localhost:5000/api/health');
        const healthData = await healthResponse.json();
        console.log('✅ Health endpoint success:', healthData);
    } catch (error) {
        console.error('❌ Health endpoint failed:', error);
        return;
    }
    
    // Test 2: Test login endpoint
    try {
        console.log('2️⃣ Testing login endpoint...');
        const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'testuser@pizzamaster.com',
                password: 'password123'
            })
        });
        const loginData = await loginResponse.json();
        console.log('✅ Login endpoint success:', loginData);
    } catch (error) {
        console.error('❌ Login endpoint failed:', error);
    }
    
    // Test 3: Test the actual API service
    try {
        console.log('3️⃣ Testing API service...');
        const API_BASE_URL = 'http://localhost:5000/api';
        
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'testuser@pizzamaster.com',
                password: 'password123'
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('✅ API service test success:', data);
        
    } catch (error) {
        console.error('❌ API service test failed:', error);
    }
}

// Auto-run the debug test
debugLogin();
