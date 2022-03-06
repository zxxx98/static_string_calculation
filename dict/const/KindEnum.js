"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KindEnum = void 0;
/**
* @description 文本类型枚举
* @author zhouxin
* @date 2022-03-04 10:39:55
* @lastEditTime 2022-03-04 10:39:55
* @lastEditors
* @filePath
*/
var KindEnum;
(function (KindEnum) {
    /**数字 */
    KindEnum[KindEnum["NUMBER"] = 0] = "NUMBER";
    /**变量 */
    KindEnum[KindEnum["VARIABLE"] = 1] = "VARIABLE";
    /**运算符 */
    KindEnum[KindEnum["OPERATOR"] = 2] = "OPERATOR";
    /**域 */
    KindEnum[KindEnum["FIELD"] = 3] = "FIELD";
})(KindEnum = exports.KindEnum || (exports.KindEnum = {}));
//# sourceMappingURL=KindEnum.js.map