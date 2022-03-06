"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CharEnum = exports.Scanner = void 0;
const KindEnum_1 = require("./const/KindEnum");
/**
* @description 词法分析
* 此类的主要作用是将一段静态文本分析成一个一个的token（参与运算的变量，运算符，数字，括号……）
* @author zhouxin
* @date 2022-03-04 09:58:41
* @lastEditTime 2022-03-04 09:58:41
* @lastEditors
* @filePath
*/
class Scanner {
    constructor() {
        this._reverseFlag = false;
        this._text = "";
        this._textInfos = [];
        this._lastChar = null;
        this._lastTextInfo = null;
        this._lastCharType = CharEnum.None;
        this._charTypeMap = new Map();
        this._charTypeMap.set(CharEnum.Char, this._isChar);
        this._charTypeMap.set(CharEnum.Number, this._isNumber);
        this._charTypeMap.set(CharEnum.Field, this._isField);
        this._charTypeMap.set(CharEnum.Operator, this._isOperator);
        this._charTypeMap.set(CharEnum.Point, this._isPoint);
    }
    setText(text) {
        this._text = text;
    }
    /**
     * 扫描主函数，这个过程中会把静态字符串解析为一个个的字符信息
     * 包含错误语法检测
     * @returns
     */
    scan() {
        let len = this._text.length;
        let curPos = 0;
        while (curPos < len) {
            let char = this._text[curPos];
            if (this._checkReverse(char)) {
                this._reverseFlag = true;
                curPos++;
                //直接进行下一个字符的操作，这里只加一个标记位，在下个字符最后组织成字符信息的时候塞进去
                continue;
            }
            let type = this._checkCharType(char);
            if (type === CharEnum.None || this._checkError(type)) {
                this._error(curPos);
                return null;
            }
            //判断是要更新上一个字符信息（主要是变量，数字的拼接）还是新建一个
            let isUpdate = this._checkCharIsUpdate(type);
            if (isUpdate) {
                this._lastTextInfo.text += char;
                this._lastTextInfo.endPos++;
            }
            else {
                let kind = null;
                switch (type) {
                    case CharEnum.Char:
                        kind = KindEnum_1.KindEnum.VARIABLE;
                        break;
                    case CharEnum.Number:
                        kind = KindEnum_1.KindEnum.NUMBER;
                        break;
                    case CharEnum.Field:
                        kind = KindEnum_1.KindEnum.FIELD;
                        break;
                    case CharEnum.Operator:
                        kind = KindEnum_1.KindEnum.OPERATOR;
                        break;
                }
                if (kind == null) {
                    this._error(curPos);
                    return;
                }
                if (this._reverseFlag) {
                    char = "-" + char;
                    this._reverseFlag = false;
                }
                let textInfo = {
                    text: char,
                    kind: kind,
                    startPos: curPos,
                    endPos: curPos + 1
                };
                this._lastTextInfo = textInfo;
                this._textInfos.push(textInfo);
            }
            this._lastChar = char;
            this._lastCharType = type;
            curPos++;
        }
        return this._textInfos;
    }
    /**
     * 根据注册的类型判断函数返回字符类型
     * @param char 字符
     * @returns
     */
    _checkCharType(char) {
        let ascll = char.charCodeAt(0);
        for (let [charType, checkFun] of this._charTypeMap) {
            if (checkFun(ascll)) {
                return charType;
            }
        }
        return CharEnum.None;
    }
    /**
     * 检查-号是减号(false)还是负号(true)
     * @param char 字符
     * @returns
     */
    _checkReverse(char) {
        if (char == "-" && (!this._lastChar || this._lastChar == "(" || this._lastCharType == CharEnum.Operator)) {
            return true;
        }
        return false;
    }
    /**
     * 错误语法检查
     * @param type 字符类型
     * @returns
     */
    _checkError(type) {
        if (type == CharEnum.Point) {
            //  .123  ||  (.123  ||  +.123
            if (!this._lastTextInfo || this._lastTextInfo.kind === KindEnum_1.KindEnum.FIELD || this._lastTextInfo.kind === KindEnum_1.KindEnum.OPERATOR) {
                return true;
            }
            //  123.123.1
            if (this._lastTextInfo.kind == KindEnum_1.KindEnum.NUMBER && this._lastTextInfo.text.indexOf(".") !== -1) {
                return true;
            }
        }
        //  123a
        if (type == CharEnum.Char && this._lastTextInfo && this._lastTextInfo.kind == KindEnum_1.KindEnum.NUMBER) {
            return true;
        }
        if (type == CharEnum.Operator && this._lastCharType == CharEnum.Operator) {
            return true;
        }
        return false;
    }
    /**
     * 检查字符类型是创建一个textInfo还是更新前一个textInfo
     * @param type
     * @returns isUpdate
     */
    _checkCharIsUpdate(type) {
        if (!this._lastTextInfo || this._lastTextInfo.kind === KindEnum_1.KindEnum.FIELD || this._lastTextInfo.kind === KindEnum_1.KindEnum.OPERATOR) {
            return false;
        }
        if (type == CharEnum.Operator || type == CharEnum.Field) {
            return false;
        }
        return true;
    }
    /**
     * 0-9
     * @param ascll
     * @returns
     */
    _isNumber(ascll) {
        return ascll >= 48 && ascll <= 57;
    }
    /**
     * a-z || A-Z
     * @param ascll
     * @returns
     */
    _isChar(ascll) {
        return (ascll >= 65 && ascll <= 90) || (ascll >= 97 && ascll <= 122);
    }
    /**
     * +-/*
     * @param ascll
     * @returns
     */
    _isOperator(ascll) {
        return ascll == 43 || ascll == 45 || ascll == 42 || ascll == 47;
    }
    /**
     * ()
     * @param ascll
     * @returns
     */
    _isField(ascll) {
        return ascll == 40 || ascll == 41;
    }
    /**
     * .
     * @param ascll
     * @returns
     */
    _isPoint(ascll) {
        return ascll == 46;
    }
    _error(pos) {
        let err = this._text;
        err = err.slice(0, pos) + `[__${this._text[pos]}__]` + err.slice(pos + 1);
        console.error(err);
    }
}
exports.Scanner = Scanner;
/**字符类型枚举 */
var CharEnum;
(function (CharEnum) {
    CharEnum[CharEnum["Number"] = 0] = "Number";
    CharEnum[CharEnum["Char"] = 1] = "Char";
    CharEnum[CharEnum["Operator"] = 2] = "Operator";
    CharEnum[CharEnum["Field"] = 3] = "Field";
    CharEnum[CharEnum["Point"] = 4] = "Point";
    CharEnum[CharEnum["None"] = 5] = "None";
    CharEnum[CharEnum["Reverse"] = 6] = "Reverse";
})(CharEnum = exports.CharEnum || (exports.CharEnum = {}));
//# sourceMappingURL=Scanner.js.map