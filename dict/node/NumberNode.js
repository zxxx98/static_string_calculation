"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NumberNode = void 0;
const CalculationNode_1 = require("./CalculationNode");
class NumberNode extends CalculationNode_1.CalculationNode {
    constructor(key) {
        super(key);
    }
    calculation() {
        return Number(this._key);
    }
}
exports.NumberNode = NumberNode;
//# sourceMappingURL=NumberNode.js.map