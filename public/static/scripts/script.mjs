import * as Three from '/lib/three.min.mjs';
import Stats from '/lib/stats.min.mjs';
import rand from '/scripts/rand.mjs';
import PowerupManager from '/scripts/PowerupManager.mjs';
import PlatformManager from '/scripts/PlatformManager.mjs';
import ui from '/scripts/ui.mjs';

onresize = () => location.reload();

const userInfo = document.getElementById('user-info');

const canvas = document.getElementById('c');
canvas.width = innerHeight * 4 / 3;
canvas.height = innerHeight;

const renderer = new Three.WebGLRenderer(
	{ canvas, antialias: true }
);

const far = 2000;
const camera = new Three.PerspectiveCamera(80, 4 / 3, 0.1, far);

const scene = new Three.Scene();

const loader = new Three.TextureLoader();

const texture = loader.load('/assets/skybox.jpg', () => {
	const rt = new Three.WebGLCubeRenderTarget(texture.image.height);
	rt.fromEquirectangularTexture(renderer, texture);
	scene.background = rt;
});

const light = new Three.DirectionalLight()
	, light2 = new Three.DirectionalLight();
light.position.set(-1, 2, 10);
light2.position.set(1, -2, -10);
scene.add(light, light2);

/* const cube = new Three.Mesh(
	new Three.BoxBufferGeometry(1, 1, 1),
	new Three.MeshPhongMaterial({ color: 0x8c03fc})
);
cube.position.setZ(far);

scene.add(cube); */

let platformZ = 0;

let platforms = [];

const offset = 1;
const size = 10;
const spacing = 25;
const rotFactor = Math.PI / 4; 
const xFactor = 5;
const yFactor = 1;
const xScale = 2;
const platformColor = 0x808080;

const wall = new Three.Mesh(
	new Three.PlaneBufferGeometry(500, 500),
	new Three.MeshBasicMaterial({map: loader.load('/assets/elmo.png'), transparent: true})
);
const back = new Three.Mesh(
	new Three.PlaneBufferGeometry(500, 500),
	new Three.MeshBasicMaterial({map: loader.load('/assets/trump.png'), transparent: true})
);
back.rotation.y = Math.PI;
back.position.setX(50);
wall.add(back);
wall.position.set(0, -100, -500);
scene.add(wall);

const player = new Three.Object3D();
player.add(camera);
player.position.z = 3;
player.position.y = 5;
scene.add(player);

let dir = new Three.Vector3();
let keys = new Set();
const possibleKeys = new Set(['ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'KeyA', 'KeyP', 'KeyD', 'KeyS', 'KeyW', 'Space', 'ShiftLeft', 'ShiftRight', 'KeyR']);

const stats = new Stats();
stats.showPanel(0);
stats.dom.style=`
	position: fixed;
	top: 0px;
	left: 0px;
`;
document.body.appendChild(stats.dom);

const playerHeight = 3;

const down = new Three.Raycaster(
	player.position,
	new Three.Vector3(0, -1, 0),
	0.1,
	playerHeight
);

const up = new Three.Raycaster(
	player.position,
	new Three.Vector3(0, 1, 0),
	0.1,
	1
);

const dirRay = new Three.Raycaster(
	player.position,
	new Three.Vector3(0, 1, 0),
	0.1,
	2
);

const startMaxSpeed = 0.3, startMaxJump = 0.4;

const vars = {
	maxSpeed: startMaxSpeed,
	shiftSpeed: 0.1,
	maxJump: startMaxJump,
	shiftJump: 0.2,
	pushback: 0.15,
	g: 0.01,
	fg: 0,
	j: startMaxJump,
	fj: 0,
	s: startMaxSpeed,
	fs: 0,
	wall,
	camera
};

const powerupManager = new PowerupManager(player, wall, vars);
scene.add(powerupManager);

const platformManager = new PlatformManager(scene, player, wall);

let gameOver = () => {
	document.exitPointerLock();
	const score = Math.max(0, Math.floor(player.position.z/10));
	const main = document.getElementsByTagName("main")[0];
	const replay = document.createElement("button");
	replay.id = "replay";
	replay.innerText = "Restart";
	replay.addEventListener("click", (e) => {
		location.reload();
	});
	main.appendChild(replay);
	const s = document.createElement("p");
	s.innerText = "Score: " + score;s.id = "score";
	main.insertBefore(s, userInfo);
	const a = document.createElement("a");
	a.innerText = "Leaderboard";a.href = "/leaderboard";
	main.insertBefore(a, document.getElementById("center"));

	fetch("/score", {
		method: "POST",
		body: JSON.stringify({score: score}),
		headers: {
			'Content-Type': 'application/json'
		},
	}).then(() => {
		main.appendChild(
			document.createElement("p")
		).innerText = "Updated score";
	}).catch((err) => {
		main.appendChild(
			document.createElement("p")
		).innerHTML = "Error adding score:<br> " + err;
	});
	
	console.log(score);
}

let game = {
	get paused() {
		return this._paused;
	},

	set paused(val) {
		if(!val) {
			this.reqID = requestAnimationFrame(render);
			canvas.requestPointerLock();
		} else {
			document.exitPointerLock();
			cancelAnimationFrame(this.reqID);
		}

		document.getElementById("pause-menu").style.display = val ? "block" : "none";

		this._paused = val;
	}
};

game.paused = false;

document.getElementById("resume").onclick = () => {
	game.paused = false;
};

function render(time) {

	if(player.position.y < -50000) {
		giveSurprise();
		return;
	}

	if((player.position.y < -200 || player.position.z < wall.position.z) && gameOver) {
		gameOver();
		gameOver = null;
	}

	stats.begin();
	
	ui.render();

	time *= 0.001;

	/* cube.rotation.x = time;
	cube.rotation.y = time; */

	//console.log(dir);

	/* userInfo.innerHTML = `	
		x: ${player.position.x.toFixed(2)}<br>
		y: ${player.position.y.toFixed(2)}<br>
		z: ${player.position.z.toFixed(2)}<br>
		dir: {x: ${dir.x}, y: ${dir.y}, z: ${dir.z}}<br>
		player.rotation.y: ${player.rotation.y.toFixed(2)}
	`; */

	userInfo.innerHTML = `	
		x: ${player.position.x.toFixed(2)}<br>
		y: ${player.position.y.toFixed(2)}<br>
		z: ${player.position.z.toFixed(2)}
	`;

	wall.position.z += 0.35;
	
	
	powerupManager.render();
	platformManager.render();

	camera.rotation.x = Math.max(-Math.PI / 2, Math.min(camera.rotation.x, Math.PI / 2));

	if(keys.size == 0) vars.fs *= 0.85;

	if(dir.x != 0 || dir.z != 0) {
		const angle = Math.atan2(dir.z, dir.x) + player.rotation.y - Math.PI/2;
		const trueDir = new Three.Vector3(-Math.sin(angle), 0, -Math.cos(angle));
		dirRay.set(player.position, trueDir);

		player.position.addScaledVector(trueDir, vars.fs);
	}

	const platforms = platformManager.platforms;

	let objs = down.intersectObjects(platforms);
	if(objs.length == 0)  {
		player.position.y -= vars.fg;
		vars.fg += vars.g;
	} else vars.fg = 0;

	objs = up.intersectObjects(platforms);
	if(objs.length) {
		vars.fj = 0;
	}

	objs = dirRay.intersectObjects(platforms);
	if(objs.length) {

		let normal = new Three.Vector3(0, 0, 1);
		normal.applyQuaternion(objs[0].object.quaternion);
		player.position.addScaledVector(normal, vars.pushback);

	}

	[down, up, dirRay].forEach(ray => {

		objs = ray.intersectObjects(powerupManager.children);

		if(objs.length) {
			for(const obj of objs) {
				obj.object.hit();
				ui.addPowerupBar(obj.object);
				powerupManager.removePowerup();
			}
		}

	});
	
	if(!keys.has('Space') && vars.fg == 0) vars.fj=0;

	player.position.y += vars.fj;
	
	renderer.render(scene, camera);

	stats.end();

	game.reqID = requestAnimationFrame(render);

}

function addDir(x, z) {
	dir.add(new Three.Vector3(x, 0, z));
}

onkeypress = e => {

	if(keys.has(e.code)||!possibleKeys.has(e.code)) return;
	if(keys.size == 0) dir.set(0, 0, 0);

	switch (e.code) {
		case 'ArrowLeft':
		case 'KeyA':
			addDir(-1, 0);
			break;
		case 'ArrowRight':
		case 'KeyD':
			addDir(1, 0);
			break;
		case 'ArrowDown':
		case 'KeyS':
			addDir(0, -1);
			break;
		case 'ArrowUp':
		case 'KeyW':
			addDir(0, 1);
			break;
		case 'Space':
			vars.fj = vars.j;
			break;
		case 'ShiftLeft':
		case 'ShiftRight':
			vars.s = vars.shiftSpeed;
			vars.fs = vars.s;
			vars.j = vars.shiftJump;
			vars.fj = vars.j;
			break;
		case 'KeyR':
			player.position.set(0, 5, platformManager.limit - platformManager.originalLimit + (platformManager.spacing*5));
			vars.fg = 0;
			vars.fs = 0;
			vars.fj = 0;
			break;
		case 'KeyP':
			game.paused = !game.paused;
	}

	if(!'Space ShiftLeft ShiftRight'.includes(e.code)) { 
		vars.fs = vars.s;
	}
	
	keys.add(e.code);

};

function giveSurprise() {
	location.href = "https://Surprise-1.dakshg.repl.co";
}

onkeyup = e => {

 	if(keys.size != 1)
		switch (e.code) {
			case 'ArrowLeft':
			case 'KeyA':
				addDir(1, 0);
				break;
			case 'ArrowRight':
			case 'KeyD':
				addDir(-1, 0);
				break;
			case 'ArrowDown':
			case 'KeyS':
				addDir(0, 1);
				break;
			case 'ArrowUp':
			case 'KeyW':
				addDir(0, -1);
		}

	switch(e.code) {
		case 'ShiftLeft':
		case 'ShiftRight':
			vars.s = vars.maxSpeed;
			vars.fs = vars.s;
			vars.j = vars.maxJump;
			vars.fj = vars.j;
			powerupManager.children.forEach(powerup => {
				if(powerup.constructor.name == "FlyPowerup") {
					vars.g = 0.005;
				}
			});
	}

	keys.delete(e.code);

}

onmousemove = e => {
	if (document.pointerLockElement) {
		player.rotation.y -= e.movementX / 100;
		camera.rotation.x -= e.movementY / 100;
	}
}

document.getElementById('ui').onclick = () => {
	if(!game.paused)
		canvas.requestPointerLock();
};

function makePlatform(w, h, pos, emissive, color = 0x000000) {
	const platform = new Three.Mesh(
		new Three.PlaneBufferGeometry(w, h),
		new Three.MeshPhongMaterial({color, emissive, side: Three.DoubleSide})
	);
	platform.rotation.x = -Math.PI / 2;
	platform.position.set(pos.x, pos.y, pos.z);
	return platform;
}