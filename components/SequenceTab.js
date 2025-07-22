import { useState, useEffect } from 'react';
import { runService } from '../lib/livy';

export default function SequenceTab() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Auto-trigger the service call on component mount
  useEffect(() => {
    const fetchSequence = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Call the Livy TEE service - validates that input number is exactly 5
        const response = await runService({
          serviceId: 'a33e2665-1458-4721-840c-f0b3a7a0569b',
          params: {
            number: '5'  // TEE function certifies this input is 5 or fails
          }
        });
        
        setResult(response);
      } catch (err) {
        if (err.code) {
          // Handle Livy SDK errors with error codes (proxied through API)
          setError(`SDK Error (${err.code}): ${err.message}`);
        } else {
          setError(`Number validation failed: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSequence();
  }, []);

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-900">Number Validation Service</h2>
        <p className="text-gray-600 mt-2">
          This tab validates that the input number is exactly 5. The TEE function certifies 
          the input parameter and succeeds only when the number equals 5. Auto-runs on component mount.
        </p>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Service Response</h3>
        
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-2 text-gray-600">Validating number in TEE...</span>
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
          </div>
        )}
      </div>

      <div className="text-sm text-gray-500">
        <p><strong>Service ID:</strong> a33e2665-1458-4721-840c-f0b3a7a0569b</p>
        <p><strong>Input Parameter:</strong> number=5</p>
        <p><strong>Trigger:</strong> Automatic on component mount (useEffect)</p>
        <p><strong>TEE Function:</strong> Validates input number is exactly 5</p>
      </div>
    </div>
  );
} 