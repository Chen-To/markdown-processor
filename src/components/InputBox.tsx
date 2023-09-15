import * as React from "react"
import TextareaAutosize from "@mui/material/TextareaAutosize"
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CssBaseline from "@mui/material/CssBaseline";
import { styled } from "@mui/system";

export default function InputBox() {
    const WrapperBox = styled("div")({
        display: "flex",
        marginTop: "100px",
        justifyContent: "center",
    });

    const TextAreaBox = styled(TextareaAutosize)({
        width: "100%",
    });

    return (
        <WrapperBox>
            <CssBaseline/>
            <Box sx={{ width: "45%" }}>
                <CssBaseline/>
                <AppBar position="relative">
                    <Typography variant="h6" align='center'>Markdown</Typography>
                </AppBar>
                <TextAreaBox minRows={20}/>
            </Box>
            <Box sx={{ width: "45% "}}>
                <CssBaseline/>
                <AppBar position="relative">
                    <Typography variant="h6" align='center'>Preview</Typography>
                </AppBar>
            </Box>
        </WrapperBox>
    )

}