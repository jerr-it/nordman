use serde::{Deserialize, Serialize};

use super::parse_table;

#[derive(Clone, Serialize, Deserialize, Default)]
pub struct Settings {
    pub threatprotectionlite: bool,
    pub firewall: bool,
    pub killswitch: bool,
    pub ipv6: bool,
    pub dns: Option<String>,

    pub autoconnect: bool,
    pub meshnet: bool,
    pub notify: bool,

    pub analytics: bool,
}

impl Settings {
    pub fn parse(output: std::process::Output) -> Result<Self, String> {
        let output_str = String::from_utf8(output.stdout).map_err(|e| e.to_string())?;

        let table = parse_table(output_str);

        let settings = Self {
            threatprotectionlite: table["Threat Protection Lite"] == "enabled",
            firewall: table["Firewall"] == "enabled",
            killswitch: table["Kill Switch"] == "enabled",
            ipv6: table["IPv6"] == "enabled",
            dns: if table["DNS"] == "disabled" {
                None
            } else {
                Some(table["DNS"].to_string())
            },

            autoconnect: table["Auto connect"] == "enabled",
            meshnet: table["Meshnet"] == "enabled",
            notify: table["Notify"] == "enabled",

            analytics: table["Analytics"] == "enabled",
        };

        Ok(settings)
    }
}

#[macro_export]
macro_rules! apply_setting {
    ($new:ident, $old:ident, $field:ident) => {
        if $new.$field != $old.$field {
            println!("{}: {} -> {}", stringify!($field), $old.$field, $new.$field);
            let setting = if $new.$field { "enabled" } else { "disabled" };
            let output = cmd!("nordvpn", "set", stringify!($field), setting,)?;

            let out_str = String::from_utf8_lossy(&output.stdout).to_string();
            let result = out_str.contains("successfully") || out_str.contains("already");

            if !result {
                println!("{}", out_str);
                return Ok(false);
            }
        }
    };

    ($new:ident, $old:ident, $field:ident, Option) => {
        if $new.$field != $old.$field {
            println!(
                "{}: {:?} -> {:?}",
                stringify!($field),
                $old.$field,
                $new.$field
            );
            let setting = match $new.$field {
                Some(value) => value,
                None => "disabled".to_string(),
            };
            let output = cmd!("nordvpn", "set", stringify!($field), setting,)?;

            let out_str = String::from_utf8_lossy(&output.stdout).to_string();
            let result = out_str.contains("successfully") || out_str.contains("already");

            if !result {
                println!("{}", out_str);
                return Ok(false);
            }
        }
    };
}
