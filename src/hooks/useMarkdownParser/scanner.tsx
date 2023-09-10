import { TokenTypes, Token, TEXT_REGEX, ESCAPE_REGEX, LIST_REGEX, HORIZONTAL_REGEX } from "./tokens"
import { isNumeric } from "./helper_functions";

class Scanner {
    input : string;
    charId : number;
    constructor(input: string) {
        this.input = input;
        this.charId = 0;
    }
}

export class Tokenizer extends Scanner {
    constructor(input: string) {
        super(input);
    }

    #resetToPrevious() {
        if (this.charId > 0) {
            --this.charId;
        }
    }

    #scanNextCharacter(): string | null {
        if (this.charId >= this.input.length) {
            return null;
        }
        else {
            return this.input[this.charId++];
        }
    }

    #tokenizeHeading(): Token {
        let tokenVal = "#";
        // default case 1
        let token = new Token(TokenTypes.Heading1, tokenVal);
        while (this.#scanNextCharacter() === "#") {
            tokenVal += "#";
        }
        switch(tokenVal.length) {
            case 2:
                token = new Token(TokenTypes.Heading2, tokenVal);
                break;
            case 3:
                token = new Token(TokenTypes.Heading3, tokenVal);
                break;
            case 4:
                token = new Token(TokenTypes.Heading4, tokenVal);
                break;
            case 5:
                token = new Token(TokenTypes.Heading5, tokenVal);
                break;
            case 6:
                token = new Token(TokenTypes.Heading6, tokenVal);
                break;
        }
        // reset to previous character (ending #) so our "next character" is correctly read 
        this.#resetToPrevious();
        return token;
    }

    // start of line relevant
    #tokenizeWhitespace(): Token {
        let whiteSpace = " ";
        while (this.#scanNextCharacter() === " ") {
            whiteSpace += " ";
        }
        // reset to previous character (the last " " of the sequence) so our "next character" is correctly read 
        this.#resetToPrevious();
        return new Token(TokenTypes.Whitespace, whiteSpace);
    }

    #tokenizeText(firstChar: string): Token {
        let resultText = firstChar;
        let currChar = this.#scanNextCharacter();
        // in case it is null we check first
        while (currChar && TEXT_REGEX.test(currChar)) {
            resultText += currChar;
            currChar = this.#scanNextCharacter();
        }
        // reset to previous character (the last alphanumeric character in the text) so our "next character" is correctly read 
        this.#resetToPrevious();
        return new Token(TokenTypes.Text, resultText);
    }

    // needs to deal with the case *should be italic***should be bold**
    #tokenizeItalticOrBold(lastFormatToken: TokenTypes | null): Token {
        if (lastFormatToken === TokenTypes.Italic) {
            return new Token(TokenTypes.Italic, "*")
        }
        else if (this.#scanNextCharacter() !== "*") {
            // reset to previous character so our "next character" is correctly read 
            this.#resetToPrevious();
            return new Token(TokenTypes.Italic, "*");
        }
        else {
            return new Token(TokenTypes.Bold, "**");
        }
    }

    #tokenizeEscapeCharacter(): Token | null {
        let escapedChar = this.#scanNextCharacter();
        if (ESCAPE_REGEX.test(escapedChar)) {
            if (escapedChar === "<") {
                escapedChar = "&lt";
            }
            else if (escapedChar === ">") {
                escapedChar = "&gt";
            }
            // since we only escape one character no need to reset to previous
            return new Token(TokenTypes.Text, escapedChar);
        }
        else {
            // reset to previous character so our "next character" is correctly read 
            this.#resetToPrevious();
            return null;
        }
    }

    // start of line relevant
    // for lists we need to have a space following the list identifier (e.g 1. inserttext) or (e.g * inserttext)
    #tokenizeList(firstChar: string): Token | null {
        if (isNumeric(firstChar)) {
            if (this.#scanNextCharacter() === "." && this.#scanNextCharacter() === " ") {
                return new Token(TokenTypes.OrderedList, firstChar + ".");
            }
            else {
                // reset twice because we checked two next characters
                this.#resetToPrevious();
                this.#resetToPrevious();
                return null;
            }
        }
        else {
            if (this.#scanNextCharacter() === " ") {
                return new Token(TokenTypes.UnorderedList, firstChar);
            }
            else {
                // reset once because we checked one next character to guarantee it is space
                this.#resetToPrevious();
                return null;
            }
        }
    }


    // start of line relevant
    #tokenizeHorizontalRule(firstChar: string): Token | null {
        let ruleStr = firstChar;
        while (this.#scanNextCharacter() === firstChar) {
            ruleStr += firstChar;
        }
        // needs to be 3 or more in length and only contain the specific identifier
        if (ruleStr.length >= 3 && ruleStr.length === this.input.length) {
            return new Token(TokenTypes.HorizontalRule, ruleStr);
        }
        // In this case we reset the charId to that of the second character to avoid the edge case with a line containing **
        else {
            this.charId = 1;
            return null;
        }
    }

    tokenizeLine(): Array<Token> {
        const tokens: Array<Token> = [];
        let currChar = this.#scanNextCharacter();
        let lastFormatType = null;
        while (currChar) {

            // this indicates that we are at the start of the line so there are extra markdown rules to keep track of
            if (tokens.length == 0) {
                if (currChar === "#") {
                    tokens.push(this.#tokenizeHeading());
                    continue;
                }
                // TODO: isNumeric used twice maybe examine a better way to write this
                else if (isNumeric(currChar) || LIST_REGEX.test(currChar)) {
                    const listToken = this.#tokenizeList(currChar);
                    if (listToken) {
                        tokens.push(listToken);
                        continue;
                    }
                }
                // start of line relevant
                else if (currChar === ">") {
                    tokens.push(new Token(TokenTypes.Quote, ">"));
                    continue;
                }
                else if (HORIZONTAL_REGEX.test(currChar)) {
                    const horizontalRuleToken = this.#tokenizeHorizontalRule(currChar);
                    if (horizontalRuleToken) {
                        tokens.push(horizontalRuleToken);
                        continue;
                    }
                }
            }

            // all other general markdown rules not specific to start of the line
            if (currChar === "<") {
                tokens.push(new Token(TokenTypes.LLink, "<"));
            }
            else if (currChar === ">") {
                tokens.push(new Token(TokenTypes.RLink, ">"));
            }
            else if (currChar === "`") {
                tokens.push(new Token(TokenTypes.Code, "`"));
            }
            else if (currChar === " ") {
                tokens.push(this.#tokenizeWhitespace());
            }
            else if (currChar === "\\") {
                const escapeToken = this.#tokenizeEscapeCharacter();
                if (escapeToken) {
                    tokens.push(escapeToken);
                }
            }
            else if (currChar === "*") {
                const formatToken = this.#tokenizeItalticOrBold(lastFormatType);
                lastFormatType = lastFormatType === formatToken.tokenType ? null : formatToken.tokenType;
                tokens.push(formatToken);
            }
            // need to keep this at end because it overlaps with some of the previous characters
            else if (TEXT_REGEX.test(currChar)) {
                tokens.push(this.#tokenizeText(currChar));
            }   

            currChar = this.#scanNextCharacter();

        }
        return tokens;
    }
}   


export class LineScanner extends Scanner {
    constructor(input: string) {
        super(input);
    }

    scanLine(): string | null {
        if (this.charId === this.input.length) {
            return null;
        }
        else {
            let token = "";
            while (this.input[this.charId] !== '\n') {
                token += this.input[this.charId++];
            }
            // skipping the newline character
            this.charId++;
            return token;
        }
    }
}
 