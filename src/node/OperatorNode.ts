
import { CalculationNode } from "./CalculationNode";

export class OperatorNode extends CalculationNode {
    public priority: number;
    constructor(key: string) {
        super(key);
        this._checkPriority(key);
    }

    public calculation(): number {
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
        };
        return value;
    }

    private _checkPriority(key: string) {
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