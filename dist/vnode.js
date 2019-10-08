"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Portal = Symbol.for('portal');
exports.Fragment = Symbol.for('fragment');
function vnode(tag, data, children, flags, childFlags, el) {
    var key = data.key ? data.key : undefined;
    return {
        _isVNode: true,
        tag: tag,
        data: data,
        children: children,
        el: el,
        key: key,
        childFlags: childFlags,
        flags: flags
    };
}
exports.vnode = vnode;
