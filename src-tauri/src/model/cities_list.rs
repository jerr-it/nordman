pub struct CitiesList {
    pub list: Vec<String>,
}

impl CitiesList {
    pub fn parse(output: std::process::Output) -> Self {
        let res = String::from_utf8_lossy(&output.stdout);

        let cities_list = res
            .lines()
            .filter(|line| !line.contains("New feature"))
            .collect::<Vec<&str>>();

        let res = cities_list[0]
            .split(",")
            .map(|name| name.replace("-", " ").trim().replace("_", " ").to_string())
            .collect::<Vec<String>>();

        Self { list: res }
    }
}
