
import { FunctionManager } from "../function/FunctionManager";
import { CalculationNode } from "./CalculationNode";

export class FunctionNode extends CalculationNode {
    constructor(key: string) {
        super(key);
    }

    public calculation(): number {
        let params = [];
        for (let child of this._childNode) {
            params.push(child.calculation());
        }
        return FunctionManager.executeFuncByName(this._key, params);
    }
}