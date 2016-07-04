'use strict'

module.exports = {
	forEach: function (arr, fn) {
        if (arr.forEach) return arr.forEach(fn)
        else {
            var len = arr.length
            for (var i = 0 ; i < len; i++) {
                fn(arr[i], i)
            }
        }
        return arr
    }
}