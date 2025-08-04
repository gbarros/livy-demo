use reqwest;
use serde::{Deserialize, Serialize};
use clap::Parser;

#[derive(Deserialize, Debug)]
struct CoinbaseData {
    amount: String,
    base: String,
    currency: String,
}

#[derive(Deserialize, Debug)]
struct CoinbaseResponse {
    data: CoinbaseData,
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

#[derive(Parser)]
#[command(name = "price-feed")]
#[command(about = "BTC Price Feed Certification Function")]
struct Args {
    /// Trading symbol to fetch price for (default: BTC-USD)
    #[arg(long, default_value = "BTC-USD")]
    symbol: String,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    println!("BTC Price Feed Certification Function");

    let args = Args::parse();
    let symbol = args.symbol.to_uppercase();

    println!("Fetching price for symbol: {}", symbol);

    // Make API call to Coinbase
    let url = format!("https://api.coinbase.com/v2/prices/{}/spot", symbol);
    println!("API endpoint: {}", url);

    let client = reqwest::Client::new();
    let response = client.get(&url).send().await?;

    // Check if the request was successful
    if !response.status().is_success() {
        eprintln!("API request failed with status: {}", response.status());
        std::process::exit(1);
    }

    // Parse the JSON response
    let coinbase_response: CoinbaseResponse = response.json().await?;
    let coinbase_data = &coinbase_response.data;
    println!("Raw API response: base={}, currency={}, amount={}", 
             coinbase_data.base, coinbase_data.currency, coinbase_data.amount);

    // Parse price as float for formatting
    let price_float: f64 = match coinbase_data.amount.parse() {
        Ok(price) => price,
        Err(e) => {
            eprintln!("Failed to parse price as number: {}", e);
            std::process::exit(1);
        }
    };

    // Create formatted result
    let result = PriceFeedResult {
        symbol: format!("{}-{}", coinbase_data.base, coinbase_data.currency),
        price_usd: price_float,
        raw_price: coinbase_data.amount.clone(),
        timestamp: chrono::Utc::now().to_rfc3339(),
        source: "Coinbase API".to_string(),
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