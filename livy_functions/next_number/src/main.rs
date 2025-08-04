use clap::Parser;

#[derive(Parser)]
#[command(name = "next_number")]
#[command(about = "Number Certification Function")]
struct Args {
    /// The number to certify (must be 5)
    #[arg(long)]
    number: Option<i32>,
}

fn main() {
    println!("Number Certification Function");

    let args = Args::parse();

    // Check if number parameter was provided
    let number = match args.number {
        Some(num) => num,
        None => {
            eprintln!("Error: --number parameter is required");
            println!("Usage: --number=5");
            std::process::exit(1);
        }
    };

    println!("Received number: {}", number);

    // Assert that the number is 5
    assert_eq!(number, 5, "You've got the wrong number! Expected 5, got {}", number);

    println!("✅ Success! Number {} is certified as correct.", number);
} 