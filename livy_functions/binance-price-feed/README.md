# Binance Price Feed TEE Function

This is a Rust command-line program designed to run in a Trusted Execution Environment (TEE) that fetches and certifies Bitcoin price data from the Binance API.

## Function Overview

The program makes an API call to Binance's public price endpoint, fetches the current BTC price in USD, and formats it as a certified price feed result:
- **Success**: Fetches price data, formats it nicely, and outputs both human-readable and JSON formats
- **Failure**: If the API call fails or data is invalid, the program exits with an error

## Usage

```bash
# Fetch BTC price (default)
./livy-service

# Fetch specific symbol price  
./livy-service --symbol=ETHUSDT
./livy-service --symbol=ADAUSDT
```

## Expected Output

### Success Case
```
BTC Price Feed Certification Function
Fetching price for symbol: BTCUSDT
API endpoint: https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT
Raw API response: symbol=BTCUSDT, price=118746.10000000

✅ CERTIFIED PRICE FEED RESULT:
Symbol: BTCUSDT
Price (USD): $118746.10
Raw Price: 118746.10000000
Timestamp: 2025-01-22T16:30:45.123Z
Source: Binance API
Certified: true

JSON Output:
{
  "symbol": "BTCUSDT",
  "price_usd": 118746.1,
  "raw_price": "118746.10000000",
  "timestamp": "2025-01-22T16:30:45.123Z",
  "source": "Binance API",
  "certified": true
}

🎉 Price feed successfully certified and notarized in TEE!
```

### Failure Case (Invalid Symbol)
```
BTC Price Feed Certification Function
Fetching price for symbol: INVALID
API endpoint: https://api.binance.com/api/v3/ticker/price?symbol=INVALID
API request failed with status: 400 Bad Request
```

## Technical Details

- **API Endpoint**: `https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT`
- **HTTP Client**: Uses `reqwest` for async HTTP requests
- **Response Format**: Parses Binance JSON response: `{"symbol":"BTCUSDT","price":"118746.10000000"}`
- **Output Formats**: Both human-readable display and structured JSON
- **Timestamp**: Adds UTC timestamp for when the price was certified
- **Error Handling**: Validates API response and price parsing

## Use Cases in TEE

This demonstrates how TEE can be used to:
- **Certify external data sources** (price feeds, market data)
- **Create trusted oracles** for blockchain applications  
- **Notarize API responses** with verifiable timestamps
- **Provide secure price feeds** for DeFi applications

## Building

```bash
cargo build --release
```

## Dependencies

- `reqwest` - HTTP client for API calls
- `serde` + `serde_json` - JSON parsing and serialization
- `tokio` - Async runtime
- `chrono` - Timestamp generation

## Usage in TEE Environment

The compiled binary `livy-service` makes HTTP requests to external APIs and certifies the responses within the trusted execution environment, providing verifiable proof that the data came from the specified source at a specific time. 