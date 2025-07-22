# Time-Aware TEE Function

This is a simple Rust command-line program designed to run in a Trusted Execution Environment (TEE) that validates the user knows how many minutes are left until the next hour.

## Function Overview

The program takes a command-line argument `--minutes=X` and asserts that the number matches the actual minutes left until the next hour (in UTC):
- **Success**: If the user provides the correct number of minutes left, prints success message and exits normally
- **Failure**: If the number is wrong, the assertion fails and the program panics with an error message

## Usage

```bash
# If current UTC time is 13:48, user should send 12 minutes
./livy-service --minutes=12

# Wrong answer example
./livy-service --minutes=10
```

## Expected Output

### Success Case (correct minutes)
```
Time-Aware Certification Function
Current UTC time: 13:48
Minutes left until next hour: 12
User provided: 12
✅ Success! You correctly identified 12 minutes left until the next hour.
```

### Failure Case (wrong minutes)
```
Time-Aware Certification Function
Current UTC time: 13:48
Minutes left until next hour: 12
User provided: 10
thread 'main' panicked at src/main.rs:XX:X:
assertion failed: `(left == right)`
  left: `10`,
 right: `12`: You've got the wrong number of minutes! Expected 12 minutes left, but you said 10
```

## Technical Details

- Uses **UTC time** to avoid timezone complications
- Calculates minutes left as: `60 - current_minute` (or 60 if exactly on the hour)
- Requires `chrono` crate for reliable time handling

## Building

```bash
cargo build --release
```

## Usage in TEE Environment

The compiled binary `livy-service` accepts command-line arguments in the format `--minutes=X` where X is the number of minutes left until the next hour in UTC. The program uses assertion to verify the user's input matches the actual time calculation. 