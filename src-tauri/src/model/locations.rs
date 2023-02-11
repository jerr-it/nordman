use std::collections::HashMap;

use serde::Serialize;

#[derive(Debug, Clone, Serialize, Default)]
pub struct Locations {
    pub list: HashMap<String, Vec<String>>,
}

impl Locations {
    pub fn parse_countries(output: std::process::Output) -> Vec<String> {
        let output = String::from_utf8_lossy(&output.stdout);

        let countries_list = output
            .lines()
            .filter(|line| !line.contains("New feature"))
            .collect::<Vec<&str>>();

        let countries = countries_list[0]
            .split(",")
            .map(|name| name.replace("-", " ").trim().to_string())
            .collect::<Vec<String>>();

        countries
    }

    pub fn parse_cities(output: std::process::Output) -> Vec<String> {
        let output = String::from_utf8_lossy(&output.stdout);

        let cities_list = output
            .lines()
            .filter(|line| !line.contains("New feature"))
            .collect::<Vec<&str>>();

        let cities = cities_list[0]
            .split(",")
            .map(|name| name.replace("-", " ").trim().to_string())
            .collect::<Vec<String>>();

        cities
    }

    pub fn add(&mut self, country: String, cities: Vec<String>) {
        self.list.insert(country, cities);
    }
}
