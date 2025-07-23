import { useState, useEffect } from 'react';
import { runService } from '../lib/livy';

export default function TimeAwareTab() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Calculate the correct answer for validation and placeholder
  const getCorrectMinutes = () => {
    const now = new Date();
    const currentMinute = now.getUTCMinutes();
    return currentMinute === 0 ? 60 : 60 - currentMinute;
  };

  // Handle form submission to validate time calculation
  const handleSubmitAnswer = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      // Call the Livy TEE service - validates user's time calculation
      const response = await runService({
        serviceId: 'd0dfa8fc-1a96-47a1-a710-fe895c38f199',
        params: {
          minutes: userAnswer
        }
      });
      
      setResult({
        output: response.output,
        proofValid: response.proofValid,
        calculatedMinutes: getCorrectMinutes(),
        currentUTC: currentTime.toISOString()
      });
    } catch (err) {
      if (err.code) {
        // Handle Livy SDK errors with error codes (proxied through API)
        let errorMessage = err.message;
        
        // Try to extract meaningful error from TEE service
        try {
          const errorData = JSON.parse(err.message);
          if (errorData.output && errorData.output.message) {
            const fullMessage = errorData.output.message;
            // Look for time-related error messages
            if (fullMessage.includes('wrong') || fullMessage.includes('Expected')) {
              const expectedMinutes = getCorrectMinutes();
              errorMessage = `Wrong time calculation! ⏰ Expected ${expectedMinutes} minutes, but you entered ${userAnswer}. Try again!`;
            }
          }
        } catch (parseErr) {
          const expectedMinutes = getCorrectMinutes();
          errorMessage = `Incorrect time calculation! Expected ${expectedMinutes} minutes but got "${userAnswer}". Try again!`;
        }
        
        setError(errorMessage);
      } else {
        const expectedMinutes = getCorrectMinutes();
        setError(`Incorrect time calculation! Expected ${expectedMinutes} minutes but got "${userAnswer}". Try again!`);
      }
    } finally {
      setLoading(false);
    }
  };

  const correctMinutes = getCorrectMinutes();

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-900">Time-Aware Challenge ⏰</h2>
        <p className="text-gray-600 mt-2">
          Do you know how to calculate UTC time? How many minutes are left until the next hour?
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Look at the UTC clock and calculate the remaining minutes!
        </p>
      </div>

      {/* Subtle UTC Clock */}
      <div className="text-center mb-2">
        <span className="text-sm text-gray-400 font-mono">
          UTC Clock: {currentTime.toUTCString().split(' ')[4]}
        </span>
      </div>

      {/* Centered Input and Button */}
      <div className="flex justify-center items-center space-x-4">
        <input
          type="text"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder={correctMinutes.toString()}
          disabled={loading}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg font-medium min-w-[100px]"
        />
        <button
          onClick={handleSubmitAnswer}
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

      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Service Response</h3>
        
        {!result && !error && !loading && (
          <div className="text-center py-8 text-gray-500">
            Enter your answer and click "Send Answer" to validate your time calculation!
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
              <strong>🎉 Correct!</strong> You calculated the time correctly! {userAnswer} minutes remaining.
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
            
            <div className="bg-blue-50 p-4 rounded border border-blue-200">
              <p className="text-blue-800">
                <strong>Verification Time:</strong> {result.currentUTC ? new Date(result.currentUTC).toUTCString() : 'N/A'}
              </p>
              <p className="text-blue-800">
                <strong>Minutes Calculated:</strong> {result.calculatedMinutes} minutes until next hour
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="text-sm text-gray-500">
        <p><strong>Service ID:</strong> d0dfa8fc-1a96-47a1-a710-fe895c38f199</p>
        <p><strong>Input Parameter:</strong> minutes={userAnswer || '{your answer}'}</p>
        <p><strong>Trigger:</strong> Manual button click</p>
        <p><strong>TEE Function:</strong> Validates correct UTC time calculation</p>
      </div>
    </div>
  );
} 