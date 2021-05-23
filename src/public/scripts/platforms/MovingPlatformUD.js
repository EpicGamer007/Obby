import Platform from '/scripts/platforms/Platform.js';
import rand from '/scripts/rand.js';

export default class MovingPlatformUD extends Platform {
	constructor(pos) {
		super(pos);
		this.startY = this.position.y;
		this.speed = 0.001;
		this.distance = 5;
	}
	
	render() {
		let current = (new Date()).getTime();
		this.position.y = this.startY + this.distance * Math.sin(this.speed * current);
	}
}