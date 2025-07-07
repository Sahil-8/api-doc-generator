// API Test Utility
export const testBackendConnection = async () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  console.log('API URL:', apiUrl);
  
  try {
    // Test root endpoint
    const rootResponse = await fetch(apiUrl.replace('/api', ''));
    console.log('Root response status:', rootResponse.status);
    console.log('Root response text:', await rootResponse.text());
    
    // Test health endpoint
    const healthResponse = await fetch(apiUrl.replace('/api', '/health'));
    console.log('Health response status:', healthResponse.status);
    console.log('Health response:', await healthResponse.json());
    
    return true;
  } catch (error) {
    console.error('Backend connection test failed:', error);
    return false;
  }
}; 