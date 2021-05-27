import Platform from '/scripts/platforms/Platform.js';
import rand from '/scripts/rand.js';

export default class DisappearingPlatform extends Platform {
	constructor(pos) {
		super(pos);
		this.cooldown = 2000;
	}

	hit() {
		if(this.hitTime) return;
		this.hitTime = (new Date()).getTime();
		this.material.transparent = true;
	}

	render() {
		if(this.hitTime) {
			let timePassed = (new Date()).getTime() - this.hitTime;
			this.material.opacity = Math.max(this.cooldown - timePassed, 0) / this.cooldown;
		}
	}
}