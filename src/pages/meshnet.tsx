import { AppBar, IconButton, Switch, Toolbar, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Settings } from "../model/settings";
import { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api";
import { useSnackbar } from "notistack";

function MeshnetPage() {
    const navigate = useNavigate();

    const [settings, setSettings] = useState(new Settings());
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    useEffect(() => {
        invoke("nordvpn_settings_apply", { new: settings }).then((ok) => {
            if (!ok) {
                DisplayError("Failed to apply settings");
            }
        }).catch((err) => {
            DisplayError(err);
        });
    }, [settings.meshnet]);

    function DisplayError(err: string) {
        enqueueSnackbar(err, {
            variant: "error",
            anchorOrigin: { vertical: "bottom", horizontal: "right" },
            autoHideDuration: 3000,
            disableWindowBlurListener: true,
        });
    }

    return (
        <AppBar>
            <Toolbar>
                <IconButton color="inherit" onClick={() => { navigate("/dashboard"); }}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Meshnet
                </Typography>
                <Switch checked={settings?.meshnet} onChange={(e) => {
                    setSettings({ ...settings, meshnet: e.target.checked } as Settings);
                }} />
            </Toolbar>
        </AppBar>
    );
}

export default MeshnetPage;