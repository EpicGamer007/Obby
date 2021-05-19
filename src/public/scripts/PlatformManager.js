import rand from '/scripts/rand.js';
import { Vector3, Mesh, PlaneBufferGeometry, MeshPhongMaterial, DoubleSide } from '/lib/three.min.js';

export default class PlatformManager {
	constructor(scene, player, wall) {

		this.platforms = [];
		this.scene = scene;
		this.wall = wall;
		this.offset = 1;
		this.size = 10;
		this.spacing = 25;
		this.limit = 250;
		this.originalLimit = this.limit;
		this.rotFactor = Math.PI / 4; 
		this.xFactor = 5;
		this.yFactor = 1;
		this.xMinScale = 0.5;
		this.xMaxScale = 2;
		this.platformColor = 0x808080;
		this.player = player;

		for(let i = 0; i <= this.limit; i += this.spacing) {
			const newPlat = this.makePlatform(
				this.size, 
				this.size, 
				new Vector3(

					rand(
						-this.offset*this.xFactor, 
						this.offset*this.xFactor
					), 
					rand(
						-this.offset*this.yFactor,
						this.offset*this.yFactor
					),
					i

				), 
				this.platformColor
			);
			newPlat.rotation.y = rand(-this.rotFactor, this.rotFactor);
			newPlat.scale.setX(rand(this.xMinScale, this.xMaxScale));
			// console.log(newPlat);
			this.platforms.push(newPlat);
		}

		this.platforms[0].position.setY(0);
		this.platforms[0].scale.setX(1);
		this.platforms[0].rotation.y = 0;
		this.scene.add(...this.platforms);

	}

	render() {
		if(this.platforms.length > 1) {

			if(this.wall.position.z > this.platforms[0].position.z) {
				this.scene.remove(this.platforms.shift());
				this.limit += this.spacing;
			}

			if(this.platforms[this.platforms.length-1].position.z - this.player.position.z < 200) {
				const newPlat = this.makePlatform(
					this.size,
					this.size,
					new Vector3(
						
						rand(
							-this.offset*this.xFactor,
							this.offset*this.xFactor
						), 
						rand(
							-this.offset*this.yFactor,
							this.offset*this.yFactor
						), 
					this.limit
					
					), 
					this.platformColor
				);
				newPlat.rotation.y = rand(-this.rotFactor, this.rotFactor);
				newPlat.position.z = this.platforms[this.platforms.length-1].position.z + this.spacing;
				this.platforms.push(newPlat);
				this.scene.add(newPlat);
			}
		}
	}
	
	makePlatform(w, h, pos, emissive, color = 0x000000) {
		const platform = new Mesh(
			new PlaneBufferGeometry(w, h),
			new MeshPhongMaterial({color, emissive, side: DoubleSide})
		);
		platform.rotation.x = -Math.PI / 2;
		platform.position.set(pos.x, pos.y, pos.z);
		// console.log(platform);
		return platform;
	}
}