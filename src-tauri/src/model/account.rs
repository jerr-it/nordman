use super::parse_terminal_output;

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

        let table = parse_terminal_output(output.to_string());

        Ok(Self {
            email: table["Email Address"].to_string(),
            service: table["VPN Service"].to_string(),
        })
    }
}
