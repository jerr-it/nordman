import { Card, Collapse, Divider, IconButton, List, ListItem, ListItemButton, ListItemText, TextField, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import NAppBar from "../components/nAppBar";
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import "/node_modules/flag-icons/css/flag-icons.min.css";
import { country_converter } from "../assets/country_converter";
import StatusCard from "../components/statusCard";
import LocationCityIcon from '@mui/icons-material/LocationCity';
import { ConnectionState } from "../assets/connection_state";

function Dashboard() {
    const [countries, setCountries] = useState<{ names: string[]; cities: string[][]; drawer_open: boolean[] }>({ names: [], cities: [], drawer_open: [] });
    const [search, setSearch] = useState("");
    const [connectionStatus, setConnectionStatus] = useState<ConnectionState>();

    /// Updates the state of the drawer for the country at index
    /// In accordance with https://beta.reactjs.org/learn/updating-arrays-in-state
    function FlipDrawer(index: number): void {
        const new_drawer_open = countries.drawer_open.map((value, i) => {
            if (i === index) {
                return !value;
            }
            return value;
        });
        setCountries({ names: countries.names, cities: countries.cities, drawer_open: new_drawer_open });
    }

    async function Connect(data: { country: string; city: string | null }) {
        invoke("nordvpn_connect", data)
            .then((res) => {
                invoke("nordvpn_connection_status").then((res) => {
                    const status = res as ConnectionState;
                    setConnectionStatus(status);
                }).catch((err) => {
                    // TODO display error to user
                    console.error(err);
                });
            }).catch((err) => {
                // TODO display error to user
                console.error(err);
            });
    }

    /// Returns the JSX for a list of cities
    /// List of cities as returned from nordvpn_cities
    function CityList(country: string, cities: string[]): Array<JSX.Element> {
        let list = [];

        for (let city of cities) {
            list.push(
                <ListItemButton sx={{ pl: 4 }} onClick={() => { Connect({ country: country, city: city }) }}>
                    <LocationCityIcon sx={{ mr: 1 }} />
                    <ListItemText>
                        {city}
                    </ListItemText>
                </ListItemButton >
            );
        }

        return list;
    }

    /// Returns the JSX for a list of countries
    /// List of countries as returned from nordvpn_countries
    function CountryList(countries: { names: string[]; cities: string[][]; drawer_open: boolean[] }): Array<JSX.Element> {
        let list = [];

        const searchTerm = search.toLowerCase();

        for (let i = 0; i < countries.names.length; i++) {
            if (!countries.names[i].toLowerCase().includes(searchTerm) &&
                !countries.cities[i].some((city) => city.toLowerCase().includes(searchTerm))
            ) continue;

            list.push(
                <Box>
                    <Divider sx={{ opacity: countries.drawer_open[i] ? 1 : 0 }} />
                    <ListItemButton onClick={() => { Connect({ country: countries.names[i], city: null }) }}>
                        <Box sx={{ mr: 1 }}><span className={"fi fi-" + country_converter(countries.names[i])}></span></Box>
                        <ListItemText>
                            {countries.names[i].replaceAll("_", " ")}
                        </ListItemText>
                        <IconButton onClick={(e) => { FlipDrawer(i); e.stopPropagation(); }} onMouseDown={(e) => { e.stopPropagation() }}>
                            {countries.drawer_open[i] ? <ExpandLess /> : <ExpandMore />}
                        </IconButton>
                    </ListItemButton>
                    <Collapse in={countries.drawer_open[i]} timeout="auto" unmountOnExit>
                        {CityList(countries.names[i], countries.cities[i])}
                    </Collapse>
                    <Divider sx={{ opacity: countries.drawer_open[i] ? 1 : 0 }} />
                </Box>
            );
        }

        return list;
    }

    useEffect(() => {
        invoke<Array<string>>("nordvpn_countries").then(async (res) => {
            let cities = [];
            for (let country of res) {
                const new_cities = await invoke<Array<string>>("nordvpn_cities", { country: country });
                cities.push(new_cities);
            }
            setCountries({ names: res, cities: cities, drawer_open: Array(res.length).fill(false) });
        }).catch((err) => {
            // TODO display error to user
            console.log(err);
        });
    }, []);

    return (
        <Box>
            <NAppBar />
            <Stack direction="row" sx={{ p: 1, m: 1, minHeight: "85vh", maxHeight: "85vh" }} spacing={1}>
                <Stack direction="column">
                    <Card sx={{ mb: 1, p: 1, minHeight: 70 }} >
                        <TextField fullWidth variant="standard" label="Filter" onChange={(event) => setSearch(event.target.value)} />
                    </Card>
                    <Card
                        sx={{ width: 300, p: 1, maxHeight: "100%", overflow: "auto", flexGrow: 1 }}
                    >
                        <List
                            component="nav"
                            aria-labelledby="nested-list-subheader"
                        >
                            {CountryList(countries)}
                        </List>
                    </Card>
                </Stack>
                <Card sx={{ flexGrow: 1, p: 1 }}>
                    <Typography>Map</Typography>
                </Card>
            </Stack >
            <StatusCard />
        </Box >
    );
}

export default Dashboard;