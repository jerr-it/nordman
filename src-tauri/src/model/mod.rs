use std::collections::HashMap;

mod account;
pub use account::Account;

mod connection;
pub use connection::ConnectionDetails;

mod settings;
pub use settings::Settings;

/// Method for parsing terminal output formatted as a table
pub fn parse_table(input: String) -> HashMap<String, String> {
    let mut table = HashMap::new();

    let lines = input
        .split("\n")
        .filter(|line| !line.contains("New feature"))
        .filter(|line| !line.contains("new version"))
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

/// Method for parsing terminal output formatted as a comma-separated list
pub fn parse_list(input: String) -> Vec<String> {
    let lines = input
        .split("\n")
        .filter(|line| !line.contains("New feature"))
        .filter(|line| !line.contains("new version"))
        .collect::<Vec<&str>>();

    let list = lines[0]
        .split(",")
        .map(|name| name.replace("-", " ").trim().to_string())
        .collect::<Vec<String>>();

    list
}
