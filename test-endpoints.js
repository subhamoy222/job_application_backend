import axios from 'axios';

const BASE_URL = 'https://job-application-backend-6jgg.onrender.com/api/v1';

async function testEndpoints() {
  console.log('Testing backend endpoints...\n');

  try {
    // Test 1: Check if server is running
    console.log('1. Testing server availability...');
    const response = await axios.get(`${BASE_URL}/user/getuser`);
    console.log('✅ Server is running');
  } catch (error) {
    console.log('❌ Server test failed:', error.response?.status || error.message);
  }

  try {
    // Test 2: Test job routes (should be public)
    console.log('\n2. Testing job routes...');
    const jobsResponse = await axios.get(`${BASE_URL}/job/getall`);
    console.log('✅ Jobs endpoint working');
  } catch (error) {
    console.log('❌ Jobs endpoint failed:', error.response?.status || error.message);
  }

  try {
    // Test 3: Test registration endpoint
    console.log('\n3. Testing registration endpoint...');
    const registerResponse = await axios.post(`${BASE_URL}/user/register`, {
      name: 'Test User',
      email: 'test@example.com',
      password: 'testpassword123',
      phone: '1234567890',
      role: 'Job Seeker'
    });
    console.log('✅ Registration endpoint working');
  } catch (error) {
    console.log('❌ Registration endpoint failed:', error.response?.status || error.message);
  }

  console.log('\n✅ Endpoint testing completed!');
}

testEndpoints(); 