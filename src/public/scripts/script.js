import * as Three from '/lib/three.min.js';
import Stats from '/lib/stats.min.js';
import rand from '/scripts/rand.js';
import PowerupManager from '/scripts/PowerupManager.js';
import PlatformManager from '/scripts/PlatformManager.js';
import ui from '/scripts/ui.js';
import Player from '/scripts/Player.js';

const scoreToken = window.token;
window.token = undefined;

onresize = () => {
	location.reload();
	if(location.pathname !== "/") return;
	fetch("/exit", {
		method: "POST",
		body: JSON.stringify({token: scoreToken}),
		headers: {
			'Content-Type': 'application/json'
		},
	});
}
const userInfo = document.getElementById('user-info');

const canvas = document.getElementById('c');
canvas.width = innerHeight * 4 / 3;
canvas.height = innerHeight;

const sensitivityFactorElem = document.querySelector("#sensitivity > input");

let sensitivityFactor = 200 - sensitivityFactorElem.value;

sensitivityFactorElem.oninput = () => {
	sensitivityFactor = 200 - sensitivityFactorElem.value;
}

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

let keys = new Set();
const possibleKeys = new Set(['ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'KeyA', 'KeyP', 'KeyD', 'KeyS', 'KeyW', 'Space']);

const stats = new Stats();
stats.showPanel(0);
stats.dom.style=`
	position: fixed;
	top: 0px;
	left: 0px;
`;
document.body.appendChild(stats.dom);

const startMaxSpeed = 0.3, startMaxJump = 0.4;

const vars = {
	maxSpeed: startMaxSpeed,
	maxJump: startMaxJump,
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

const player = new Player(camera, ui, vars);
scene.add(player);

const powerupManager = new PowerupManager(player, wall, vars);
scene.add(powerupManager);

const platformManager = new PlatformManager(player, wall);
scene.add(platformManager);

player.platforms = platformManager.children;
player.powerupManager = powerupManager;

let gameOver = () => {
	document.exitPointerLock();
	const score = Math.max(0, Math.floor(player.position.z/10));
	const main = document.getElementsByTagName("main")[0];
	const replay = document.createElement("button");
	replay.id = "replay";
	replay.innerText = "Restart";
	replay.addEventListener("click", (e) => {
		if(location.pathname === "/") {
			fetch("/exit", {
				method: "POST",
				body: JSON.stringify({token: scoreToken}),
				headers: {
					'Content-Type': 'application/json'
				},
			});
		}
		location.reload();
	});
	main.appendChild(replay);

	const s = document.createElement("p");
	s.innerText = "Score: " + score;s.id = "score";
	main.insertBefore(s, userInfo);
	const a = document.createElement("a");
	a.innerText = "Leaderboard";a.href = "/leaderboard";
	main.insertBefore(a, document.getElementById("center"));

	if(location.pathname !== "/") return;

	fetch("/score", {
		method: "POST",
		body: JSON.stringify({score: score, token: scoreToken}),
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
}

let game = {
	get paused() {
		return this._paused;
	},

	set paused(val) {
		if(!val) {
			this.reqID = requestAnimationFrame(render);
			canvas.requestPointerLock();
			this.timePaused = (new Date()).getTime() - this.timeAtPause;
			ui.adjustPowerupTime(this.timePaused);
		} else {
			document.exitPointerLock();
			cancelAnimationFrame(this.reqID);
			this.timeAtPause = (new Date()).getTime();
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

	player.render();
	
	if(!keys.has('Space') && vars.fg == 0) vars.fj=0;

	player.position.y += vars.fj;
	
	renderer.render(scene, camera);

	stats.end();

	game.reqID = requestAnimationFrame(render);

}

onkeypress = e => {

	if(keys.has(e.code)||!possibleKeys.has(e.code)) return;
	if(keys.size == 0) player.dir.set(0, 0, 0);

	switch (e.code) {
		case 'ArrowLeft':
		case 'KeyA':
			player.addDir(-1, 0);
			break;
		case 'ArrowRight':
		case 'KeyD':
			player.addDir(1, 0);
			break;
		case 'ArrowDown':
		case 'KeyS':
			player.addDir(0, -1);
			break;
		case 'ArrowUp':
		case 'KeyW':
			player.addDir(0, 1);
			break;
		case 'Space':
			vars.fj = vars.j;
			break;
		case 'KeyP':
			game.paused = !game.paused;
	}

	if(!'Space'.includes(e.code)) { 
		vars.fs = vars.s;
	}
	
	keys.add(e.code);

};

function giveSurprise() {
	location.href = "https://Surprise-1.dakshg.repl.co/video.mp4";
}

onkeyup = e => {

 	if(keys.size != 1)
		switch (e.code) {
			case 'ArrowLeft':
			case 'KeyA':
				player.addDir(1, 0);
				break;
			case 'ArrowRight':
			case 'KeyD':
				player.addDir(-1, 0);
				break;
			case 'ArrowDown':
			case 'KeyS':
				player.addDir(0, 1);
				break;
			case 'ArrowUp':
			case 'KeyW':
				player.addDir(0, -1);
		}

	keys.delete(e.code);

}

onmousemove = e => {
	if (document.pointerLockElement) {
		player.rotation.y -= e.movementX / sensitivityFactor; // this is all we need to change for sensitivity
		camera.rotation.x -= e.movementY / sensitivityFactor; // default was 100 before, remember that ig, ok
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

window.addEventListener("beforeunload", (evt) => {
	if(location.pathname !== "/") return;
	fetch("/exit", {
		method: "POST",
		body: JSON.stringify({token: scoreToken}),
		headers: {
			'Content-Type': 'application/json'
		},
	});
});