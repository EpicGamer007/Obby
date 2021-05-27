import Platform from '/scripts/platforms/Platform.js';
import rand from '/scripts/rand.js';

export default class RotatingPlatform extends Platform {
	constructor(pos) {
		super(pos);
		this.speed = 0.01 * (rand(0, 1) < 0.5 ? 1 : -1);
		this.chosen = Math.floor(rand(1, 8));
		if(Math.floor(rand(0, 2))) this.chosen = [1, 2, 4][Math.floor(rand(0, 3))];
		
	}
	
	render() {
		if(this.chosen & 1) this.rotation.x += this.speed;
		if(this.chosen & 2) this.rotation.y += this.speed;
		if(this.chosen & 4) this.rotation.z += this.speed;
	}
}