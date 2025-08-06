use chrono::{Utc, Timelike};
use clap::Parser;

#[derive(Parser)]
#[command(name = "time-aware")]
#[command(about = "Time-Aware Certification Function")]
struct Args {
    /// Minutes left until next hour
    #[arg(long)]
    minutes: Option<u32>,
}

fn main() {
    println!("Time-Aware Certification Function");

    let args = Args::parse();

    // Check if minutes parameter was provided
    let user_minutes = match args.minutes {
        Some(num) => num,
        None => {
            eprintln!("Error: --minutes parameter is required");
            println!("Usage: --minutes=12");
            std::process::exit(1);
        }
    };

    // Get current UTC time
    let now = Utc::now();
    let current_minute = now.minute();
    
    // Calculate minutes left until next hour
    let minutes_left = if current_minute == 0 {
        60  // If it's exactly on the hour, 60 minutes until next hour
    } else {
        60 - current_minute
    };

    println!("Current UTC time: {}:{:02}", now.hour(), current_minute);
    println!("Minutes left until next hour: {}", minutes_left);
    println!("User provided: {}", user_minutes);

    // Assert that the user's input matches the actual minutes left
    assert_eq!(
        user_minutes, 
        minutes_left, 
        "You've got the wrong number of minutes! Expected {} minutes left, but you said {}",
        minutes_left,
        user_minutes
    );

    println!("✅ Success! You correctly identified {} minutes left until the next hour.", minutes_left);
} 