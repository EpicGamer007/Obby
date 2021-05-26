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

/*
0
1000

101

101
001 &
001

101
010 &
000

101
100 &
100

1101
1011 &
1001

001
	& 001 = 001 => true
	& 010 = 000 => false
	& 100 = 000 => false
010
	& 001 = 000 => false
	& 010 = 010 => true
	& 100 = 000 => false
011
	& 001 = 001 => true
	& 010 = 010 => true
	& 100 = 000 => false
100
	& 001 = 000 => false
	& 010 = 000 => false
	& 100 = 100 => true
101
	& 001 = 001 => true
	& 010 = 000 => false
	& 100 = 100 => true
110
	& 001 = 000 => false
	& 010 = 010 => true
	& 100 = 100 => true
111
	& 001 = 001 => true
	& 010 = 010 => true
	& 100 = 100 => true
	
first:  4/7
second: 4/7
third:  4/7
*/