"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createListener() {
    return function handler(event) {
        handleEvent(event, handler.vnode);
    };
}
function handleEvent(event, vnode) {
    var name = event.type;
    var on = vnode.data.on;
}
function patchEventListeners(elm, prevListeners, nextListeners) {
    var oldOn = prevListeners || {}, newOn = nextListeners || {};
    if (!oldOn && !newOn)
        return;
    if (oldOn === newOn)
        return;
    for (var key in oldOn) {
        if (!(key in newOn)) {
            elm.removeEventListener(key, oldOn[key], false);
        }
    }
    for (var key in newOn) {
        elm.addEventListener(key, newOn[key], false);
    }
}
exports.patchEventListeners = patchEventListeners;
