import { useState } from 'react';
import { runService } from '../lib/livy';

export default function PriceFeedTab() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Handle button click to fetch BTC price
  const handleFetchPrice = async (symbol = 'BTC-USD') => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      // Call the Livy TEE service - fetches and certifies crypto prices from Coinbase API
      const response = await runService({
        serviceId: 'd1ea89d7-140e-4c66-9ce9-0c44701a506a',
        params: symbol !== 'BTC-USD' ? { symbol: symbol } : {} // Default to BTC-USD
      });
      
      // Parse the JSON response from the TEE service
      let parsedOutput;
      try {
        parsedOutput = typeof response.output === 'string' 
          ? JSON.parse(response.output) 
          : response.output;
      } catch (parseErr) {
        parsedOutput = response.output; // Use as-is if not JSON
      }
      
      setResult({
        ...response,
        parsedOutput
      });
    } catch (err) {
      if (err.code) {
        // Handle Livy SDK errors with error codes (proxied through API)
        setError(`SDK Error (${err.code}): ${err.message}`);
      } else {
        setError(`API call failed: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Extract price from result for display using TEE service format
  const getDisplayPrice = () => {
    if (!result?.parsedOutput) return null;
    
    // Use the structured format from the TEE service
    const priceData = result.parsedOutput;
    return priceData.price_usd || priceData.raw_price || priceData.price;
  };

  const displayPrice = getDisplayPrice();
  const priceData = result?.parsedOutput;

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-900">Bitcoin Price Feed</h2>
        <p className="text-gray-600 mt-2">
          This tab fetches and certifies live cryptocurrency prices from the Coinbase API. 
          The TEE function validates data authenticity with cryptographic proof and timestamps.
        </p>
      </div>

      {/* Price Display */}
      {displayPrice && (
        <div className="bg-gradient-to-r from-orange-100 to-yellow-100 p-6 rounded-lg border border-orange-200">
          <div className="text-center">
            <div className="text-6xl mb-2">₿</div>
            <h3 className="text-3xl font-bold text-gray-900">
              ${typeof displayPrice === 'number' ? displayPrice.toLocaleString() : displayPrice}
            </h3>
            <p className="text-gray-600 mt-1">
              {priceData?.symbol || 'BTC-USD'} - {priceData?.source || 'Coinbase API'}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              TEE Certified: {priceData?.timestamp ? new Date(priceData.timestamp).toLocaleString() : new Date().toLocaleString()}
            </p>
            {priceData?.certified && (
              <p className="text-xs text-green-600 mt-1">✓ Cryptographically Certified</p>
            )}
          </div>
        </div>
      )}

      <div className="flex justify-center">
        <button
          onClick={handleFetchPrice}
          disabled={loading}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-orange-600 hover:bg-orange-700 active:bg-orange-800'
          } text-white`}
        >
          {loading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Fetching Price...
            </div>
          ) : (
            'Fetch BTC→USD Rate'
          )}
        </button>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Service Response</h3>
        
        {!result && !error && !loading && (
          <div className="text-center py-8 text-gray-500">
            Click the button above to fetch the current Bitcoin price
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong>Error:</strong> {error}
          </div>
        )}

        {result && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded border">
              <h4 className="font-semibold text-gray-700 mb-2">Raw JSON Output:</h4>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                {JSON.stringify(result.output, null, 2)}
              </pre>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-gray-700">Proof Status:</span>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                result.proofValid 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {result.proofValid ? '✓ Valid' : '✗ Invalid'}
              </div>
            </div>

            {result.proofValid && (
              <div className="bg-green-50 p-4 rounded border border-green-200">
                <h4 className="font-semibold text-green-800 mb-2">✓ Verification Successful</h4>
                <p className="text-green-700 text-sm">
                  The price data has been cryptographically verified and can be trusted as authentic.
                  This ensures the data hasn't been tampered with and comes from a legitimate source.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="text-sm text-gray-500">
        <p><strong>Service ID:</strong> d1ea89d7-140e-4c66-9ce9-0c44701a506a</p>
        <p><strong>Input Parameter:</strong> symbol=BTC-USD (default)</p>
        <p><strong>Trigger:</strong> Manual button click</p>
        <p><strong>TEE Function:</strong> Fetches & certifies crypto prices from Coinbase API</p>
        <p><strong>Data Source:</strong> https://api.coinbase.com/v2/prices/</p>
      </div>
    </div>
  );
} 