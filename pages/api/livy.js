import { createClient, SDKError } from '@livylabs/sdk';

// Service ID to API key mapping
const SERVICE_API_KEYS = {
  'a33e2665-1458-4721-840c-f0b3a7a0569b': process.env.NEXT_NUMBER_API_KEY,   // next-number
  'd0dfa8fc-1a96-47a1-a710-fe895c38f199': process.env.TIME_AWARE_API_KEY,     // time-aware
  '05498066-9092-4fbb-bac2-31b58bb1e98e': process.env.COIN_TOSS_API_KEY,      // coin-toss
  'd1ea89d7-140e-4c66-9ce9-0c44701a506a': process.env.PRICE_FEED_API_KEY,     // price-feed
};

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { serviceId, params = {}, withAttestation = true } = req.body;

    if (!serviceId) {
      return res.status(400).json({ error: 'serviceId is required' });
    }

    // Get the correct API key for this service
    const apiKey = SERVICE_API_KEYS[serviceId];
    if (!apiKey) {
      return res.status(400).json({ 
        error: `No API key found for service ID: ${serviceId}` 
      });
    }

    // Create client with service-specific API key
    const client = createClient({ apiKey });

    // Make the Livy SDK call server-side
    const result = await client.run({
      serviceId,
      params,
      withAttestation
    });

    // Verify the attestation if enabled
    const proofValid = withAttestation ? await result.verifyAttestation() : true;

    // Return the result to the frontend
    res.status(200).json({
      output: result.output,
      proofValid,
      success: true
    });

  } catch (err) {
    console.error('Livy API Error:', err);
    
    // Handle SDK errors
    if (err instanceof SDKError) {
      return res.status(400).json({
        error: err.message,
        code: err.code,
        success: false
      });
    }

    // Handle other errors
    res.status(500).json({
      error: err.message,
      success: false
    });
  }
} 