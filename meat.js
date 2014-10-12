// Здесь хранится все, что зависит от выбранных для показа объектов:
// объекты, их поведение, пользовательский интерфейс для управления ими.

var textSize = 60;

var startString = "404";

var cataloguePath = '/static/img/404/';

var boxSkinPath = '../box_bck.png';

var gui = new function() {

this.seedColor = [200, 0,0];
this.sideColor = [11, 10, 27];
this.message = startString;
this.background = [30,30,30];
this.pointColor = [153,255,255];
this.ambientColor = [255,153,255];
this.hsv = {};
this.explode = function() {
explode =  new THREE.Vector3(0,0,0);
};
};

var explode = false;

var mask = {
	data : [],
	w : 0,
	h : 0,
	dim : {
		max : 0,
		halfDelta : {
			w : 0,
			h : 0
		},
		cell : 0
	}
};

var zoomIn = {

	step : function(p, relativeHeight) {

		p.velocity.y *= 1 + .2 * relativeHeight;
	},
	init : function(p) {
		p.velocity.x = 0;
		p.velocity.y = Math.random();
		p.velocity.z = 0;
	}
};

var molecule = {

	step : function(p, time) {
		/* if(p.number==0){
		 var angle = time*p.speed+p.phase.x;
		 p.x = Math.sin(angle)*p.ampl+p.initial.x;
		 p.z = Math.cos(angle)*p.ampl+p.initial.z;
		 p.y = Math.sin(angle)*p.ampl+p.initial.y;
		 }  */
	},
	init : function(p) {
		p.velocity.x = 0;
		p.velocity.y = 0;
		p.velocity.z = 0;

		if (!p.tween) {
			tweenParticle(p);
		} else {
			p.tween.setPaused(false);
		}

	}
};

var physics = molecule;

function resetParticle(p) {

	p.position.x = p.initial.x;
	p.position.z = p.initial.z;
	p.position.y = floor;

	physics.init(p);

}

function setupGUI() {

	//dat.gui

	var colors = [/* 'topColor', */'sideColor', 'seedColor'];

	var guiA = new dat.GUI();

	for (var i = 0, c = colors[i]; i < colors.length; i++, c = colors[i]) {

		gui.hsv[c] = rgb2hsv(gui[c][0], gui[c][1], gui[c][2]);
		gui.hsv[c].h /= 360;
		gui.hsv[c].s /= 100;
		gui.hsv[c].v /= 100;

		guiA.addColor(gui, colors[i]).onChange(closureEscaper(colors[i]));
	}

	function closureEscaper(c) {
		return function(value) {
			gui.hsv[c] = rgb2hsv(value[0], value[1], value[2]);
			gui.hsv[c].h /= 360;
			gui.hsv[c].s /= 100;
			gui.hsv[c].v /= 100;
		};
	}


	guiA.add(gui, 'message').onChange(function(value) {
		if (value.length > 0) {
			initParticlesFromString(value);
		}
	});

	guiA.addColor(gui, 'pointColor').onChange(function(value) {
		lights.update();
	});

	guiA.addColor(gui, 'ambientColor').onChange(function(value) {
		lights.update();
	});

	guiA.addColor(gui, 'background').onChange(function(value) {
		updateBackgroundColor(value);
	});

	/*
	 guiA.addColor(gui, 'ambientLight').onChange(function(value) {

	 });*/

	guiA.add(gui, 'explode');
}

function threeRGBColorFromArr(arr) {
	var r = new THREE.Color();
	return r.setRGB(arr[0] / 255, arr[1] / 255, arr[2] / 255);
}

var lights = {
	point : {
		obj : undefined,
	},
	ambient : {
		obj : undefined
	},
	init : function() {

		lights.point.obj = new THREE.PointLight(0xffffff, 1);

		lights.point.obj.position.x = 0;
		lights.point.obj.position.y = 400;
		lights.point.obj.position.z = 0;

		scene.add(lights.point.obj);

		lights.ambient.obj = new THREE.AmbientLight(0xffffff);

		lights.update();

		scene.add(lights.ambient.obj);

	},
	update : function() {

		lights.point.obj.color = threeRGBColorFromArr(gui.pointColor);
		lights.ambient.obj.color = threeRGBColorFromArr(gui.ambientColor);

	}
}

var testObjectA;

function objectsInit() {

	if (showLights) {
		lights.init();
	}

	setupGUI();

	if (!guiEnabled) {
		$('.dg.main.a').hide();
	}
	
	
	if(showPlane){
		plane();	
	}

	if (showParticles) {
		particles.init();
	}

	updateBackgroundColor();

	if (linePattern) {
		grid();
	}

	

	if (brandBackground) {
		backgroundPlane.init();
	}

}

function tweenParticle(p) {

	var spd = 5;

	var baseRad = 30;

	var rot = {
		a : new THREE.Vector3(),
		b : new THREE.Vector3()
	};

	var iter_a = ['a', 'b'];

	function generateBasis() {
		for (var i = 0; i < iter_a.length; i++) {
			for (var j = 0; j < axises.length; j++) {
				rot[iter_a[i]][axises[j]] = dRange(baseRad);
			}
		}
	}

	var s = {
		ang : 0
	}, e = {
		ang : Math.PI * 2
	};

	function init() {

		s.ang = 0;

		baseRad = range(1, 2.5);

		generateBasis();
	}

	init();

	function update() {

		var pos = p.position;

		var ang = s.ang, cosAng = Math.cos(ang), sinAng = Math.sin(ang);

		pos.x = p.initial.x + cosAng * rot.a.x + sinAng * rot.b.x - rot.a.x;
		pos.y = p.initial.y + cosAng * rot.a.y + sinAng * rot.b.y - rot.a.y;
		pos.z = p.initial.z + cosAng * rot.a.z + sinAng * rot.b.z - rot.a.z;
	}

	p.tween = createjs.Tween.get(s, {
		loop : true
	}).wait(Math.random() * 200).to(e, 1000);

	p.tween.addEventListener("change", update);
}

function plane() {

	var plane = new THREE.Mesh(new THREE.PlaneGeometry(maxRadius * 8, maxRadius * 8), new THREE.MeshBasicMaterial({
		color : 0x0000FF,
		transparent : true,
		opacity : 0
	}));

	plane.rotation.x = -Math.PI / 2;
	plane.overdraw = true;

	scene.add(plane);

}

var backgroundPlane = {

	object : undefined,
	init : function() {

		var size = 10000;

		if (smallUnshiftedCube) {
			size = 100;
		}

		if (skybox) {

			
			var texture_placeholder = document.createElement('canvas');
			texture_placeholder.width = 128;
			texture_placeholder.height = 128;
			
			
			var context = texture_placeholder.getContext( '2d' );
			context.fillStyle = 'rgb( 200, 200, 200 )';
			context.fillRect( 0, 0, texture_placeholder.width, texture_placeholder.height );
			
			function loadTexture(path) {

				var texture = new THREE.Texture(texture_placeholder);
				
				var material = new THREE.MeshBasicMaterial( { map: texture, overdraw: true } );;
				
				var image = new Image();
				image.onload = function() {
					texture.needsUpdate = true;
					material.map.image = this;
				};
				image.src = path;

				return material;

			}

			var materials = [loadTexture(cataloguePath + boxSkinPath), // right
			loadTexture(cataloguePath + boxSkinPath), // left
			loadTexture(cataloguePath + boxSkinPath), // top
			loadTexture(cataloguePath + boxSkinPath), // bottom
			loadTexture(cataloguePath + boxSkinPath), // back
			loadTexture(cataloguePath + boxSkinPath) // front
			];

			backgroundPlane.object = new THREE.Mesh(new THREE.CubeGeometry(size, size, size, 7, 7, 7), 
													new THREE.MeshFaceMaterial(materials));
			backgroundPlane.object.scale.x = -1;

		} else {

			var brandTexture = THREE.ImageUtils.loadTexture(cataloguePath + boxSkinPath);

			if (cubeBasicMaterial) {
				brandMaterial = new THREE.MeshBasicMaterial({
					depthWrite : true,
					map : brandTexture,
					side : THREE.DoubleSide
				});
			} else {
				
				brandMaterial = new THREE.MeshPhongMaterial({
					depthWrite : true,
					map : brandTexture,
					side : THREE.DoubleSide
				});
		}

			backgroundPlane.object = new THREE.Mesh(new THREE.CubeGeometry(size, size, size), brandMaterial);

		}

		if (!smallUnshiftedCube) {
			backgroundPlane.object.position.y += ceiling;
		}
		scene.add(backgroundPlane.object);

	},
	update : function() {
		if (backgroundCubeMoving) {
			var timeSlowed = time * .00005;
			backgroundPlane.object.rotation.x = Math.sin(timeSlowed) * Math.PI;
			backgroundPlane.object.rotation.y = Math.cos(timeSlowed) * Math.PI;
		}
	}
};

hotdot.particle = function (index){
	this.index = index;
	return this;
}

var particles = {

	count : 950,

	geometry : undefined,

	mat : undefined,

	threeObject : undefined,
	
	plainArray: undefined,
	
	getVelocity: function(i){
		return particles.geometry.vertices[i];
	},
	
	getParticlePosition: function(i){
		if(particles.canvasMode){
			return particles.plainArray[i].position;
		} else {
			return particles.geometry.vertices[i];
		}
	},
	
	canvasMode: canvasMode,

	init : function() {


		var glowCircle = THREE.ImageUtils.loadTexture(cataloguePath + "particle_tr.png"), 
			disc = THREE.ImageUtils.loadTexture(cataloguePath + "disc.png");

		particles.plainArray = new Array(particles.count);

		
		
		if(!particles.canvasMode) {
			
			particles.geometry = new THREE.Geometry();
			particles.geometry.colors = [];
			
			particles.mat = new THREE.ParticleBasicMaterial({
				size : 10,
				vertexColors : true,
				blending : THREE.AdditiveBlending,
				map : disc,
				transparent : true
			});
			
		} else {
			
			var canvasPMaterial = new THREE.ParticleBasicMaterial({ 
				size : .1,
				vertexColors : true,
				color: 0xff0000,
				blending: THREE.AdditiveBlending,
				map: disc, 
				transparent : true
			});
			
			var PI2 = Math.PI * 2;
			
			var programFill = function(hdParticle){
				
				return function ( context ) {
					
				    context.globalCompositeOperation = 'lighter';
					context.fillStyle = "rgb("+Math.floor(hdParticle.color.r*256)+","+
											   +Math.floor(hdParticle.color.g*256)+","+
											   +Math.floor(hdParticle.color.b*256)+")";
					context.beginPath();
					context.arc( 0, 0, 2, 0, PI2, true );
					context.closePath();
					context.fill();
				}
			}
			
			
			var prMat = function (hdParticle){
				return new THREE.ParticleCanvasMaterial({
					 program: programFill(hdParticle)
				});
			}
			
		}

		var tjsParticle, hdParticle;
		
		for (var p = 0; p < particles.count; p++) {
			
			hdParticle = new hotdot.particle(p);
			particles.plainArray[p] = hdParticle;
			
			if(particles.canvasMode){
			
				
				if(canvasSettings.particlesFromImage){
					tjsParticle = new THREE.Particle(canvasPMaterial);
				} else {
					tjsParticle = new THREE.Particle(prMat(hdParticle));
				}				
				
				hdParticle.position = tjsParticle.position;
				
				scene.add( tjsParticle );
				
				hdParticle.color = new THREE.Color(0xff0000);
			
			} else {
				
				var tjsParticle = new THREE.Vector3(0, 0, 0);
				
				hdParticle.position = tjsParticle;
				
				particles.geometry.vertices.push(tjsParticle);
				
				hdParticle.color = particles.geometry.colors[p] = new THREE.Color(0xff0000);
			}
			
			particles.plainArray[p] = hdParticle;
			
			hdParticle.velocity = new THREE.Vector3(0, 0, 0);
			hdParticle.initial = {
				x : 0,
				z : 0,
				y : 0
			};
			
			resetParticle(hdParticle);
		}

		if(!particles.canvasMode) {
			particles.threeObject = new THREE.ParticleSystem(particles.geometry, particles.mat);
		}
		
		initParticlesFromString(startString, particles);
		
		if(!particles.canvasMode) {
			particles.threeObject.sortParticles = true;
			scene.add(particles.threeObject);
		}

	},
	explodeParameters : {
		max : {
			pow : 10,
			dist : 50
		},
		min : {
			pow : 3
		}
	},

	mixRGB : function(comp, relativeRad) {
		var s = gui.seedColor[comp] * (1 - relativeRad) + gui.sideColor[comp] * relativeRad;
		/* s*= (1-relativeHeight);
		 s+= gui.topColor[comp]*relativeHeight; */
		return s / 255;
	},
	update : function() {

		if (particles.plainArray.length == 0)
			return;

		var pCount = particles.count;

		var p, relativeRad, relativeHeight, c, ang, dist, pow, vel, pos;

		while (pCount--) {

			p = particles.plainArray[pCount];
			
			pos = p.position;
			
			vel = p.velocity;
			
			if (Math.abs(Math.sqrt(Math.pow(pos.x, 2) + Math.pow(pos.z, 2)) > maxRadius * 3)) {
				resetParticle(p);
			}
			
			relativeRad = Math.sqrt(Math.pow(pos.x / maxRadius, 2) + Math.pow(pos.z / maxRadius, 2));
			relativeHeight = pos.y / ceiling;

			pos.add(vel);
			
			physics.step(p, time);

			if (explode) {

				ang = Math.atan2(pos.z - explode.z, pos.x - explode.x);
				dist = Math.sqrt(Math.pow(pos.z - explode.z, 2) + Math.pow(pos.x - explode.x, 2));

				// Частицы внутри области взрыва
				if (dist < particles.explodeParameters.max.dist) {

					pow = (particles.explodeParameters.max.pow - particles.explodeParameters.min.pow) * (1 - dist / particles.explodeParameters.max.dist) + particles.explodeParameters.min.pow;

					vel.x = pow * Math.cos(ang);
					vel.z = pow * Math.sin(ang);

					p.tween.setPaused(true);
				}

			}
			
			c = p.color;
			c.setRGB(particles.mixRGB(0, relativeRad),
					 particles.mixRGB(1, relativeRad), 
					 particles.mixRGB(2, relativeRad));
			
		}

		if(!particles.canvasMode){
			particles.threeObject.geometry.__dirtyVertices = true;
			particles.threeObject.geometry.colorsNeedUpdate = true;
		}
	}
}

function updateBackgroundColor(v) {

	var newClr = v ? v : gui.background;
	var threeClr = new THREE.Color();
	threeClr.setRGB(newClr[0] / 255, newClr[1] / 255, newClr[2] / 255);

	renderer.setClearColorHex(threeClr.getHex(), 1);
}

function updateObjects() {

	particles.update();

	if (linesConstructShouldRotate) {
		for (var i = 0; i < scene.children.length; i++) {

			var object = scene.children[i];
			if ( object instanceof THREE.Line) {
				object.rotation.x = time * (i % 2 ? 1 : -1 ) / 4;
				object.rotation.y = time * (i % 2 ? 1 : -1 ) / 4;
			}

		}
	}

	if (brandBackground) {
		backgroundPlane.update();
	}

	explode = false;

	createjs.Tween.tick(deltaFrame, false);
}

function mousedownLsnr() {

	var adj = {
		x : (mouse.x / window.innerWidth ) * 2 - 1,
		y : -((mouse.y / window.innerHeight) * 2 - 1)
	};

	var vector = new THREE.Vector3(adj.x, adj.y, 1);

	projector.unprojectVector(vector, camera);

	var ray = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());

	var intersects = ray.intersectObjects(scene.children);

	if (intersects.length > 0) {

		explode = intersects[0].point;

	}

}

/////////////////////////////
//webgl_lines_colors >>

function grid() {

	var geometry = new THREE.Geometry(), points = hilbert3D(new THREE.Vector3(0, 0, 0), 200.0, 2, 0, 1, 2, 3, 4, 5, 6, 7), colors = [];

	for ( i = 0; i < points.length; i++) {

		geometry.vertices.push(points[i]);

		colors[i] = new THREE.Color(0xffffff);
		colors[i].setHSV(0.6, (200 + points[i].x ) / 400, 1);

	}

	geometry.colors = colors;

	material = new THREE.LineBasicMaterial({
		opacity : .5,
		linewidth : 1,
		vertexColors : THREE.VertexColors
	});

	var line, p, scale = 2, d = 2000;
	var parameters = [[material, scale * 7, [0, -d, 0], geometry]];

	for ( i = 0; i < parameters.length; ++i) {

		p = parameters[i];
		line = new THREE.Line(p[3], p[0]);
		line.scale.x = line.scale.y = line.scale.z = p[1];
		line.position.x = p[ 2 ][0];
		line.position.y = p[ 2 ][1];
		line.position.z = p[ 2 ][2];
		scene.add(line);

	}
}

function hilbert3D(center, side, iterations, v0, v1, v2, v3, v4, v5, v6, v7) {

	var half = side / 2, vec_s = [new THREE.Vector3(center.x - half, center.y + half, center.z - half), new THREE.Vector3(center.x - half, center.y + half, center.z + half), new THREE.Vector3(center.x - half, center.y - half, center.z + half), new THREE.Vector3(center.x - half, center.y - half, center.z - half), new THREE.Vector3(center.x + half, center.y - half, center.z - half), new THREE.Vector3(center.x + half, center.y - half, center.z + half), new THREE.Vector3(center.x + half, center.y + half, center.z + half), new THREE.Vector3(center.x + half, center.y + half, center.z - half)], vec = [vec_s[v0], vec_s[v1], vec_s[v2], vec_s[v3], vec_s[v4], vec_s[v5], vec_s[v6], vec_s[v7]];

	if (--iterations >= 0) {

		var tmp = [];

		Array.prototype.push.apply(tmp, hilbert3D(vec[0], half, iterations, v0, v3, v4, v7, v6, v5, v2, v1));
		Array.prototype.push.apply(tmp, hilbert3D(vec[1], half, iterations, v0, v7, v6, v1, v2, v5, v4, v3));
		Array.prototype.push.apply(tmp, hilbert3D(vec[2], half, iterations, v0, v7, v6, v1, v2, v5, v4, v3));
		Array.prototype.push.apply(tmp, hilbert3D(vec[3], half, iterations, v2, v3, v0, v1, v6, v7, v4, v5));
		Array.prototype.push.apply(tmp, hilbert3D(vec[4], half, iterations, v2, v3, v0, v1, v6, v7, v4, v5));
		Array.prototype.push.apply(tmp, hilbert3D(vec[5], half, iterations, v4, v3, v2, v5, v6, v1, v0, v7));
		Array.prototype.push.apply(tmp, hilbert3D(vec[6], half, iterations, v4, v3, v2, v5, v6, v1, v0, v7));
		Array.prototype.push.apply(tmp, hilbert3D(vec[7], half, iterations, v6, v5, v2, v1, v0, v3, v4, v7));

		return tmp;

	}

	return vec;
}

/////////////////////////////