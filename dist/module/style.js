"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function patchStyle(elm, prevStyle, nextStyle) {
    var oldStyle = prevStyle || {}, newStyle = nextStyle || {};
    for (var key in oldStyle) {
        if (!newStyle[key]) {
            elm.style[key] = '';
        }
    }
    for (var key in newStyle) {
        elm.style[key] = newStyle[key];
    }
}
exports.patchStyle = patchStyle;
