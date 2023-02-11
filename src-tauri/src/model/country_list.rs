pub struct CountryList {
    pub list: Vec<String>,
}

impl CountryList {
    pub fn parse(output: std::process::Output) -> Self {
        let output = String::from_utf8_lossy(&output.stdout);

        let countries_list = output
            .lines()
            .filter(|line| !line.contains("New feature"))
            .collect::<Vec<&str>>();

        let countries = countries_list[0]
            .split(",")
            .map(|name| name.replace("-", " ").trim().to_string())
            .collect::<Vec<String>>();

        Self { list: countries }
    }
}
