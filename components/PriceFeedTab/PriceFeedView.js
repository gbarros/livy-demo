import ServiceResponse from '../shared/ServiceResponse';
import styles from './PriceFeedTab.module.css';

/**
 * PriceFeed View - Pure templating and rendering
 * Takes controller state/handlers as props and renders UI
 */
export default function PriceFeedView({
  loading,
  parsedResponse,
  userSymbol,
  setUserSymbol,
  handleSubmit,
  serviceId,
  inputParams
}) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Crypto Price Feed 💰</h2>
        <p className={styles.description}>
          Enter a trading pair (like BTC-USD, ETH-USD, etc.) to fetch and certify live cryptocurrency prices from the Coinbase API. 
          The TEE function validates data authenticity with cryptographic proof and timestamps.
        </p>
        <p className={styles.subtitle}>
          Leave empty for default BTC-USD or try other pairs like ETH-USD, ADA-USD, SOL-USD.
        </p>
      </div>



      <div className={styles.inputSection}>
        <input
          type="text"
          value={userSymbol}
          onChange={(e) => setUserSymbol(e.target.value)}
          placeholder="BTC-USD"
          disabled={loading}
          className={styles.input}
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`${styles.button} ${loading ? styles.buttonDisabled : styles.buttonEnabled}`}
        >
          {loading ? (
            <div className={styles.buttonLoading}>
              <div className={styles.spinner}></div>
              Fetching...
            </div>
          ) : (
            'Fetch Price'
          )}
        </button>
      </div>

      <ServiceResponse 
        parsedResponse={parsedResponse}
        loading={loading}
        serviceId={serviceId}
        inputParams={inputParams}
      />
    </div>
  );
} 