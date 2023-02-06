import { Card, Collapse, Divider, List, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import NAppBar from "../components/nAppBar";
import LanguageIcon from '@mui/icons-material/Language';
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

function Dashboard() {
    const [countries, setCountries] = useState<{ names: string[]; cities: string[][]; drawer_open: boolean[]}>({names: [], cities: [], drawer_open: []});

    /// Updates the state of the drawer for the country at index
    /// In accordance with https://beta.reactjs.org/learn/updating-arrays-in-state
    function FlipDrawer(index: number): void {
        const new_drawer_open = countries.drawer_open.map((value, i) => {
            if (i === index) {
                return !value;
            }
            return value;
        });
        setCountries({names: countries.names, cities: countries.cities, drawer_open: new_drawer_open});
    }

    /// Returns the JSX for a list of cities
    /// List of cities as returned from nordvpn_cities
    function CityList(cities: string[]): Array<JSX.Element> {
        let list = [];
    
        for (let city of cities) {
            list.push(
                <ListItemButton sx={{pl: 4}}>
                    <ListItemText>
                        {city}
                    </ListItemText>
                </ListItemButton>
            );
        }
    
        return list;
    }
    
    /// Returns the JSX for a list of countries
    /// List of countries as returned from nordvpn_countries
    function CountryList(countries: { names: string[]; cities: string[][]; drawer_open: boolean[]}): Array<JSX.Element> {
        let list = [];
    
        // TODO: add country flags
        for (let i = 0; i < countries.names.length; i++) {
            list.push(
                <Box>
                    <Divider sx={{opacity: countries.drawer_open[i] ? 1 : 0}}/>
                    <ListItemButton onClick={() => FlipDrawer(i)}>
                        <ListItemIcon>
                            <LanguageIcon />
                        </ListItemIcon>
                        <ListItemText>
                            {countries.names[i].replaceAll("_", " ")}
                        </ListItemText>
                        {countries.drawer_open[i] ? <ExpandLess/> : <ExpandMore/>}
                    </ListItemButton>
                    <Collapse in={countries.drawer_open[i]} timeout="auto" unmountOnExit>
                        {CityList(countries.cities[i])}
                    </Collapse>
                    <Divider sx={{opacity: countries.drawer_open[i] ? 1 : 0}}/>
                </Box>  
            );
        }
    
        return list;
    }

    useEffect(() => {
        invoke<Array<string>>("nordvpn_countries").then(async (res) => {
            let cities = [];
            for (let country of res) {
                const new_cities = await invoke<Array<string>>("nordvpn_cities", {country: country});
                cities.push(new_cities);
            }
            setCountries({names: res, cities: cities, drawer_open: Array(res.length).fill(false)});
        }).catch((err) => {
            // TODO display error to user
            console.log(err);
        });
    }, []);

    return (
        <Box>
            <NAppBar/>
            <Stack direction="row" sx={{p:1, m:1, maxHeight: "85vh"}} spacing={1}>
                <Card 
                    sx={{ width: 300, p:1, maxHeight: "100%", overflow: "auto"}}
                >
                    <List
                        component="nav"
                        aria-labelledby="nested-list-subheader"
                        subheader={
                            <Typography variant="h6" component="div" id="nested-list-subheader">
                                Servers
                            </Typography>
                        }
                    >
                        {CountryList(countries)}
                    </List>
                </Card>
                <Card sx={{ flexGrow: 1, p:1 }}>
                    <Typography>Map</Typography>
                </Card>
            </Stack>
        </Box>        
    );
}

export default Dashboard;