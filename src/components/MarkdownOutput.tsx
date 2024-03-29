import * as React from "react"
import { useMarkdownParser } from "../hooks/useMarkdownParser/useMarkdownParser"

type MarkdownOutputProps = {
    inputText : string
}

export const MarkdownOutput = ({ inputText }: MarkdownOutputProps) => {
    const outputHTML = useMarkdownParser({inputMarkdown: inputText});
    return (
        <>  
            <div 
                style={{height: "706px", overflow: "scroll"}} 
                dangerouslySetInnerHTML={{ __html: outputHTML }} 
            />
        </>
    );
}