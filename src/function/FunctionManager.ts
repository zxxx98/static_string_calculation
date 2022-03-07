export class FunctionManager {
    /**
     * 函数表
     */
    private static _functionRegisterMap: Map<string, Function> = new Map();
    private static readonly _funcNameConst = {
        Min: "min",
        Max: "max",
        Abs: "abs",
    }

    public static checkIsFunc(name: string) {
        return this._functionRegisterMap.has(name);
    }

    public static registerFunc(name: string, execute: Function) {
        this._functionRegisterMap.set(name, execute);
    }

    public static executeFuncByName(name: string, ...args) {
        let func = this._functionRegisterMap.get(name);
        return func(...args);
    }

    public static initDefaultFunc() {
        this.registerFunc(this._funcNameConst.Min, this._min);
        this.registerFunc(this._funcNameConst.Max, this._max);
        this.registerFunc(this._funcNameConst.Abs, this._abs);
    }

    private static _min(...arg) {
        let nums = arg[0].map(char => { return Number(char) })
        return Math.min(...nums);
    }

    private static _max(...arg) {
        let nums = arg[0].map(char => { return Number(char) })
        return Math.max(...nums);
    }

    private static _abs(...arg) {
        return Math.abs(Number(arg[0]));
    }
}

FunctionManager.initDefaultFunc();