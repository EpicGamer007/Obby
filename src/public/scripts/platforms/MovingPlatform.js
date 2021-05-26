import Platform from '/scripts/platforms/Platform.js';
import rand from '/scripts/rand.js';

export default class MovingPlatform extends Platform {
	constructor(pos) {
		super(pos);
		this.angle = rand(0, Math.PI * 2);
		this.startX = this.position.x;
		this.startY = this.position.y;
		this.speed = 0.001;
		this.distance = 7;
		if(Math.floor(rand(0, 2))) {
			this.speed *= -1;
		}		
		if(Math.floor(rand(0, 2))) {
			this.angle = Math.floor(rand(0, 2)) ? 0 : (Math.PI / 2);
		}
	}
	
	render() {
		let current = (new Date()).getTime();
		this.position.x = this.startX + this.distance * Math.sin(Math.cos(this.angle) * this.speed * current);
		this.position.y = this.startY + this.distance * Math.sin(Math.sin(this.angle) * this.speed * current);
	}
}