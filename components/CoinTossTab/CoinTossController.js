import { useState } from 'react';
import { runService } from '../../lib/livy';
import { parseServiceResponse } from '../../lib/responseParser';

/**
 * CoinToss Controller - Pure business logic and TEE integration
 * Handles state management, API calls, and game logic
 */
export function useCoinTossController() {
  const [loading, setLoading] = useState(false);
  const [parsedResponse, setParsedResponse] = useState(null);
  const [userChoice, setUserChoice] = useState('head');
  const [gameResult, setGameResult] = useState(null);

  const handleChoiceChange = (choice) => {
    setUserChoice(choice);
    setGameResult(null);
    setParsedResponse(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setParsedResponse(null);
    setGameResult(null);
    
    try {
      // TEE Service Call - Core integration logic
      const response = await runService({
        serviceId: process.env.COIN_SERVICE_ID,
        params: { choice: userChoice }
      });
      
      // Parse response using standardized parser
      const parsed = parseServiceResponse(response, null, 'coin-toss');
      setParsedResponse(parsed);
      
      // Extract game result for UI state
      if (parsed.extractedData) {
        setGameResult({
          coinResult: parsed.extractedData.coinResult,
          userChoice: parsed.extractedData.userGuess,
          won: parsed.extractedData.won
        });
      }
      
    } catch (error) {
      // Handle TEE service errors
      const parsed = parseServiceResponse(null, error, 'coin-toss');
      setParsedResponse(parsed);
      
      // Extract game result from error case (losses)
      if (parsed.extractedData) {
        setGameResult({
          coinResult: parsed.extractedData.coinResult,
          userChoice: parsed.extractedData.userGuess,
          won: parsed.extractedData.won
        });
      }
      
    } finally {
      setLoading(false);
    }
  };

  // Return all state and handlers for the view
  return {
    // State
    loading,
    parsedResponse,
    userChoice,
    gameResult,
    
    // Handlers
    handleChoiceChange,
    handleSubmit,
    
    // Service metadata
    serviceId: process.env.COIN_SERVICE_ID,
    inputParams: { choice: userChoice }
  };
} 