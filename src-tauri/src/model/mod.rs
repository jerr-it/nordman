mod country_list;
use std::collections::HashMap;

pub use country_list::CountryList;

mod cities_list;
pub use cities_list::CitiesList;

mod account;
pub use account::Account;

mod connection;
pub use connection::ConnectionDetails;

mod settings;

fn parse_terminal_output(input: String) -> HashMap<String, String> {
    let mut table = HashMap::new();

    let mut lines = input.split("\n");
    lines.next();

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
