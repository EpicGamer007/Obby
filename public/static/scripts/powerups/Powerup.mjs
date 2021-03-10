import { Mesh } from '/lib/three.min.mjs';
import rand from '/scripts/rand.mjs';

export default class Powerup {
	
	constructor(geo, mat, cooldown, vars) {
		this.mesh = new Mesh(geo, mat);
		this.cooldown = cooldown;
		this.vars = vars;
		this.dx = (Math.random() > 0.5?1:-1) * 0.1;
		this.dy = (Math.random() > 0.5?1:-1) * 0.1;
	}

	render() {
		this.mesh.rotation.x += this.dx;
		this.mesh.rotation.y += this.dy;
	}

	hit() {
		this.apply();
		setTimeout(() => {
			this.unapply();
		}, this.cooldown * 1000);
	}

}

/* 

in script.js

powerup.hit();

addPowerupBar(powerup);

addPowerupBar(powerup) {

	addBar(powerup);

	setTimeout(() => {
	
		barSize--;
		updatePoerupbar();

	}, powerup.coolDown);
}

 */


/*

let pastTime = new Date.getTime();
while(new Date.getTime() - pastTime < powerup.cooldown * 1000) {

	make the cooldown bar the right height based on powerup.cooldown
	
}

*/