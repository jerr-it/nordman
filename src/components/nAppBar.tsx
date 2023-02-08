import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";
import ThemeSwitchButton from "./themeSwitchButton";
import { Box } from "@mui/system";
import { useState } from "react";
import SettingsIcon from '@mui/icons-material/Settings';
import { useNavigate } from "react-router-dom";

function NAppBar() {
    const navigate = useNavigate();

    return (
        <Box>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Nordman
                    </Typography>

                    <ThemeSwitchButton />
                    <IconButton color="inherit" onClick={() => { navigate("/settings"); }}>
                        <SettingsIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default NAppBar;