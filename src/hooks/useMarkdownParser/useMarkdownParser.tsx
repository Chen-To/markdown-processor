import { useState, useEffect } from "react";
import { LineScanner, Tokenizer } from "./scanner";
import { Token, TokenTypes } from "./tokens";
import { NodeTypes, SyntaxTree } from "./syntaxtree";


function findNextToken(arrTokens: Array<Token>, matchingType: TokenTypes, startingIndex: number, endingIndex: number): number {
    for (let i = startingIndex+1; i < endingIndex; ++i) {
        if (arrTokens[i].tokenType == matchingType) {
            return i;
        }
    }
    return -1;
}


function parseGeneral(root: SyntaxTree, arrTokens: Array<Token>, startingIndex: number, endingIndex: number) {
    const NOT_FOUND = -1;
    let i = startingIndex;
    while (i < endingIndex) {
        switch (arrTokens[i].tokenType) {
            case TokenTypes.Text:
                console.log("HERE TEXT");
                root.children.push(SyntaxTree.syntaxTreeFactory(NodeTypes.Text, arrTokens[i].val));
                break;
            case TokenTypes.Whitespace:
                if (i === arrTokens.length-1 && arrTokens[i].val.length >= 2) {
                    root.children.push(SyntaxTree.syntaxTreeFactory(NodeTypes.Br));
                }
                else {
                    root.children.push(SyntaxTree.syntaxTreeFactory(NodeTypes.Text, arrTokens[i].val));
                }
                break;
            case TokenTypes.Bold: {
                const nextTokenIndex = findNextToken(arrTokens, TokenTypes.Bold, i, endingIndex);
                if (nextTokenIndex !== NOT_FOUND) {
                    const boldSyntaxNode = SyntaxTree.syntaxTreeFactory(NodeTypes.Strong);
                    parseGeneral(boldSyntaxNode, arrTokens, i+1, nextTokenIndex);
                    root.children.push(boldSyntaxNode);
                    i = nextTokenIndex;
                }
                else {
                    root.children.push(SyntaxTree.syntaxTreeFactory(NodeTypes.Text, arrTokens[i].val));
                }
                break;
            }
            case TokenTypes.Italic: {
                const nextTokenIndex = findNextToken(arrTokens, TokenTypes.Italic, i, endingIndex);
                if (nextTokenIndex !== NOT_FOUND) {
                    const italicSyntaxNode = SyntaxTree.syntaxTreeFactory(NodeTypes.I);
                    parseGeneral(italicSyntaxNode, arrTokens, i+1, nextTokenIndex);
                    root.children.push(italicSyntaxNode);
                    i = nextTokenIndex;
                }
                else {
                    root.children.push(SyntaxTree.syntaxTreeFactory(NodeTypes.Text, arrTokens[i].val));
                }
                break;
            }
            case TokenTypes.LLink: {
                const nextTokenIndex = findNextToken(arrTokens, TokenTypes.RLink, i, endingIndex); 
                if (nextTokenIndex !== NOT_FOUND) {
                    const linkSyntaxNode = SyntaxTree.syntaxTreeFactory(NodeTypes.A);
                    parseGeneral(linkSyntaxNode, arrTokens, i+1, nextTokenIndex);
                    root.children.push(linkSyntaxNode);
                    i = nextTokenIndex;
                }
                else {
                    root.children.push(SyntaxTree.syntaxTreeFactory(NodeTypes.Text, "&lt"));
                }
                break;
            }
            // This technically should not happen (as we find the next immediate RLink upon hitting a LLink as shown above)
            // This occuring means the user may have either missed an LLink or just entered a >
            case TokenTypes.RLink: {
                root.children.push(SyntaxTree.syntaxTreeFactory(NodeTypes.Text, "&gt"));
                break;
            }
            case TokenTypes.Code: {
                const nextTokenIndex = findNextToken(arrTokens, TokenTypes.Code, i, endingIndex);
                if (nextTokenIndex !== NOT_FOUND) {
                    const codeSyntaxTree = SyntaxTree.syntaxTreeFactory(NodeTypes.Code);
                    parseGeneral(codeSyntaxTree, arrTokens, i+1, nextTokenIndex);
                    root.children.push(codeSyntaxTree);
                    i = nextTokenIndex;
                }
                else {
                    root.children.push(SyntaxTree.syntaxTreeFactory(NodeTypes.Text, "`"));
                }
                break;
            }
        }
        ++i;
    }
}


function parseList(root: SyntaxTree, allTokens: Array<Array<Token>>, listType: TokenTypes, start: number, 
    nestedWhitespace: number): number {
    let i = start;
    while (i < allTokens.length) {
        switch (allTokens[i][0].tokenType) {
            case listType: {
                const liTree = SyntaxTree.syntaxTreeFactory(NodeTypes.Li);
                parseGeneral(liTree, allTokens[i], 1, allTokens[i].length);
                root.children.push(liTree);
                ++i;
                break;
            }
            case TokenTypes.Whitespace: {
                if (allTokens[i][1].tokenType === TokenTypes.OrderedList || allTokens[i][1].tokenType === TokenTypes.UnorderedList) {
                    // check the nested degrees we have 3 cases
                    // case 1: it is a list nested one level further than the current list (we use recursion to process it)
                    if (allTokens[i][0].val.length >= nestedWhitespace + 4) {
                        const nestedListType = allTokens[i][1].tokenType === TokenTypes.OrderedList ? NodeTypes.Ol : NodeTypes.Ul;
                        const nestedListTree = SyntaxTree.syntaxTreeFactory(nestedListType);
                        i = parseList(nestedListTree, allTokens, allTokens[i][1].tokenType, i, allTokens[i][0].val.length);
                    }
                    // case 2: the nested list has ended (the current line is that of the list one level less nested)
                    else if (allTokens[i][0].val.length < nestedWhitespace) {
                        return i - 1;
                    }
                    // case 3: the list is nested same amount as the one currently being processed.
                    else {
                        const liTree = SyntaxTree.syntaxTreeFactory(NodeTypes.Li);
                        parseGeneral(liTree, allTokens[i], 1, allTokens[i].length);
                        root.children.push(liTree);
                    }
                    ++i;
                    break;
                }
                else {
                    // minus 1 to adjust for the fact that the current index is the one we failed at
                    return i - 1;
                }
            }
            default:
                // minus 1 to adjust for the fact that the current index is the one we failed at
                return i - 1;
        }
    }
    return i;
}


function convertMarkdownToTokens(inputMarkdown: string): Array<Array<Token>> {
    const ls = new LineScanner(inputMarkdown);
    const allTokens: Array<Array<Token>> = [];
    let currLine = ls.scanLine();
    console.log(`currLine: ${currLine}`)
    while (currLine) {
        if (currLine !== "\n") {
            const tokenizer = new Tokenizer(currLine);
            allTokens.push(tokenizer.tokenizeLine());
        }
        currLine = ls.scanLine();
    }
    return allTokens;
}   


// TODO: Probably move this into the hook so that we can call setState for the error
function generateSyntaxTree(inputMarkdown: string): SyntaxTree {
    const syntaxTree = SyntaxTree.syntaxTreeFactory();
    let currParagraphTree: SyntaxTree = null;
    let newParagraph: boolean = true;
    const allTokens = convertMarkdownToTokens(inputMarkdown);
    console.log(`allTokens: ${allTokens}`)
    for (let i = 0; i < allTokens.length; ++i) {
        if (allTokens[i].length === 0) {
            // TODO: Examine empty line logic (its a skip line for now) but it is relevant for starting new paragraphs
            newParagraph = true;
            continue;
        }

        // parsing rules based on first token
        switch (allTokens[i][0].tokenType) {
            case TokenTypes.HorizontalRule:
                syntaxTree.children.push(SyntaxTree.syntaxTreeFactory(NodeTypes.Hr));
                newParagraph = true;
                break;
            case TokenTypes.Heading1: {
                const heading1Tree = SyntaxTree.syntaxTreeFactory(NodeTypes.H1);
                parseGeneral(heading1Tree, allTokens[i], 1, allTokens[i].length);
                syntaxTree.children.push(heading1Tree);
                newParagraph = true;
                break;
            }
            case TokenTypes.Heading2: {
                const heading2Tree = SyntaxTree.syntaxTreeFactory(NodeTypes.H2);
                parseGeneral(heading2Tree, allTokens[i], 1, allTokens[i].length);
                syntaxTree.children.push(heading2Tree);
                newParagraph = true;
                break;
            }
            case TokenTypes.Heading3: {
                const heading3Tree = SyntaxTree.syntaxTreeFactory(NodeTypes.H3);
                parseGeneral(heading3Tree, allTokens[i], 1, allTokens[i].length);
                syntaxTree.children.push(heading3Tree);
                newParagraph = true;
                break;
            }
            case TokenTypes.Heading4: {
                const heading4Tree = SyntaxTree.syntaxTreeFactory(NodeTypes.H4);
                parseGeneral(heading4Tree, allTokens[i], 1, allTokens[i].length);
                syntaxTree.children.push(heading4Tree);
                newParagraph = true;
                break;
            }
            case TokenTypes.Heading5: {
                const heading5Tree = SyntaxTree.syntaxTreeFactory(NodeTypes.H5);
                parseGeneral(heading5Tree, allTokens[i], 1, allTokens[i].length);
                syntaxTree.children.push(heading5Tree);
                newParagraph = true;
                break;
            }
            case TokenTypes.Heading6: {
                const heading6Tree = SyntaxTree.syntaxTreeFactory(NodeTypes.H6);
                parseGeneral(heading6Tree, allTokens[i], 1, allTokens[i].length);
                syntaxTree.children.push(heading6Tree);
                newParagraph = true;
                break;
            }
            case TokenTypes.Quote: {
                const quoteTree = SyntaxTree.syntaxTreeFactory(NodeTypes.Blockquote);
                parseGeneral(quoteTree, allTokens[i], 1, allTokens[i].length);
                syntaxTree.children.push(quoteTree);
                newParagraph = true;
                break;
            }
            case TokenTypes.OrderedList: {
                const olTree = SyntaxTree.syntaxTreeFactory(NodeTypes.Ol);
                i = parseList(olTree, allTokens, TokenTypes.OrderedList, i, 0);
                syntaxTree.children.push(olTree);
                newParagraph = true;
                break;
            }
            case TokenTypes.UnorderedList: {
                const ulTree = SyntaxTree.syntaxTreeFactory(NodeTypes.Ul);
                i = parseList(ulTree, allTokens, TokenTypes.UnorderedList, i, 0);
                syntaxTree.children.push(ulTree);
                newParagraph = true;
                break;
            }
            // default for Text, Whitespace, Bold, Italic, Code, Link Types
            default: {
                if (newParagraph) {
                    currParagraphTree = SyntaxTree.syntaxTreeFactory(NodeTypes.P);
                }
                parseGeneral(currParagraphTree, allTokens[i], 0, allTokens[i].length);
            }
        }
        if (newParagraph && currParagraphTree) {
            syntaxTree.children.push(currParagraphTree);
            currParagraphTree = null;
        }
    }
    
    // edge case for ending with a paragraph we would still need to push the paragraph tree
    if (currParagraphTree) {
        syntaxTree.children.push(currParagraphTree);
    }
    return syntaxTree;
}

type MarkdownParserHookProps = {
    inputMarkdown: string;
}

export const useMarkdownParser = ({ inputMarkdown }: MarkdownParserHookProps) => {
    const [outputHTML, setOutputHTML] = useState("");
    useEffect(() => {
        const syntaxTree = generateSyntaxTree(inputMarkdown);
        const html = syntaxTree.generateHTML();
        setOutputHTML(html);
        // For debugging
        console.log(html);
    });
    return outputHTML;
}