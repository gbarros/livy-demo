import ServiceResponse from '../shared/ServiceResponse';
import styles from './CoinTossTab.module.css';

/**
 * CoinToss View - Pure templating and rendering
 * Takes controller state/handlers as props and renders UI
 */
export default function CoinTossView({
  loading,
  parsedResponse,
  userChoice,
  gameResult,
  handleChoiceChange,
  handleSubmit,
  serviceId,
  inputParams
}) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Coin Toss Game</h2>
        <p className={styles.description}>
          Choose heads or tails for a fair 50/50 coin toss! The TEE function generates true randomness.
          Service succeeds if you win, throws an error if you lose (expected behavior).
        </p>
      </div>

      {/* Coin Animation */}
      <div className={styles.coinSection}>
        <div className={`${styles.coin} ${loading ? styles.coinFlipping : ''}`}>
          {loading ? (
            <span className={styles.coinSpinner}>🔄</span>
          ) : gameResult ? (
            <>
              <img 
                src={gameResult.coinResult === 'heads' ? '/celestia-heads.svg' : '/bitcoin-tails.svg'}
                alt={gameResult.coinResult === 'heads' ? 'Celestia (Heads)' : 'Bitcoin (Tails)'}
                className={styles.coinImage}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'inline';
                }}
              />
              <span className={styles.coinFallback} style={{display: 'none'}}>
                {gameResult.coinResult === 'heads' ? '👑' : '₿'}
              </span>
            </>
          ) : (
            <>
              <img 
                src={userChoice === 'heads' ? '/celestia-heads.svg' : '/bitcoin-tails.svg'}
                alt={userChoice === 'heads' ? 'Celestia (Heads)' : 'Bitcoin (Tails)'}
                className={`${styles.coinImage} ${styles.coinPreview}`}
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'inline';
                }}
              />
              <span className={`${styles.coinFallback} ${styles.coinPreview}`} style={{display: 'none'}}>
                {userChoice === 'heads' ? '👑' : '₿'}
              </span>
            </>
          )}
        </div>
        {loading && <div className={styles.loadingIndicator}></div>}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.choiceSection}>
          <label className={styles.choiceLabel}>
            <input
              type="radio"
              value="heads"
              checked={userChoice === 'heads'}
              onChange={(e) => handleChoiceChange(e.target.value)}
              disabled={loading}
              className={styles.choiceInput}
            />
            <span className={styles.choiceText}>Heads</span>
          </label>
          <label className={styles.choiceLabel}>
            <input
              type="radio"
              value="tails"
              checked={userChoice === 'tails'}
              onChange={(e) => handleChoiceChange(e.target.value)}
              disabled={loading}
              className={styles.choiceInput}
            />
            <span className={styles.choiceText}>Tails</span>
          </label>
        </div>

        <div className={styles.buttonSection}>
          <button
            type="submit"
            disabled={loading}
            className={`${styles.button} ${loading ? styles.buttonDisabled : styles.buttonEnabled}`}
          >
            {loading ? 'Flipping Coin...' : 'Flip Coin!'}
          </button>
        </div>
      </form>

      <ServiceResponse 
        parsedResponse={parsedResponse}
        loading={loading}
        serviceId={serviceId}
        inputParams={inputParams}
      />
    </div>
  );
} 