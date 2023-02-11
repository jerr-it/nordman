use serde::{Deserialize, Serialize};

use super::parse_table;

#[derive(Clone, Serialize, Deserialize, Default)]
pub struct Settings {
    pub threat_protection_lite: bool,
    pub firewall: bool,
    pub kill_switch: bool,
    pub ipv6: bool,
    pub custom_dns: Option<String>,

    pub auto_connect: bool,
    pub meshnet: bool,
    pub notify: bool,

    pub analytics: bool,
}

impl Settings {
    pub fn parse(output: std::process::Output) -> Result<Self, String> {
        let output_str = String::from_utf8(output.stdout).map_err(|e| e.to_string())?;

        let table = parse_table(output_str);

        let settings = Self {
            threat_protection_lite: table["Threat Protection Lite"] == "enabled",
            firewall: table["Firewall"] == "enabled",
            kill_switch: table["Kill Switch"] == "enabled",
            ipv6: table["IPv6"] == "enabled",
            custom_dns: if table["DNS"] == "disabled" {
                None
            } else {
                Some(table["DNS"].to_string())
            },

            auto_connect: table["Auto connect"] == "enabled",
            meshnet: table["Meshnet"] == "enabled",
            notify: table["Notify"] == "enabled",

            analytics: table["Analytics"] == "enabled",
        };

        Ok(settings)
    }
}

#[macro_export]
macro_rules! check_and_apply {
    ($new:ident, $old:ident, $field:ident, $name:literal) => {
        if $new.$field != $old.$field {
            let setting = if $new.$field { "enabled" } else { "disabled" };
            let output = cmd!("nordvpn", "set", $name, setting,)?;
            let result = String::from_utf8_lossy(&output.stdout)
                .to_string()
                .contains("successfully");

            if !result {
                return Ok(false);
            }
        }
    };

    ($new:ident, $old:ident, $field:ident, $name:literal, Option) => {
        if $new.$field != $old.$field {
            let setting = match $new.$field {
                Some(value) => value,
                None => "disabled".to_string(),
            };
            let output = cmd!("nordvpn", "set", $name, setting,)?;
            let result = String::from_utf8_lossy(&output.stdout)
                .to_string()
                .contains("successfully");

            if !result {
                return Ok(false);
            }
        }
    };
}
