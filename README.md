# Livy Demo Site

A four-tab demo site showcasing Livy's JavaScript SDK (`@livylabs/sdk`) with Next.js and Tailwind CSS. Each tab demonstrates different use cases for Livy's cryptographic proof verification system.

## 🚀 Features

- **Sequence Generator**: Auto-triggers on page load to generate the next number in a sequence
- **Time-Aware Service**: Calculates minutes remaining until the next hour 
- **Coin Toss Game**: Interactive coin flip with win/lose logic and animations
- **Bitcoin Price Feed**: Fetches real-time BTC→USD exchange rates

Each service call includes cryptographic proof verification to ensure data authenticity and integrity.

## 📋 Prerequisites

- Node.js 16.x or higher
- npm or yarn package manager
- Livy API key and service IDs (see setup instructions below)

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

3. **Edit `.env.local` with your Livy credentials:**
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

   > **Note**: Use HTTPS mode to avoid CORS issues with the Livy API. The browser may show a security warning for the self-signed certificate - click "Advanced" and "Proceed to localhost" to continue.

## 🔧 Required Environment Variables

| Variable | Description | Required | Usage |
|----------|-------------|----------|-------|
| `LIVY_API_KEY` | Your Livy API authentication key | ✅ Yes | Server-side only (secure) |
| `NEXT_PUBLIC_LIVY_API_KEY` | API key for client display | ✅ Yes | Client-side (display only) |
| `LIVY_BASE_URL` | Livy API base URL | ✅ Yes | Server-side |
| `SEQ_SERVICE_ID` | Service ID for sequence generation | ✅ Yes | Reference only |
| `TIME_SERVICE_ID` | Service ID for time calculations | ✅ Yes | Reference only |
| `COIN_SERVICE_ID` | Service ID for coin toss game | ✅ Yes | Reference only |
| `PRICE_SERVICE_ID` | Service ID for Bitcoin price feed | ✅ Yes | Reference only |

> **Security Note**: The actual API calls are made server-side using `LIVY_API_KEY` to avoid CORS issues and keep the API key secure. The `NEXT_PUBLIC_` version is only used for display purposes in the UI.

## 🔑 Obtaining Livy Service IDs

1. **Sign up for Livy:**
   - Visit [Livy Labs Console](https://console.livylabs.xyz)
   - Create an account and get your API key

2. **Create Services:**
   You need to create **four separate services** in the Livy console:
   
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
├── components/           # React components for each tab
│   ├── SequenceTab.js   # Auto-triggering sequence generator
│   ├── TimeAwareTab.js  # Time calculation service
│   ├── CoinTossTab.js   # Interactive coin toss game
│   └── PriceFeedTab.js  # Bitcoin price fetcher
├── lib/
│   └── livy.js          # Livy SDK client wrapper
├── pages/
│   ├── _app.js          # Next.js app component
│   └── index.js         # Main page with tab navigation
├── styles/
│   └── globals.css      # Global styles and animations
├── plan.md              # Project development plan
├── env.example          # Environment variables template
└── README.md            # This file
```

## 🎯 Tab Functionality

### 1. Sequence Tab
- **Trigger**: Automatic on component mount (`useEffect`)
- **Function**: Generates the next number in a sequence
- **Proof**: Verifies the computation was performed correctly

### 2. Time-Aware Tab  
- **Trigger**: Manual button click
- **Function**: Calculates minutes remaining until next hour
- **Proof**: Verifies the time calculation is accurate

### 3. Coin Toss Tab
- **Trigger**: Form submission (Heads/Tails choice)
- **Function**: Performs random coin flip with user prediction
- **Animation**: Spinning coin during request
- **Proof**: Verifies the randomness is truly random

### 4. Price Feed Tab
- **Trigger**: Manual button click  
- **Function**: Fetches current Bitcoin to USD exchange rate
- **Proof**: Verifies the price data hasn't been tampered with

## 🔍 Proof Verification

Each tab demonstrates Livy's cryptographic proof system:

- **Green ✓ Valid**: The computation/data has been cryptographically verified
- **Red ✗ Invalid**: The proof verification failed
- **Raw JSON**: Shows the complete service response including proof data

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
3. The site will load and CORS issues with the Livy API will be resolved

The certificates are automatically generated and stored in the `certs/` directory.

## 🔧 SDK Usage Examples

### Basic Service Call
```javascript
import { runService } from '../lib/livy';

const result = await runService({
  serviceId: 'your-service-id-here'
});

console.log('Output:', result.output);
console.log('Proof Valid:', result.proofValid);
```

### Service Call with Input Parameters
```javascript
const result = await runService({
  serviceId: 'your-service-id-here',
  input: { userChoice: 'heads' }
});
```

### Error Handling
```javascript
import { SDKError } from '@livylabs/sdk';

try {
  const result = await runService({ serviceId: 'invalid-id' });
} catch (err) {
  if (err instanceof SDKError) {
    console.log('SDK Error Code:', err.code);
    console.log('SDK Error Message:', err.message);
  } else {
    console.log('General Error:', err.message);
  }
}
```

## 🔍 Verification Process

1. **Service Execution**: Livy runs your service in a secure enclave
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
- No direct browser calls to Livy API (bypasses CORS)

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

- [Livy Labs Documentation](https://docs.livylabs.xyz)
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

**Built with ❤️ using Livy SDK, Next.js, and Tailwind CSS** 