import * as React from "react"
import { useState } from "react"
import { TextField, Card, CardActionArea, Typography, CssBaseline, CardContent, CardHeader, Box } from "@mui/material";
import { styled } from "@mui/system";
import { MarkdownOutput } from "./MarkdownOutput";

const WrapperBox = styled("div")({
    display: "flex",
    justifyContent: "center",
    position: "static",
    // height: "1000px",
});

const defaultMarkdown = `# ${process.env.APP_NAME}
---
${process.env.APP_NAME} is a simple markdown parser that converts markdown to HTML.`
export default function InputBox() {

    const [inputText, setInputText] = useState(defaultMarkdown); 
    return (
        <>
            <CssBaseline/>
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
                            minRows={31}
                            maxRows={31}
                            defaultValue={defaultMarkdown}
                            value={inputText}
                            onChange={e => setInputText(e.target.value)}
                            variant="filled"
                            fullWidth
                            sx={{
                                // "& .MuiFilledInput-root": { position: "relative", height: "100vh"  },
                                // "& .MuiFilledInput-input": { position: "relative", top: "-10vh"},
                            }}
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
            <Box sx={{ background: "rgba(0, 0, 0, 0.06)", width: "100vw", height: "100vh" }}/>
        </>
    )
}