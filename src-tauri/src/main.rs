#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod model;
use std::process::Command;
use std::sync::Mutex;

use model::ConnectionDetails;

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
fn nordvpn_login() -> Result<String, String> {
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
fn nordvpn_is_logged_in() -> Result<bool, String> {
    let output = cmd!("nordvpn", "account",)?;

    match model::Account::parse(output) {
        Ok(_) => Ok(true),
        Err(_) => Ok(false),
    }
}

#[tauri::command]
fn nordvpn_countries() -> Result<Vec<String>, String> {
    let output = cmd!("nordvpn", "countries",)?;

    let countries = model::CountryList::parse(output);

    Ok(countries.list)
}

#[tauri::command]
fn nordvpn_cities(country: String) -> Result<Vec<String>, String> {
    let output = cmd!("nordvpn", "cities", country,)?;

    let cities = model::CitiesList::parse(output);

    Ok(cities.list)
}

#[tauri::command]
fn nordvpn_connect(country: String, city: Option<String>) -> Result<bool, String> {
    let output = match city {
        Some(city) => cmd!("nordvpn", "connect", country, city,)?,
        None => cmd!("nordvpn", "connect", country,)?,
    };

    let output_str = String::from_utf8(output.stdout).map_err(|e| e.to_string())?;

    Ok(output_str.contains("You are connected to"))
}

#[tauri::command]
fn nordvpn_connection_status(
    state: tauri::State<Mutex<Option<ConnectionDetails>>>,
) -> Result<Option<ConnectionDetails>, String> {
    let output = cmd!("nordvpn", "status",)?;

    let new_state = ConnectionDetails::parse(output)?;

    let mut conn = state.lock().unwrap();

    *conn = Some(new_state.clone());

    Ok(Some(new_state))
}

#[tauri::command]
fn nordvpn_logout() -> Result<bool, String> {
    let output = cmd!("nordvpn", "logout",)?;

    Ok(String::from_utf8_lossy(&output.stdout)
        .to_string()
        .contains("You are logged out."))
}

fn main() {
    tauri::Builder::default()
        .manage(Mutex::new(None::<ConnectionDetails>))
        .invoke_handler(tauri::generate_handler![
            nordvpn_login,
            nordvpn_logout,
            nordvpn_is_logged_in,
            nordvpn_countries,
            nordvpn_cities,
            nordvpn_connect,
            nordvpn_connection_status,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
