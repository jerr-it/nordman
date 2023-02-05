import { AppBar, Drawer, IconButton, MenuItem, Toolbar, Typography } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import ThemeSwitchButton from "./themeSwitchButton";
import { Box } from "@mui/system";
import { useState } from "react";
import PersonIcon from '@mui/icons-material/Person';

function NAppBar() {
    const [open, setOpen] = useState(false);

    return (
        <Box>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        onClick={() => setOpen(true)}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Nordman
                    </Typography>

                    <ThemeSwitchButton/>
                    
                    <IconButton color="inherit">
                        <PersonIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Drawer
                open={open}
                onClose={() => setOpen(false)}
            >
                <MenuItem>Dash</MenuItem>
                <MenuItem>Favoriten</MenuItem>
                <MenuItem>Settings</MenuItem>
            </Drawer>
        </Box>
    );
}

export default NAppBar;