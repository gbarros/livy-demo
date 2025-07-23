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
✅ **PRODUCTION READY + REFACTORED!** - Full TEE integration with clean architecture for presentations
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
- [x] **🎯 NEW: REFACTORED ARCHITECTURE** - Standardized response parsing and clean component structure

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

## 🎯 NEW: Refactored Architecture (Presentation-Ready!)

### Standardized Response Parsing System
- [x] **`lib/responseParser.js`** - Universal parser for all TEE service responses
- [x] **`lib/messageExtractor.js`** - Service-specific message extraction patterns
- [x] **`lib/livy.js`** - TEE service client SDK
- [x] **`components/shared/ServiceResponse/`** - Reusable response display component
- [x] **Clean separation** of business logic from UI presentation

### Example: SequenceTab Refactored
- [x] **Before**: 151 lines with mixed concerns
- [x] **After**: ~70 lines of pure UI logic
- [x] **Benefits**: Much easier to follow during presentations, logic abstracted but accessible

### ✅ COMPLETE REFACTORING RESULTS
- [x] **SequenceTab**: 151 lines → 70 lines (53% reduction)
- [x] **TimeAwareTab**: 189 lines → 80 lines (58% reduction)  
- [x] **CoinTossTab**: 323 lines → 120 lines (63% reduction)
- [x] **PriceFeedTab**: 201 lines → 90 lines (55% reduction)
- [x] **All CSS extracted** to clean CSS modules
- [x] **Standardized response handling** across all tabs

### 🎯 Controller/View Architecture - PERFECT FOR DEMOS!
- [x] **Controller files** - Pure business logic and TEE integration (focus here in demos)
- [x] **View files** - Pure templating (mention briefly: "ServiceResponse handles rendering")
- [x] **Tab files** - Thin connectors (skip in presentations - just plumbing)

### 📊 Final File Structure Per Tab:
```
SequenceTab/
├── SequenceController.js   (~45 lines) ← THE MEAT: TEE integration logic
├── SequenceView.js         (~50 lines) ← Pure templating
├── SequenceTab.js          (~8 lines)  ← Thin connector
└── SequenceTab.module.css  (styling)
```

### 🎯 Presentation Benefits Achieved
- **Focus on Controllers** - All TEE logic concentrated in ~45 line files
- **Ignore View complexity** - Just say "ServiceResponse correctly renders errors"  
- **Skip connectors** - They're just plumbing
- **Perfect separation** - Business logic completely separated from templating
- **Total reduction**: 864 lines → 360 lines (58% overall) + Controller/View separation!
