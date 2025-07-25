# Livy Demo Site

A four-tab demo site showcasing [Livy's](https://x.com/livylabs) JavaScript SDK (`@livylabs/sdk`) with Next.js and Tailwind CSS, presented by [Celestia Labs](https://celestia.org/). Built with a clean controller/view architecture, this demo demonstrates different use cases for [Livy's](https://x.com/livylabs) cryptographic proof verification system with standardized response parsing and presentation-ready code organization.

## 🚀 Features

- **Sequence Generator**: Auto-triggers on page load to generate the next number in a sequence
- **Time-Aware Service**: Calculates minutes remaining until the next hour 
- **Coin Toss Game**: Interactive coin flip with win/lose logic and animations
- **Crypto Price Feed**: Fetches real-time cryptocurrency prices from Coinbase API

Each service call includes cryptographic proof verification to ensure data authenticity and integrity.

## 📋 Prerequisites

- Node.js 16.x or higher
- npm or yarn package manager
- [Livy](https://x.com/livylabs) API key and service IDs (see setup instructions below)

## 🛠️ Installation

1. **Clone and setup the project:**
   ```bash
   git clone <repository-url>
   cd livy-demo
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp env.example .env.local
   ```

3. **Edit `.env.local` with your [Livy](https://x.com/livylabs) credentials:**
   ```env
   # Livy SDK Configuration
   LIVY_API_KEY=your-api-key-here
   LIVY_BASE_URL=https://console.livylabs.xyz/api/proxy

   # Service IDs - One unique ID per tab function
   SEQ_SERVICE_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
   TIME_SERVICE_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
   COIN_SERVICE_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
   PRICE_SERVICE_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
   ```

4. **Start the development server:**

   **For HTTPS (recommended for Livy API):**
   ```bash
   npm run dev:https
   ```
   Then open [https://localhost:3000](https://localhost:3000)

   **For regular HTTP:**
   ```bash
   npm run dev
   ```
   Then open [http://localhost:3000](http://localhost:3000)

   > **Note**: Use HTTPS mode to avoid CORS issues with the [Livy](https://x.com/livylabs) API. The browser may show a security warning for the self-signed certificate - click "Advanced" and "Proceed to localhost" to continue.

## 🔧 Required Environment Variables

| Variable | Description | Required | Usage |
|----------|-------------|----------|-------|
| `LIVY_API_KEY` | Your [Livy](https://x.com/livylabs) API authentication key | ✅ Yes | Server-side only (secure) |
| `NEXT_PUBLIC_LIVY_API_KEY` | API key for client display | ✅ Yes | Client-side (display only) |
| `LIVY_BASE_URL` | [Livy](https://x.com/livylabs) API base URL | ✅ Yes | Server-side |
| `SEQ_SERVICE_ID` | Service ID for sequence generation | ✅ Yes | Reference only |
| `TIME_SERVICE_ID` | Service ID for time calculations | ✅ Yes | Reference only |
| `COIN_SERVICE_ID` | Service ID for coin toss game | ✅ Yes | Reference only |
| `PRICE_SERVICE_ID` | Service ID for Bitcoin price feed | ✅ Yes | Reference only |

> **Security Note**: The actual API calls are made server-side using `LIVY_API_KEY` to avoid CORS issues and keep the API key secure. The `NEXT_PUBLIC_` version is only used for display purposes in the UI.

## 🔑 Obtaining [Livy](https://x.com/livylabs) Service IDs

1. **Sign up for [Livy](https://x.com/livylabs):**
   - Visit [Livy Labs Console](https://console.livylabs.xyz)
   - Create an account and get your API key

2. **Create Services:**
   You need to create **four separate services** in the [Livy](https://x.com/livylabs) console:
   
   - **Sequence Service**: A service that generates sequential numbers
   - **Time Service**: A service that calculates time-based values
   - **Coin Toss Service**: A service that generates random heads/tails results
   - **Price Feed Service**: A service that fetches cryptocurrency prices

3. **Copy Service IDs:**
   - Each service will have a unique UUID
   - Copy these UUIDs to your `.env.local` file

## 📁 Project Structure

```
livy-demo/
├── components/                    # React components organized by feature
│   ├── SequenceTab/
│   │   ├── index.js              # Main component (thin connector)
│   │   ├── SequenceController.js # Business logic & TEE integration
│   │   ├── SequenceView.js       # Pure UI templating
│   │   └── SequenceTab.module.css # Component-specific styles
│   ├── TimeAwareTab/
│   │   ├── index.js              
│   │   ├── TimeAwareController.js
│   │   ├── TimeAwareView.js      
│   │   └── TimeAwareTab.module.css
│   ├── CoinTossTab/
│   │   ├── index.js              
│   │   ├── CoinTossController.js 
│   │   ├── CoinTossView.js       
│   │   └── CoinTossTab.module.css
│   ├── PriceFeedTab/
│   │   ├── index.js              
│   │   ├── PriceFeedController.js
│   │   ├── PriceFeedView.js      
│   │   └── PriceFeedTab.module.css
│   └── shared/
│       └── ServiceResponse/       # Reusable response display component
│           ├── ServiceResponse.js
│           ├── ServiceResponse.module.css
│           └── index.js
├── lib/                          # Core utilities & SDK integrations
│   ├── livy.js                   # [Livy](https://x.com/livylabs) SDK client wrapper
│   ├── responseParser.js         # Standardized response parsing
│   └── messageExtractor.js       # Service-specific message extraction
├── pages/
│   ├── api/
│   │   └── livy.js              # Next.js API route (CORS proxy)
│   ├── _app.js                  # Next.js app component
│   └── index.js                 # Main page with tab navigation
├── styles/
│   └── globals.css              # Global styles and animations
├── plan.md                      # Project development plan
├── env.example                  # Environment variables template
└── README.md                    # This file
```

## 🏗️ Architecture Overview

### Controller/View Pattern
Each tab follows a clean separation of concerns:

- **`Controller.js`** - Pure business logic and [Livy](https://x.com/livylabs) TEE integration (~45-65 lines)
- **`View.js`** - Pure UI templating and rendering (~50-110 lines)  
- **`index.js`** - Thin connector component (~8 lines)

### Standardized Response Handling
- **`lib/responseParser.js`** - Universal parser for all [Livy](https://x.com/livylabs) service responses
- **`lib/messageExtractor.js`** - Service-specific message extraction patterns
- **`shared/ServiceResponse/`** - Reusable response display component

### Benefits for Presentations
- **Focus on Controllers** - All TEE integration logic in focused files
- **Skip View complexity** - Just mention "ServiceResponse handles rendering"
- **Ignore connectors** - They're just plumbing

## 🎯 Tab Functionality

### 1. Sequence Tab
- **Trigger**: Manual button click with user input
- **Function**: Validates if user's answer equals 5
- **Controller**: Input validation and [Livy](https://x.com/livylabs) service integration
- **Proof**: Verifies the computation was performed correctly

### 2. Time-Aware Tab  
- **Trigger**: Manual button click with time calculation
- **Function**: Validates user's UTC time calculation
- **Controller**: Real-time clock and [Livy](https://x.com/livylabs) service integration
- **Proof**: Verifies the time calculation is accurate

### 3. Coin Toss Tab
- **Trigger**: Form submission (Heads/Tails choice)
- **Function**: Performs random coin flip with user prediction
- **Controller**: Game logic and [Livy](https://x.com/livylabs) service integration
- **Animation**: Spinning coin during request (in View)
- **Proof**: Verifies the randomness is truly random

### 4. Price Feed Tab
- **Trigger**: Manual button click with optional symbol input
- **Function**: Fetches cryptocurrency prices from Coinbase API
- **Controller**: Price data handling and [Livy](https://x.com/livylabs) service integration
- **Proof**: Verifies the price data hasn't been tampered with

## 🔍 Proof Verification & Response Handling

Each tab demonstrates [Livy's](https://x.com/livylabs) cryptographic proof system through the standardized `ServiceResponse` component:

### Response Display Features
- **User-friendly messages** - Clean, formatted success/error messages
- **Proof status badges** - Green ✓ Valid / Red ✗ Invalid indicators  
- **Service-specific displays** - Price cards, game results, validation details
- **Raw output toggle** - View complete JSON response data
- **Function console output** - Show/hide TEE function execution logs

### Standardized Parsing
- **Universal parser** - Handles all [Livy](https://x.com/livylabs) service response formats
- **Error extraction** - Intelligently parses TEE function error messages
- **Technical log cleaning** - Filters out binary paths and execution details
- **Service-specific extraction** - Custom parsing for each tab's data format

## 🎨 Animations

The Coin Toss tab features CSS animations:
- **Coin flip animation**: Rotates the coin while the request is processing
- **Result display**: Shows win/lose state with colored backgrounds
- **Loading states**: Consistent loading spinners across all tabs

## 🛠️ Development Commands

```bash
# Start HTTP development server
npm run dev

# Start HTTPS development server (recommended for Livy API)
npm run dev:https

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

### HTTPS Development Setup

The HTTPS development server uses self-signed certificates for local development. When you first visit `https://localhost:3000`, your browser will show a security warning. This is normal for self-signed certificates.

**To proceed:**
1. Click "Advanced" or "Show Details"
2. Click "Proceed to localhost (unsafe)" or "Accept Risk and Continue"
3. The site will load and CORS issues with the [Livy](https://x.com/livylabs) API will be resolved

The certificates are automatically generated and stored in the `certs/` directory.

## 🔧 SDK Usage Examples

### Controller Pattern
```javascript
// SequenceController.js - Business logic only
import { runService } from '../../lib/livy';
import { parseServiceResponse } from '../../lib/responseParser';

export function useSequenceController() {
  const [loading, setLoading] = useState(false);
  const [parsedResponse, setParsedResponse] = useState(null);
  
  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      // TEE Service Call - Core integration logic
      const response = await runService({
        serviceId: 'a33e2665-1458-4721-840c-f0b3a7a0569b',
        params: { number: userAnswer }
      });
      
      // Use standardized parser
      const parsed = parseServiceResponse(response, null, 'sequence');
      setParsedResponse(parsed);
      
    } catch (error) {
      const parsed = parseServiceResponse(null, error, 'sequence');
      setParsedResponse(parsed);
    } finally {
      setLoading(false);
    }
  };
  
  return { loading, parsedResponse, handleSubmit, /* ... */ };
}
```

### View Pattern
```javascript
// SequenceView.js - Pure templating
import ServiceResponse from '../shared/ServiceResponse';

export default function SequenceView({ 
  loading, parsedResponse, handleSubmit, serviceId, inputParams 
}) {
  return (
    <div>
      {/* UI elements */}
      <button onClick={handleSubmit}>Send Answer</button>
      
      {/* Standardized response display */}
      <ServiceResponse 
        parsedResponse={parsedResponse}
        loading={loading}
        serviceId={serviceId}
        inputParams={inputParams}
      />
    </div>
  );
}
```

### Standardized Response Parsing
```javascript
import { parseServiceResponse } from '../lib/responseParser';

// Handles both success and error cases consistently
const parsed = parseServiceResponse(response, error, 'coin-toss');

console.log('Success:', parsed.success);
console.log('User Message:', parsed.userMessage);
console.log('Extracted Data:', parsed.extractedData);
console.log('Technical Details:', parsed.technicalDetails);
```

## 🔍 Verification Process

1. **Service Execution**: [Livy](https://x.com/livylabs) runs your service in a secure enclave
2. **Attestation Generation**: Creates cryptographic proof of execution
3. **Result Return**: Service output + attestation returned to client
4. **Verification**: Client verifies the attestation using `verifyAttestation()`
5. **Display**: UI shows both result and verification status

## 🚨 Troubleshooting

### Environment Variables Not Loading
- Ensure `.env.local` exists in project root
- Restart the development server after changing environment variables
- Check that variable names match exactly (case-sensitive)
- Make sure both `LIVY_API_KEY` and `NEXT_PUBLIC_LIVY_API_KEY` are set

### CORS Issues
- **Fixed**: Use `npm run dev:https` for HTTPS development
- API calls are proxied through Next.js API routes (`/api/livy`)
- No direct browser calls to [Livy](https://x.com/livylabs) API (bypasses CORS)

### Authentication Errors
- `INVALID_API_KEY`: Check your `LIVY_API_KEY` in `.env.local`
- `TIMEOUT_ERROR`: Service took too long (>30 seconds)
- `SERVICE_NOT_FOUND`: Verify your service IDs are correct
- Check server logs for detailed error messages

### HTTPS Certificate Warnings
- Browser will show security warning for self-signed certificates
- Click "Advanced" → "Proceed to localhost" to continue
- This is normal for local development

### Build Errors
- Run `npm install` to ensure all dependencies are installed
- Check Node.js version (16.x+ required)
- Verify Tailwind CSS is properly configured

## 📚 Learn More

- [Livy Labs](https://x.com/livylabs) - [Documentation](https://docs.livylabs.xyz)
- [Celestia](https://celestia.org/) - Modular blockchain network
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Livy SDK Repository](https://github.com/livylabs/sdk)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`  
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License - see the package.json file for details.

---

**Presented by [Celestia Labs](https://celestia.org/) | Built with ❤️ using [Livy SDK](https://x.com/livylabs), Next.js, and Tailwind CSS** 