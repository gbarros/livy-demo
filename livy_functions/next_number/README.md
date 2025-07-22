# Next Number TEE Function

This is a simple Rust command-line program designed to run in a Trusted Execution Environment (TEE) that certifies whether an input number is exactly 5.

## Function Overview

The program takes a command-line argument `--number=X` and asserts that the number is exactly 5:
- **Success**: If the number is 5, prints success message and exits normally
- **Failure**: If the number is not 5, the assertion fails and the program panics with an error message

## Usage

```bash
# Success case
./livy-service --number=5

# Failure case  
./livy-service --number=4
```

## Expected Output

### Success Case (`--number=5`)
```
Number Certification Function
Received number: 5
✅ Success! Number 5 is certified as correct.
```

### Failure Case (`--number=4`)
```
Number Certification Function
Received number: 4
thread 'main' panicked at src/main.rs:35:5:
assertion failed: `(left == right)`
  left: `4`,
 right: `5`: You've got the wrong number! Expected 5, got 4
```

## Building

```bash
cargo build --release
```

## Usage in TEE Environment

The compiled binary `livy-service` accepts command-line arguments in the format `--number=X` where X is the number to verify. The program uses a simple assertion to verify the number equals 5. 