# Coin Toss TEE Function

This is a simple Rust command-line program designed to run in a Trusted Execution Environment (TEE) that simulates a coin toss game where the user tries to guess the outcome.

## Function Overview

The program takes a command-line argument `--choice=X` where X is either "head" or "tail", generates a random number to determine the server's coin toss result, and compares them:
- **Win**: If the user's guess matches the server's random result, prints success message and exits normally
- **Lose**: If the guess is wrong, the assertion fails and the program panics with an error message

## Usage

```bash
# Guess heads
./livy-service --choice=head

# Guess tails  
./livy-service --choice=tail

# Also accepts plural forms
./livy-service --choice=heads
./livy-service --choice=tails
```

## Expected Output

### Win Case (lucky guess)
```
Coin Toss Certification Function
Your guess: head
Random number generated: 1234567890
Server coin toss result: head
🎉 You WIN! Your guess 'head' matches the server result 'head'!
```

### Lose Case (unlucky guess)
```
Coin Toss Certification Function
Your guess: tail
Random number generated: 1234567891
Server coin toss result: head
thread 'main' panicked at src/main.rs:XX:X:
assertion failed: `(left == right)`
  left: `tail`,
 right: `head`: You LOSE! You guessed 'tail' but the coin landed on 'head'
```

## Technical Details

- Uses `rand` crate for cryptographically secure random number generation
- **Logic**: Even random numbers = heads, odd random numbers = tails
- Accepts both singular ("head"/"tail") and plural ("heads"/"tails") forms
- Shows the actual random number generated for transparency
- Uses assertion to fail on loss for consistency with other TEE functions

## Building

```bash
cargo build --release
```

## Usage in TEE Environment

The compiled binary `livy-service` accepts command-line arguments in the format `--choice=head` or `--choice=tail`. The program generates a random number and uses even/odd logic to determine the coin toss result, then compares it with the user's guess. 