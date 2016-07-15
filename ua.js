'use strict'
function check(ua) {
	if (!ua) {
		return;
	}

	var os = {}, browser = {};

	var oscheck = {
		iphone: ua.match(/(iphone)\sos\s([\d_]+)/i),
		ipad: ua.match(/(ipad).*\s([\d_]+)/i),
		ipod: ua.match(/(ipod).*\s([\d_]+)/i),
		android: ua.match(/(android)\s([\d\.]+)/i),
		windows: ua.match(/Windows(\s+\w+)?\s+?(\d+\.\d+)/)
	};

	if (oscheck.ipod) {
		os.ios = os.ipod = true;
		os.version = oscheck.ipod[2].replace(/_/g, '.');
		os.name = 'ipod';
	}
	if (oscheck.ipad) {
		os.ios = os.ipad = true;
		os.version = oscheck.ipad[2].replace(/_/g, '.');
		os.name = 'ipad';
	}
	if (oscheck.iphone) {
		os.iphone = os.ios = true;
		os.version = oscheck.iphone[2].replace(/_/g, '.');
		os.name = 'iphone';
	}
	if (oscheck.android) {
		os.android = true;
		os.version = oscheck.android[2];
		os.name = 'android';
	}
	if (oscheck.windows) {
		os.windows = true;
		os.version = oscheck.windows[2];
		os.name = 'windows';
	}

	var browsercheck = {
		WeChat: ua.match(/MicroMessenger\/((\d+)\.(\d+))\.(\d+)/) || ua.match(/MicroMessenger\/((\d+)\.(\d+))/),
		MQQClient: (ua.match(/QQ\/(\d+\.\d+)/i) || ua.match(/V1_AND_SQ_([\d\.]+)/) && !ua.match(/QQReader/)),//QQ阅读伪装成了QQ然而不具备QQ的jsapi
		MQQReader: ua.match(/QQReader/i),
		QQvideo: ua.match(/QQLiveBrowser\/([\d.]+)/),
		MQQBrowser: ua.match(/MQQBrowser\/(\d+\.\d+)/i),
		UCBrowser: ua.match(/ucbrowser\/(\d+\.\d+)/i),
		Qzone: ua.match(/Qzone\/[\w\d\_]*(\d\.\d)[\.\w\d\_]*/i),
		Weibo: ua.match(/Weibo/i),
		qqnews: ua.match(/qqnews\/(\d+\.\d+\.\d+)/i),
		kuaibao: ua.match(/qnreading\/(\d+\.\d+\.\d+)/i),
		liebao: ua.match(/LieBaoFast\/(\d+\.\d+\.\d+)/i),
		IEMobile: ua.match(/IEMobile(\/|\s+)(\d+\.\d+)/) || ua.match(/WPDesktop/),
		douban: ua.match(/com\.douban\.frodo\/(\d+\.\d+\.\d+)/i),
		MiuiBrowser: ua.match(/MiuiBrowser\/(\d+\.\d+)/i),
		Chrome: os.ios ? ua.match(/CriOS\/(\d+\.\d+)/) : ua.match(/Chrome\/(\d+\.\d+)/),
		Safari: ua.match(/Safari\/(\d+\.\d+)/)
	};

	if (browsercheck.MQQReader) {// 非主流的QQ阅读
		browser.MQQReader = true;
		browser.version = 1;
		browser.name = 'MQQReader';
	} else if (browsercheck.IEMobile) {
		browser.IEMobile = true;
		browser.version = 1;
		browser.name = 'IEMobile';
	} else {
		for (var i in browsercheck) {
			if (browsercheck[i]) {
				browser[i] = true;
				browser.version = browsercheck[i][1];
				browser.name = i;
				break;
			}
		}
	}

	return {
		browser: browser,
		os: os
	};
}

var cache = null;

var ua = function (noCache) {
	return (!noCache && cache) || (cache = check(navigator.userAgent));
};

//注入到express或者connect的中间件
ua.__express = function (req, res, next, noCache) {
	req.ua = (!noCache && cache) || (cache = check(req.headers['user-agent']));
	next();
};
module.exports = ua