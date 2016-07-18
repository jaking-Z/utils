//简易滑动插件
'use strict'
var fns = require('./fns'),
	$ = window.$;
/**
 * 左右滑动器
 * @param {[Object]} cfg [{
	 * $cont,	//必须传，内容容器 一般就是ul（dom 或 jquery元素）
	 * $prev,	//上一页
	 * $next,	//下一页
	 * total,	//内容总个数
	 * cur,		//当前页数
	 * size,	//页容量，每页显示个数
	 * width,	//内容条目的ui宽度，一般对应li 的宽度
	 * disClass	//上/下页 不可点击时的样式
 * }]
 */
function Slider(cfg) {
	if (!cfg || !cfg.$cont) return;
	if (!(this instanceof Slider)) {
		return new Slider(cfg)
	}
	this.config = fns.extend({}, {
		total: 0,
		cur: 1,
		size: 5,
		width: 156,
		disClass: 'none'
	}, cfg);
	this.$cont = $(cfg.$cont);
	this.$prev = cfg.$prev ? $(cfg.$prev) : null;
	this.$next = cfg.$next ? $(cfg.$next) : null;
	this.init();
}
Slider.prototype.init = function() {
	var $cont = this.$cont,
		$prev = this.$prev,
		$next = this.$next;
	$cont.css({
		position: 'relative'
	});
	this.update();
	$prev && $prev.on('click', fns.bind(this.onPrev, this));
	$next && $next.on('click', fns.bind(this.onNext, this));
};
Slider.prototype.update = function() {
	var $cont = this.$cont,
		$prev = this.$prev,
		$next = this.$next,
		cur = this.get('cur'),
		size = this.get('size'),
		total = this.get('total'),
		width = this.get('width'),
		disClass = this.get('disClass'),
		totalPage = Math.ceil(total / size);

	$cont.animate({left: -(cur - 1)*width*size}, 200);

	if ($prev) {
		cur > 1 ? $prev.removeClass(disClass) : $prev.addClass(disClass)
	}
	if ($next) {
		totalPage > 1 && cur < totalPage ? $next.removeClass(disClass) : $next.addClass(disClass)
	}
};
Slider.prototype.onPrev = function(e) {
	var cur = this.get('cur');
	if (cur > 1) {
		this.set({cur: --cur});
		this.update();
	}
	return false;
};
Slider.prototype.onNext = function(e) {
	var cur = this.get('cur'),
		size = this.get('size'),
		total = this.get('total'),
		totalPage = Math.ceil(total / size);
	if (totalPage > 1 && cur < totalPage) {
		this.set({cur: ++cur});
		this.update();
	}
	return false;
};
Slider.prototype.get = function(param) {
	return this.config[param]
};
Slider.prototype.set = function(obj) {
	if (obj instanceof Object)
		fns.extend(this.config, obj)
};
module.exports = Slider
