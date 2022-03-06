"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldNode = void 0;
const CalculationNode_1 = require("./CalculationNode");
class FieldNode extends CalculationNode_1.CalculationNode {
    constructor(key, variables) {
        super(key);
        this._variables = variables;
    }
    calculation() {
        return this._childNode[0].calculation();
    }
}
exports.FieldNode = FieldNode;
//# sourceMappingURL=FieldNode.js.map