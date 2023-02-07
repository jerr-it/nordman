pub struct CountryList {
    pub list: Vec<String>,
}

impl CountryList {
    pub fn parse(output: std::process::Output) -> Self {
        let output = String::from_utf8_lossy(&output.stdout);
        let countries = output
            .split("\n")
            .nth(1)
            .unwrap()
            .split(",")
            .map(|name| name.replace("-", " ").trim().to_string())
            .collect::<Vec<String>>();

        Self { list: countries }
    }
}
