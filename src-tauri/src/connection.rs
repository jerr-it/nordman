use std::collections::HashMap;

use serde::Serialize;

#[derive(Serialize, Clone)]
pub struct ConnectionState {
    connected: bool,
    con_details: Option<ConnectionDetails>,
}

impl ConnectionState {
    pub fn new() -> Self {
        Self {
            connected: false,
            con_details: None,
        }
    }

    pub fn is_connected(&self) -> bool {
        self.connected
    }

    pub fn connect(&mut self, details: ConnectionDetails) {
        self.connected = true;
        self.con_details = Some(details);
    }

    pub fn disconnect(&mut self) {
        self.connected = false;
        self.con_details = None;
    }
}

macro_rules! table_struct {
    (
        $(#[$struct_meta:meta])*
        $v:vis struct $name:ident {
            $(
                $field:ident: String,
            )*
        }
    ) => {
        $(#[$struct_meta])*
        $v struct $name {
            $(
                $field: String,
            )*
        }

        impl $name {
            fn parse_input_string(input: &str) -> HashMap<String, String> {
                let mut table = HashMap::new();

                let lines = input.split("\n");

                for line in lines {
                    let mut line = line.split(": ");
                    let key = line.next().unwrap().to_string();
                    let value = line.next().unwrap().to_string();

                    table.insert(key, value);
                }

                table
            }

            pub fn from_terminal_output(output: String) -> Result<Self, String> {
                let table = Self::parse_input_string(&output);
                if table.get("Status").unwrap() == "Disconnected" {
                    return Err("Not connected".to_string());
                }

                Ok(Self {
                    $(
                        $field: table.get(stringify!($field)).unwrap().to_string(),
                    )*
                })
            }
        }
    };
}

// TODO?: more appropriate name for macro
table_struct!(
    #[derive(Serialize, Clone)]
    pub struct ConnectionDetails {
        hostname: String,
        ip: String,
        country: String,
        city: String,
        technology: String,
        protocol: String,
        received_bytes: String,
        sent_bytes: String,
        uptime: String,
    }
);
