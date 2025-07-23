import ServiceResponse from '../shared/ServiceResponse';
import styles from './SequenceTab.module.css';

/**
 * Sequence View - Pure templating and rendering
 * Takes controller state/handlers as props and renders UI
 */
export default function SequenceView({
  loading,
  parsedResponse,
  userAnswer,
  setUserAnswer,
  handleSubmit,
  serviceId,
  inputParams
}) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Sequence Challenge 🧠</h2>
        <p className={styles.description}>
          Do you know the right answer? What is the next number in the sequence: 
          <span className={styles.sequence}>1, 2, 3, 4, ...</span>
        </p>
        <p className={styles.subtitle}>
          The TEE function will verify if you got it right!
        </p>
      </div>

      <div className={styles.inputSection}>
        <input
          type="text"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="5"
          disabled={loading}
          className={styles.input}
        />
        <button
          onClick={handleSubmit}
          disabled={loading || !userAnswer.trim()}
          className={`${styles.button} ${(loading || !userAnswer.trim()) ? styles.buttonDisabled : styles.buttonEnabled}`}
        >
          {loading ? (
            <div className={styles.buttonLoading}>
              <div className={styles.spinner}></div>
              Checking...
            </div>
          ) : (
            'Send Answer'
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