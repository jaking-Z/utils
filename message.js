'use strict';

var util = require('@tencent/fns')
var outdatedMsgs = {}

function Message () {
    this._evtObjs = {};
}
Message.prototype.on = function (evtType, handler, _once) {
    if (!this._evtObjs[evtType]) {
        this._evtObjs[evtType] = [];
    }
    this._evtObjs[evtType].push({
        handler: handler,
        once: _once
    })
    var that = this
    return function () {
        that.off(evtType, handler)
    }
}
Message.prototype.wait = function (evtType, handler) {
    if (outdatedMsgs[evtType]) {
        handler.apply(null, outdatedMsgs[evtType])
        return noop
    } else {
        // call once
        return this.on(evtType, handler, true)
    }
}
Message.prototype.off = function (evtType, handler) {
    var that = this
    var types;
    if (evtType) {
        types = [evtType];
    } else {
        types = util.keys(this._evtObjs)
    }
    util.forEach(types, function (type) {
        if (!handler) {
            // remove all
            that._evtObjs[type] = [];
        } else {
            var handlers = that._evtObjs[type] || [],
                nextHandlers = [];

            util.forEach(handlers, function (evtObj) {
                if (evtObj.handler !== handler) {
                    nextHandlers.push(evtObj)
                }
            })
            that._evtObjs[type] = nextHandlers;
        }
    })

    return this;
}
Message.prototype.emit = function (evtType) {
    var args = Array.prototype.slice.call(arguments, 1)

    outdatedMsgs[evtType] = args
    var handlers = this._evtObjs[evtType] || [];
    util.forEach(handlers, function (evtObj) {
        if (evtObj.once && evtObj.called) return
        evtObj.called = true
        evtObj.handler && evtObj.handler.apply(null, args);
    })
}

/**
 *  Global Message Central
 **/
var msg = new Message();
Message.on = function () {
    return msg.on.apply(msg, arguments);
}
Message.off = function () {
    return msg.off.apply(msg, arguments);
}
Message.emit = function () {
    return msg.emit.apply(msg, arguments);
}
Message.wait = function () {
    return msg.wait.apply(msg, arguments);
}
function noop(){}

module.exports = Message;