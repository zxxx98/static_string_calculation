"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Parser_1 = require("./Parser");
const Scanner_1 = require("./Scanner");
class Main {
    constructor() {
    }
    static use() {
        let scanner = new Scanner_1.Scanner();
        scanner.setText("-1+17.3+2.*32.31-(12+-599)+5-3-2-123+231-(1-(-3-9)-(4-7+(0-3)))+-ab-cd");
        let textInfos = scanner.scan();
        let parser = new Parser_1.Parser();
        let map = new Map();
        map.set("ab", "cd+1");
        map.set("cd", "2");
        parser.setVariables(map);
        let root = parser.parser(textInfos);
        console.log(root.calculation());
    }
}
Main.use();
//# sourceMappingURL=Main.js.map