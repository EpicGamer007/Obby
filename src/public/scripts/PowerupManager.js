import * as Powerups from '/scripts/powerups/Powerups.js';
import rand from '/scripts/rand.js';
import { Object3D } from '/lib/three.min.js';

export default class PowerupManager extends Object3D {

	constructor(player, wall, vars) {
		super();
		this.player = player;
		this.vars = vars;
		this.wall = wall;
		this.limit = 50;
		this.spacing = 160;
	}

	render() {
		
		if(this.children.length && this.wall.position.z > this.children[0].position.z) {
			this.children.shift();
		}

		for (const powerup of this.children) {
			powerup.render();
		}

		if(this.player.position.z > this.limit) {
			let newPowerup = new [Powerups.JumpPowerup, Powerups.SpeedPowerup, Powerups.ScareElmoPowerup, Powerups.FlyPowerup][Math.floor(rand(0, 4))](this.vars);
			newPowerup.position.set(rand(-10, 10), 10+rand(-5, 5), this.limit+50);
			this.add(newPowerup);
			this.limit += this.spacing;
		}
	}

};