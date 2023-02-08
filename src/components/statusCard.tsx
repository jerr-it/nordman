import { Box, ButtonBase, Card, Collapse, Divider, IconButton, ListItemText, Snackbar, Stack, Typography } from "@mui/material";
import { country_converter } from "../assets/country_converter";
import CancelIcon from '@mui/icons-material/Cancel';
import { useState } from "react";
import { ConnectionDetails } from "../assets/connection_state";

function StatusCard({ connection, onDisconnect }: { connection: ConnectionDetails | null, onDisconnect: () => void }) {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <Snackbar
            sx={{ position: "fixed", mb: -1.5 }}
            open={connection !== null}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
            <Box>
                <ButtonBase onClick={() => setCollapsed(!collapsed)}>
                    <Card sx={{ minWidth: 200, minHeight: 70, maxWidth: 445, p: 1.25, backgroundColor: "green" }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} sx={{ mr: 5 }}>
                            <span className={"fi fi-" + country_converter(connection?.country.replaceAll(" ", "_") ?? "")} style={{ width: 50, height: 50 }}></span>
                            <ListItemText primary={connection?.city} secondary={connection?.country} />
                            <ListItemText primary={connection?.ip} secondary={connection?.hostname} />
                        </Stack>
                        <Collapse
                            in={collapsed}
                        >
                            <Divider sx={{ m: 1 }} />
                            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                                <Stack direction="column">
                                    <Typography variant="body2">{connection?.transfer.split(",")[0]}</Typography>
                                    <Typography variant="body2">{connection?.transfer.split(",")[1]}</Typography>
                                </Stack>
                                <Stack direction="column">
                                    <Typography variant="body2">{connection?.current_technology}</Typography>
                                    <Typography variant="body2">{connection?.current_protocol}</Typography>
                                </Stack>
                                <Typography variant="body2">{connection?.uptime}</Typography>
                            </Stack>
                        </Collapse>
                    </Card>
                </ButtonBase>
                <IconButton
                    color="inherit"
                    sx={{ position: "absolute", top: 0, right: 0 }}
                    onClick={(e) => { e.stopPropagation(); onDisconnect(); }}
                    onMouseDown={(e) => { e.stopPropagation() }}
                >
                    <CancelIcon />
                </IconButton>
            </Box>
        </Snackbar>
    );
}

export default StatusCard;