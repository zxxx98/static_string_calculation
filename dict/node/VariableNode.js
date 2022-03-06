"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VariableNode = void 0;
const Parser_1 = require("../Parser");
const Scanner_1 = require("../Scanner");
const CalculationNode_1 = require("./CalculationNode");
class VariableNode extends CalculationNode_1.CalculationNode {
    constructor(key, variables) {
        super(key);
        this._variables = variables;
    }
    calculation() {
        let num = 1;
        if (this._key.indexOf("-") !== -1) {
            num = -1;
            this._key = this._key.slice(1);
        }
        let scanner = new Scanner_1.Scanner();
        scanner.setText(this._variables.get(this._key));
        let textInfo = scanner.scan();
        let parser = new Parser_1.Parser();
        parser.setVariables(this._variables);
        let root = parser.parser(textInfo);
        return root.calculation() * num;
    }
}
exports.VariableNode = VariableNode;
//# sourceMappingURL=VariableNode.js.map