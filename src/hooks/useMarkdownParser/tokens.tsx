export enum TokenTypes {
    Heading1 = 1,
    Heading2,
    Heading3,
    Heading4,
    Heading5,
    Heading6,
    LLink, // Left part of a markdown link or < character
    RLink, // Right part of a markdown link or > character
    Bold,
    Italic,
    Whitespace,
    OrderedList,
    UnorderedList,
    HorizontalRule,
    Code,
    Text,
    Quote,
}

export class Token {
    tokenType : TokenTypes;
    val : string | null;
    constructor(tokenType: TokenTypes, val: string | null) {
        this.tokenType = tokenType;
        this.val = val;
    }
    toString(): string {
        return this.tokenType + " " + this.val;
    }
}

// eslint-disable-next-line no-useless-escape 
export const TEXT_REGEX = new RegExp(/[^\s\\*<>`]/); // alternative regex [a-zA-Z0-9.!?:;()-_='\"]

export const ESCAPE_REGEX = new RegExp(/[*\\`_<>#+-]/);

export const LIST_REGEX = new RegExp(/[*+-]/);

export const HORIZONTAL_REGEX = new RegExp(/[*-_]/)