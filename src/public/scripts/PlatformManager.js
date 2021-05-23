import { Object3D, Vector3 } from '/lib/three.min.js';
import Platforms from '/scripts/platforms/Platforms.js';
import rand from '/scripts/rand.js';

export default class PlatformManager extends Object3D {
	constructor(player, wall) {

		super();

		this.player = player;
		this.wall = wall;
		
		this.spacing = 25;
		this.limit = 250;
		this.originalLimit = this.limit;

		for(let i = 0; i <= this.limit; i += this.spacing)
			this.add(new Platforms.NormalPlatform(new Vector3(0, 0, i)));

		this.children[0].position.setY(0);
		this.children[0].scale.setX(1);
		this.children[0].rotation.y = 0;

	}

	render() {
		for(const platform of this.children) {
			platform.render();
		}
		if(this.children.length > 1) {

			if(this.wall.position.z > this.children[0].position.z) {
				this.children.shift();
				this.limit += this.spacing;
			}

			let lastZ = this.children[this.children.length - 1].position.z;

			if(lastZ - this.player.position.z < 200) {
				let newZ = lastZ + this.spacing;
				let newPlatform = new [Platforms.NormalPlatform, Platforms.MovingPlatformLR, Platforms.MovingPlatformUD, Platforms.RotatingPlatform][Math.floor(rand(0, 4))](new Vector3(0, 0, newZ));
				this.add(newPlatform);
			}
		}
	}
}