use std::collections::HashMap;

use serde::Serialize;

#[derive(Serialize, Clone)]
pub struct ConnectionState {
    connected: bool,
    conn_details: Option<ConnectionDetails>,
}

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

impl ConnectionState {
    pub fn new() -> Self {
        Self {
            connected: false,
            conn_details: None,
        }
    }

    pub fn parse(output: std::process::Output) -> Result<Self, String> {
        let output = String::from_utf8(output.stdout).map_err(|e| e.to_string())?;

        let table = parse_input_to_table(output);
        println!("{:?}", table);

        let connected = table.get("Status").ok_or("Status not found")? == "Connected";

        let conn_details = if connected {
            Some(ConnectionDetails::from_table(table)?)
        } else {
            None
        };

        Ok(Self {
            connected,
            conn_details,
        })
    }
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
    pub fn from_table(table: HashMap<String, String>) -> Result<Self, String> {
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
