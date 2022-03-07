import { KindEnum } from "./const/KindEnum";

/**
* @description 词法分析
* 此类的主要作用是将一段静态文本分析成一个一个的token（参与运算的变量，运算符，数字，括号……）
* @author zhouxin
* @date 2022-03-04 09:58:41
* @lastEditTime 2022-03-04 09:58:41
* @lastEditors 
* @filePath 
*/
export class Scanner {
    private _text: string;
    private _textInfos: TextInfo[];
    private _lastChar: string;
    private _lastCharType: CharEnum;
    private _lastTextInfo: TextInfo;
    private _charTypeMap: Map<CharEnum, Function>;
    private _reverseFlag: boolean = false;
    constructor() {
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
        this._charTypeMap.set(CharEnum.Param_split_symbol, this._isSplit);
    }

    public setText(text: string) {
        this._text = text;
    }

    /**
     * 扫描主函数，这个过程中会把静态字符串解析为一个个的字符信息
     * 包含错误语法检测
     * @returns 
     */
    public scan() {
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
            let isUpdate: boolean = this._checkCharIsUpdate(type);
            if (isUpdate) {
                this._lastTextInfo.text += char;
                this._lastTextInfo.endPos++;
            }
            else {
                let kind: KindEnum = null;
                switch (type) {
                    case CharEnum.Char:
                        kind = KindEnum.VARIABLE;
                        break;
                    case CharEnum.Number:
                        kind = KindEnum.NUMBER;
                        break;
                    case CharEnum.Field:
                        kind = KindEnum.FIELD;
                        break;
                    case CharEnum.Operator:
                        kind = KindEnum.OPERATOR;
                        break;
                    case CharEnum.Param_split_symbol:
                        kind = KindEnum.PARAM_SPLIT_SYMBOL;
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
                let textInfo: TextInfo = {
                    text: char,
                    kind: kind,
                    startPos: curPos,
                    endPos: curPos + 1
                }
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
    private _checkCharType(char: string) {
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
    private _checkReverse(char: string) {
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
    private _checkError(type: CharEnum) {
        if (type == CharEnum.Point) {
            //  .123  ||  (.123  ||  +.123
            if (!this._lastTextInfo || this._lastTextInfo.kind === KindEnum.FIELD || this._lastTextInfo.kind === KindEnum.OPERATOR) {
                return true;
            }
            //  123.123.1
            if (this._lastTextInfo.kind == KindEnum.NUMBER && this._lastTextInfo.text.indexOf(".") !== -1) {
                return true;
            }
        }
        //  123a
        if (type == CharEnum.Char && this._lastTextInfo && this._lastTextInfo.kind == KindEnum.NUMBER) {
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
    private _checkCharIsUpdate(type: CharEnum) {
        if (!this._lastTextInfo || this._lastTextInfo.kind === KindEnum.FIELD || this._lastTextInfo.kind === KindEnum.OPERATOR || this._lastTextInfo.kind === KindEnum.PARAM_SPLIT_SYMBOL) {
            return false;
        }
        if (type == CharEnum.Operator || type == CharEnum.Field || type === CharEnum.Param_split_symbol) {
            return false;
        }
        return true;
    }

    /**
     * 0-9
     * @param ascll 
     * @returns 
     */
    private _isNumber(ascll: number) {
        return ascll >= 48 && ascll <= 57;
    }

    /**
     * a-z || A-Z
     * @param ascll 
     * @returns 
     */
    private _isChar(ascll: number) {
        return (ascll >= 65 && ascll <= 90) || (ascll >= 97 && ascll <= 122);
    }

    /**
     * +-/*
     * @param ascll 
     * @returns 
     */
    private _isOperator(ascll: number) {
        return ascll == 43 || ascll == 45 || ascll == 42 || ascll == 47;
    }

    /**
     * ()
     * @param ascll 
     * @returns 
     */
    private _isField(ascll: number) {
        return ascll == 40 || ascll == 41;
    }

    /**
     * .
     * @param ascll 
     * @returns 
     */
    private _isPoint(ascll: number) {
        return ascll == 46;
    }

    /**
     * ,
     * @param ascll 
     * @returns 
     */
    private _isSplit(ascll: number) {
        return ascll == 44;
    }

    private _error(pos: number) {
        let err = this._text;
        err = err.slice(0, pos) + `[__${this._text[pos]}__]` + err.slice(pos + 1);
        console.error(err);
    }
}

/**
 * 文本信息
 */
export interface TextInfo {
    /**文本 */
    text: string,
    /**起始位置 */
    startPos: number,
    /**结束位置 */
    endPos: number,
    /**种类 */
    kind: KindEnum
}

/**字符类型枚举 */
export enum CharEnum {
    Number,
    Char,
    Operator,
    Field,
    Point,
    None,
    Reverse,
    Param_split_symbol
}