use chrono::{Utc, Timelike};
use std::env;

fn main() {
    println!("Time-Aware Certification Function");

    // Collect command-line arguments
    let args: Vec<String> = env::args().collect();

    // Look for the --minutes parameter
    let mut minutes_value: Option<u32> = None;

    for arg in args.iter().skip(1) {
        if arg.starts_with("--minutes=") {
            let value_str = arg.split('=').nth(1).unwrap_or("");
            match value_str.parse::<u32>() {
                Ok(num) => {
                    minutes_value = Some(num);
                    break;
                }
                Err(_) => {
                    eprintln!("Error: Invalid number format in --minutes parameter");
                    std::process::exit(1);
                }
            }
        }
    }

    // Check if minutes parameter was provided
    let user_minutes = match minutes_value {
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