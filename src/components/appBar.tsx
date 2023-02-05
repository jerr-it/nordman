import { AppBar, Avatar, IconButton, Toolbar, Typography } from "@mui/material";
import MenuIcon from '@mui/icons-material/Menu';
import ThemeSwitchButton from "../components/themeSwitchButton";

function NAppBar() {
    return (
        <AppBar position="static">
            <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{ mr: 2 }}
                >
                    <MenuIcon />
                </IconButton>

                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Nordman
                </Typography>

                <ThemeSwitchButton/>
                <Avatar sx={{ml:2}}>U</Avatar>
            </Toolbar>
        </AppBar>
    );
}

export default NAppBar;