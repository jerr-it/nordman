use std::collections::HashMap;

pub struct Account {
    pub email: String,
    pub service: String,
}

impl Account {
    pub fn parse(output: std::process::Output) -> Result<Self, String> {
        let output = String::from_utf8_lossy(&output.stdout);

        if output.contains("You are not logged in") {
            return Err("Not logged in".to_string());
        }

        let table = Self::parse_input_string(&output);

        Ok(Self {
            email: table["Email Address"].to_string(),
            service: table["VPN Service"].to_string(),
        })
    }

    fn parse_input_string(input: &str) -> HashMap<String, String> {
        let mut table = HashMap::new();

        let mut lines = input.split("\n");
        lines.next();
        lines.next();

        for line in lines {
            if line == "" {
                continue;
            }

            let mut line = line.split(": ");
            let key = line.next().unwrap().to_string();
            let value = line.next().unwrap().to_string();

            table.insert(key, value);
        }

        table
    }
}
