import { useState } from 'react';
import { runService } from '../lib/livy';

export default function CoinTossTab() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [userChoice, setUserChoice] = useState('heads');
  const [gameResult, setGameResult] = useState(null);

  // Handle choice change and reset game state
  const handleChoiceChange = (choice) => {
    setUserChoice(choice);
    setGameResult(null); // Reset previous game result to show new preview
    setResult(null);     // Reset result display
    setError(null);      // Reset any error
  };

  // Handle form submission for coin toss
  const handleCoinToss = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    setGameResult(null);
    
    try {
      // Call the Livy TEE service - 50/50 random coin toss game
      // Success = user wins, Error = user loses (expected behavior)
      const response = await runService({
        serviceId: '05498066-9092-4fbb-bac2-31b58bb1e98e',
        params: {
          choice: userChoice  // accepts: head, heads, tail, tails (case insensitive)
        }
      });
      
      setResult(response);
      
      // If we reach here, user WON! (TEE service succeeded)
      setGameResult({
        coinResult: userChoice, // User's guess was correct
        userChoice,
        won: true
      });
      
    } catch (err) {
      // User LOST! (TEE service failed - this is expected 50% of the time)
      let actualCoinResult = userChoice === 'heads' ? 'tails' : 'heads'; // Default fallback
      let cleanErrorMessage = `Better luck next time! The coin landed on ${actualCoinResult}.`;
      let formattedErrorOutput = null;
      
      if (err.code) {
        // Try to extract and format the error response like success case
        try {
          const errorData = JSON.parse(err.message);
          
          // Store the formatted error output for display
          formattedErrorOutput = errorData;
          
          if (errorData.output && errorData.output.message) {
            const fullMessage = errorData.output.message;
            
            // Look for the coin flip result pattern: "You guessed 'X' but the coin landed on 'Y'"
            const coinResultMatch = fullMessage.match(/You guessed '(\w+)' but the coin landed on '(\w+)'/);
            
            if (coinResultMatch) {
              const guessedChoice = coinResultMatch[1];
              const actualResult = coinResultMatch[2];
              
              // Use the actual result from TEE service
              actualCoinResult = actualResult === 'head' ? 'heads' : 'tails';
              
              // Create clean user message
              cleanErrorMessage = `You LOSE! 💔 You guessed ${guessedChoice === 'head' ? 'heads' : 'tails'}, but the coin landed on ${actualCoinResult}!`;
            } else if (fullMessage.includes('You LOSE!')) {
              // If we can't parse the exact result, but know it's a loss
              cleanErrorMessage = `You LOSE! 💔 The coin landed on ${actualCoinResult}. Better luck next time!`;
            }
          }
        } catch (parseErr) {
          // If parsing fails, use the fallback message
          cleanErrorMessage = `Better luck next time! The coin landed on ${actualCoinResult}.`;
        }
      }
      
      setGameResult({
        coinResult: actualCoinResult,
        userChoice,
        won: false
      });
      
      setResult({
        output: formattedErrorOutput,
        proofValid: false, // Error case doesn't have proof
        error: cleanErrorMessage
      });
      
      // Don't set error separately since we're including it in result
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-900">Coin Toss Game</h2>
        <p className="text-gray-600 mt-2">
          Choose heads or tails for a fair 50/50 coin toss! The TEE function generates true randomness.
          Service succeeds if you win, throws an error if you lose (expected behavior).
        </p>
      </div>

      {/* Coin Animation */}
      <div className="flex justify-center py-8">
        <div className="relative">
          <div className={`w-24 h-24 rounded-full border-4 border-yellow-400 bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center text-2xl font-bold text-yellow-800 ${
            loading ? 'coin-flip' : ''
          }`}>
            {loading ? (
              <span className="text-2xl">🔄</span>
            ) : gameResult ? (
              <>
                <img 
                  src={gameResult.coinResult === 'heads' ? '/celestia-heads.svg' : '/bitcoin-tails.svg'}
                  alt={gameResult.coinResult === 'heads' ? 'Celestia (Heads)' : 'Bitcoin (Tails)'}
                  className="w-20 h-20 object-contain"
                  onError={(e) => {
                    console.error('Image failed to load:', e.target.src);
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'inline';
                  }}
                />
                <span 
                  className="text-2xl" 
                  style={{display: 'none'}}
                >
                  {gameResult.coinResult === 'heads' ? '👑' : '₿'}
                </span>
              </>
            ) : (
              <>
                                 <img 
                   src={userChoice === 'heads' ? '/celestia-heads.svg' : '/bitcoin-tails.svg'}
                   alt={userChoice === 'heads' ? 'Celestia (Heads)' : 'Bitcoin (Tails)'}
                   className="w-20 h-20 object-contain opacity-90"
                  onError={(e) => {
                    console.error('Preview image failed to load:', e.target.src);
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'inline';
                  }}
                />
                <span 
                                   className="text-2xl opacity-90" 
                 style={{display: 'none'}}
                >
                  {userChoice === 'heads' ? '👑' : '₿'}
                </span>
              </>
            )}
          </div>
          {loading && (
            <div className="absolute -top-2 -right-2">
              <div className="animate-pulse w-6 h-6 bg-blue-500 rounded-full"></div>
            </div>
          )}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleCoinToss} className="space-y-4">
        <div className="flex justify-center space-x-6">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              value="heads"
              checked={userChoice === 'heads'}
              onChange={(e) => handleChoiceChange(e.target.value)}
              disabled={loading}
              className="w-4 h-4 text-blue-600"
            />
            <span className="text-lg font-medium">Heads</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="radio"
              value="tails"
              checked={userChoice === 'tails'}
              onChange={(e) => handleChoiceChange(e.target.value)}
              disabled={loading}
              className="w-4 h-4 text-blue-600"
            />
            <span className="text-lg font-medium">Tails</span>
          </label>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            disabled={loading}
            className={`px-8 py-3 rounded-lg font-medium transition-colors ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 active:bg-green-800'
            } text-white`}
          >
            {loading ? 'Flipping Coin...' : 'Flip Coin!'}
          </button>
        </div>
      </form>

      {/* Game Result */}
      {gameResult && (
        <div className={`p-6 rounded-lg border-2 ${
          gameResult.won 
            ? 'bg-green-50 border-green-200' 
            : 'bg-red-50 border-red-200'
        }`}>
          <div className="text-center">
            <h3 className={`text-2xl font-bold ${
              gameResult.won ? 'text-green-800' : 'text-red-800'
            }`}>
              {gameResult.won ? '🎉 You Won!' : '😔 You Lost!'}
            </h3>
            <p className="mt-2 text-lg">
              You chose <strong>{gameResult.userChoice}</strong>, coin landed on <strong>{gameResult.coinResult}</strong>
            </p>
          </div>
        </div>
      )}

      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Service Response</h3>
        
        {!result && !error && !loading && (
          <div className="text-center py-8 text-gray-500">
            Make your choice and flip the coin to see the result
          </div>
        )}

        {error && !result && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong>Error:</strong> {error}
          </div>
        )}

        {result && (
          <div className="space-y-4">
            {/* Show clean error message for losses */}
            {result.error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                <strong>Game Result:</strong> {result.error}
              </div>
            )}
            
            {/* Show success message for wins */}
            {!result.error && result.output && typeof result.output === 'object' && result.output.output && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                <strong>🎉 Correct!</strong> {result.output.output.split('\n').filter(line => line.includes('You won!')).join(' ')}
              </div>
            )}

            <div className="bg-white p-4 rounded border">
              <h4 className="font-semibold text-gray-700 mb-2">Output:</h4>
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                {(() => {
                  // Create a clean version for display
                  if (result.output && result.output.output && result.output.output.message) {
                    const displayOutput = JSON.parse(JSON.stringify(result.output));
                    // Replace the long message with a reference
                    displayOutput.output.message = "[See formatted message below]";
                    return JSON.stringify(displayOutput, null, 2);
                  }
                  return JSON.stringify(result.output, null, 2);
                })()}
              </pre>
              
              {/* Display formatted message separately */}
              {result.output && result.output.output && result.output.output.message && (
                <div className="mt-4 border-t pt-4">
                  <h5 className="font-semibold text-gray-700 mb-2">Formatted Message:</h5>
                  <pre className="bg-gray-50 p-3 rounded text-sm whitespace-pre-wrap font-mono">
                    {result.output.output.message.replace(/\\n/g, '\n')}
                  </pre>
                </div>
              )}
            </div>
            
            {/* Extract and highlight custom message for errors */}
            {result.error && result.output && result.output.output && result.output.output.message && (
              <div className="bg-blue-50 p-4 rounded border border-blue-200">
                <h4 className="font-semibold text-blue-800 mb-2">🎯 Custom Function Message:</h4>
                <div className="font-mono text-sm text-blue-700 whitespace-pre-wrap">
                  {result.output.output.message.split('\n').find(line => 
                    line.includes('You LOSE!') || line.includes('You guessed')
                  ) || 'Coin toss completed with TEE verification'}
                </div>
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-gray-700">Proof Status:</span>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                result.proofValid 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {result.proofValid ? '✓ Valid' : '✗ No Proof (Error Case)'}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="text-sm text-gray-500">
        <p><strong>Service ID:</strong> 05498066-9092-4fbb-bac2-31b58bb1e98e</p>
        <p><strong>Input Parameter:</strong> choice={userChoice}</p>
        <p><strong>Trigger:</strong> Form submission with heads/tails choice</p>
        <p><strong>TEE Function:</strong> 50/50 random coin toss (wins succeed, losses throw errors)</p>
      </div>
    </div>
  );
} 