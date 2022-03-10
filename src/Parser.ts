import { KindEnum } from "./const/KindEnum";
import { FunctionManager } from "./function/FunctionManager";
import { CalculationNode } from "./node/CalculationNode";
import { FieldNode } from "./node/FieldNode";
import { FunctionNode } from "./node/FunctionNode";
import { NumberNode } from "./node/NumberNode";
import { OperatorNode } from "./node/OperatorNode";
import { VariableNode } from "./node/VariableNode";
import { TextInfo } from "./Scanner";

/**
* @description 根据生成的TextInfo生成计算树
* @author zhouxin
* @date 2022-03-04 17:29:52
* @lastEditTime 2022-03-04 17:29:52
* @lastEditors 
* @filePath 
*/

//最后生成的树应该是如下结构
//        FieldNode
//            |
//       OperatorNode
//         /      \
//   NumberNode   VariableNode       
export class Parser {
    private _variables: Map<string, string>;
    constructor() {

    }

    public setVariables(variables: Map<string, string>) {
        this._variables = variables;
    }

    public parser(textInfos: TextInfo[]): FieldNode {
        let root = new FieldNode("", this._variables);
        let nodes = [];
        let len = textInfos.length;
        let curIndex = 0;
        while (curIndex < len) {
            let textInfo = textInfos[curIndex];
            let text = textInfo.text;
            switch (textInfo.kind) {
                case KindEnum.NUMBER:
                    nodes.push(new NumberNode(text));
                    break;
                case KindEnum.VARIABLE:
                    if (FunctionManager.checkIsFunc(text)) {
                        let obj = this._getFieldEndPos(textInfos.slice(curIndex + 2));
                        nodes.push(this._createFuncNode(obj.arr, text));
                        curIndex += obj.endPos + 2;
                    } else {
                        nodes.push(new VariableNode(text, this._variables));
                    }
                    break;
                case KindEnum.OPERATOR:
                    nodes.push(new OperatorNode(text));
                    break;
                case KindEnum.FIELD:
                    if (this._multiplicativeImplicitCheck(nodes[nodes.length - 1])) {
                        nodes.push(new OperatorNode("*"));
                    }
                    let obj = this._getFieldEndPos(textInfos.slice(curIndex + 1));
                    nodes.push(this.parser(obj.arr));
                    curIndex += obj.endPos + 1;
                    break;
                default:
                    break;
            }
            curIndex++;
        }
        let tree = this._createTree(nodes);
        root.addChild(tree);
        return root;
    }

    private _getFieldEndPos(textInfos: TextInfo[]): { arr: TextInfo[], endPos: number } {
        let count = 0;
        let len = textInfos.length;
        for (let i = 0; i < len; i++) {
            let textInfo = textInfos[i];
            if (textInfo.kind === KindEnum.FIELD) {
                if (textInfo.text == "(") {
                    count++;
                } else {
                    if (count == 0) {
                        return { arr: textInfos.slice(0, i), endPos: i };
                    } else {
                        count--;
                    }
                }
            }
        }
    }

    private _createTree(nodes: CalculationNode[]) {
        let len = nodes.length;
        if (len == 1) {
            return nodes[0];
        }
        let minpriority = 999;
        let root: OperatorNode = null;
        let rootIndex = 0;
        for (let i = 0; i < len; i++) {
            let node = nodes[i];
            if (node instanceof OperatorNode) {
                if (node.priority <= minpriority) {
                    minpriority = node.priority;
                    root = node;
                    rootIndex = i;
                }
            }
        }
        root.addChild(this._createTree(nodes.slice(0, rootIndex)));
        root.addChild(this._createTree(nodes.slice(rootIndex + 1)));
        return root;
    }

    private _createFuncNode(textInfos: TextInfo[], text: string): FunctionNode {
        let nodess: TextInfo[][] = [];
        let temps: TextInfo[] = [];
        for (let temp of textInfos) {
            if (temp.kind === KindEnum.PARAM_SPLIT_SYMBOL) {
                nodess.push(temps.slice());
                temps = [];
            } else {
                temps.push(temp);
            }
        }
        if (temps.length > 0) {
            nodess.push(temps.slice());
            temps = [];
        }
        let funcNode = new FunctionNode(text);
        for (let nodes of nodess) {
            funcNode.addChild(this.parser(nodes));
        }
        return funcNode;
    }

    /**
    * 乘法简写检查  如果用了简写就塞一个乘法标记到队列中
    * @param lastNode 上一个节点
    */
    private _multiplicativeImplicitCheck(lastNode: CalculationNode) {
        if (lastNode instanceof NumberNode || lastNode instanceof VariableNode) {
            return true;
        }
        return false;
    }
}