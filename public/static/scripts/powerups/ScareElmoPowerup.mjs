import Powerup from '/scripts/powerups/Powerup.mjs';
import { OctahedronBufferGeometry, MeshPhongMaterial } from '/lib/three.min.mjs';

export default class ScareElmoPowerup extends Powerup {
	
	constructor(vars) {
		super(
			new OctahedronBufferGeometry(2),
			new MeshPhongMaterial({color: 0x000000, emissive: 0xFFFFFF}),
			0,
			vars
		);
	}

	apply() {
		this.vars.wall.position.setZ(this.vars.wall.position.z - 200);
	}

	unapply() { 
		// Nothing to unapply
	}		
}