"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperatorNode = void 0;
const CalculationNode_1 = require("./CalculationNode");
class OperatorNode extends CalculationNode_1.CalculationNode {
    constructor(key) {
        super(key);
        this._checkPriority(key);
    }
    calculation() {
        let value = 0;
        let left = this._childNode[0].calculation();
        let right = this._childNode[1].calculation();
        switch (this._key) {
            case "+":
                value = left + right;
                break;
            case "-":
                value = left - right;
                break;
            case "*":
                value = left * right;
                break;
            case "/":
                value = left / right;
                break;
            default:
                console.error(`该运算符不存在${this._key}`);
                break;
        }
        ;
        return value;
    }
    _checkPriority(key) {
        switch (key) {
            case "+":
            case "-":
                this.priority = 1;
                break;
            case "*":
            case "/":
                this.priority = 2;
                break;
            default:
                console.error("没有这个运算符");
                break;
        }
    }
}
exports.OperatorNode = OperatorNode;
//# sourceMappingURL=OperatorNode.js.map