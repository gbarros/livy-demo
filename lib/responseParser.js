/**
 * Standardized parser for Livy TEE service API responses
 * Handles both success and error cases with consistent structure
 */

import { extractServiceMessage } from './messageExtractor';

/**
 * Parse a Livy service response into a standardized format
 * @param {Object} response - Raw response from runService
 * @param {Object} error - Error object if service call failed
 * @param {string} serviceType - Type of service (sequence, time-aware, coin-toss, price-feed)
 * @returns {Object} Standardized parsed response
 */
export function parseServiceResponse(response, error, serviceType) {
  const baseResult = {
    success: false,
    proofValid: false,
    rawOutput: null,
    extractedData: null,
    userMessage: null,
    technicalDetails: null,
    dataAvailability: null,
  };

  try {
    if (error) {
      // Handle error case
      baseResult.success = false;
      baseResult.proofValid = false;
      
      if (error.code && error.message) {
        try {
          // Try to parse the stringified JSON error
          const errorData = JSON.parse(error.message);
          baseResult.rawOutput = errorData;
          
          if (errorData.output && errorData.output.message) {
            const cleanMessage = cleanTechnicalLogs(errorData.output.message);
            baseResult.technicalDetails = cleanMessage;
            
            // Extract meaningful content based on service type
            baseResult.extractedData = extractServiceMessage(cleanMessage, serviceType, false);
            baseResult.userMessage = baseResult.extractedData.userFriendlyMessage;
          } else {
            // For generic service errors without detailed messages, try to extract based on service type
            let errorMessage = errorData.error || error.message || 'Unknown error';
            if (serviceType === 'coin-toss' && errorMessage.includes('RA service execution failed')) {
              // For coin toss, generic failure means they lost
              baseResult.extractedData = extractServiceMessage('RA service execution failed', serviceType, false);
              baseResult.userMessage = baseResult.extractedData.userFriendlyMessage;
            } else {
              baseResult.userMessage = `Service call failed: ${errorMessage}`;
            }
          }
        } catch (jsonParseError) {
          // If JSON parsing fails, treat the raw error message as the technical details
          baseResult.technicalDetails = error.message;
          
          // For coin toss, check if this looks like a loss
          if (serviceType === 'coin-toss' && error.message.includes('RA service')) {
            baseResult.extractedData = extractServiceMessage(error.message, serviceType, false);
            baseResult.userMessage = baseResult.extractedData.userFriendlyMessage;
          } else {
            baseResult.userMessage = `Service call failed: ${error.message}`;
          }
        }
      } else {
        baseResult.userMessage = `Service call failed: ${error.message}`;
      }
    } else if (response) {
      // Handle success case
      baseResult.success = true;
      baseResult.proofValid = response.proofValid || false;
      baseResult.rawOutput = response.output;
      
      // For success cases, extract the meaningful content
      let messageToExtract = '';
      
      if (typeof response.output === 'string') {
        messageToExtract = response.output;
      } else if (response.output && response.output.output && typeof response.output.output === 'string') {
        messageToExtract = response.output.output;
      } else if (response.output && response.output.message) {
        messageToExtract = response.output.message;
      }
      
      if (messageToExtract) {
        const cleanMessage = cleanTechnicalLogs(messageToExtract);
        baseResult.technicalDetails = cleanMessage;
        baseResult.extractedData = extractServiceMessage(cleanMessage, serviceType, true);
        baseResult.userMessage = baseResult.extractedData.userFriendlyMessage;
      }

      // Handle data availability result
      if (response.dataAvailabilityResult) {
        baseResult.dataAvailability = {
          userMessage: `Request has been posted to Celestia at height ${response.dataAvailabilityResult.height}.`,
          technicalDetails: response.dataAvailabilityResult
        };
      }
    }
  } catch (parseError) {
    // If we're in a coin toss and have an error that looks like a loss, handle it specially
    if (serviceType === 'coin-toss' && error?.message?.includes('RA service')) {
      baseResult.extractedData = extractServiceMessage(error.message, serviceType, false);
      baseResult.userMessage = baseResult.extractedData.userFriendlyMessage;
      baseResult.technicalDetails = error.message;
    } else {
      baseResult.userMessage = `Failed to parse service response: ${parseError.message}`;
      baseResult.technicalDetails = error?.message || 'Unknown error';
    }
  }

  return baseResult;
}

/**
 * Clean technical logs from TEE function output
 * Removes binary paths, execution details, keeps meaningful content
 */
function cleanTechnicalLogs(message) {
  if (!message) return '';
  
  const lines = message.split('\n');
  const filteredLines = lines.filter(line => {
    const trimmed = line.trim();
    
    // Filter out technical execution details
    if (trimmed.startsWith('Running binary from:')) return false;
    if (trimmed.startsWith('Found binary:')) return false;
    if (trimmed.startsWith('Executing:')) return false;
    if (trimmed.includes('RUST_BACKTRACE')) return false;
    if (trimmed.startsWith('note: run with')) return false;
    if (trimmed.includes('thread \'main\' panicked')) return false;
    if (trimmed.includes('left:') && trimmed.includes('right:')) return false;
    if (trimmed.startsWith('at src/main.rs:')) return false;
    
    // Keep meaningful content
    return trimmed.length > 0;
  });
  
  return filteredLines.join('\n').trim();
}

/**
 * Check if a response indicates success
 */
export function isSuccessResponse(parsedResponse) {
  return parsedResponse.success && parsedResponse.proofValid;
}

/**
 * Get user-friendly error message
 */
export function getUserErrorMessage(parsedResponse) {
  return parsedResponse.userMessage || 'An unexpected error occurred';
}

/**
 * Get technical details for debugging
 */
export function getTechnicalDetails(parsedResponse) {
  return parsedResponse.technicalDetails || 'No technical details available';
} 