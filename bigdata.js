'use strict'

function add(a, b) {
	a = (a || 0) + '';
	b = (b || 0) + '';
	var arrA = a.split('').reverse(),
		arrB = b.split('').reverse(),
		lenA = arrA.length,
		lenB = arrB.length,
		len = lenA > lenB ? lenA : lenB,
		sums = {},
		sumRet = [];
	for (var i = 0; i < len; i++) {
		sums = sum(arrA[i] || 0, arrB[i] || 0, sums.carry || 0);
		sumRet.push(sums.mod);
	}
	if (sums.carry) {
		sumRet.push(sums.carry);
	}
	return sumRet.reverse().join('');

	function sum(item1, item2, carry){
		var ret = parseInt(item1) + parseInt(item2) + parseInt(carry);
		return {
			mod: ret % 10,
			carry: parseInt(ret / 10)
		}
	}
}


module.exports = {
	add: add
}