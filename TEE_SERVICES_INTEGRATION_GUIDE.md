# TEE Services Integration Guide

This document provides integration details for 4 TEE (Trusted Execution Environment) services that need to be integrated into the frontend application.

## Service Overview

| Service | Function | Tab Name | Trigger | Service ID |
|---------|----------|----------|---------|------------|
| next_number | Number validation | Sequence | Auto (useEffect) | `a33e2665-1458-4721-840c-f0b3a7a0569b` |
| time-aware | Time validation | Time-Aware | Button click | `d0dfa8fc-1a96-47a1-a710-fe895c38f199` |
| coin-toss | Random coin toss | Coin Toss | Form submission | `05498066-9092-4fbb-bac2-31b58bb1e98e` |
| price-feed | Crypto price feed | Price Feed | Button click | `d1ea89d7-140e-4c66-9ce9-0c44701a506a` |

---

## 1. Next Number Service (Sequence Tab)

**Service ID**: `a33e2665-1458-4721-840c-f0b3a7a0569b`

**Purpose**: Validates that the input number is exactly 5

**Integration**: Auto-trigger on component mount using `useEffect`

**Input Parameters**:
```bash
--number=5
```

**Expected Behavior**:
- ✅ **Success**: When `--number=5` → Service succeeds, shows success message
- ❌ **Failure**: When `--number≠5` → Service fails with assertion error

**Frontend Implementation**:
```javascript
import { createClient } from '@livylabs/sdk';

const client = createClient({
  apiKey: process.env.NEXT_PUBLIC_LIVY_API_KEY
});

// Auto-trigger on mount
useEffect(() => {
  const runSequenceService = async () => {
    try {
      const result = await client.run({
        serviceId: 'a33e2665-1458-4721-840c-f0b3a7a0569b',
        params: {
          number: '5'
        },
        withAttestation: true
      });
      console.log('Sequence service result:', result);
    } catch (error) {
      console.error('Sequence service failed:', error);
    }
  };
  
  runSequenceService();
}, []);
```

**Expected Output**:
- Success case: Service completes normally
- Failure case: Service fails with panic/assertion error

---

## 2. Time-Aware Service (Time-Aware Tab)

**Service ID**: `d0dfa8fc-1a96-47a1-a710-fe895c38f199`

**Purpose**: Validates user knows how many minutes are left until the next hour (UTC)

**Integration**: Button click "Get minutes to next hour"

**Input Parameters**:
```bash
--minutes=X
```
Where X = minutes left until next hour in UTC

**Expected Behavior**:
- User must calculate current UTC time and determine minutes left
- Example: If UTC time is 14:37, user should input `--minutes=23`

**Frontend Implementation**:
```javascript
const handleTimeAwareService = async () => {
  // Get current UTC time and calculate minutes left
  const now = new Date();
  const currentMinute = now.getUTCMinutes();
  const minutesLeft = currentMinute === 0 ? 60 : 60 - currentMinute;

  try {
    const result = await client.run({
      serviceId: 'd0dfa8fc-1a96-47a1-a710-fe895c38f199',
      params: {
        minutes: minutesLeft.toString()
      },
      withAttestation: true
    });
    console.log('Time-aware service result:', result);
  } catch (error) {
    console.error('Time-aware service failed:', error);
  }
};
```

**Expected Output**:
- Success: User provided correct minutes left
- Failure: User provided wrong calculation

---

## 3. Coin Toss Service (Coin Toss Tab)

**Service ID**: `05498066-9092-4fbb-bac2-31b58bb1e98e`

**Purpose**: Random coin toss game where user guesses the outcome

**Integration**: Form submission with radio buttons (Heads/Tails)

**Input Parameters**:
```bash
--choice=head
# OR
--choice=tail
```

**Accepted Values**: `head`, `heads`, `tail`, `tails` (case insensitive)

**Expected Behavior**:
- User selects heads or tails
- Server generates random number to determine coin result
- Even numbers = heads, odd numbers = tails
- 50/50 chance of winning

**Frontend Implementation**:
```javascript
// Form with radio buttons
const [choice, setChoice] = useState('head');
const [isFlipping, setIsFlipping] = useState(false);

const handleCoinToss = async () => {
  setIsFlipping(true);
  
  try {
    const result = await client.run({
      serviceId: '05498066-9092-4fbb-bac2-31b58bb1e98e',
      params: {
        choice: choice
      },
      withAttestation: true
    });
    console.log('Coin toss result:', result);
    // Handle win scenario
  } catch (error) {
    console.error('Coin toss lost:', error);
    // Handle loss scenario
  } finally {
    setIsFlipping(false);
  }
};

// UI with animation for coin flip effect
```

**Expected Output**:
- Win: User guess matches random result → Success message
- Lose: User guess doesn't match → Service fails with assertion error

---

## 4. Price Feed Service (Price Feed Tab)

**Service ID**: `d1ea89d7-140e-4c66-9ce9-0c44701a506a`

**Purpose**: Fetches and certifies live cryptocurrency prices from Coinbase API

**Integration**: Button click "Fetch BTC→USD"

**Input Parameters**:
```bash
# Default (BTC)
(no parameters - defaults to BTC-USD)

# OR specify symbol
--symbol=BTC-USD
--symbol=ETH-USD
--symbol=ADA-USD
```

**Expected Behavior**:
- Makes API call to Coinbase: `https://api.coinbase.com/v2/prices/BTC-USD/spot`
- Parses response: `{"data":{"amount":"119137.66","base":"BTC","currency":"USD"}}`
- Returns certified price data with timestamp

**Frontend Implementation**:
```javascript
const [priceData, setPriceData] = useState(null);
const [isLoading, setIsLoading] = useState(false);

const fetchBTCPrice = async (symbol = 'BTC-USD') => {
  setIsLoading(true);
  
  try {
    const result = await client.run({
      serviceId: 'd1ea89d7-140e-4c66-9ce9-0c44701a506a',
      params: symbol !== 'BTC-USD' ? { symbol: symbol } : {},
      withAttestation: true
    });
    
    // Parse the JSON response from the service
    const parsedResult = JSON.parse(result.output);
    setPriceData(parsedResult);
    console.log('Price feed result:', parsedResult);
  } catch (error) {
    console.error('Price feed failed:', error);
  } finally {
    setIsLoading(false);
  }
};

// Usage examples:
// fetchBTCPrice();              // Default BTC-USD
// fetchBTCPrice('ETH-USD');     // Ethereum price
```

**Expected Output** (JSON format):
```json
{
  "symbol": "BTC-USD",
  "price_usd": 119137.66,
  "raw_price": "119137.66",
  "timestamp": "2025-07-22T17:51:39.303388912+00:00",
  "source": "Coinbase API",
  "certified": true
}
```

---

## Environment Variables Required

Add these to your `.env` file:

```env
# Livy API Configuration
NEXT_PUBLIC_LIVY_API_KEY=sk-fe22bccc251d8f3f3818852be754ede0c03ecd2a43bbc4099d76e9e5fcae38f5

# TEE Service IDs (for reference, hardcoded in components)
SEQ_SERVICE_ID=a33e2665-1458-4721-840c-f0b3a7a0569b
TIME_SERVICE_ID=d0dfa8fc-1a96-47a1-a710-fe895c38f199
COIN_SERVICE_ID=05498066-9092-4fbb-bac2-31b58bb1e98e
PRICE_SERVICE_ID=d1ea89d7-140e-4c66-9ce9-0c44701a506a
```

---

## Expected Tab Behavior

### Sequence Tab
- **Auto-loads** on mount
- Shows "Next number" result and proof status
- Always uses `--number=5` parameter

### Time-Aware Tab  
- **Button trigger**: "Get minutes to next hour"
- Calculate current UTC minutes left
- Display computed minutes and proof status

### Coin Toss Tab
- **Form interface**: Radio buttons for Heads/Tails selection
- Submit button to start coin flip
- Show animation during processing
- Display win/lose result with proof

### Price Feed Tab
- **Button trigger**: "Fetch BTC→USD" 
- Display loading state during API call
- Show current BTC price and certification proof
- Display JSON proof data

---

## Error Handling

**Success Cases**: Service completes normally, display success UI
**Failure Cases**: Service fails with assertion/panic, display error message

**Recommended Error Display**:
- Sequence: "Number validation failed" 
- Time-Aware: "Incorrect time calculation"
- Coin Toss: "Better luck next time!" 
- Price Feed: "API call failed" or "Invalid symbol"

---

## Livy SDK Setup

Add this to your main component or create a shared client:

```javascript
import { createClient } from '@livylabs/sdk';

const client = createClient({
  apiKey: process.env.NEXT_PUBLIC_LIVY_API_KEY
});
```

## Notes for Frontend Implementation

1. **All services** use the Livy SDK with `params` object (keys without `--` prefix)
2. **Success/Failure** determined by service exit status - success resolves promise, failure throws error
3. **Price Feed** returns structured JSON in the `output` field that needs to be parsed
4. **Coin Toss** has 50/50 randomness - losses are expected and normal (will throw error)
5. **Time-Aware** requires real-time UTC calculation on frontend
6. **Sequence** should always succeed when using `number: '5'`
7. **withAttestation: true** enables proof verification for all services

## Error Handling Pattern

```javascript
try {
  const result = await client.run({ serviceId, params, withAttestation: true });
  // Handle success
} catch (error) {
  // Handle failure (expected for coin toss losses, validation failures, etc.)
}
```

This completes the integration guide for all 4 TEE services with real service IDs and Livy SDK integration. 