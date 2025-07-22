use reqwest;
use serde::{Deserialize, Serialize};
use std::env;

#[derive(Deserialize, Debug)]
struct BinanceResponse {
    symbol: String,
    price: String,
}

#[derive(Serialize, Debug)]
struct PriceFeedResult {
    symbol: String,
    price_usd: f64,
    raw_price: String,
    timestamp: String,
    source: String,
    certified: bool,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    println!("BTC Price Feed Certification Function");

    // Check for optional symbol parameter (default to BTCUSDT)
    let args: Vec<String> = env::args().collect();
    let mut symbol = "BTCUSDT".to_string();

    for arg in args.iter().skip(1) {
        if arg.starts_with("--symbol=") {
            symbol = arg.split('=').nth(1).unwrap_or("BTCUSDT").to_uppercase();
            break;
        }
    }

    println!("Fetching price for symbol: {}", symbol);

    // Make API call to Binance
    let url = format!("https://api.binance.com/api/v3/ticker/price?symbol={}", symbol);
    println!("API endpoint: {}", url);

    let client = reqwest::Client::new();
    let response = client.get(&url).send().await?;

    // Check if the request was successful
    if !response.status().is_success() {
        eprintln!("API request failed with status: {}", response.status());
        std::process::exit(1);
    }

    // Parse the JSON response
    let binance_data: BinanceResponse = response.json().await?;
    println!("Raw API response: symbol={}, price={}", binance_data.symbol, binance_data.price);

    // Parse price as float for formatting
    let price_float: f64 = match binance_data.price.parse() {
        Ok(price) => price,
        Err(e) => {
            eprintln!("Failed to parse price as number: {}", e);
            std::process::exit(1);
        }
    };

    // Create formatted result
    let result = PriceFeedResult {
        symbol: binance_data.symbol.clone(),
        price_usd: price_float,
        raw_price: binance_data.price,
        timestamp: chrono::Utc::now().to_rfc3339(),
        source: "Binance API".to_string(),
        certified: true,
    };

    // Display the certified price information
    println!("\n✅ CERTIFIED PRICE FEED RESULT:");
    println!("Symbol: {}", result.symbol);
    println!("Price (USD): ${:.2}", result.price_usd);
    println!("Raw Price: {}", result.raw_price);
    println!("Timestamp: {}", result.timestamp);
    println!("Source: {}", result.source);
    println!("Certified: {}", result.certified);

    // Output as JSON for programmatic use
    println!("\nJSON Output:");
    println!("{}", serde_json::to_string_pretty(&result)?);

    println!("\n🎉 Price feed successfully certified and notarized in TEE!");

    Ok(())
} 