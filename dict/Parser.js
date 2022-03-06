"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
const KindEnum_1 = require("./const/KindEnum");
const FieldNode_1 = require("./node/FieldNode");
const NumberNode_1 = require("./node/NumberNode");
const OperatorNode_1 = require("./node/OperatorNode");
const VariableNode_1 = require("./node/VariableNode");
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
class Parser {
    constructor() {
    }
    setVariables(variables) {
        this._variables = variables;
    }
    parser(textInfos) {
        let root = new FieldNode_1.FieldNode("", this._variables);
        let nodes = [];
        let len = textInfos.length;
        let curIndex = 0;
        while (curIndex < len) {
            let textInfo = textInfos[curIndex];
            let text = textInfo.text;
            switch (textInfo.kind) {
                case KindEnum_1.KindEnum.NUMBER:
                    nodes.push(new NumberNode_1.NumberNode(text));
                    break;
                case KindEnum_1.KindEnum.VARIABLE:
                    nodes.push(new VariableNode_1.VariableNode(text, this._variables));
                    break;
                case KindEnum_1.KindEnum.OPERATOR:
                    nodes.push(new OperatorNode_1.OperatorNode(text));
                    break;
                case KindEnum_1.KindEnum.FIELD:
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
    _getFieldEndPos(textInfos) {
        let count = 0;
        let len = textInfos.length;
        for (let i = 0; i < len; i++) {
            let textInfo = textInfos[i];
            if (textInfo.kind === KindEnum_1.KindEnum.FIELD) {
                if (textInfo.text == "(") {
                    count++;
                }
                else {
                    if (count == 0) {
                        return { arr: textInfos.slice(0, i), endPos: i };
                    }
                    else {
                        count--;
                    }
                }
            }
        }
    }
    _createTree(nodes) {
        let len = nodes.length;
        if (len == 1) {
            return nodes[0];
        }
        let minpriority = 999;
        let root = null;
        let rootIndex = 0;
        for (let i = 0; i < len; i++) {
            let node = nodes[i];
            if (node instanceof OperatorNode_1.OperatorNode) {
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
}
exports.Parser = Parser;
//# sourceMappingURL=Parser.js.map