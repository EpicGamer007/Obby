import { Mesh } from '/lib/three.min.js';
import rand from '/scripts/rand.js';

export default class Powerup extends Mesh {
	
	constructor(geo, mat, cooldown, vars) {
		super(geo, mat);
		this.cooldown = cooldown;
		this.vars = vars;
		this.dx = (Math.random() > 0.5?1:-1) * 0.1;
		this.dy = (Math.random() > 0.5?1:-1) * 0.1;
	}

	apply() {}
	unapply() {}

	render() {
		this.rotation.x += this.dx;
		this.rotation.y += this.dy;
	}

	hit() {
		this.apply();
		setTimeout(() => {
			this.unapply();
		}, this.cooldown * 1000);
	}

}