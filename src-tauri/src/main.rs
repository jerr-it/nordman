#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod connection;
use std::process::Command;
use std::sync::Mutex;

use connection::ConnectionDetails;
use connection::ConnectionState;

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

    Ok(!String::from_utf8_lossy(&output.stdout)
        .to_string()
        .contains("You are not logged in."))
}

#[tauri::command]
fn nordvpn_countries() -> Result<Vec<String>, String> {
    let output = cmd!("nordvpn", "countries",)?;

    let res = String::from_utf8_lossy(&output.stdout);
    let res = res
        .split("\n")
        .nth(1)
        .unwrap()
        .split(",")
        .map(|name| name.replace("-", " ").trim().to_string())
        .collect::<Vec<String>>();

    Ok(res)
}

#[tauri::command]
fn nordvpn_cities(country: String) -> Result<Vec<String>, String> {
    let output = cmd!("nordvpn", "cities", country,)?;

    let res = String::from_utf8_lossy(&output.stdout);
    let res = res
        .split("\n")
        .nth(1)
        .unwrap()
        .split(",")
        .map(|name| name.replace("-", " ").trim().replace("_", " ").to_string())
        .collect::<Vec<String>>();

    Ok(res)
}

#[tauri::command]
fn nordvpn_connect(
    country: String,
    city: Option<String>,
    state: tauri::State<Mutex<ConnectionState>>,
) -> Result<ConnectionState, String> {
    match city {
        Some(city) => cmd!("nordvpn", "connect", country, city,)?,
        None => cmd!("nordvpn", "connect", country,)?,
    };

    let output = cmd!("nordvpn", "status",)?;

    let details = ConnectionDetails::from_terminal_output(
        String::from_utf8_lossy(&output.stdout).to_string(),
    )?;

    let mut conn = state.lock().unwrap();

    conn.connect(details);

    Ok(conn.clone())
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
        .manage(Mutex::new(connection::ConnectionState::new()))
        .invoke_handler(tauri::generate_handler![
            nordvpn_login,
            nordvpn_logout,
            nordvpn_is_logged_in,
            nordvpn_countries,
            nordvpn_cities,
            nordvpn_connect
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
