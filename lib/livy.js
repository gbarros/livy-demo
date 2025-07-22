/**
 * Runs a Livy service through the Next.js API proxy to bypass CORS
 * @param {Object} config - Configuration object with serviceId, params, etc.
 * @returns {Promise<{output: any, proofValid: boolean}>} Result with output and proof validation status
 * @throws {Error} When API call fails
 */
export async function runService({ serviceId, params = {}, withAttestation = true }) {
  try {
    // Make request to our Next.js API proxy instead of direct SDK call
    const response = await fetch('/api/livy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        serviceId,
        params,
        withAttestation
      })
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      // Create an error object that mimics SDKError for compatibility
      const error = new Error(data.error || 'API request failed');
      error.code = data.code;
      throw error;
    }

    return {
      output: data.output,
      proofValid: data.proofValid
    };

  } catch (err) {
    // Handle fetch errors and re-throw with meaningful messages
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      throw new Error('Network error: Unable to connect to Livy API');
    }
    throw err;
  }
} 