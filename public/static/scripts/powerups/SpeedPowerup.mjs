import Powerup from '/scripts/powerups/Powerup.mjs';
import { OctahedronBufferGeometry, MeshPhongMaterial } from '/lib/three.min.mjs';

export default class SpeedPowerup extends Powerup {
	
	constructor(vars) {
		super(
			new OctahedronBufferGeometry(2),
			new MeshPhongMaterial({color: 0x000000, emissive: 0xfc8803}),
			10,
			vars
		);

	}

	apply() {
		this.vars.maxSpeed = 0.6;
		this.vars.s = 0.6;
		this.vars.shiftSpeed = 0.3;

		this.vars.camera.fov = 90;
		this.vars.camera.updateProjectionMatrix();
	}

	unapply() {
		this.vars.maxSpeed = 0.3;
		this.vars.s = 0.3;
		this.vars.shiftSpeed = 0.2;
		this.vars.fs = Math.min(this.vars.fs, this.vars.maxSpeed);

		this.vars.camera.fov = 80;
		this.vars.camera.updateProjectionMatrix();
	}
}