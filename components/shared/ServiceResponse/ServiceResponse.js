import { useState } from 'react';
import { getBlob } from '../../../lib/livy';
import styles from './ServiceResponse.module.css';

/**
 * Standardized service response display component
 * Handles success/error states, proof validation, and technical details
 */
export default function ServiceResponse({ 
  parsedResponse, 
  loading = false, 
  showTechnicalDetails = true,
  serviceId = null,
  inputParams = null
}) {
  const [showRawOutput, setShowRawOutput] = useState(false);
  const [showTechDetails, setShowTechDetails] = useState(false);
  const [showBlobData, setShowBlobData] = useState(false);
  const [showBlobContent, setShowBlobContent] = useState(false);
  const [blobContent, setBlobContent] = useState(null);
  const [blobLoading, setBlobLoading] = useState(false);
  const [blobError, setBlobError] = useState(null);

  if (loading) {
    return (
      <div className={styles.container}>
        <h3 className={styles.title}>Service Response</h3>
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <span>Processing request...</span>
        </div>
      </div>
    );
  }

  if (!parsedResponse) {
    return (
      <div className={styles.container}>
        <h3 className={styles.title}>Service Response</h3>
        <div className={styles.emptyState}>
          Submit your request to see the service response
        </div>
      </div>
    );
  }

  const { success, proofValid, userMessage, rawOutput, technicalDetails, extractedData, dataAvailability } = parsedResponse;

  const handleFetchBlob = async () => {
    if (!dataAvailability?.technicalDetails) return;

    // If content is already loaded, just toggle visibility
    if (blobContent) {
      setShowBlobContent(!showBlobContent);
      return;
    }

    // If content is not loaded, fetch it
    setShowBlobContent(true);
    setBlobLoading(true);
    setBlobError(null);
    try {
      const { height, commitment } = dataAvailability.technicalDetails;
      const result = await getBlob({ celestiaHeight: height, celestiaCommitment: commitment });
      setBlobContent(result);
    } catch (err) {
      setBlobError(err.message || 'Failed to fetch blob content.');
    } finally {
      setBlobLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Service Response</h3>
      
      {/* User-friendly message */}
      <div className={`${styles.userMessage} ${success ? styles.success : styles.error}`}>
        <strong>{success ? 'Success:' : 'Error:'}</strong> {userMessage}
      </div>

      {/* Data Availability message */}
      {dataAvailability && (
        <div className={`${styles.userMessage} ${styles.info}`}>
          <strong>Info:</strong> {dataAvailability.userMessage}
        </div>
      )}

      {/* Proof status badge */}
      <div className={styles.proofSection}>
        <span className={styles.proofLabel}>Proof Status:</span>
        <div className={`${styles.proofBadge} ${proofValid ? styles.valid : styles.invalid}`}>
          {proofValid ? '✓ Valid' : '✗ Invalid'}
        </div>
      </div>

      {/* Additional extracted data display (service-specific) */}
      {extractedData && renderExtractedData(extractedData)}

      {/* Raw output toggle */}
      {rawOutput && (
        <div className={styles.section}>
          <button 
            onClick={() => setShowRawOutput(!showRawOutput)}
            className={styles.toggleButton}
          >
            {showRawOutput ? 'Hide' : 'Show'} Raw Output
          </button>
          
          {showRawOutput && (
            <div className={styles.codeBlock}>
              <h4 className={styles.sectionTitle}>Raw JSON Output:</h4>
              <pre className={styles.code}>
                {JSON.stringify(rawOutput, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Function console output toggle */}
      {showTechnicalDetails && technicalDetails && (
        <div className={styles.section}>
          <button 
            onClick={() => setShowTechDetails(!showTechDetails)}
            className={styles.toggleButton}
          >
            {showTechDetails ? 'Hide' : 'Show'} Function Console Output
          </button>
          
          {showTechDetails && (
            <div className={styles.codeBlock}>
              <h4 className={styles.sectionTitle}>TEE Function Console Output:</h4>
              <pre className={styles.code}>
                {technicalDetails}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Blob metadata toggle */}
      {dataAvailability && (
        <div className={styles.section}>
          <button 
            onClick={() => setShowBlobData(!showBlobData)}
            className={styles.toggleButton}
          >
            {showBlobData ? 'Hide' : 'Show'} Blob Metadata
          </button>
          
          {showBlobData && (
            <div className={styles.codeBlock}>
              <h4 className={styles.sectionTitle}>Celestia Blob Metadata:</h4>
              <pre className={styles.code}>
                {JSON.stringify(dataAvailability.technicalDetails, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Blob content toggle */}
      {dataAvailability && (
        <div className={styles.section}>
          <button 
            onClick={handleFetchBlob}
            className={styles.toggleButton}
            disabled={blobLoading}
          >
            {blobLoading ? 'Fetching...' : (blobContent ? (showBlobContent ? 'Hide' : 'Show') : 'Fetch')} Blob Content
          </button>
          
          {showBlobContent && (
            <div className={styles.codeBlock}>
              {blobLoading && <p>Loading...</p>}
              {blobError && <p className={styles.errorText}>{blobError}</p>}
              {blobContent && (
                <>
                  <h4 className={styles.sectionTitle}>Celestia Blob Content:</h4>
                  <pre className={styles.code}>
                    {JSON.stringify(blobContent, null, 2)}
                  </pre>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Service metadata */}
      {(serviceId || inputParams) && (
        <div className={styles.metadata}>
          {serviceId && <p><strong>Service ID:</strong> {serviceId}</p>}
          {inputParams && <p><strong>Input Parameters:</strong> {JSON.stringify(inputParams)}</p>}
        </div>
      )}
    </div>
  );
}

/**
 * Render service-specific extracted data
 */
function renderExtractedData(extractedData) {
  // Price feed specific display
  if (extractedData.priceData) {
    const { priceData } = extractedData;
    return (
      <div className={styles.priceDisplay}>
        <div className={styles.priceCard}>
          <div className={styles.priceIcon}>💰</div>
          <h3 className={styles.priceValue}>
            ${typeof priceData.price_usd === 'number' ? priceData.price_usd.toLocaleString() : priceData.raw_price}
          </h3>
          <p className={styles.priceSymbol}>{priceData.symbol} - {priceData.source}</p>
          <p className={styles.priceTimestamp}>
            TEE Certified: {new Date(priceData.timestamp).toLocaleString()}
          </p>
        </div>
      </div>
    );
  }

  // Coin toss specific display  
  if (extractedData.hasOwnProperty('won')) {
    return (
      <div className={`${styles.gameResult} ${extractedData.won ? styles.gameWin : styles.gameLose}`}>
        <h3 className={styles.gameTitle}>
          {extractedData.won ? '🎉 You Won!' : '😔 You Lost!'}
        </h3>
        {extractedData.userGuess && extractedData.coinResult && (
          <p className={styles.gameDetails}>
            You chose <strong>{extractedData.userGuess}</strong>, coin landed on <strong>{extractedData.coinResult}</strong>
          </p>
        )}
      </div>
    );
  }

  // Time/sequence specific display - only show if there are validation details
  if (extractedData.hasOwnProperty('correct') && extractedData.expected && extractedData.actual) {
    return (
      <div className={styles.validationResult}>
        <p className={styles.validationDetails}>
          Expected: <strong>{extractedData.expected}</strong>, Got: <strong>{extractedData.actual}</strong>
        </p>
      </div>
    );
  }

  return null;
} 