"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.domPropsRE = /[A-Z]|^(?:value|checked|selected|muted)$/;
var xlinkNS = 'http://www.w3.org/1999/xlink';
var xmlNS = 'http://www.w3.org/XML/1998/namespace';
var colonChar = 58; // ：
var xChar = 120; // x
exports.patchAttrs = function (elm, prevAttrs, nextAttrs) {
    if (!prevAttrs && !nextAttrs)
        return;
    if (prevAttrs === nextAttrs)
        return;
    var oldAttrs = prevAttrs || {};
    var newAttrs = nextAttrs || {};
    for (var key in newAttrs) {
        if (exports.domPropsRE.test(key)) {
            elm[key] = newAttrs[key];
        }
        else {
            if (key.charCodeAt(0) !== xChar) {
                elm.setAttribute(key, newAttrs[key]); // 不以x开头
            }
            else if (key.charCodeAt(3) === colonChar) {
                // :
                elm.setAttributeNS(xmlNS, key, newAttrs[key]);
            }
            else if (key.charCodeAt(5) === colonChar) {
                elm.setAttributeNS(xlinkNS, key, newAttrs[key]);
            }
            else {
                elm.setAttribute(key, newAttrs[key]);
            }
        }
    }
    for (var key in oldAttrs) {
        if (!newAttrs.hasOwnProperty(key)) {
            elm.removeAttribute(key);
        }
    }
};
