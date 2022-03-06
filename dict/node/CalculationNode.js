"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalculationNode = void 0;
class CalculationNode {
    constructor(key) {
        this._key = key;
        this._childNode = [];
    }
    calculation() {
        console.error("need overwrite calculation function");
        return 0;
    }
    addChild(node) {
        this._childNode.push(node);
    }
}
exports.CalculationNode = CalculationNode;
//# sourceMappingURL=CalculationNode.js.map