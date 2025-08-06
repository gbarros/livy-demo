import { createClient, SDKError } from '@livylabs/sdk';

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
    const apiKey = process.env.USER_API_KEY;
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