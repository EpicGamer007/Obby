import Powerup from '/scripts/powerups/Powerup.js';
import { OctahedronBufferGeometry, MeshPhongMaterial } from '/lib/three.min.js';

export default class JumpPowerup extends Powerup {
	
	constructor(vars) {
		super(
			new OctahedronBufferGeometry(2),
			new MeshPhongMaterial({color: 0x000000, emissive: 0x0000ff}),
			15,
			vars
		);

	}

	apply() {
		this.vars.g = 0.005;
	}

	unapply() {
		this.vars.g = 0.01;
	}
}