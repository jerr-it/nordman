import { AppBar, Button, Card, Divider, FormControlLabel, FormGroup, FormLabel, IconButton, ListItemText, Switch, TextField, Toolbar, Typography } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ThemeSwitchButton from "../components/themeSwitchButton";
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import LogoutIcon from '@mui/icons-material/Logout';
import CheckIcon from '@mui/icons-material/Check';
import RestoreIcon from '@mui/icons-material/Restore';
import { useNavigate } from "react-router-dom";
import { Box, Stack } from "@mui/system";

function Settings() {
    const navigate = useNavigate();

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
                            <FormControlLabel control={<Switch />} label="Threat Protection Lite" />
                            <FormControlLabel control={<Switch />} label="Firewall" />
                            <FormControlLabel control={<Switch />} label="Kill Switch" />
                            <FormControlLabel control={<Switch />} label="IPv6" />
                            <FormControlLabel
                                control={
                                    <Stack direction="row" justifyContent="center" alignItems="center">
                                        <Switch sx={{ mt: 2 }} />
                                        <TextField variant="standard" label="Custom DNS" />
                                    </Stack>
                                }
                                label=""
                            />
                        </FormGroup>
                        <FormGroup>
                            <FormLabel>Features</FormLabel>
                            <FormControlLabel control={<Switch />} label="Autoconnect" />
                            <FormControlLabel control={<Switch />} label="Meshnet" />
                            <FormControlLabel control={<Switch />} label="Notify" />
                        </FormGroup>
                        <FormGroup>
                            <FormLabel>Misc</FormLabel>
                            <FormControlLabel control={<Switch />} label="Analytics" />
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

export default Settings;