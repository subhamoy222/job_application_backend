import axios from 'axios';

const BASE_URL = 'https://job-application-backend-6jgg.onrender.com/api/v1';

async function testJobRoute() {
  console.log('Testing job details route without authentication...\n');

  try {
    // Test job details route without any authentication
    console.log('Testing job details route...');
    const response = await axios.get(`${BASE_URL}/job/682839f82b46dfc8b2b5ac37`);
    console.log('✅ Job details route working without authentication');
    console.log('Response status:', response.status);
    console.log('Job data:', response.data);
  } catch (error) {
    console.log('❌ Job details route failed:');
    console.log('Status:', error.response?.status);
    console.log('Message:', error.response?.data?.message || error.message);
  }

  try {
    // Test jobs list route (should be public)
    console.log('\nTesting jobs list route...');
    const jobsResponse = await axios.get(`${BASE_URL}/job/getall`);
    console.log('✅ Jobs list route working');
    console.log('Jobs count:', jobsResponse.data?.jobs?.length || 0);
  } catch (error) {
    console.log('❌ Jobs list route failed:', error.response?.status || error.message);
  }
}

testJobRoute(); 