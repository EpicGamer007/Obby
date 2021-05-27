import Powerup from '/scripts/powerups/Powerup.js';
import { OctahedronBufferGeometry, MeshPhongMaterial } from '/lib/three.min.js';

export default class FlyPowerup extends Powerup {
	
	constructor(vars) {
		super(
			new OctahedronBufferGeometry(2),
			new MeshPhongMaterial({color: 0x000000, emissive: 0xff0000}),
			10,
			vars
		);

	}

	apply() {
		this.vars.g = -0.0001;
	}

	unapply() {
		this.vars.g = 0.01;
	}
}