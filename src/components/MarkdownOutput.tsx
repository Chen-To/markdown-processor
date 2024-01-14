import * as React from "react"
import { useMarkdownParser } from "../hooks/useMarkdownParser/useMarkdownParser"

type MarkdownOutputProps = {
    inputText : string

}

export const MarkdownOutput = ({ inputText }: MarkdownOutputProps) => {
    const outputHTML = useMarkdownParser({inputMarkdown: inputText});
    return (
        <>  
            <div dangerouslySetInnerHTML={{ __html: outputHTML }} />
        </>
    );
}