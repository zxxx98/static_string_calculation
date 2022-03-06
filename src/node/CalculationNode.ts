export class CalculationNode {
    protected _childNode: CalculationNode[];
    protected _key: string;
    constructor(key: string) {
        this._key = key;
        this._childNode = [];
    }

    public calculation(): number {
        console.error("need overwrite calculation function");
        return 0;
    }

    public addChild(node: CalculationNode) {
        this._childNode.push(node);
    }
}