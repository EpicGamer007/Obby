import Platform from '/scripts/platforms/Platform.js';
import rand from '/scripts/rand.js';

export default class RotatingPlatform extends Platform {
	constructor(pos) {
		super(pos);
		this.speed = 0.01 * (rand(0, 1) < 0.5 ? 1 : -1);
	}
	
	render() {
		this.rotation.y += this.speed;
	}
}