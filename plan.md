# Livy Demo Site Project Plan

## Overall Goals
- [x] Initialize Next.js app with required dependencies
- [x] Configure Tailwind CSS  
- [x] Set up environment variables
- [x] Create Livy SDK client library
- [x] Build UI layout with four tabs
- [x] Implement Sequence tab (auto-trigger on mount)
- [x] Implement Time-Aware tab (button trigger)
- [x] Implement Coin Toss tab (form + animation)
- [x] Implement Price Feed tab (button trigger)
- [x] Add proper error handling and proof verification
- [x] Create comprehensive documentation

## Current Step
✅ **PRODUCTION READY!** - Full TEE integration with CORS fix and security improvements
- [x] Created 4 TEE functions with real service IDs and Livy API key
- [x] Updated all React components to use actual TEE service calls
- [x] **FIXED CORS ISSUES**: Added Next.js API proxy for server-side Livy calls
- [x] **SECURITY**: API key is server-side only, no client exposure
- [x] **HTTPS**: Self-signed SSL certificates for local development
- [x] Integrated proper parameter passing and error handling
- [x] Added structured output parsing for price feed JSON
- [x] Configured win/loss logic for coin toss via promise success/error
- [x] Real-time UTC time calculation for time-aware service
- [x] **READY FOR PRODUCTION** with working TEE services!

## TEE Functions Progress
| Function            | Status | Description                                    |
|---------------------|--------|------------------------------------------------|
| next_number         | ✅ Done | Certifies input number is 5 or fails         |
| time-aware          | ✅ Done | Validates minutes left until next hour (UTC) |
| coin-toss           | ✅ Done | Random coin toss game (head/tail guess)      |
| price-feed          | ✅ Done | Fetches & certifies crypto prices from **Coinbase API** |
| binance-price-feed  | 💾 Backup | Original Binance API version (preserved for debugging) |

## Tab Requirements
| Tab         | Service ID       | Trigger                         | Description                                                   |
|-------------|------------------|----------------------------------|---------------------------------------------------------------|
| Sequence    | SEQ_SERVICE_ID   | Button "Validate Number 5"     | Displays "Next number" result and proof status.              |
| Time‑Aware  | TIME_SERVICE_ID  | Button "Get minutes to next hour" | Shows computed minutes and proof.                           |
| Coin Toss   | COIN_SERVICE_ID  | Form (Heads/Tails)              | Starts coin‑flip animation, then shows win/lose + proof.     |
| Price Feed  | PRICE_SERVICE_ID | Button "Fetch BTC→USD"          | Displays current rate and proof JSON.                        |

## Environment Variables Required
```env
LIVY_API_KEY=your-api-key
LIVY_BASE_URL=https://console.livylabs.xyz/api/proxy
SEQ_SERVICE_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
TIME_SERVICE_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
COIN_SERVICE_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
PRICE_SERVICE_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```
