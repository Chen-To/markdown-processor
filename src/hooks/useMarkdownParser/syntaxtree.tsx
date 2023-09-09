import { TokenTypes, Token } from "./tokens"

class SyntaxTree {
    children : Array<SyntaxTree>;
    token : Token;
}