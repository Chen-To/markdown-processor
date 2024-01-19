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

    generateHTML(): string {
        let html = "";
        for (const child of this.children) {
            html += child.generateHTML();
        }
        switch (this.type) {
            case NodeTypes.H1:
                html = "<h1>" + html + "</h1>\n";
                break;
            case NodeTypes.H2:
                html = "<h2>" + html + "</h2>\n";
                break;
            case NodeTypes.H3:
                html = "<h3>" + html + "</h3>\n";
                break;
            case NodeTypes.H4:
                html = "<h4>" + html + "</h4>\n";
                break;
            case NodeTypes.H5:
                html = "<h5>" + html + "</h5>\n";
                break;
            case NodeTypes.H6:
                html = "<h6>" + html + "</h6>\n";
                break;
            case NodeTypes.Br:
                html = "<br>" + html + "</br>\n";
                break;
            case NodeTypes.Hr:
                html = "<hr>" + html + "</hr>\n";
                break;
            case NodeTypes.P:
                html = "<p>" + html + "</p>\n";
                break;
            case NodeTypes.Strong:
                html = "<strong>" + html + "</strong>\n";
                break;
            case NodeTypes.Blockquote:
                html = "<blockquote>" + html + "</blockquote>\n";
                break;
            case NodeTypes.I:
                html = "<i>" + html + "</i>\n";
                break;
            // TODO: Verify validity of the link
            case NodeTypes.A:
                html = `<a href='${html}'>` + html + "</a>\n";
                break;
            case NodeTypes.Ol:
                html = "<ol>" + html + "</ol>\n";
                break;
            case NodeTypes.Ul:
                html = "<ul>" + html + "</ul>\n";
                break;
            case NodeTypes.Li:
                html = "<li>" + html + "</li>\n";
                break;
            case NodeTypes.Code:
                html = "<code>" + html + "</code>\n";
                break;
            // redundant case here for only clarity
            case NodeTypes.Text:
                html = this.value;
                break;
        }
        return html;
    }
} 