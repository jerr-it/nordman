import { ButtonBase, Card, Collapse, Divider, IconButton, ListItemText, Snackbar, Stack, Typography } from "@mui/material";
import { country_converter } from "../assets/country_converter";
import CancelIcon from '@mui/icons-material/Cancel';
import { useState } from "react";

function StatusCard() {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <Snackbar
            sx={{ position: "fixed", mb: -1.5 }}
            open={true}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
            <ButtonBase onClick={() => setCollapsed(!collapsed)}>
                <Card sx={{ minWidth: 200, minHeight: 70, maxWidth: 445, p: 1.25, backgroundColor: "green" }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                        <span className={"fi fi-" + country_converter("United_States")} style={{ width: 50, height: 50 }}></span>
                        <ListItemText primary="New York" secondary="United States" />
                        <ListItemText primary="185.202.220.116" secondary="us9341.nordvpn.com" />
                        <IconButton
                            color="inherit"
                            onClick={(e) => { e.stopPropagation() }}
                            onMouseDown={(e) => { e.stopPropagation() }}
                        >
                            <CancelIcon />
                        </IconButton>
                    </Stack>
                    <Collapse
                        in={collapsed}
                    >
                        <Divider sx={{ m: 1 }} />
                        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                            <Stack direction="column">
                                <Typography variant="body2">3.14KiB received</Typography>
                                <Typography variant="body2">1.41KiB sent</Typography>
                            </Stack>
                            <Stack direction="column">
                                <Typography variant="body2">NORDLYNX</Typography>
                                <Typography variant="body2">UDP</Typography>
                            </Stack>
                            <Typography variant="body2">5 minutes</Typography>
                        </Stack>
                    </Collapse>
                </Card>
            </ButtonBase>
        </Snackbar>
    );
}

export default StatusCard;