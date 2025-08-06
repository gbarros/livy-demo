import { useState, useEffect } from 'react';
import { runService } from '../../lib/livy';
import { parseServiceResponse } from '../../lib/responseParser';

/**
 * TimeAware Controller - Pure business logic and TEE integration
 * Handles state management, API calls, and time calculation logic
 */
export function useTimeAwareController() {
  const [loading, setLoading] = useState(false);
  const [parsedResponse, setParsedResponse] = useState(null);
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

  const handleSubmit = async () => {
    setLoading(true);
    setParsedResponse(null);
    
    try {
      // TEE Service Call - Core integration logic
      const response = await runService({
        serviceId: process.env.TIME_SERVICE_ID,
        params: { minutes: userAnswer }
      });
      
      // Parse response using standardized parser
      const parsed = parseServiceResponse(response, null, 'time-aware');
      setParsedResponse(parsed);
      
    } catch (error) {
      // Handle TEE service errors
      const parsed = parseServiceResponse(null, error, 'time-aware');
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
    currentTime,
    
    // Computed values
    correctMinutes: getCorrectMinutes(),
    
    // Handlers
    handleSubmit,
    
    // Service metadata
    serviceId: process.env.TIME_SERVICE_ID,
    inputParams: { minutes: userAnswer || '{your answer}' }
  };
} 