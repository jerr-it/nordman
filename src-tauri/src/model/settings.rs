use serde::Serialize;

use super::parse_terminal_output;

#[derive(Clone, Serialize)]
struct Settings {
    threat_protection_lite: bool,
    firewall: bool,
    kill_switch: bool,
    ipv6: bool,
    custom_dns: Option<String>,

    auto_connect: bool,
    meshnet: bool,
    notify: bool,

    analytics: bool,
}

impl Settings {
    pub fn parse(output: std::process::Output) -> Result<Self, String> {
        let output_str = String::from_utf8(output.stdout).map_err(|e| e.to_string())?;

        let table = parse_terminal_output(output_str);

        let settings = Self {
            threat_protection_lite: table["Threat Protection Lite"] == "enabled",
            firewall: table["Firewall"] == "enabled",
            kill_switch: table["Kill Switch"] == "enabled",
            ipv6: table["IPv6"] == "enabled",
            custom_dns: if table["Custom DNS"] == "disabled" {
                None
            } else {
                Some(table["DNS"].to_string())
            },

            auto_connect: table["Auto-connect"] == "enabled",
            meshnet: table["Meshnet"] == "enabled",
            notify: table["Notify"] == "enabled",

            analytics: table["Analytics"] == "enabled",
        };

        Ok(settings)
    }
}
