import { Parser } from "../Parser";
import { Scanner } from "../Scanner";
import { CalculationNode } from "./CalculationNode";

export class VariableNode extends CalculationNode {
    protected _variables: Map<string, string>;
    constructor(key: string, variables: Map<string, string>) {
        super(key);
        this._variables = variables;
    }

    public calculation(): number {
        let num = 1;
        if (this._key.indexOf("-") !== -1) {
            num = -1;
            this._key = this._key.slice(1);
        }
        let scanner = new Scanner();
        scanner.setText(this._variables.get(this._key));
        let textInfo = scanner.scan();
        let parser = new Parser();
        parser.setVariables(this._variables);
        let root = parser.parser(textInfo);
        return root.calculation() * num;
    }
}