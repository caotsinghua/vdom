"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var h_1 = require("./h");
function render(vnode, container) {
    var prevVNode = container.vnode;
    if (prevVNode == null) {
        // 没有旧的vnode，mount新vnode
        mount(vnode, container);
        container.vnode = vnode;
    }
    else {
        if (vnode) {
            // 有旧vnode和新vnode，比较差异并更新
            patch(prevVNode, vnode, container);
            container.vnode = vnode;
        }
        else {
            // 有旧vnode，没有新vnode，表示删除节点
            container.removeChild(prevVNode.el);
            container.vnode = null;
        }
    }
}
exports.render = render;
// 挂载一个船新的节点
function mount(vnode, container, isSvg, refNode) {
    if (isSvg === void 0) { isSvg = false; }
    console.log('mount', vnode);
    var flags = vnode.flags;
    if (flags & 3 /* ELEMENT */) {
        // 挂载普通标签
        mountElement(vnode, container, isSvg, refNode);
    }
    else if (flags & 60 /* COMPONENT */) {
        // 组件
        mountComponent(vnode, container, isSvg);
    }
    else if (flags & 64 /* TEXT */) {
        // 文本
        mountText(vnode, container);
    }
    else if (flags & 128 /* FRAGMENT */) {
        // fragment
        mountFragment(vnode, container, isSvg);
    }
    else if (flags & 256 /* PORTAL */) {
        // portal
        mountPortal(vnode, container, isSvg);
    }
}
exports.mount = mount;
function mountElement(vnode, container, isSvg, refNode) {
    if (isSvg === void 0) { isSvg = false; }
    isSvg = !!(vnode.flags & 2 /* ELEMENT_SVG */);
    var element = isSvg
        ? document.createElementNS('http://www.w3.org/2000/svg', vnode.tag)
        : document.createElement(vnode.tag);
    vnode.el = element;
    var data = vnode.data;
    if (data) {
        for (var key in data) {
            patchData(vnode.el, key, null, data[key]);
        }
    }
    // 递归挂载子节点
    var childFlags = vnode.childFlags;
    var children = vnode.children;
    if (childFlags !== 1 /* NO_CHILDREN */) {
        if (childFlags & 2 /* SINGLE_VNODE */) {
            mount(children, element, isSvg);
        }
        else if (childFlags & 12 /* MULTIPLE_VNODES */) {
            for (var i = 0; i < children.length; i++) {
                mount(children[i], element, isSvg);
            }
        }
    }
    if (refNode) {
        container.insertBefore(element, refNode);
    }
    else {
        container.appendChild(element);
    }
}
/**
 * 挂载文本节点
 * @param {*} vnode
 * @param {*} container
 */
function mountText(vnode, container) {
    var element = document.createTextNode(vnode.children);
    vnode.el = element;
    container.appendChild(element);
}
/**
 * 挂载Fragment
 * @param {*} vnode
 * @param {*} container
 * @param {*} isSvg
 */
function mountFragment(vnode, container, isSvg) {
    if (isSvg === void 0) { isSvg = false; }
    var children = vnode.children, childFlags = vnode.childFlags;
    switch (childFlags) {
        case 2 /* SINGLE_VNODE */: {
            mount(children, container, isSvg);
            vnode.el = children.el;
            break;
        }
        case 1 /* NO_CHILDREN */: {
            // 没有子节点相当于挂载空节点
            var placeholder = h_1.createTextVNode('');
            mountText(placeholder, container);
            vnode.el = placeholder.el;
            break;
        }
        default: {
            for (var i = 0; i < children.length; i++) {
                mount(children[i], container, isSvg);
            }
            vnode.el = children[0].el;
        }
    }
}
function mountPortal(vnode, container, isSvg) {
    var tag = vnode.tag, children = vnode.children, childFlags = vnode.childFlags;
    // 获取挂载点
    var target = typeof tag === 'string' ? document.querySelector(tag) : tag;
    if (childFlags & 2 /* SINGLE_VNODE */) {
        mount(children, target, isSvg);
    }
    else if (childFlags & 12 /* MULTIPLE_VNODES */) {
        for (var i = 0; i < children.length; i++) {
            mount(children[i], target, isSvg);
        }
    }
    // 虽然 Portal 的内容可以被渲染到任意位置，但它的行为仍然像普通的DOM元素一样，
    // 如事件的捕获/冒泡机制仍然按照代码所编写的DOM结构实施
    // 需要一个占位节点
    var placeholder = h_1.createTextVNode('');
    mountText(placeholder, container);
    vnode.el = placeholder.el;
}
function mountComponent(vnode, container, isSvg) {
    if (vnode.flags & 28 /* COMPONENT_STATEFULL */) {
        mountStatefulComponent(vnode, container, isSvg);
    }
    else {
        mountFunctionalComponent(vnode, container, isSvg);
    }
}
/**
 *
 * @param {*} vnode
 * @param {*} container
 * @param {*} isSvg
 *
 * vnode是要挂载的组件节点h(compnent)
 * instance=vnode.children是new Component
 * instance.$vnode是该instance render后的vnode
 */
function mountStatefulComponent(vnode, container, isSvg) {
    // vnode=lastInstance.$vnode
    // lastInstance.$vnode.children=new lastInstance.vnode.tag()
    // 是因为每个类型为有状态组件的 VNode，在挂载期间我们都会让其 children 属性引用组件的实例，以便能够通过 VNode 访问组件实例对象
    var instance = (vnode.children = new vnode.tag()); // 组件实例
    instance._mounted = false;
    instance.$props = vnode.data; // 创建实例后绑定props
    instance._update = function () {
        if (instance._mounted) {
            // 更新
            var prevVnode = instance.$vnode;
            var nextVnode = (instance.$vnode = instance.render());
            console.log('_update');
            console.log(prevVnode, nextVnode);
            patch(prevVnode, nextVnode, prevVnode.el.parentNode);
            instance.$el = vnode.el = instance.$vnode.el;
            // updated
        }
        else {
            // render=>vnode
            // 刚render时 $vnode.children===null
            instance.$vnode = instance.render(); // h('child')
            mount(instance.$vnode, container, isSvg);
            instance._mounted = true; // flag
            instance.$el = vnode.el = instance.$vnode.el;
            instance.mounted && instance.mounted();
        }
    };
    instance._update();
}
function mountFunctionalComponent(vnode, container, isSvg) {
    console.log('____mountFunctionalComponent');
    vnode.handle = {
        prev: null,
        next: vnode,
        container: container,
        update: function () {
            if (vnode.handle.prev) {
                // 更新
                console.log('更新');
                // prevVNode 是旧的组件VNode，nextVNode 是新的组件VNode
                var prevVNode = vnode.handle.prev;
                var nextVNode = vnode.handle.next;
                var props = nextVNode.data;
                var prevTree = prevVNode.children;
                var nextTree = (nextVNode.children = nextVNode.tag(props));
                patch(prevTree, nextTree, vnode.handle.container);
                console.log('更新结束');
                nextVNode.el = nextTree.el;
            }
            else {
                //挂载
                var props = vnode.data;
                var $vnode = (vnode.children = vnode.tag(props));
                mount($vnode, container, isSvg);
                vnode.el = $vnode.el;
            }
        }
    };
    // 首次挂载
    vnode.handle.update();
}
