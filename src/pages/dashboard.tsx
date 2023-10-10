import { Card, Collapse, Divider, IconButton, List, ListItemButton, ListItemText, TextField, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import NAppBar from "../components/nAppBar";
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import "/node_modules/flag-icons/css/flag-icons.min.css";
import { country_converter } from "../model/country_converter";
import StatusCard from "../components/statusCard";
import LocationCityIcon from '@mui/icons-material/LocationCity';
import { ConnectionDetails } from "../model/connection_state";
import { useSnackbar } from 'notistack';

function Dashboard() {
    const [countries, setCountries] = useState<{ [country: string]: { cities: Array<string>; drawer_open: boolean } }>({});
    const [search, setSearch] = useState("");
    const [connectionStatus, setConnectionStatus] = useState<ConnectionDetails | null>(null);

    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    useEffect(() => {
        invoke<{ [country: string]: Array<string> }>("nordvpn_locations").then(async (res) => {
            const countries = res as { [country: string]: Array<string> };

            const country_names = Object.keys(countries);
            const country_cities = Object.values(countries);
            const country_drawers = country_names.map(() => false);

            // Construct dictionary of countries and their cities plus drawer state
            const country_dict: { [country: string]: { cities: Array<string>; drawer_open: boolean } } = {};
            for (let i = 0; i < country_names.length; i++) {
                country_dict[country_names[i]] = { cities: country_cities[i], drawer_open: country_drawers[i] };
            }
            setCountries(country_dict);
        }).catch((err) => {
            DisplayError(err);
        });

        invoke("nordvpn_connection_status").then((res) => {
            const status = res as ConnectionDetails;
            setConnectionStatus(status);
        }).catch((err) => {
            DisplayError(err);
        });
    }, []);

    useEffect(() => {
        if (connectionStatus === null) return;

        const interval = setInterval(() => {
            invoke("nordvpn_connection_status").then((res) => {
                const status = res as ConnectionDetails;
                setConnectionStatus(status);
            }).catch((err) => {
                DisplayError(err);
            });
        }, 5000);

        return () => clearInterval(interval);
    }, [connectionStatus]);

    function Connect(data: { country: string; city: string | null }) {
        const fixed_data = { country: data.country.replaceAll(" ", "_"), city: data.city?.replaceAll(" ", "_") };
        invoke("nordvpn_connect", fixed_data)
            .then((res) => {
                invoke("nordvpn_connection_status").then((res) => {
                    const status = res as ConnectionDetails;
                    setConnectionStatus(status);
                }).catch((err) => {
                    DisplayError(err);
                });
            }).catch((err) => {
                DisplayError(err);
            });
    }

    function Disconnect() {
        invoke("nordvpn_disconnect")
            .then((res) => {
                setConnectionStatus(null);
            }).catch((err) => {
                DisplayError(err);
            });
    }

    /// Updates the state of the drawer for the country at index
    /// In accordance with https://beta.reactjs.org/learn/updating-arrays-in-state
    function FlipDrawer(country: string): void {
        const new_countries = { ...countries };
        new_countries[country].drawer_open = !new_countries[country].drawer_open;
        setCountries(new_countries);
    }

    function DisplayError(err: string) {
        enqueueSnackbar(err, {
            variant: "error",
            anchorOrigin: { vertical: "bottom", horizontal: "right" },
            autoHideDuration: 3000,
            disableWindowBlurListener: true,
        });
    }

    /// Returns the JSX for a list of cities
    /// List of cities as returned from nordvpn_cities
    function CityList(country: string, cities: string[]): Array<JSX.Element> {
        let list = [];

        for (let city of cities) {
            list.push(
                <ListItemButton key={country + city} sx={{ pl: 4 }} onClick={() => { Connect({ country: country, city: city }) }}>
                    <LocationCityIcon sx={{ mr: 1 }} />
                    <ListItemText>
                        {city.replaceAll("_", " ")}
                    </ListItemText>
                </ListItemButton >
            );
        }

        return list;
    }

    /// Returns the JSX for a list of countries
    /// List of countries as returned from nordvpn_countries
    function CountryList(): Array<JSX.Element> {
        let list = [];

        const searchTerm = search.toLowerCase();

        for (const [country, { cities, drawer_open }] of Object.entries(countries)) {
            if (!country.toLowerCase().includes(searchTerm) &&
                !cities.some((city) => city.toLowerCase().includes(searchTerm))
            ) continue;

            list.push(
                <Box key={country}>
                    <Divider sx={{ opacity: drawer_open ? 1 : 0 }} />
                    <ListItemButton onClick={() => { Connect({ country: country, city: null }) }}>
                        <Box sx={{ mr: 1 }}><span className={"fi fi-" + country_converter(country)}></span></Box>
                        <ListItemText>
                            {country.replaceAll("_", " ")}
                        </ListItemText>
                        <IconButton onClick={(e) => { FlipDrawer(country); e.stopPropagation(); }} onMouseDown={(e) => { e.stopPropagation() }}>
                            {drawer_open ? <ExpandLess /> : <ExpandMore />}
                        </IconButton>
                    </ListItemButton>
                    <Collapse in={drawer_open} timeout="auto" unmountOnExit>
                        {CityList(country, cities)}
                    </Collapse>
                    <Divider sx={{ opacity: drawer_open ? 1 : 0 }} />
                </Box>
            );
        }

        return list;
    }

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
                            {CountryList()}
                        </List>
                    </Card>
                </Stack>
                <Card sx={{ flexGrow: 1, p: 1 }}>
                    <Typography>Map</Typography>
                </Card>
            </Stack >
            <StatusCard connection={connectionStatus} onDisconnect={Disconnect} />
        </Box >
    );
}

export default Dashboard;