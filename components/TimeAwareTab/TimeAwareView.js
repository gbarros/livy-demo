import ServiceResponse from '../shared/ServiceResponse';
import styles from './TimeAwareTab.module.css';

/**
 * TimeAware View - Pure templating and rendering
 * Takes controller state/handlers as props and renders UI
 */
export default function TimeAwareView({
  loading,
  parsedResponse,
  userAnswer,
  setUserAnswer,
  currentTime,
  correctMinutes,
  handleSubmit,
  serviceId,
  inputParams
}) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Time-Aware Challenge ⏰</h2>
        <p className={styles.description}>
          Do you know how to calculate UTC time? How many minutes are left until the next hour?
        </p>
        <p className={styles.subtitle}>
          Look at the UTC clock and calculate the remaining minutes!
        </p>
      </div>

      <div className={styles.clockSection}>
        <span className={styles.clock}>
          UTC Clock: {currentTime.toUTCString().split(' ')[4]}
        </span>
      </div>

      <div className={styles.inputSection}>
        <input
          type="text"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder={correctMinutes.toString()}
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