use rand::Rng;
use std::env;

fn main() {
    println!("Coin Toss Certification Function");

    // Collect command-line arguments
    let args: Vec<String> = env::args().collect();

    // Look for the --choice parameter
    let mut user_choice: Option<String> = None;

    for arg in args.iter().skip(1) {
        if arg.starts_with("--choice=") {
            let value_str = arg.split('=').nth(1).unwrap_or("").to_lowercase();
            if value_str == "head" || value_str == "heads" || value_str == "tail" || value_str == "tails" {
                // Normalize to singular form
                let normalized = if value_str.starts_with("head") { "head" } else { "tail" };
                user_choice = Some(normalized.to_string());
                break;
            } else {
                eprintln!("Error: Invalid choice '{}'. Must be 'head' or 'tail'", value_str);
                std::process::exit(1);
            }
        }
    }

    // Check if choice parameter was provided
    let user_guess = match user_choice {
        Some(choice) => choice,
        None => {
            eprintln!("Error: --choice parameter is required");
            println!("Usage: --choice=head or --choice=tail");
            std::process::exit(1);
        }
    };

    // Generate random number for server coin toss
    let mut rng = rand::thread_rng();
    let random_number: u32 = rng.gen();
    
    // Use even/odd to determine coin result (even = heads, odd = tails)
    let server_result = if random_number % 2 == 0 { "head" } else { "tail" };

    println!("Your guess: {}", user_guess);
    println!("Random number generated: {}", random_number);
    println!("Server coin toss result: {}", server_result);

    // Check if user won
    if user_guess == server_result {
        println!("🎉 You WIN! Your guess '{}' matches the server result '{}'!", user_guess, server_result);
    } else {
        // Use assertion to fail on loss for consistency with other functions
        assert_eq!(
            user_guess, 
            server_result, 
            "You LOSE! You guessed '{}' but the coin landed on '{}'",
            user_guess,
            server_result
        );
    }
} 