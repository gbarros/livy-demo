import { createClient, SDKError } from '@livylabs/sdk';
import debug from 'debug';

const log = debug('livy:api:getblob');
const logError = debug('livy:api:getblob:error');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { celestiaHeight, celestiaCommitment } = req.body;

    if (!celestiaHeight || !celestiaCommitment) {
      return res.status(400).json({ 
        error: 'celestiaHeight and celestiaCommitment are required' 
      });
    }

    const apiKey = process.env.USER_API_KEY;
    if (!apiKey) {
      return res.status(400).json({ 
        error: 'No API key found' 
      });
    }

    const client = createClient({ apiKey });

    const result = await client.getFromCelestia({
      height: celestiaHeight,
      commitment: celestiaCommitment,
    });

    log('Livy GetBlob Result:', result);

    res.status(200).json({
      ...result,
      success: true,
    });

  } catch (err) {
    logError('Livy API Error:', err);

    if (err instanceof SDKError) {
      return res.status(400).json({
        error: err.message,
        code: err.code,
        success: false,
      });
    }

    res.status(500).json({
      error: err.message,
      success: false,
    });
  }
}

