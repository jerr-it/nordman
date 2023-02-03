import { Button, Card, CircularProgress, Grid, IconButton, Typography, useTheme } from "@mui/material";
import { Stack } from "@mui/system";
import LoginIcon from '@mui/icons-material/Login';
import { invoke } from "@tauri-apps/api";
import { open } from "@tauri-apps/api/shell";
import { useContext, useEffect, useState } from "react";
import { ColorModeContext } from "../App";

import Brightness7Icon from '@mui/icons-material/Brightness7';
import Brightness4Icon from '@mui/icons-material/Brightness4';

function LoginPage() {
    const theme = useTheme();
    const colorMode = useContext(ColorModeContext);

    const [waiting, setWaiting] = useState(false);

    async function StartLogin() {
        try {
            const url: string = await invoke("nordvpn_login", {});
            await open(url);
            setWaiting(true);
        } catch (e) {
            console.error(e);
        }
    }

    let failCounter = 0;
    useEffect(() => {
        const repeat = setInterval(async () => {
            if (!waiting) return;

            try {
                const status: boolean = await invoke("nordvpn_is_logged_in", {});
                if (status) {
                    console.log("Logged in!")
                    setWaiting(false);
                    clearInterval(repeat);
                } else {
                    failCounter++;
                    if (failCounter >= 5) {
                        setWaiting(false);
                        clearInterval(repeat);
                    }
                }
            } catch (e) {
                console.error(e);
            }
        }, 3000);

        return () => {
            clearInterval(repeat);
        }
    }, [waiting]);

    return (
        <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
            style={{ minHeight: '100vh' }}
        >
            <Card sx={{m:1, p:5, minWidth:400}}>
                <Stack direction="column" alignItems="center">
                    <Typography variant="h3" align="center">Login</Typography>
                    <Button 
                        sx={{mt:3, minWidth:200}}
                        variant="contained" 
                        startIcon={<LoginIcon/>}
                        onClick={StartLogin}
                        disabled={waiting}
                    >
                        Browser Login
                    </Button>
                    {waiting && 
                        <Stack sx={{m:3}} direction="row" alignItems="center">
                            <CircularProgress/>
                            <Typography sx={{m:1}} align="center">Waiting for login...</Typography>
                        </Stack>
                    }
                </Stack>
            </Card>
            <IconButton sx={{ ml: 1 }} onClick={colorMode.toggleColorMode} color="inherit">
                {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
        </Grid>
    );
}

export default LoginPage;