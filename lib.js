/* */

var alertFallback = false;
if ( typeof console === "undefined" || typeof console.log === "undefined") {
	console = {};
	if (alertFallback) {
		console.log = function(msg) {
			alert(msg);
		};
	} else {
		console.log = function() {
		};
	}
}

/* */

function supportsTranslate3D() {
	var el = document.createElement('div'), supportsTranslate3D, transforms = {
		'WebkitTransform' : '-webkit-transform',
		'OTransform' : '-o-transform',
		'MSTransform' : '-ms-transform',
		'MozTransform' : '-moz-transform',
		'Transform' : 'transform'
	};

	// Add it to the body to get the computed style.
	document.body.insertBefore(el, null);

	for (var t in transforms) {
		if (el.style[t] !== undefined) {
			el.style[t] = "translate3d(1px,1px,1px)";
			supportsTranslate3D = window.getComputedStyle(el).getPropertyValue(transforms[t]);
		}
	}

	document.body.removeChild(el);

	return (supportsTranslate3D !== undefined && supportsTranslate3D !== null && supportsTranslate3D.length > 0 && supportsTranslate3D !== "none");
}

function supportsTransition() {
	var div = document.createElement("div");
	var p, ext, pre = ["ms", "O", "Webkit", "Moz"];
	for (p in pre) {
		if (div.style[pre[p] + "Transition"] !== undefined) {
			ext = pre[p];
			break;
		}
	}
	delete div;
	return ext;
};

function supported(prop) {
	var div = document.createElement('div'), vendors = 'Khtml Ms O Moz Webkit'.split(' '), len = vendors.length;
	if ( prop in div.style)
		return true;
	prop = prop.replace(/^[a-z]/, function(val) {
		return val.toUpperCase();
	});
	while (len--) {
		if (vendors[len] + prop in div.style) {
			// browser supports box-shadow. Do what you need.
			// Or use a bang (!) to test if the browser doesn't.
			return true;
		}
	}
	return false;
}

var browserDetection_isIE = ( function() {

		var undef, v = 3, div = document.createElement('div'), all = div.getElementsByTagName('i');

		while (div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->', all[0]);

		return v > 4 ? v : undef;

	}());

/* */

var tdLib = {}, hotdot = {};

(function(nmspc) {

	nmspc.DEVICE_TYPES = {
		iPad : 'iPad',
		iPhone: 'iPhone',
		android : 'android',
		desktop : 'desktop',
		wPhone : 'wPhone'
	}
	
	nmspc.BROWSERS = {
		safari: 'Safari',
		chrome: 'Chrome'
	}
	
	nmspc.OS_TYPES = {
		mac: 'Mac OS',
		win: 'Windows'
	}

	nmspc.deviceDescription = {
		type : undefined,
		browser : undefined,
		touchCapable : false
	}
	
	

	nmspc.deviceDescription.type = nmspc.DEVICE_TYPES.desktop;

	if (navigator.userAgent.indexOf('iPad') > -1) {
		nmspc.deviceDescription.type = nmspc.DEVICE_TYPES.iPad;
	} else if (navigator.userAgent.indexOf('iPhone') > -1) {
		nmspc.deviceDescription.type = nmspc.DEVICE_TYPES.iPhone;
	} else if (navigator.userAgent.indexOf('Android') > -1) {
		nmspc.deviceDescription.type = nmspc.DEVICE_TYPES.android;
	} else if (navigator.userAgent.indexOf('Windows Phone') > -1) {
		nmspc.deviceDescription.type = nmspc.DEVICE_TYPES.wPhone;
	}

	if (navigator.userAgent.indexOf('Chrome') > -1 ){
		nmspc.deviceDescription.browser = nmspc.BROWSERS.chrome;
	} else if (navigator.userAgent.indexOf('Safari') > -1) {
		nmspc.deviceDescription.browser = nmspc.BROWSERS.safari;
	}
	
	nmspc.deviceDescription.os = undefined;
	
	if (navigator.userAgent.indexOf('Mac OS') > -1 ){
		nmspc.deviceDescription.os = nmspc.OS_TYPES.mac;
	} else if (navigator.userAgent.indexOf('Windows') > -1 ){
		nmspc.deviceDescription.os = nmspc.OS_TYPES.win;
	}
	
	if (( typeof Touch == "object") || ('ontouchstart' in document.documentElement)) {
		nmspc.deviceDescription.touchCapable = true;
	}

	/* */

	nmspc.debu = window.location.href.indexOf('?debug') > -1;
	var $debWindow;

	nmspc.debLog = function(str) {
		if (!$debWindow)
			return;
		$debWindow.prepend($('<p>' + str + '</p>'));
	}
	$(function() {

		if (nmspc.debu) {

			$debWindow = $('<div></div>').css({
				position : 'fixed',
				top : 0,
				right : 0,
				display : 'inline-block',
				width : 300,
				'min-height' : 100,
				font : '12px sans-serif',
				color : 'rgba(255,255,255,.8)',
				'background-color' : 'rgba(0,0,0,.5)',
				'z-index' : 999,
				'max-height' : '50%',
				'overflow-y' : 'scroll'
			});
			$('body').append($debWindow);

		}

		nmspc.debLog(nmspc.deviceDescription.type);
		nmspc.debLog('Standard-touch-capable: ' + nmspc.deviceDescription.touchCapable);

	})
	/* */

	nmspc.twoComponentLoad = {
		arr : [],
		componentsReady : 0,
		bind : function(f) {
			nmspc.twoComponentLoad.arr.push(f);
		},
		addComponent : function() {
			if (++nmspc.twoComponentLoad.componentsReady < 2)
				return;
			nmspc.debLog('onTwoComponentLoad');
			for (var c in nmspc.twoComponentLoad.arr) {
				nmspc.twoComponentLoad.arr[c]();
			}
		}
	}

	$(function() {
		nmspc.twoComponentLoad.addComponent();
	});

	$(window).on('load', function() {
		nmspc.twoComponentLoad.addComponent();
	});
	
	nmspc.positiveModulo = function (arg,mod){
		return (arg%mod+mod)%mod;
	}

})(tdLib);


(function(arg){
	
	if(!window.Modernizr) return;
	
	if(window.Modernizr.csstransforms3d){
		hotdot.bestTranslateType = 'translate3d';
	} else if(window.Modernizr.csstransforms){
		hotdot.bestTranslateType = 'translate';
	} else {
		hotdot.bestTranslateType = 'left';
	}
	
	// translate3d, left, translate
	
	var translateType,
		transformString;
	
	arg.applyHorizontalShift = function(value, $div, translateType){
		
		
		translateType = translateType || hotdot.bestTranslateType;
		
		if (value=='' || translateType != 'left') {

			if (value==''){
				transformString = '';
			} else if (translateType === 'translate3d') {
				transformString = 'translate3d(' + value + 'px, 0px, 0px)';
			} else if (translateType === 'translate') {
				transformString = 'translate(' + value + 'px, 0px)';
			} else if (translateType === 'translateX') {
				transformString = 'translateX(' + value + 'px)';
			} else 
				return;

			$div.css({

				WebkitTransform : transformString,
				MozTransform : transformString,
				Transform : transformString,
				msTransform : transformString,
				OTransform : transformString,
				transform : transformString

			});

		}
		
		if (value=='' || translateType == 'left') {

			$div.css('left', value);

		}
		
	}
	
})(hotdot);
