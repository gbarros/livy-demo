import { useState } from 'react';
import { runService } from '../../lib/livy';
import { parseServiceResponse } from '../../lib/responseParser';

/**
 * Sequence Controller - Pure business logic and TEE integration
 * Handles state management, API calls, and validation logic
 */
export function useSequenceController() {
  const [loading, setLoading] = useState(false);
  const [parsedResponse, setParsedResponse] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setParsedResponse(null);
    
    try {
      // TEE Service Call - Core integration logic
      const response = await runService({
        serviceId: 'a33e2665-1458-4721-840c-f0b3a7a0569b',
        params: { number: userAnswer }
      });
      
      // Parse response using standardized parser
      const parsed = parseServiceResponse(response, null, 'sequence');
      setParsedResponse(parsed);
      
    } catch (error) {
      // Handle TEE service errors
      const parsed = parseServiceResponse(null, error, 'sequence');
      setParsedResponse(parsed);
      
    } finally {
      setLoading(false);
    }
  };

  // Return all state and handlers for the view
  return {
    // State
    loading,
    parsedResponse,
    userAnswer,
    setUserAnswer,
    
    // Handlers
    handleSubmit,
    
    // Service metadata
    serviceId: 'a33e2665-1458-4721-840c-f0b3a7a0569b',
    inputParams: { number: userAnswer || '{your answer}' }
  };
} 