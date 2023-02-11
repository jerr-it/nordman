
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
