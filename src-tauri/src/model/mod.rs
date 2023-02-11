use std::collections::HashMap;

mod account;
pub use account::Account;

mod connection;
pub use connection::ConnectionDetails;

mod settings;
pub use settings::Settings;

pub mod locations;

fn parse_terminal_output(input: String) -> HashMap<String, String> {
    let mut table = HashMap::new();

    let lines = input
        .split("\n")
        .filter(|line| !line.contains("New feature"))
        .collect::<Vec<&str>>();

    for line in lines {
        if line == "" {
            continue;
        }

        let mut split = line.split(": ");

        let key = split
            .next()
            .unwrap_or("")
            .replace("-", " ")
            .trim()
            .to_string();
        let value = split.next().unwrap_or("").to_string();

        table.insert(key, value);
    }

    table
}
