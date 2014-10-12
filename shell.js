// Здесь хранятся программные структуры сцены, камеры, часть пользовательского
// интерфейса.
// Код, содержащийся здесь, применим к любому набору объектов на сцене.

var WIDTH, HEIGHT, ASPECT;

var VIEW_ANGLE = 45, NEAR = 0.1, FAR = 10000;

var cameraMaxA = 0.0001;

var origin;

var maxRadius = 150, ceiling = 400, floor = 0;

var renderer, scene, camera, projector;

var lastMouseEvent;

var stats;

var mouseDown = false;

var cl, time = 0, deltaFrame = 0;

var TWEEN;

var canvasMode = window.location.href.indexOf('webGL=true') == -1;

var showParticles = true;

var cubeBasicMaterial = false;

var showLights = !canvasMode;

var canvasSettings = {
	particlesFromImage: false
};

var smallUnshiftedCube = false;
var skybox = canvasMode;
var brandBackground = true, 
	oldTweenLib = false, 
	backgroundCubeMoving = false, 
	linePattern = false, 
	linesConstructShouldRotate = false, 
	statsEnabled = window.location.href.indexOf('perf=true') > -1, 
	guiEnabled = false,
	showPlane = true;

var mouse = {
	x : 0,
	y : 0
};

var adaptiveCam = {

	s : {
		a : 0,
		va : Math.PI / 2
	},
	f : {
		a : 0,
		va : Math.PI / 2
	},
	delta : .01
};

var axises = ['x', 'y', 'z'];

var THREE;

function supportsWebGl() {
	try {
		return !!window.WebGLRenderingContext && !! document.createElement('canvas').getContext('experimental-webgl');
	} catch( e ) {
		return false;
	}
}


$(document).on('ready', function() {

	if (
		(canvasMode && !Modernizr.canvas)
		|| (!canvasMode && !Modernizr.webgl) 
	) {
		return;
	}

	$('#container .fallback').hide();

	init();
	update();

});

function init() {

	$(window).on('resize', function(e) {

		WIDTH = window.innerWidth;
		HEIGHT = window.innerHeight;
		ASPECT = WIDTH / HEIGHT;

		renderer.setSize(WIDTH, HEIGHT);

		camera.aspect = ASPECT;
		camera.updateProjectionMatrix();

	});

	origin = new THREE.Vector3(0, 0, 0)

	if(canvasMode){
		renderer = new THREE.CanvasRenderer();
	} else {
		renderer = new THREE.WebGLRenderer();
	}
	

	WIDTH = window.innerWidth;
	HEIGHT = window.innerHeight;
	renderer.setSize(WIDTH, HEIGHT);

	$('#container').append(renderer.domElement);
	scene = new THREE.Scene();
	scene.add(camera);

	$('canvas').on('mousemove', function(e) {

		mouse.x = e.pageX;
		mouse.y = e.pageY;

		var relative = {
			x : mouse.x / window.innerWidth,
			z : mouse.y / window.innerHeight
		};

		var easing;
		if(oldTweenLib){
			easing = TWEEN.Easing.Cubic.InOut;
		} else {
			easing = createjs.Ease.cubicInOut;
		}
		
		var eased = {
			x : easing(relative.x),
			z : easing(relative.z)
		};

		adaptiveCam.f.a = eased.x * Math.PI * .5 - Math.PI / 4;
		adaptiveCam.f.va = (1 - eased.z) * Math.PI * .5 + Math.PI / 4;

		/* camera.a = eased.x*Math.PI*.5-Math.PI/4;
		 camera.va = (1-eased.z)*Math.PI*.5+Math.PI/4; */

		lastMouseEvent = e;

	});

	$('canvas').on('mousedown', function(e) {
		e.preventDefault();
		mousedownLsnr();
		mouseDown = true;
	});

	$('canvas').on('mouseup', function(e) {
		mouseDown = false;
	});

	ASPECT = WIDTH / HEIGHT;

	camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);

	camera.a = adaptiveCam.s.a;
	camera.va = adaptiveCam.s.va;
	camera.up = new THREE.Vector3(0, 0, -1);

	applyCamAngles();

	/* addIndicators(); */

	//stats
	if (statsEnabled) {

		stats = new Stats();
		stats.domElement.style.position = 'absolute';
		stats.domElement.style.top = '0px';
		stats.domElement.style.zIndex = 100;
		$('#container').append(stats.domElement);

	}

	projector = new THREE.Projector();

	objectsInit();

	cl = new THREE.Clock();
	cl.start();
}

function applyCamAngles() {

	camera.position.x = Math.sin(camera.a) * Math.sin(camera.va) * ceiling;
	camera.position.y = Math.cos(camera.a) * Math.sin(camera.va) * ceiling;
	camera.position.z = Math.cos(camera.va) * ceiling;
	camera.lookAt(origin);
}


function update() {

	var now = cl.getElapsedTime();
	deltaFrame = Math.round(1000*(now-time));
	time = now;
		
	updateObjects();

	camera.a += (adaptiveCam.f.a - camera.a) * adaptiveCam.delta;
	camera.va += (adaptiveCam.f.va - camera.va) * adaptiveCam.delta;
	applyCamAngles();

	if (statsEnabled)
		stats.update();
	renderer.render(scene, camera);
	requestAnimFrame(update);
}

function addIndicators() {

	var xAxisEnd = new THREE.Vector3(maxRadius, 0, 0);
	yAxisEnd = new THREE.Vector3(0, maxRadius, 0);
	zAxisEnd = new THREE.Vector3(0, 0, maxRadius);

	addLine(origin, xAxisEnd, 0xff0000);
	addLine(origin, yAxisEnd, 0x00ff00);
	addLine(origin, zAxisEnd, 0x0000ff);

	addLine(new THREE.Vector3(-maxRadius, 0, -maxRadius), new THREE.Vector3(maxRadius, 0, -maxRadius), 0xffffff);
	addLine(new THREE.Vector3(-maxRadius, 0, -maxRadius), new THREE.Vector3(-maxRadius, 0, maxRadius), 0xffffff);

}

function addLine(startPoint, endPoint, color) {
	var g = new THREE.Geometry();
	var s = new THREE.Vector3(startPoint.x, startPoint.y, startPoint.z);
	g.vertices.push(s);

	var e = new THREE.Vector3(endPoint.x, endPoint.y, endPoint.z);
	g.vertices.push(e);
	var line = new THREE.Line(g, new THREE.LineBasicMaterial({
		color : color,
		opacity : 0.5
	}));
	scene.add(line);
}

function dRange(halfRange) {
	return -halfRange + Math.random() * halfRange * 2;
}

function range(start, end) {
	return start + Math.random() * (end - start);
}

function randNeg() {
	return Math.random() > .5 ? 1 : -1;
}

window.requestAnimFrame = (function() {
	return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
	function(callback) {
		window.setTimeout(callback, 1000 / 60);
	};
})();
