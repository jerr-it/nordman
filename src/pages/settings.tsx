import { AppBar, Button, Card, Divider, FormControlLabel, FormGroup, FormLabel, IconButton, ListItemText, Switch, TextField, Toolbar, Typography } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ThemeSwitchButton from "../components/themeSwitchButton";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import LogoutIcon from '@mui/icons-material/Logout';
import CheckIcon from '@mui/icons-material/Check';
import RestoreIcon from '@mui/icons-material/Restore';
import { useNavigate } from "react-router-dom";
import { Box, Stack } from "@mui/system";
import { useEffect, useState } from "react";
import { Settings } from "../model/settings";
import { invoke } from "@tauri-apps/api";

function SettingsPage() {
    const navigate = useNavigate();

    const [settings, setSettings] = useState<Settings>(new Settings());

    useEffect(() => {
        invoke("nordvpn_settings").then((settings) => {
            console.log(settings);
            setSettings(settings as Settings);
        }).catch((err: any) => {
            console.error(err);
        });
    }, []);

    return (
        <Box>
            <AppBar position="static">
                <Toolbar>
                    <IconButton color="inherit" onClick={() => { navigate("/dashboard"); }}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Settings
                    </Typography>

                    <ThemeSwitchButton />
                </Toolbar>
            </AppBar>
            <Card sx={{ width: "98vw", height: "85vh", m: 1, p: 1 }}>
                <Stack direction="row" justifyContent="center" alignItems="center">
                    <AccountBoxIcon sx={{ width: 100, height: 100, mr: 1 }} />
                    <ListItemText sx={{ flexGrow: 1 }}>
                        <Typography variant="h6">
                            john.doe@gmail.com
                        </Typography>
                        <Typography variant="body2">
                            Active (Expires on Jan 1st, 2030)
                        </Typography>
                    </ListItemText>
                    <Button
                        variant="contained"
                        startIcon={<LogoutIcon />}
                    >
                        Logout
                    </Button>
                </Stack>
                <Divider sx={{ mt: 1 }} />
                <Stack direction="column" justifyContent="space-between" sx={{ height: "77%" }}>
                    <Stack direction="row" spacing={2} sx={{ m: 2, flexGrow: 1 }}>
                        <FormGroup>
                            <FormLabel>Security</FormLabel>

                            <FormControlLabel control={<Switch checked={settings?.threat_protection_lite} onChange={(e) => {
                                setSettings({ ...settings, threat_protection_lite: e.target.checked } as Settings);
                            }} />} label="Threat Protection Lite" />

                            <FormControlLabel control={<Switch checked={settings?.firewall} onChange={(e) => {
                                setSettings({ ...settings, firewall: e.target.checked } as Settings);
                            }} />} label="Firewall" />

                            <FormControlLabel control={<Switch checked={settings?.kill_switch} onChange={(e) => {
                                setSettings({ ...settings, kill_switch: e.target.checked } as Settings);
                            }} />} label="Kill Switch" />

                            <FormControlLabel control={<Switch checked={settings?.ipv6} onChange={(e) => {
                                setSettings({ ...settings, ipv6: e.target.checked } as Settings);
                            }} />} label="IPv6" />

                            <FormControlLabel
                                control={
                                    <Stack direction="row" justifyContent="center" alignItems="center">
                                        <Switch sx={{ mt: 2 }} checked={settings?.custom_dns != null} onChange={(e) => {
                                            setSettings({ ...settings, custom_dns: e.target.checked ? "" : null } as Settings);
                                        }} />
                                        <TextField variant="standard" label="Custom DNS" value={settings?.custom_dns ?? ""} disabled={settings?.custom_dns == null} onChange={(e) => {
                                            setSettings({ ...settings, custom_dns: e.target.value } as Settings);
                                        }} />
                                    </Stack>
                                }
                                label=""
                            />
                        </FormGroup>
                        <FormGroup>
                            <FormLabel>Features</FormLabel>
                            <FormControlLabel control={<Switch checked={settings?.auto_connect} onChange={(e) => {
                                setSettings({ ...settings, auto_connect: e.target.checked } as Settings);
                            }} />} label="Autoconnect" />
                            <FormControlLabel control={<Switch checked={settings?.meshnet} onChange={(e) => {
                                setSettings({ ...settings, meshnet: e.target.checked } as Settings);
                            }} />} label="Meshnet" />
                            <FormControlLabel control={<Switch checked={settings?.notify} onChange={(e) => {
                                setSettings({ ...settings, notify: e.target.checked } as Settings);
                            }} />} label="Notify" />
                        </FormGroup>
                        <FormGroup>
                            <FormLabel>Misc</FormLabel>
                            <FormControlLabel control={<Switch checked={settings?.analytics} onChange={(e) => {
                                setSettings({ ...settings, analytics: e.target.checked } as Settings);
                            }} />} label="Analytics" />
                        </FormGroup>
                    </Stack>
                    <Stack direction="row" spacing={2}>
                        <Button variant="contained" startIcon={<RestoreIcon />}>
                            Defaults
                        </Button>
                        <Button variant="contained" startIcon={<CheckIcon />}>
                            Apply
                        </Button>
                    </Stack>
                </Stack>
            </Card>
        </Box>
    );
}

export default SettingsPage;