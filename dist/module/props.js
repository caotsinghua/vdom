"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.patchProps = function (elm, prevProps, nextProps) {
    if (!prevProps && !nextProps)
        return;
    if (prevProps === nextProps)
        return;
    var oldProps = prevProps || {}, newProps = nextProps || {};
    for (var key in oldProps) {
        if (!(key in newProps)) {
            delete elm[key];
        }
    }
    for (var key in newProps) {
        var cur = newProps[key], old = oldProps[key];
        // domPropsRE相关的只由patchAttr来处理，否则props和attr设置重复值会有覆盖问题
        // if (cur !== old && !domPropsRE.test(key) && elm[key] !== cur) {
        //   elm[key] = cur
        // }
        if (cur !== old && elm[key] !== cur) {
            elm[key] = cur;
        }
    }
};
