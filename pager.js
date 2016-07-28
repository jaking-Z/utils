'use strict'
//分页器
var fns = require('./fns')

function Pager(cfg) {
    if (!(this instanceof Pager)) {
        return new Pager(cfg)
    }
    this.config = {
        cur: 1, //当前分页，从1开始
        pages: 0, //总分页数
        size: 5 //显示的分页数
    }
    cfg && fns.extend(this.config, cfg)
}
Pager.prototype.computeItems = function() {
    var cur = parseInt(this.config.cur),
        pages = parseInt(this.config.pages),
        size = parseInt(this.config.size),
        middle = Math.ceil(size / 2),
        start,
        end,
        items = [];
    // if(cur<middle){
    // 	start = 1;
    // 	end = Math.min(size, pages);
    // }else{
    // 	if (cur>pages-(size-middle)) {
    // 		start = Math.max(pages-size+1, 1);
    // 		end = pages;
    // 	}else{
    // 		start = cur-middle+1;
    // 		end = cur+(size-middle); 
    // 	}
    // }
    start = Math.max(cur - middle + 1, 1);
    end = Math.min(cur + (size - middle), pages);
    //前后固定比size多两个
    if (start <= 2) {
        start = 1
        end = Math.min(size + 2, pages)
    } else if (end > pages - 2) {
        start = Math.max(pages - size - 1, 1)
        end = pages
    }
    for (var i = start; i <= end; i++) {
        items.push(i)
    }
    return items
}
module.exports = Pager
