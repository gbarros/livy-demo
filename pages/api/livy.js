import { createClient, SDKError } from '@livylabs/sdk';
import debug from 'debug';

const log = debug('livy:api');
const logError = debug('livy:api:error');

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

    const resultSummary = {
      status: result.status,
      output: result.output,
      serviceId: result.serviceId,
      params: result.params,
      withAttestation: result.withAttestation,
      postedToDataAvailability: result.postedToDataAvailability,
      quote: result.quote ? {
        quote: `${result.quote.quote.substring(0, 80)}...`,
        rtmrs: result.quote.rtmrs.map(r => `${r.substring(0, 20)}...`),
        eventLog: `eventLog exists... (length: ${result.quote.eventLog.length})`
      } : null,
    };
    log('Livy Run Result:', JSON.stringify(resultSummary, null, 2));

    // Verify the attestation if enabled
    const proofValid = withAttestation ? await result.verifyAttestation() : true;

    // Return the result to the frontend
    res.status(200).json({
      output: result.output,
      proofValid,
      success: true
    });

  } catch (err) {
    logError('Livy API Error:', err);
    
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
