
import { CalculationNode } from "./CalculationNode";

export class NumberNode extends CalculationNode {
    constructor(key: string) {
        super(key);
    }

    public calculation(): number {
        return Number(this._key);
    }
}