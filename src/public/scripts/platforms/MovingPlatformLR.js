import Platform from '/scripts/platforms/Platform.js';
import rand from '/scripts/rand.js';

export default class MovingPlatformLR extends Platform {
	constructor(pos) {
		super(pos);
		this.startX = this.position.x;
		this.speed = 0.001;
		if(Math.floor(rand(0, 2))) this.speed *= -1;
		this.distance = 10;
	}
	
	render() {
		let current = (new Date()).getTime();
		this.position.x = this.startX + this.distance * Math.sin(this.speed * current);
	}
}