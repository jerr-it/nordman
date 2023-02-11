import { Button, Card, CircularProgress, Grid, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import LoginIcon from '@mui/icons-material/Login';
import { invoke } from "@tauri-apps/api";
import { open } from "@tauri-apps/api/shell";
import { useEffect, useState } from "react";
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import ThemeSwitchButton from "../components/themeSwitchButton";

function LoginPage() {
    const [state, setState] = useState<{ waiting: boolean, login_url: string }>({ waiting: false, login_url: "" });

    const navigate = useNavigate();
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    async function StartLogin() {
        try {
            if (!state.waiting) {
                const url: string = await invoke("nordvpn_login", {});
                await open(url);
                setState({ waiting: true, login_url: url });
            } else {
                await open(state.login_url);
            }
        } catch (e) {
            DisplayError(e as string);
        }
    }

    async function check_login(): Promise<boolean> {
        try {
            return await invoke("nordvpn_is_logged_in", {});
        } catch (e) {
            DisplayError(e as string);
        }

        return false;
    }

    // Initial check
    useEffect(() => {
        check_login().then((status) => {
            if (status) {
                navigate("/dashboard");
            }
        });
    }, []);

    function DisplayError(err: string) {
        enqueueSnackbar(err, {
            variant: "error",
            anchorOrigin: { vertical: "bottom", horizontal: "right" },
            autoHideDuration: 3000,
            disableWindowBlurListener: true,
        });
    }

    // Check every 3 seconds after pressing login
    useEffect(() => {
        const repeat = setInterval(async () => {
            if (!state.waiting) return;

            const status = await check_login();
            if (status) {
                clearInterval(repeat);
                navigate("/dashboard");
            }
        }, 3000);

        return () => {
            clearInterval(repeat);
        }
    }, [state.waiting]);

    return (
        <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justifyContent="center"
            style={{ minHeight: '100vh' }}
        >
            <Card sx={{ m: 1, p: 5, minWidth: 400 }}>
                <Stack direction="column" alignItems="center">
                    <Typography variant="h3" align="center">Login</Typography>
                    <Button
                        sx={{ mt: 3, minWidth: 200 }}
                        variant="contained"
                        startIcon={<LoginIcon />}
                        onClick={StartLogin}
                    >
                        Browser Login
                    </Button>
                    {state.waiting &&
                        <Stack sx={{ m: 3 }} direction="row" alignItems="center">
                            <CircularProgress />
                            <Typography sx={{ m: 1 }} align="center">Waiting for login...</Typography>
                        </Stack>
                    }
                </Stack>
            </Card>
            <ThemeSwitchButton />
        </Grid>
    );
}

export default LoginPage;