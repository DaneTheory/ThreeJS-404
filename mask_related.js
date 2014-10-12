function initParticlesFromMask(imagePath, particleSystemData) {

	var image = THREE.ImageUtils.loadTexture(imagePath).image;
	image.onload = function() {
		var canvas = document.createElement('canvas');
		canvas.width = image.width;
		canvas.height = image.height;

		var context = canvas.getContext('2d');
		context.drawImage(image, 0, 0);

		var imageData = context.getImageData(0, 0, image.width, image.height);

		initParticlesFromImageData(imageData, particleSystemData);

	}
}

function initParticlesFromString(s, particleSystemData) {
   
	var canvas = document.createElement('canvas');
	canvas.width = 1;
	canvas.height = textSize; 

	var font = textSize + 'px arial';
	var context = canvas.getContext('2d');
	context.font = font;
	canvas.width = context.measureText(s).width;
	context.font = font;
	context.textBaseline = "bottom";
	context.fillText(s, 0, textSize);

	var imageData = context.getImageData(0, 0, canvas.width, canvas.height);

	initParticlesFromImageData(imageData, particleSystemData);
}

function initParticlesFromImageData(ida, particleSystemData) {

	mask.data = [];

	mask.w = ida.width;
	mask.h = ida.height;

	mask.dim.max = Math.max(mask.w, mask.h);
	mask.dim.halfCell = maxRadius * 2 / mask.dim.max / 2;

	mask.dim.halfDelta.w = (mask.dim.max - mask.w) / 2.0;
	mask.dim.halfDelta.h = (mask.dim.max - mask.h) / 2.0;

	var i;
	for (var x = 0; x < mask.w; x++) {
		for (var y = 0; y < mask.h; y++) {
			i = x + mask.w * y;
			mask.data[i] = ida.data[i * 4 + 3];
		}
	}

	alignToMask(particleSystemData);
}

function alignToMask(particleSystemData) {
	for (var p = 0; p < particleSystemData.count; p++) {
		
		setParticleToRandomUnmaskedPixel(particleSystemData.plainArray[p]);
		resetParticle(particleSystemData.plainArray[p]);
	}
}

function setParticleToRandomUnmaskedPixel(p) {

	var nicePoint;
	do {
		nicePoint = Math.floor(Math.random() * mask.data.length);
	} while (Math.random()*255>mask.data[nicePoint]);
	var z = Math.floor(nicePoint / mask.w);
	var x = nicePoint % mask.w;

	p.initial.x = (x + mask.dim.halfDelta.w + 0.5) / (mask.dim.max) * 2 - 1;
	p.initial.x *= maxRadius;
	p.initial.x += range(-mask.dim.halfCell, mask.dim.halfCell);
	p.initial.z = (z + mask.dim.halfDelta.h + 0.5) / (mask.dim.max) * 2 - 1;
	p.initial.z *= maxRadius;
	p.initial.z += range(-mask.dim.halfCell, mask.dim.halfCell);
}