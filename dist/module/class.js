"use strict";
/**
 * 解析class名
 */
Object.defineProperty(exports, "__esModule", { value: true });
function patchClass(elm, nextClass) {
    if (nextClass) {
        elm.className = parseClassNames(nextClass);
    }
    else {
        elm.className = '';
    }
}
exports.patchClass = patchClass;
function parseClassNames(classList) {
    if (typeof classList === 'string') {
        return classList;
    }
    var cls = [];
    if (Object.prototype.toString.call(classList) === '[object Object]') {
        for (var klass in classList) {
            if (classList[klass]) {
                cls.push(klass);
            }
        }
    }
    else if (Array.isArray(classList)) {
        for (var i = 0; i < classList.length; i++) {
            cls.push(parseClassNames(classList[i]));
        }
    }
    return cls.join(' ');
}
