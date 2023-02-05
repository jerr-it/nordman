import { Button, Card, CircularProgress, Grid, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import LoginIcon from '@mui/icons-material/Login';
import { invoke } from "@tauri-apps/api";
import { open } from "@tauri-apps/api/shell";
import { useEffect, useState } from "react";

import { useNavigate } from 'react-router-dom';
import ThemeSwitchButton from "../components/themeSwitchButton";

function LoginPage() {
    const [waiting, setWaiting] = useState(true);

    const navigate = useNavigate();

    async function StartLogin() {
        try {
            const url: string = await invoke("nordvpn_login", {});
            await open(url);
            setWaiting(true);
        } catch (e) {
            console.error(e);
        }
    }

    async function check_login(): Promise<boolean> {
        console.log("check");
        try {
            return await invoke("nordvpn_is_logged_in", {});
        } catch (e) {
            console.error(e);
        }

        return false;
    }

    // Initial check
    useEffect(() => {
        check_login().then((status) => {
            if(status) {
                navigate("/dashboard");
            } else {
                setWaiting(false);
            }
        });
    }, []);

    // Check every 3 seconds after pressing login
    let failCounter = 0;
    useEffect(() => {
        const repeat = setInterval(async () => {
            if(!waiting) return;

            const status = await check_login();
            if (status) {
                console.log("Logged in!");
                clearInterval(repeat);
                navigate("/dashboard");
            } else {
                failCounter++;
                if (failCounter >= 5) {
                    setWaiting(false);
                    clearInterval(repeat);
                }
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
            <ThemeSwitchButton/>
        </Grid>
    );
}

export default LoginPage;