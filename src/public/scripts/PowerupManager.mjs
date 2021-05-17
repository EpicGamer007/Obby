import * as Powerups from '/scripts/powerups/Powerups.mjs';
import rand from '/scripts/rand.mjs';
import { Object3D } from '/lib/three.min.mjs';

export default class PowerupManager extends Object3D {

	constructor(player, wall, vars) {
		super();
		this.player = player;
		this.vars = vars;
		this.wall = wall;
		this.limit = 50;
		this.spacing = 200;
	}

	removePowerup(powerup) {
		this.children.splice(this.children.indexOf(powerup), 1);
	}

	render() {
		
		if(this.children.length && this.wall.position.z > this.children[0].position.z) {
			this.children.shift();
		}

		for (const powerup of this.children) {
			powerup.render();
		}

		if(this.player.position.z > this.limit) {
			console.log('new powerup spawned');
			let newPowerup = new [Powerups.JumpPowerup, Powerups.SpeedPowerup, Powerups.ScareElmoPowerup, Powerups.FlyPowerup][Math.floor(rand(0, 4))](this.vars);
			newPowerup.position.set(rand(-10, 10), 10+rand(-5, 5), this.limit+50);
			this.add(newPowerup);
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