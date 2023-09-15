import * as React from "react"
import TextareaAutosize from "@mui/material/TextareaAutosize"
import { styled } from "@mui/system";

export default function InputBox() {
    const TextAreaBox = styled(TextareaAutosize)({
        width: "100%",
    });
    return (
        <>
            <TextAreaBox minRows={20}/>
        </>
    )
}