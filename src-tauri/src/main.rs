#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod model;
use std::{collections::HashMap, process::Command};

use model::{locations, Account, ConnectionDetails, Settings};

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

macro_rules! cmd {
    ($cmd:expr, $($args:expr,)*) => {
        Command::new($cmd)
            $(
                .arg($args)
            )*
            .output()
            .map_err(|e| e.to_string())
    };
}

/// Returns the browser link for logging in to NordVPN
#[tauri::command]
async fn nordvpn_login() -> Result<String, String> {
    let output = cmd!("nordvpn", "login",)?;

    let res = String::from_utf8_lossy(&output.stdout)
        .to_string()
        .split("browser: ")
        .last()
        .unwrap()
        .to_string();

    Ok(res)
}

/// Returns true if the user is logged in to NordVPN
#[tauri::command]
async fn nordvpn_is_logged_in() -> Result<bool, String> {
    let output = cmd!("nordvpn", "account",)?;

    match Account::parse(output) {
        Ok(_) => Ok(true),
        Err(_) => Ok(false),
    }
}

#[tauri::command]
async fn nordvpn_locations() -> Result<HashMap<String, Vec<String>>, String> {
    let output = cmd!("nordvpn", "countries",)?;
    let countries = locations::parse_countries(output);

    let mut locations = HashMap::new();

    for country in countries.iter() {
        let output = cmd!("nordvpn", "cities", country,)?;
        let cities = locations::parse_cities(output);

        locations.insert(country.to_string(), cities);
    }

    Ok(locations)
}

#[tauri::command]
async fn nordvpn_connect(country: String, city: Option<String>) -> Result<bool, String> {
    let output = match city {
        Some(city) => cmd!("nordvpn", "connect", country, city,)?,
        None => cmd!("nordvpn", "connect", country,)?,
    };

    let output_str = String::from_utf8(output.stdout).map_err(|e| e.to_string())?;

    Ok(output_str.contains("You are connected to"))
}

#[tauri::command]
async fn nordvpn_disconnect() -> Result<bool, String> {
    let output = cmd!("nordvpn", "disconnect",)?;

    let output_str = String::from_utf8(output.stdout).map_err(|e| e.to_string())?;

    Ok(output_str.contains("You are disconnected"))
}

#[tauri::command]
async fn nordvpn_connection_status() -> Result<Option<ConnectionDetails>, String> {
    let output = cmd!("nordvpn", "status",)?;

    let new_state = ConnectionDetails::parse(output)?;

    Ok(Some(new_state))
}

#[tauri::command]
async fn nordvpn_logout() -> Result<bool, String> {
    let output = cmd!("nordvpn", "logout",)?;

    Ok(String::from_utf8_lossy(&output.stdout)
        .to_string()
        .contains("You are logged out."))
}

#[tauri::command]
async fn nordvpn_settings() -> Result<Settings, String> {
    let output = cmd!("nordvpn", "settings",)?;

    let settings = Settings::parse(output)?;

    Ok(settings)
}

#[tauri::command]
async fn nordvpn_settings_default() -> Result<bool, String> {
    let output = cmd!("nordvpn", "set", "defaults",)?;

    let output_str = String::from_utf8_lossy(&output.stdout).to_string();

    Ok(output_str.contains("Settings were successfully restored to defaults."))
}

#[tauri::command]
async fn nordvpn_settings_apply(new: Settings) -> Result<bool, String> {
    let current = nordvpn_settings().await?;

    check_and_apply!(new, current, threat_protection_lite, "threatprotectionlite");
    check_and_apply!(new, current, firewall, "firewall");
    check_and_apply!(new, current, kill_switch, "killswitch");
    check_and_apply!(new, current, ipv6, "ipv6");
    check_and_apply!(new, current, custom_dns, "dns", Option);

    check_and_apply!(new, current, auto_connect, "autoconnect");
    check_and_apply!(new, current, meshnet, "meshnet");
    check_and_apply!(new, current, notify, "notify");

    check_and_apply!(new, current, analytics, "analytics");

    Ok(true)
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::default().build())
        .invoke_handler(tauri::generate_handler![
            nordvpn_login,
            nordvpn_logout,
            nordvpn_is_logged_in,
            nordvpn_locations,
            nordvpn_connect,
            nordvpn_disconnect,
            nordvpn_connection_status,
            nordvpn_settings,
            nordvpn_settings_default,
            nordvpn_settings_apply,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
