use std::env;

fn main() {
    println!("Number Certification Function");

    // Collect command-line arguments
    let args: Vec<String> = env::args().collect();

    // Look for the --number parameter
    let mut number_value: Option<i32> = None;

    for arg in args.iter().skip(1) {
        if arg.starts_with("--number=") {
            let value_str = arg.split('=').nth(1).unwrap_or("");
            match value_str.parse::<i32>() {
                Ok(num) => {
                    number_value = Some(num);
                    break;
                }
                Err(_) => {
                    eprintln!("Error: Invalid number format in --number parameter");
                    std::process::exit(1);
                }
            }
        }
    }

    // Check if number parameter was provided
    let number = match number_value {
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