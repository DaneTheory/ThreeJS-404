function hex2rgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function rgb2hsv () {
    var rr, gg, bb,
        r = arguments[0] / 255,
        g = arguments[1] / 255,
        b = arguments[2] / 255,
        h, s,
        v = Math.max(r, g, b),
        diff = v - Math.min(r, g, b),
        diffc = function(c){
            return (v - c) / 6 / diff + 1 / 2;
        };

    if (diff == 0) {
        h = s = 0;
    } else {
        s = diff / v;
        rr = diffc(r);
        gg = diffc(g);
        bb = diffc(b);

        if (r === v) {
            h = bb - gg;
        }else if (g === v) {
            h = (1 / 3) + rr - bb;
        }else if (b === v) {
            h = (2 / 3) + gg - rr;
        }
        if (h < 0) {
            h += 1;
        }else if (h > 1) {
            h -= 1;
        }
    }
    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        v: Math.round(v * 100)
    };
}

function colorFromArr(obj){
	return [obj.r,obj.g,obj.b];
}

/* 
function artlGen()
{	
	h = Math.floor (360 * Math.random());
	s = 30 + Math.floor (70 * Math.random());
	v = 30 + Math.floor (50 * Math.random());

	return hsv2rgb(h,s,v);
}

function hsv2rgb (h, s, v)
{
	h /= 360;
	s /= 100;
	v /= 100;

	var m2 = v <= 0.5 ? v * (s + 1) : v + s - v * s;
	var m1 = v * 2 - m2;
    var r = norm2hex (hue2rgb (m1, m2, h + 1/3));
    var g = norm2hex (hue2rgb (m1, m2, h));
    var b = norm2hex (hue2rgb (m1, m2, h - 1/3));
    return r + '' + g + '' + b;
}

function hue2rgb (m1, m2, h)
{
	if (h < 0) h = h + 1;
	if (h > 1) h = h - 1;
	if (h * 6 < 1) return m1 + (m2 - m1) * h * 6;
	if (h * 2 < 1) return m2;
	if (h * 3 < 2) return m1 + (m2 - m1) * (2/3 - h) * 6;
	return m1;
} 

function dec2hex (dec)
{
	var hexChars = "0123456789ABCDEF";
	var a = dec % 16;
	var b = (dec - a) / 16;
	hex = '' + hexChars.charAt (b) + hexChars.charAt (a);
	return hex;
}

function norm2hex (value)
{
	return dec2hex (Math.floor (255 * value));
} */

