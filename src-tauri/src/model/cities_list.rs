pub struct CitiesList {
    pub list: Vec<String>,
}

impl CitiesList {
    pub fn parse(output: std::process::Output) -> Self {
        let res = String::from_utf8_lossy(&output.stdout);
        let res = res
            .split("\n")
            .nth(1)
            .unwrap()
            .split(",")
            .map(|name| name.replace("-", " ").trim().replace("_", " ").to_string())
            .collect::<Vec<String>>();

        Self { list: res }
    }
}
