import { AppBar, Drawer, IconButton, MenuItem, Toolbar, Typography } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import ThemeSwitchButton from "./themeSwitchButton";
import { Box } from "@mui/system";
import { useState } from "react";
import SettingsIcon from '@mui/icons-material/Settings';

function NAppBar() {
    const [open, setOpen] = useState(false);

    return (
        <Box>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Nordman
                    </Typography>

                    <ThemeSwitchButton />
                    <IconButton color="inherit">
                        <SettingsIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default NAppBar;