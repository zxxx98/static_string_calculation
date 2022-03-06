import { CalculationNode } from "./CalculationNode";

export class FieldNode extends CalculationNode {
    protected _variables: Map<string, string>;
    constructor(key: string, variables: Map<string, string>) {
        super(key);
        this._variables = variables;
    }

    public calculation(): number {
        return this._childNode[0].calculation();
    }
}