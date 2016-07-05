'use strict'

var undef = void(0)
function hasOwn (obj, prop) {
    return obj && obj.hasOwnProperty && obj.hasOwnProperty(prop)
}
module.exports = {
    escape: function (markup) {
        if (!markup) return '';
        return String(markup)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/'/g, '&#39;')
            .replace(/"/g, '&quot;');
    },
    type: function(obj) {
        if (obj === null) return 'null'
        else if (obj === undef) return 'undefined'
        var m = /\[object (\w+)\]/.exec(Object.prototype.toString.call(obj))
        return m ? m[1].toLowerCase() : ''
    },
    keys: function (obj) {
        var keys = []
        if (!obj) return keys
        if (Object.keys) return Object.keys(obj)
        this.objEach(obj, function (key) {
            keys.push(key)
        })
        return keys
    },
    bind: function (fn, ctx) {
        if (fn.bind) return fn.bind(ctx)
        return function () {
            return fn.apply(ctx, arguments)
        }
    },
    extend: function(obj) {
        if (this.type(obj) != 'object' && this.type(obj) != 'function') return obj;
        var source, prop;
        for (var i = 1, length = arguments.length; i < length; i++) {
            source = arguments[i];
            for (prop in source) {
                if (hasOwn(source, prop)) {
                    obj[prop] = source[prop];
                }
            }
        }
        return obj;
    },
    trim: function (str) {
        if (str.trim) return str.trim()
        else {
            return str.replace(/^\s+|\s+$/gm, '')
        }
    },
    indexOf: function (arr, tar) {
        if (arr.indexOf) return arr.indexOf(tar)
        else {
            var i = -1
            fns.some(arr, function (item, index) {
                if (item === tar) {
                    i = index
                    return true
                }
            })
            return i
        }
    },
    forEach: function (arr, fn) {
        if (arr.forEach) return arr.forEach(fn)
        else {
            var len = arr.length
            for (var i = 0 ; i < len; i++) {
                fn(arr[i], i)
            }
        }
        return arr
    },
    some: function (arr, fn) {
        if (arr.some) return arr.some(fn)
        else {
            var len = arr.length
            var r = false
            for (var i = 0 ; i < len; i++) {
                if (fn(arr[i], i)) {
                    r = true
                    break
                }
            }
            return r
        }
    },
    map: function (arr, fn) {
        if (arr.map) return arr.map(fn)
        else {
            var len = arr.length
            var next = []
            for (var i = 0 ; i < len; i++) {
                next.push(fn(arr[i], i))
            }
            return next
        }
    },
    objEach: function (obj, fn) {
        if (!obj) return
        for(var key in obj) {
            if (hasOwn(obj, key)) {
                if(fn(key, obj[key]) === false) break
            }
        }
    },
    filter: function(arr, fn, context) {
        if (arr.filter) return arr.filter(fn)
        else {
            var len = arr.length
            var res = []
            for(var i = 0; i < len; i++) {
                var val = arr[i]
                if(fn.call(context, val, i, arr)) {
                    res.push(val)
                }
            }
            return res
        }
    },
    /**
     * Lock function before lock release
     */
    lock: function lock(fn) {
        var pending
        return function () {
            if (pending) return
            pending = true
            var args = [].slice.call(arguments, 0)
            args.unshift(function () {
                pending = false
            })
            fn.apply(this, args)
        }
    },
    /**
     * Call only once
     */
    once: function (cb/*[, ctx]*/) {
        var args = arguments.length
        var called
        return function () {
            if (called || !cb) return
            called = true
            return cb.apply(args.length >=2 ? args[1] : null, arguments)
        }
    }
}