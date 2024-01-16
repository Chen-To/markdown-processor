import * as React from "react"
import { useState } from "react"
    import { TextField, Card, CardActionArea, Typography, CssBaseline, CardContent, CardHeader } from "@mui/material";
import { styled } from "@mui/system";
import { MarkdownOutput } from "./MarkdownOutput";

const WrapperBox = styled("div")({
    display: "flex",
    justifyContent: "center",
    position: "static"
});

export default function InputBox() {

    const [inputText, setInputText] = useState(""); 

    return (
        <WrapperBox>
            <CssBaseline/>
            <Card sx={{ width: "50%", height: "100%" }}>
                <CardHeader 
                    sx={{ borderStyle: "solid", borderWidth: "1px", borderColor: "rgba(0, 0, 0, 0.10)", borderRadius: "4px" }} 
                    title={<Typography color="lightblue">Markdown Input</Typography>}
                />
                <CardActionArea>
                    <TextField
                        multiline
                        minRows={30}
                        value={inputText}
                        onChange={e => setInputText(e.target.value)}
                        variant="filled"
                        fullWidth
                        // sx={{
                        //     "& .MuiFilledInput-root": { height: "1000px"  },
                        //     "& .MuiFilledInput-input": { position: "relative" },
                        // }}
                    />
                    </CardActionArea>
            </Card>
            <Card sx={{ width: "50% "}}>
                <CardHeader 
                    sx={{ borderStyle: "solid", borderWidth: "1px", borderColor: "rgba(0, 0, 0, 0.10)", borderRadius: "4px" }} 
                    title={<Typography color="lightblue">Preview</Typography>}
                />
                <CardContent>
                    <MarkdownOutput inputText={inputText}/>
                </CardContent>
            </Card>
        </WrapperBox>
    )
}