// Test the price-feed service specifically
const { createClient } = require('@livylabs/sdk');

async function testPriceFeed() {
  console.log('🔍 Testing Price Feed Service (this should work)...\n');
  
  const apiKey = 'sk-...';
  const serviceId = 'd1...';
  
  console.log('Using:');
  console.log('API Key:', apiKey);
  console.log('Service ID:', serviceId);
  console.log();
  
  try {
    const client = createClient({
      apiKey: apiKey,
    });
    
    console.log('🚀 Calling price feed service...');
    const result = await client.run({
      serviceId: serviceId,
      params: {}, // Default BTC-USD
      withAttestation: false
    });
    
    console.log('✅ SUCCESS!');
    console.log('Result:', JSON.stringify(result.output, null, 2));
    
  } catch (error) {
    console.log('❌ FAILED!');
    console.log('Error:', error.code, '-', error.message);
  }
}

testPriceFeed().catch(console.error); 