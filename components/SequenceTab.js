import { useState } from 'react';
import { runService } from '../lib/livy';

export default function SequenceTab() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');

  // Manual trigger for the service call via button click
  const handleValidateNumber = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      // Call the Livy TEE service - validates that input number is exactly 5
      const response = await runService({
        serviceId: 'a33e2665-1458-4721-840c-f0b3a7a0569b',
        params: {
          number: userAnswer  // TEE function certifies this input is 5 or fails
        }
      });
      
      setResult(response);
    } catch (err) {
      if (err.code) {
        // Handle Livy SDK errors with error codes (proxied through API)
        let errorMessage = err.message;
        
        // Try to extract the meaningful error from the TEE service
        try {
          const errorData = JSON.parse(err.message);
          if (errorData.output && errorData.output.message) {
            const fullMessage = errorData.output.message;
            // Look for the assertion failure message
            const assertionMatch = fullMessage.match(/You've got the wrong number! Expected (\d+), got (\d+)/);
            if (assertionMatch) {
              const expected = assertionMatch[1];
              const received = assertionMatch[2];
              errorMessage = `Wrong answer! 🤔 Expected ${expected}, but you entered ${received}. Try again!`;
            }
          }
        } catch (parseErr) {
          // If parsing fails, fall back to generic message
          errorMessage = `Incorrect! The TEE expected 5 but got "${userAnswer}". Try again!`;
        }
        
        setError(errorMessage);
      } else {
        setError(`Incorrect! The TEE expected 5 but got "${userAnswer}". Try again!`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-900">Sequence Challenge 🧠</h2>
        <p className="text-gray-600 mt-2">
          Do you know the right answer? What is the next number in the sequence: <span className="font-mono font-bold text-blue-600">1, 2, 3, 4, ...</span>
        </p>
        <p className="text-sm text-gray-500 mt-1">
          The TEE function will verify if you got it right!
        </p>
      </div>

      <div className="flex justify-center">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="5"
            disabled={loading}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg font-medium min-w-[100px]"
          />
          <button
            onClick={handleValidateNumber}
            disabled={loading || !userAnswer.trim()}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              loading || !userAnswer.trim()
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
            } text-white`}
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Checking...
              </div>
            ) : (
              'Send Answer'
            )}
          </button>
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Service Response</h3>
        
        {!result && !error && !loading && (
          <div className="text-center py-8 text-gray-500">
            Enter your answer and click "Send Answer" to see if you're correct!
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong>Error:</strong> {error}
          </div>
        )}

        {result && (
          <div className="space-y-4">
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
              <strong>🎉 Correct!</strong> You got it right! The answer is indeed {userAnswer}.
            </div>
            
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
        <p><strong>Input Parameter:</strong> number={userAnswer || '{your answer}'}</p>
        <p><strong>Trigger:</strong> Manual button click</p>
        <p><strong>TEE Function:</strong> Validates if your answer equals 5</p>
      </div>
    </div>
  );
} 