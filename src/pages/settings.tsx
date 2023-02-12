import { AppBar, Button, Card, Divider, FormControlLabel, FormGroup, FormLabel, IconButton, ListItemText, Switch, TextField, Toolbar, Typography } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import LogoutIcon from '@mui/icons-material/Logout';
import CheckIcon from '@mui/icons-material/Check';
import RestoreIcon from '@mui/icons-material/Restore';
import { useNavigate } from "react-router-dom";
import { Box, Stack } from "@mui/system";
import { useEffect, useState } from "react";
import { Settings } from "../model/settings";
import { invoke } from "@tauri-apps/api";
import { useSnackbar } from 'notistack';
import { Store } from "tauri-plugin-store-api";
import { ColorModeContext } from "../App";
import { useContext } from "react";
import { useTheme } from "@mui/material";

function SettingsPage() {
    const navigate = useNavigate();

    const [settings, setSettings] = useState<Settings>(new Settings());
    const store = new Store(".settings.dat");

    const theme = useTheme();
    const colorMode = useContext(ColorModeContext);

    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    useEffect(() => {
        invoke("nordvpn_settings").then(async (settings) => {
            const full_settings = settings as Settings;

            full_settings.dark_mode = await store.get("dark_mode") ?? false;

            setSettings(full_settings);
        }).catch((err: any) => {
            DisplayError(err);
        });
    }, []);

    async function ApplySettings() {
        await store.set("dark_mode", settings.dark_mode);
        colorMode.setColorMode(settings.dark_mode);

        invoke("nordvpn_settings_apply", { new: settings }).then((ok) => {
            if (!ok) {
                DisplayError("Failed to apply settings");
                return;
            }

            enqueueSnackbar("Settings applied", {
                variant: "success",
                anchorOrigin: { vertical: "bottom", horizontal: "right" },
                autoHideDuration: 3000,
                disableWindowBlurListener: true,
            });
        }).catch((err: any) => {
            DisplayError(err);
        });
    }

    function LoadDefaultSettings() {
        setSettings(new Settings());
    }

    function DisplayError(err: string) {
        enqueueSnackbar(err, {
            variant: "error",
            anchorOrigin: { vertical: "bottom", horizontal: "right" },
            autoHideDuration: 3000,
            disableWindowBlurListener: true,
        });
    }

    function DisplayInfo(info: string) {
        enqueueSnackbar(info, {
            variant: "info",
            anchorOrigin: { vertical: "bottom", horizontal: "right" },
            autoHideDuration: 3000,
            disableWindowBlurListener: true,
        });
    }

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

                            <FormControlLabel control={<Switch checked={settings?.threatprotectionlite} onChange={(e) => {
                                setSettings({ ...settings, threatprotectionlite: e.target.checked } as Settings);
                            }} />} label="Threat Protection Lite" />

                            <FormControlLabel control={<Switch checked={settings?.firewall} onChange={(e) => {
                                if (!e.target.checked && settings?.killswitch) {
                                    setSettings({ ...settings, firewall: e.target.checked, killswitch: false } as Settings);
                                    DisplayInfo("Kill Switch requires Firewall to be enabled");
                                    return;
                                }
                                setSettings({ ...settings, firewall: e.target.checked } as Settings);
                            }} />} label="Firewall" />

                            <FormControlLabel control={<Switch checked={settings?.killswitch} onChange={(e) => {
                                if (e.target.checked && !settings?.firewall) {
                                    setSettings({ ...settings, killswitch: e.target.checked, firewall: true } as Settings);
                                    DisplayInfo("Kill Switch requires Firewall to be enabled");
                                    return;
                                }
                                setSettings({ ...settings, killswitch: e.target.checked } as Settings);
                            }} />} label="Kill Switch" />

                            <FormControlLabel control={<Switch checked={settings?.ipv6} onChange={(e) => {
                                setSettings({ ...settings, ipv6: e.target.checked } as Settings);
                            }} />} label="IPv6" />
                        </FormGroup>
                        <FormGroup>
                            <FormLabel>Features</FormLabel>
                            <FormControlLabel control={<Switch checked={settings?.autoconnect} onChange={(e) => {
                                setSettings({ ...settings, autoconnect: e.target.checked } as Settings);
                            }} />} label="Autoconnect" />
                            <FormControlLabel control={<Switch checked={settings?.meshnet} onChange={(e) => {
                                setSettings({ ...settings, meshnet: e.target.checked } as Settings);
                            }} />} label="Meshnet" />
                            <FormControlLabel control={<Switch checked={settings?.notify} onChange={(e) => {
                                setSettings({ ...settings, notify: e.target.checked } as Settings);
                            }} />} label="Notify" />
                            <FormControlLabel
                                control={
                                    <Stack direction="row" justifyContent="center" alignItems="center">
                                        <Switch sx={{ mt: 2 }} checked={settings?.dns != null} onChange={(e) => {
                                            setSettings({ ...settings, dns: e.target.checked ? "" : null } as Settings);
                                        }} />
                                        <TextField variant="standard" label="Custom DNS" value={settings?.dns ?? ""} disabled={settings?.dns == null} onChange={(e) => {
                                            setSettings({ ...settings, dns: e.target.value } as Settings);
                                        }} />
                                    </Stack>
                                }
                                label=""
                            />
                        </FormGroup>
                        <FormGroup>
                            <FormLabel>Misc</FormLabel>
                            <FormControlLabel control={<Switch checked={settings?.analytics} onChange={(e) => {
                                setSettings({ ...settings, analytics: e.target.checked } as Settings);
                            }} />} label="Analytics" />
                            <FormControlLabel control={<Switch checked={settings?.dark_mode} onChange={(e) => {
                                setSettings({ ...settings, dark_mode: e.target.checked } as Settings);
                            }} />} label="Dark Mode" />
                        </FormGroup>
                    </Stack>
                    <Stack direction="row" spacing={2}>
                        <Button variant="contained" startIcon={<RestoreIcon />} onClick={LoadDefaultSettings}>
                            Defaults
                        </Button>
                        <Button variant="contained" startIcon={<CheckIcon />} onClick={ApplySettings}>
                            Apply
                        </Button>
                    </Stack>
                </Stack>
            </Card>
        </Box>
    );
}

export default SettingsPage;