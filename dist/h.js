"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vnode_1 = require("./vnode");
var vnode_2 = require("./vnode");
var component_1 = require("./component");
function h(tag, data, children) {
    /**
     * 检查节点的类型
     */
    var flags;
    if (typeof tag === 'string') {
        flags = tag === 'svg' ? 2 /* ELEMENT_SVG */ : 1 /* ELEMENT_HTML */;
    }
    else if (tag === vnode_2.Fragment) {
        flags = 128 /* FRAGMENT */;
    }
    else if (tag === vnode_2.Portal) {
        flags = 256 /* PORTAL */;
        tag = data && data.target; // 表示目标挂载点
    }
    else {
        // 组件
        if (tag instanceof component_1.Component) {
            flags = tag.functional ? 32 /* COMPONENT_FUNCTIONAL */ : 4 /* COMPONENT_STATEFULL_NORMAL */;
        }
        else if (typeof tag === 'function') {
            flags =
                tag.prototype && tag.prototype.render
                    ? 4 /* COMPONENT_STATEFULL_NORMAL */
                    : 32 /* COMPONENT_FUNCTIONAL */;
        }
    }
    var childFlags;
    if (Array.isArray(children)) {
        var length_1 = children.length;
        if (length_1 === 0) {
            // 无元素
            childFlags = 1 /* NO_CHILDREN */;
        }
        else if (length_1 === 1) {
            childFlags = 2 /* SINGLE_VNODE */;
            children = children[0];
        }
        else {
            // 多个子节点，且子节点使用key
            childFlags = 4 /* KEYED_VNODES */;
            children = normalizeVNodes(children);
        }
    }
    else if (children == null) {
        // children为null/undefined
        childFlags = 1 /* NO_CHILDREN */;
    }
    else if (children._isVNode) {
        childFlags = 2 /* SINGLE_VNODE */;
    }
    else {
        // 其他情况都作为文本节点处理，即单个子节点，会调用 createTextVNode 创建纯文本类型的 VNode
        // 如：普通对象，字符串，数字等
        childFlags = 2 /* SINGLE_VNODE */;
        children = createTextVNode(children + '');
    }
    return vnode_1.vnode(tag, data, children, flags, childFlags, undefined);
}
exports.h = h;
/**
 * 人为创造key节点
 * @param {*} children
 */
function normalizeVNodes(children) {
    var newChildren = [];
    // 遍历 children
    for (var i = 0; i < children.length; i++) {
        var child = children[i];
        if (child.key == null) {
            // 如果原来的 VNode 没有key，则使用竖线(|)与该VNode在数组中的索引拼接而成的字符串作为key
            child.key = '|' + i;
        }
        newChildren.push(child);
    }
    // 返回新的children，此时 children 的类型就是 ChildrenFlags.KEYED_VNODES
    return newChildren;
}
function createTextVNode(text) {
    return {
        _isVNode: true,
        tag: null,
        data: null,
        flags: 64 /* TEXT */,
        children: text,
        childFlags: 1 /* NO_CHILDREN */,
        el: null,
        key: null
    };
}
exports.createTextVNode = createTextVNode;
