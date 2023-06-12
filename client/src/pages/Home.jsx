import * as React from "react";
import { Paper, InputBase, Divider, IconButton } from "@mui/material";
import DirectionsIcon from "@mui/icons-material/Directions";

import socket from "../socket/socket";

export default function Home() {
    return (
        <Paper component="form" sx={{ p: "2px 4px", display: "flex", alignItems: "center", width: 600 }}>
            <InputBase sx={{ ml: 1, flex: 1 }} placeholder="Room ID" inputProps={{ "aria-label": "Room ID" }} />
            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
            <InputBase sx={{ ml: 1, flex: 1 }} placeholder="User Name" inputProps={{ "aria-label": "User Name" }} />
            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
            <IconButton color="primary" sx={{ p: "10px" }} aria-label="join">
                <DirectionsIcon />
            </IconButton>
        </Paper>
    );
}
