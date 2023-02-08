use std::collections::HashMap;

use serde::Serialize;

fn parse_input_to_table(input: String) -> HashMap<String, String> {
    let mut table = HashMap::new();

    let mut lines = input.split("\n");
    lines.next();

    for line in lines {
        if line == "" {
            continue;
        }

        let mut split = line.split(": ");

        let key = split.next().unwrap().replace("-", " ").trim().to_string();
        let value = split.next().unwrap().to_string();

        table.insert(key, value);
    }

    table
}

#[derive(Serialize, Clone)]
pub struct ConnectionDetails {
    hostname: String,
    ip: String,
    country: String,
    city: String,
    current_technology: String,
    current_protocol: String,
    transfer: String,
    uptime: String,
}

impl ConnectionDetails {
    pub fn parse(output: std::process::Output) -> Result<Self, String> {
        let table = parse_input_to_table(String::from_utf8_lossy(&output.stdout).to_string());

        let hostname = table.get("Hostname").ok_or("No hostname")?.to_string();

        let ip = table.get("IP").ok_or("No IP")?.to_string();

        let country = table.get("Country").ok_or("No country")?.to_string();

        let city = table.get("City").ok_or("No city")?.to_string();

        let current_technology = table
            .get("Current technology")
            .ok_or("No current technology")?
            .to_string();

        let current_protocol = table
            .get("Current protocol")
            .ok_or("No current protocol")?
            .to_string();

        let transfer = table.get("Transfer").ok_or("No transfer")?.to_string();

        let uptime = table.get("Uptime").ok_or("No uptime")?.to_string();

        Ok(Self {
            hostname,
            ip,
            country,
            city,
            current_technology,
            current_protocol,
            transfer,
            uptime,
        })
    }
}
