import * as Powerups from '/scripts/powerups/Powerups.mjs';
import rand from '/scripts/rand.mjs';

export default class PowerupManager {

	constructor(startingPowerups = [], scene, player, wall, vars) {

		this.powerups = startingPowerups;
		this.scene = scene;
		this.player = player;
		this.vars = vars;
		this.wall = wall;
		this.limit = 50;
		this.spacing = 200; // 200

		this.meshes = [];

		startingPowerups.forEach(powerup => {
			this.meshes.push(powerup.mesh);
		});

	}

	/* addPowerup() {

	} */

	remove() {
		this.scene.remove(this.powerups.shift().mesh);
		this.meshes.shift();
	}

	render() {
		
		if(this.meshes.length && this.wall.position.z > this.meshes[0].position.z) {
			this.remove();
		}

		for (const powerup of this.powerups) {
			powerup.render();
		}

		if(this.player.position.z > this.limit) {
			let newPowerup = new [Powerups.JumpPowerup, Powerups.SpeedPowerup, Powerups.ScareElmoPowerup, Powerups.FlyPowerup][Math.floor(rand(0, 4))](this.vars);
			newPowerup.mesh.position.set(rand(-10, 10), 10+rand(-5, 5), this.limit+50);
			this.powerups.push(newPowerup);
			this.meshes.push(newPowerup.mesh);
			this.scene.add(newPowerup.mesh);
			this.limit += this.spacing;
		}
	}

};

/* 
let powerup = new SpeedPowerup(vars);
powerup.mesh.position.set(0, 10, 50);
scene.add(powerup.mesh);

let jump = new JumpPowerup(vars);
jump.mesh.position.set(0, 10, 80);
scene.add(jump.mesh);

let scare = new ScareElmoPowerup(vars);
scare.mesh.position.set(0, 10, 100);
scene.add(scare.mesh);
*/