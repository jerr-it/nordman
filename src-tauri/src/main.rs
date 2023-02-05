#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::process::Command;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command

/// Returns the browser link for logging in to NordVPN
#[tauri::command]
fn nordvpn_login() -> Result<String, String> {
    let output = Command::new("nordvpn")
        .arg("login")
        .output()
        .map_err(|e| e.to_string())?;

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
    let output = Command::new("nordvpn")
        .arg("account")
        .output()
        .map_err(|e| e.to_string())?;

    Ok(!String::from_utf8_lossy(&output.stdout)
        .to_string()
        .contains("You are not logged in."))
}

#[tauri::command]
fn nordvpn_logout() -> Result<bool, String> {
    let output = Command::new("nordvpn")
        .arg("logout")
        .output()
        .map_err(|e| e.to_string())?;

    Ok(String::from_utf8_lossy(&output.stdout)
        .to_string()
        .contains("You are logged out."))
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            nordvpn_login,
            nordvpn_is_logged_in
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
