export enum NodeTypes {
    H1 = 1,
    H2,
    H3,
    H4,
    H5,
    H6,
    Br,
    Hr,
    P,
    Strong,
    Blockquote,
    I,
    A,
    Ol,
    Ul,
    Li,
    Code,
    Text
}

export class SyntaxTree {
    children : Array<SyntaxTree>;
    type: NodeTypes | null;
    value: string;

    // using a factory style design pattern
    static syntaxTreeFactory(type? : NodeTypes, value? : string): SyntaxTree {
        const syntaxTree = new SyntaxTree();
        if (typeof type !== 'undefined') {
            syntaxTree.type = type;
        }
        if (typeof value !== 'undefined') {
            syntaxTree.value = value;
        }
        return syntaxTree;
    }

    // root constructor
    constructor() {
        this.children = [];
        this.type = null;
        this.value = "";
    }
} 