# Livy Demo Site

A four-tab demo site showcasing [Livy's](https://livylabs.xyz/) JavaScript SDK (`@livylabs/sdk`) with Next.js and Tailwind CSS, presented by [Celestia Labs](https://celestia.org/). Built with a clean controller/view architecture, this demo demonstrates different use cases for [Livy's](https://livylabs.xyz/) cryptographic proof verification system with standardized response parsing and presentation-ready code organization.

## 🚀 Features

- **Sequence Validator**: Validates that a user-provided number is equal to 5
- **Time-Aware Service**: Calculates minutes remaining until the next hour
- **Coin Toss Game**: Interactive coin flip with win/lose logic and animations
- **Crypto Price Feed**: Fetches real-time cryptocurrency prices from Coinbase API

Each service call returns a cryptographic proof, which is verified to ensure the TEE execution was untampered.

## 📋 Prerequisites

- Node.js 16.x or higher
- npm or yarn package manager
- [Livy](https://livylabs.xyz/) API key and service IDs (see setup instructions below)

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

3. **Edit `.env.local` with your [Livy](https://livylabs.xyz/) credentials:**
   ```env
   # Livy SDK Configuration
   USER_API_KEY=your-api-key-here

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

   > **Note**: Use HTTPS mode to avoid CORS issues with the [Livy](https://livylabs.xyz/) API. The browser may show a security warning for the self-signed certificate - click "Advanced" and "Proceed to localhost" to continue.

## 🔧 Required Environment Variables

| Variable | Description | Required | Usage |
|----------|-------------|----------|-------|
| `USER_API_KEY` | Your [Livy](https://livylabs.xyz/) API authentication key | ✅ Yes | Server-side only (secure) |
| `SEQ_SERVICE_ID` | Service ID for sequence generation | ✅ Yes | Reference only |
| `TIME_SERVICE_ID` | Service ID for time calculations | ✅ Yes | Reference only |
| `COIN_SERVICE_ID` | Service ID for coin toss game | ✅ Yes | Reference only |
| `PRICE_SERVICE_ID` | Service ID for Bitcoin price feed | ✅ Yes | Reference only |

> **Security Note**: The actual API calls are made server-side to avoid CORS issues and keep the API key secure. 

## 🔑 Obtaining [Livy](https://livylabs.xyz/) Service IDs

1. **Sign up for [Livy](https://livylabs.xyz/):**
   - Visit [Livy Labs Console](https://console.livylabs.xyz)
   - Create an account and get your API key

2. **Create Services:**
   You need to create **four separate services** in the [Livy](https://livylabs.xyz/) console:

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
├── livy_functions/
│   ├── coin-toss/
│   │   └── src/main.rs
│   ├── next_number/
│   │   └── src/main.rs
│   ├── price-feed/
│   │   └── src/main.rs
│   └── time-aware/
│       └── src/main.rs
├── lib/                          # Core utilities & SDK integrations
│   ├── livy.js                   # [Livy](https://livylabs.xyz/) SDK client wrapper
│   ├── responseParser.js         # Standardized response parsing
│   └── messageExtractor.js       # Service-specific message extraction
├── pages/
│   ├── api/
│   │   └── livy/
│   │       ├── getBlob.js         # Next.js API route for getting blobs
│   │       └── run.js             # Next.js API route for running services
│   ├── _app.js                  # Next.js app component
│   └── index.js                 # Main page with tab navigation
├── styles/
│   └── globals.css              # Global styles and animations
├── env.example                  # Environment variables template
└── README.md                    # This file
```

## 🏗️ Architecture Overview


<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 683.24609375 406.5015869140626" width="683.24609375" height="406.5015869140626"><!-- svg-source:excalidraw --><metadata></metadata><defs><style class="style-fonts">
      @font-face { font-family: Nunito; src: url(data:font/woff2;base64,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); }</style></defs><rect x="0" y="0" width="683.24609375" height="406.5015869140626" fill="#ffffff"></rect><g stroke-linecap="round" transform="translate(427.80859375 252.8140869140626) rotate(0 122.71875 71.84375)"><path d="M32 0 C98.05 -0.78, 163.46 0.26, 213.44 0 M32 0 C100.42 -1.75, 166.82 -2.47, 213.44 0 M213.44 0 C233.38 -1.24, 246.93 8.69, 245.44 32 M213.44 0 C233.1 0.02, 243.46 11.68, 245.44 32 M245.44 32 C244.75 47.09, 243.66 64.39, 245.44 111.69 M245.44 32 C245.84 54.29, 245.05 76.21, 245.44 111.69 M245.44 111.69 C246.01 133.54, 234.63 142.94, 213.44 143.69 M245.44 111.69 C243.81 133.25, 236.04 145, 213.44 143.69 M213.44 143.69 C149.84 145.2, 83.07 145.6, 32 143.69 M213.44 143.69 C152.62 141.84, 92.13 142.75, 32 143.69 M32 143.69 C9.36 142.79, 1.28 133.63, 0 111.69 M32 143.69 C10.6 143.25, -1.06 131.1, 0 111.69 M0 111.69 C0.72 90.37, 0.91 71.66, 0 32 M0 111.69 C0.84 79.73, -0.05 49.43, 0 32 M0 32 C1.09 10, 9.92 1.27, 32 0 M0 32 C1.79 11.5, 9.09 1.31, 32 0" stroke="#1e1e1e" stroke-width="2" fill="none"></path></g><g transform="translate(465.86939239501953 257.8140869140626) rotate(0 84.65795135498047 17.5)"><text x="84.65795135498047" y="26.712" font-family="Nunito, Segoe UI Emoji" font-size="28px" fill="#1e1e1e" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="alphabetic">Livy Platform</text></g><g stroke-linecap="round" transform="translate(446.02734375 314.0953369140626) rotate(0 48.46875000000001 32.78125)"><path d="M16.39 0 C33.19 -1.45, 47.54 -0.71, 80.55 0 M16.39 0 C37.6 0.85, 58.17 0.13, 80.55 0 M80.55 0 C91.72 0.09, 96.99 6.57, 96.94 16.39 M80.55 0 C91.36 -0.88, 94.78 6.93, 96.94 16.39 M96.94 16.39 C95.95 24.38, 96.5 34.55, 96.94 49.17 M96.94 16.39 C96.35 24.35, 97.08 33.17, 96.94 49.17 M96.94 49.17 C98.22 61.8, 91.36 67.37, 80.55 65.56 M96.94 49.17 C98.17 61.22, 90.38 65.75, 80.55 65.56 M80.55 65.56 C64.99 64.38, 48.36 64.53, 16.39 65.56 M80.55 65.56 C64.51 64.74, 47.64 65.73, 16.39 65.56 M16.39 65.56 C4.46 65.49, 1.04 58.77, 0 49.17 M16.39 65.56 C6.36 66.97, -1.07 61.15, 0 49.17 M0 49.17 C-1.26 37.99, -0.98 21.91, 0 16.39 M0 49.17 C0.06 36.85, -0.3 23.91, 0 16.39 M0 16.39 C-1.69 6.5, 4.54 -0.85, 16.39 0 M0 16.39 C-2.19 3.95, 5.14 1.74, 16.39 0" stroke="#1e1e1e" stroke-width="2" fill="none"></path></g><g transform="translate(457.7161331176758 321.8765869140626) rotate(0 36.77996063232422 25)"><text x="36.77996063232422" y="19.08" font-family="Nunito, Segoe UI Emoji" font-size="20px" fill="#1e1e1e" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="alphabetic">TEE</text><text x="36.77996063232422" y="44.08" font-family="Nunito, Segoe UI Emoji" font-size="20px" fill="#1e1e1e" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="alphabetic">function</text></g><g stroke-linecap="round" transform="translate(551.75 313.7828369140626) rotate(0 48.46875000000001 32.78125)"><path d="M16.39 0 C41.36 1.97, 68.47 1.55, 80.55 0 M16.39 0 C30.2 -0.86, 45.96 0.5, 80.55 0 M80.55 0 C91.22 -0.17, 98.64 3.48, 96.94 16.39 M80.55 0 C90.51 -1.5, 97.48 6.92, 96.94 16.39 M96.94 16.39 C96.93 30.84, 95.34 41.02, 96.94 49.17 M96.94 16.39 C97.35 25, 96.47 33.42, 96.94 49.17 M96.94 49.17 C96.84 61.01, 91.28 64.32, 80.55 65.56 M96.94 49.17 C97.42 58.01, 92.16 66.88, 80.55 65.56 M80.55 65.56 C64.9 64.81, 53.07 65.46, 16.39 65.56 M80.55 65.56 C54.72 66.56, 29.47 65.03, 16.39 65.56 M16.39 65.56 C6.1 66.54, 0.92 60.38, 0 49.17 M16.39 65.56 C4.36 64.82, -1.37 59.27, 0 49.17 M0 49.17 C-1.06 36.95, -0.38 28.73, 0 16.39 M0 49.17 C0.8 41.78, 0.43 34.2, 0 16.39 M0 16.39 C-1.34 4.92, 6.45 1.12, 16.39 0 M0 16.39 C-1.15 5.5, 7.66 -1.17, 16.39 0" stroke="#1e1e1e" stroke-width="2" fill="none"></path></g><g transform="translate(564.0387878417969 321.5640869140626) rotate(0 36.179962158203125 25)"><text x="36.179962158203125" y="19.08" font-family="Nunito, Segoe UI Emoji" font-size="20px" fill="#1e1e1e" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="alphabetic">Celestia</text><text x="36.179962158203125" y="44.08" font-family="Nunito, Segoe UI Emoji" font-size="20px" fill="#1e1e1e" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="alphabetic">Node</text></g><g stroke-linecap="round"><g transform="translate(131.076227025835 154.68512916650894) rotate(0 0.894009830307823 44.703404979137865)"><path d="M1.16 1.06 C1.44 16.33, 1.43 75.73, 1.67 90.59 M0.32 0.57 C0.42 15.63, 0.33 74.47, 0.66 89.09" stroke="#1e1e1e" stroke-width="2" fill="none"></path></g><g transform="translate(131.076227025835 154.68512916650894) rotate(0 0.894009830307823 44.703404979137865)"><path d="M-8.09 65.68 C-3.88 72.47, -1.03 81.12, 0.66 89.09 M-8.09 65.68 C-5.39 73.86, -0.65 82.36, 0.66 89.09" stroke="#1e1e1e" stroke-width="2" fill="none"></path></g><g transform="translate(131.076227025835 154.68512916650894) rotate(0 0.894009830307823 44.703404979137865)"><path d="M9.01 65.53 C8.05 72.53, 5.75 81.22, 0.66 89.09 M9.01 65.53 C5.41 73.67, 3.83 82.22, 0.66 89.09" stroke="#1e1e1e" stroke-width="2" fill="none"></path></g></g><mask></mask><g stroke-linecap="round"><g transform="translate(258.4593183390145 323.99877511887985) rotate(0 84.24377414958008 -0.8057423963281636)"><path d="M-0.61 0.25 C27.32 -0.27, 140 -2.17, 168.11 -2.35 M1.27 -0.67 C28.96 -1.11, 139.33 -0.84, 166.97 -1.21" stroke="#1e1e1e" stroke-width="2" fill="none"></path></g><g transform="translate(258.4593183390145 323.99877511887985) rotate(0 84.24377414958008 -0.8057423963281636)"><path d="M143.52 7.45 C152 3.95, 158.48 0.9, 166.97 -1.21 M143.52 7.45 C152.46 3.68, 160.66 0.58, 166.97 -1.21" stroke="#1e1e1e" stroke-width="2" fill="none"></path></g><g transform="translate(258.4593183390145 323.99877511887985) rotate(0 84.24377414958008 -0.8057423963281636)"><path d="M143.44 -9.65 C152.06 -7.23, 158.57 -4.35, 166.97 -1.21 M143.44 -9.65 C152.43 -7.24, 160.66 -4.16, 166.97 -1.21" stroke="#1e1e1e" stroke-width="2" fill="none"></path></g></g><mask></mask><g stroke-linecap="round" transform="translate(10 10) rotate(0 122.71875 71.84375)"><path d="M32 0 C86.37 -0.87, 142.08 0.53, 213.44 0 M32 0 C94.29 -0.59, 157.97 0.68, 213.44 0 M213.44 0 C234.07 0.06, 245.48 9.31, 245.44 32 M213.44 0 C233.58 1.76, 243.91 11.45, 245.44 32 M245.44 32 C247.67 61.79, 247.22 91.52, 245.44 111.69 M245.44 32 C244.47 56.79, 243.76 82.33, 245.44 111.69 M245.44 111.69 C245.06 134.36, 235.65 143.32, 213.44 143.69 M245.44 111.69 C243.16 131.98, 234.89 145.2, 213.44 143.69 M213.44 143.69 C148.01 143.68, 86.2 143.89, 32 143.69 M213.44 143.69 C142.48 143.96, 69.23 144.34, 32 143.69 M32 143.69 C8.71 145.02, -1.67 132.16, 0 111.69 M32 143.69 C12.33 145.72, -0.77 131.88, 0 111.69 M0 111.69 C2.21 85.53, -0.37 61.43, 0 32 M0 111.69 C1.46 90.49, 0.04 70.75, 0 32 M0 32 C-1.6 9.03, 10.56 1.17, 32 0 M0 32 C-0.92 12.31, 12.5 1.95, 32 0" stroke="#1e1e1e" stroke-width="2" fill="none"></path></g><g transform="translate(64.13278198242188 15) rotate(0 68.58596801757812 17.5)"><text x="68.58596801757812" y="26.712" font-family="Nunito, Segoe UI Emoji" font-size="28px" fill="#1e1e1e" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="alphabetic">ReactJS FE</text></g><g stroke-linecap="round" transform="translate(28.21875 71.28125) rotate(0 48.46875 32.78125)"><path d="M16.39 0 C34.62 -0.26, 50.98 -1.73, 80.55 0 M16.39 0 C31.62 -0.42, 47.56 -1.13, 80.55 0 M80.55 0 C90.44 1.53, 95.61 6.15, 96.94 16.39 M80.55 0 C93.05 0.82, 97.93 7.7, 96.94 16.39 M96.94 16.39 C97.51 24.96, 97.46 37.06, 96.94 49.17 M96.94 16.39 C96.45 25.55, 97.08 33.18, 96.94 49.17 M96.94 49.17 C94.96 59.19, 91.58 66.88, 80.55 65.56 M96.94 49.17 C98.23 60.36, 93.7 64.61, 80.55 65.56 M80.55 65.56 C68.89 64.78, 54.38 66.84, 16.39 65.56 M80.55 65.56 C64.32 66.07, 49.22 64.97, 16.39 65.56 M16.39 65.56 C6.91 67.33, -0.67 59.1, 0 49.17 M16.39 65.56 C5.69 64.03, 0.48 62.03, 0 49.17 M0 49.17 C-0.64 40.47, 0.72 36.24, 0 16.39 M0 49.17 C-0.65 39.98, 0.1 33.02, 0 16.39 M0 16.39 C-0.8 6.89, 7.06 1.69, 16.39 0 M0 16.39 C2.22 3.43, 3.81 -2.2, 16.39 0" stroke="#1e1e1e" stroke-width="2" fill="none"></path></g><g transform="translate(53.367515563964844 91.5625) rotate(0 23.319984436035156 12.5)"><text x="23.319984436035156" y="19.08" font-family="Nunito, Segoe UI Emoji" font-size="20px" fill="#1e1e1e" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="alphabetic">View</text></g><g stroke-linecap="round" transform="translate(133.94140625 70.96875) rotate(0 50.875 32.78125)"><path d="M16.39 0 C35.89 0.36, 59.09 -0.19, 85.36 0 M16.39 0 C36.77 1.23, 57.52 0.81, 85.36 0 M85.36 0 C97.66 0.71, 102.61 7.41, 101.75 16.39 M85.36 0 C96.77 1.72, 102.65 5.84, 101.75 16.39 M101.75 16.39 C100.97 21.22, 101.68 29.26, 101.75 49.17 M101.75 16.39 C100.91 27.96, 101.95 41.1, 101.75 49.17 M101.75 49.17 C102.87 60.32, 98.22 64.73, 85.36 65.56 M101.75 49.17 C99.72 62.35, 94.51 67.77, 85.36 65.56 M85.36 65.56 C64.41 65.12, 45.46 64.22, 16.39 65.56 M85.36 65.56 C60.81 66.15, 34.48 64.77, 16.39 65.56 M16.39 65.56 C5.66 64.23, 0.42 61.78, 0 49.17 M16.39 65.56 C3.76 64.52, -1.05 59.19, 0 49.17 M0 49.17 C-0.99 40.51, 1.02 32.14, 0 16.39 M0 49.17 C-0.38 42.73, 0.82 35.71, 0 16.39 M0 16.39 C1.93 3.69, 4.02 -1.91, 16.39 0 M0 16.39 C1.45 3.34, 6.86 -2.04, 16.39 0" stroke="#1e1e1e" stroke-width="2" fill="none"></path></g><g transform="translate(139.37644958496094 91.25) rotate(0 45.43995666503906 12.5)"><text x="45.43995666503906" y="19.08" font-family="Nunito, Segoe UI Emoji" font-size="20px" fill="#1e1e1e" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="alphabetic">Controller</text></g><g stroke-linecap="round" transform="translate(12.0625 246.5) rotate(0 122.71875 71.84375)"><path d="M32 0 C102.16 -0.35, 171.63 1.42, 213.44 0 M32 0 C95.04 0.4, 157.88 -0.26, 213.44 0 M213.44 0 C234.74 1.23, 245.64 9.47, 245.44 32 M213.44 0 C235.74 -1.4, 245.08 10.35, 245.44 32 M245.44 32 C246.26 54.21, 247.6 77.07, 245.44 111.69 M245.44 32 C244.86 54.37, 245.36 76.97, 245.44 111.69 M245.44 111.69 C245.18 131.99, 234.95 145.45, 213.44 143.69 M245.44 111.69 C247.31 131.71, 234.15 145.2, 213.44 143.69 M213.44 143.69 C165.05 144.64, 114.13 141.25, 32 143.69 M213.44 143.69 C154.23 144.98, 95.96 143.61, 32 143.69 M32 143.69 C12.06 144.99, 0.34 133.65, 0 111.69 M32 143.69 C11.26 144.34, -0.78 132.18, 0 111.69 M0 111.69 C1.25 88.23, 0.95 64.15, 0 32 M0 111.69 C-0.54 89.62, 0.15 66.08, 0 32 M0 32 C1.16 11.24, 9.4 1.3, 32 0 M0 32 C0.18 12.46, 9.88 -1, 32 0" stroke="#1e1e1e" stroke-width="2" fill="none"></path></g><g transform="translate(61.11328125 251.5) rotate(0 73.66796875 35)"><text x="73.66796875" y="26.712" font-family="Nunito, Segoe UI Emoji" font-size="28px" fill="#1e1e1e" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="alphabetic">NextJS API </text><text x="73.66796875" y="61.712" font-family="Nunito, Segoe UI Emoji" font-size="28px" fill="#1e1e1e" text-anchor="middle" style="white-space: pre;" direction="ltr" dominant-baseline="alphabetic"></text></g><g transform="translate(36.48632049560547 311.46875) rotate(0 61.16992950439453 25)"><text x="0" y="19.08" font-family="Nunito, Segoe UI Emoji" font-size="20px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="alphabetic">- /api/livy/run</text><text x="0" y="44.08" font-family="Nunito, Segoe UI Emoji" font-size="20px" fill="#1e1e1e" text-anchor="start" style="white-space: pre;" direction="ltr" dominant-baseline="alphabetic">- /api/livy/getBlob</text></g></svg>  


### Controller/View Pattern
Each tab follows a clean separation of concerns:

- **`Controller.js`** - Pure business logic and [Livy](https://livylabs.xyz/) TEE integration (~45-65 lines)
- **`View.js`** - Pure UI templating and rendering (~50-110 lines)
- **`index.js`** - Thin connector component (~8 lines)

### Standardized Response Handling
- **`lib/responseParser.js`** - Universal parser for all [Livy](https://livylabs.xyz/) service responses
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
- **Controller**: Input validation and [Livy](https://livylabs.xyz/) service integration
- **Proof**: Verifies that the validation logic executed in the TEE without tampering.

### 2. Time-Aware Tab
- **Trigger**: Manual button click with time calculation
- **Function**: Validates user's UTC time calculation
- **Controller**: Real-time clock and [Livy](https://livylabs.xyz/) service integration
- **Proof**: Verifies that the time calculation logic executed in the TEE without tampering.

### 3. Coin Toss Tab
- **Trigger**: Form submission (Heads/Tails choice)
- **Function**: Performs random coin flip with user prediction
- **Controller**: Game logic and [Livy](https://livylabs.xyz/) service integration
- **Animation**: Spinning coin during request (in View)
- **Proof**: Verifies that the random number generation for the coin toss executed in the TEE without tampering.

### 4. Price Feed Tab
- **Trigger**: Manual button click with optional symbol input
- **Function**: Fetches cryptocurrency prices from Coinbase API
- **Controller**: Price data handling and [Livy](https://livylabs.xyz/) service integration
- **Proof**: Verifies that the price-fetching logic executed in the TEE without tampering.

## 🔍 Proof Verification & Response Handling

Each tab demonstrates [Livy's](https://livylabs.xyz/) cryptographic proof system through the standardized `ServiceResponse` component:

### Response Display Features
- **User-friendly messages** - Clean, formatted success/error messages
- **Proof status badges** - Green ✓ Valid / Red ✗ Invalid indicators
- **Service-specific displays** - Price cards, game results, validation details
- **Raw output toggle** - View complete JSON response data
- **Function console output** - Show/hide TEE function execution logs
- **Blob metadata toggle** - View data availability posting details from Celestia
- **Blob content fetch** - Fetch and display the full content of the blob from Celestia

### Standardized Parsing
- **Universal parser** - Handles all [Livy](https://livylabs.xyz/) service response formats
- **Error extraction** - Intelligently parses TEE function error messages
- **Technical log cleaning** - Filters out binary paths and execution details
- **Service--specific extraction** - Custom parsing for each tab's data format

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
3. The site will load and CORS issues with the [Livy](https://livylabs.xyz/) API will be resolved

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

1. **Service Execution**: [Livy](https://livylabs.xyz/) runs your service in a secure enclave
2. **Attestation Generation**: Creates cryptographic proof of execution
3. **Result Return**: Service output + attestation returned to client
4. **Verification**: Client verifies the attestation using `verifyAttestation()`
5. **Display**: UI shows both result and verification status

## 🚨 Troubleshooting

### Environment Variables Not Loading
- Ensure `.env.local` exists in project root
- Restart the development server after changing environment variables
- Check that variable names match exactly (case-sensitive)
- Make sure `USER_API_KEY` is set

### CORS Issues
- **Fixed**: Use `npm run dev:https` for HTTPS development
- API calls are proxied through Next.js API routes (`/api/livy/run` and `/api/livy/getBlob`)
- No direct browser calls to [Livy](https://livylabs.xyz/) API (bypasses CORS)

### Authentication Errors
- `INVALID_API_KEY`: Check your `USER_API_KEY` in `.env.local`
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

- [Livy Labs](https://livylabs.xyz/) - [Documentation](https://docs.livylabs.xyz/)
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

This project is licensed under the Apache License 2.0 - see the LICENSE file for details.

---

**Presented by [Celestia Labs](https://celestia.org/) | Built with ❤️ using [Livy SDK](https://livylabs.xyz/), Next.js, and Tailwind CSS**
