import { useState } from 'react';
import { runService } from '../../lib/livy';
import { parseServiceResponse } from '../../lib/responseParser';

/**
 * PriceFeed Controller - Pure business logic and TEE integration
 * Handles state management, API calls, and price data logic
 */
export function usePriceFeedController() {
  const [loading, setLoading] = useState(false);
  const [parsedResponse, setParsedResponse] = useState(null);
  const [userSymbol, setUserSymbol] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setParsedResponse(null);
    
    try {
      // TEE Service Call - Core integration logic
      const response = await runService({
        serviceId: process.env.PRICE_SERVICE_ID,
        params: userSymbol.trim() ? { symbol: userSymbol.trim() } : {},
        withAttestation: true,
        postToDataAvailability: true // post to celestia
      });
      
      // Parse response using standardized parser
      const parsed = parseServiceResponse(response, null, 'price-feed');
      setParsedResponse(parsed);
      
    } catch (error) {
      // Handle TEE service errors
      const parsed = parseServiceResponse(null, error, 'price-feed');
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
    userSymbol,
    setUserSymbol,
    
    // Handlers
    handleSubmit,
    
    // Service metadata
    serviceId: process.env.PRICE_SERVICE_ID,
    inputParams: { symbol: userSymbol || 'BTC-USD (default)' }
  };
} 