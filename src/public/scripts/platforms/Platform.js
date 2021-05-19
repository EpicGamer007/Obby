import rand from '/scripts/rand.js'
import { Mesh, PlaneBufferGeometry, MeshPhongMaterial, DoubleSide } from '/lib/three.min.js';

const size = 10;

const rotFactor = Math.PI / 4;

const xMinScale = 0.5;
const xMaxScale = 2;

const offset = 1;
const xPosFactor = 5;
const yPosFactor = 1;

export default class Platform extends Mesh {

	constructor(pos) {
		super(
			new PlaneBufferGeometry(size, size),
			new MeshPhongMaterial({color: 0x000000, emissive: rand(0, 0xffffff+1), side: DoubleSide})
		);

		this.size = size;
		this.color = this.material.emissive;
		this.rotFactor = rotFactor;
		this.xMinScale = xMinScale;
		this.xMaxScale = xMaxScale;
		this.offset = offset;
		this.xPosFactor = xPosFactor;
		this.yPosFactor = yPosFactor;

		this.position.set(pos.x, pos.y, pos.z);
		this.rotation.x = -Math.PI / 2;

		this.position.setX(rand(
			-this.offset * this.xPosFactor,
			this.offset * this.xPosFactor
		));

		this.position.setY(rand(
			-this.offset * this.yPosFactor,
			this.offset * this.yPosFactor
		));
		
		this.rotation.y = rand(-this.rotFactor, this.rotFactor);
		this.scale.setX(rand(this.xMinScale, this.xMaxScale));
	}

	render() {
	}
}