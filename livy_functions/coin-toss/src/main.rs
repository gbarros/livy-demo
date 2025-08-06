use rand::Rng;
use clap::{Parser, ValueEnum};

#[derive(ValueEnum, Clone, Debug, PartialEq)]
enum Choice {
    Head,
    Tail, 
}

impl Choice {
    fn normalize(&self) -> &'static str {
        match self {
            Choice::Head => "head",
            Choice::Tail => "tail",
        }
    }
}

#[derive(Parser, Debug)]
#[command(author, version, about, long_about = None)]
struct Args {
    /// Your coin toss choice (head/tail)
    #[arg(short, long)]
    choice: Choice,
}

fn main() {
    println!("Coin Toss Certification Function");

    let args = Args::parse();
    let user_guess = args.choice.normalize();

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