import { useState } from 'react';
import { runService } from '../lib/livy';

export default function TimeAwareTab() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Handle button click to get minutes to next hour
  const handleGetMinutes = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      // Calculate current UTC time and minutes left until next hour
      const now = new Date();
      const currentMinute = now.getUTCMinutes();
      const minutesLeft = currentMinute === 0 ? 60 : 60 - currentMinute;
      
      // Call the Livy TEE service - validates user knows correct UTC time calculation
      const response = await runService({
        serviceId: 'd0dfa8fc-1a96-47a1-a710-fe895c38f199',
        params: {
          minutes: minutesLeft.toString()
        }
      });
      
      setResult({
        ...response,
        calculatedMinutes: minutesLeft,
        currentUTC: now.toISOString()
      });
          } catch (err) {
        if (err.code) {
          // Handle Livy SDK errors with error codes (proxied through API)
          setError(`SDK Error (${err.code}): ${err.message}`);
        } else {
          setError(`Incorrect time calculation: ${err.message}`);
        }
      } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-900">Time-Aware Service</h2>
        <p className="text-gray-600 mt-2">
          This tab validates correct UTC time calculation. The TEE function checks if you know 
          how many minutes are left until the next hour in UTC. Auto-calculates and validates.
        </p>
      </div>

      <div className="flex justify-center">
        <button
          onClick={handleGetMinutes}
          disabled={loading}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
          } text-white`}
        >
          {loading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Calculating...
            </div>
          ) : (
            'Get Minutes to Next Hour'
          )}
        </button>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Service Response</h3>
        
        {!result && !error && !loading && (
          <div className="text-center py-8 text-gray-500">
            Click the button above to calculate minutes to next hour
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
              <h4 className="font-semibold text-gray-700 mb-2">Output:</h4>
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
            
            <div className="bg-blue-50 p-4 rounded border border-blue-200">
              <p className="text-blue-800">
                <strong>Current UTC:</strong> {result.currentUTC ? new Date(result.currentUTC).toUTCString() : 'N/A'}
              </p>
              <p className="text-blue-800">
                <strong>Minutes Left:</strong> {result.calculatedMinutes} minutes until next hour
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="text-sm text-gray-500">
        <p><strong>Service ID:</strong> d0dfa8fc-1a96-47a1-a710-fe895c38f199</p>
        <p><strong>Input Parameter:</strong> minutes={`{calculated UTC minutes left}`}</p>
        <p><strong>Trigger:</strong> Manual button click</p>
        <p><strong>TEE Function:</strong> Validates correct UTC time calculation</p>
      </div>
    </div>
  );
} 