import { Mesh, Shape, ExtrudeGeometry, Vector3, Object3D, MeshPhongMaterial } from '/lib/three.min.js';

const arrowShape = new Shape();
arrowShape.moveTo(0, 1)
		  .lineTo(0, 2)
		  .lineTo(2, 2)
		  .lineTo(2, 3)
		  .lineTo(3, 1.5)
		  .lineTo(2, 0)
		  .lineTo(2, 1)
		  .lineTo(0, 1);

const extrudeSettings = {
	steps: 2,
	depth: 1,
	bevelEnabled: false
};

const leftArrowPos =  [10, 3, -50]
	, rightArrowPos = [-10, 3, -50];

class Arrow extends Mesh {
	constructor(pos) {
		super(
			new ExtrudeGeometry(arrowShape, extrudeSettings),
			new MeshPhongMaterial({color: 0x000000, emissive: 0xf2b200})
		);
		this.position.set(pos.x, pos.y, pos.z);
		this.material.transparent = true;
		this.startZ = this.position.z;
		this.speed = 1;
	}

	render() {
		this.material.opacity -= 0.01;
		this.position.z += this.speed;
		if(this.material.opacity <= 0) {
			this.material.opacity = 1;
			this.position.z = this.startZ;
		}
	}
}

export default class Arrows extends Object3D {
	constructor() {
		super();

		this.add(new Arrow(new Vector3(...leftArrowPos)))
			.add(new Arrow(new Vector3(...rightArrowPos)));

		for(let arrow of this.children)
			arrow.rotation.y = -Math.PI / 2;
	}

	render() {
		for(let arrow of this.children)
			arrow.render();
	}
};