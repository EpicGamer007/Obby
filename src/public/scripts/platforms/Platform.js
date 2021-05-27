import rand from '/scripts/rand.js'
import { Mesh, PlaneBufferGeometry, CircleGeometry, MeshPhongMaterial, DoubleSide } from '/lib/three.min.js';

const minRadius = 5;
const maxRadius = 10;

const rotFactor = Math.PI / 4;

const minScale = 0.5;
const maxScale = 2;

const offset = 1;
const xPosFactor = 5;
const yPosFactor = 1;

export default class Platform extends Mesh {

	constructor(pos) {
		super(
			new CircleGeometry(rand(minRadius, maxRadius), Math.floor(rand(1, 10))),
			new MeshPhongMaterial({color: 0x000000, emissive: rand(0, 0xffffff+ 1), side: DoubleSide})
		);

		this.color = this.material.emissive;
		this.rotFactor = rotFactor;
		this.minScale = minScale;
		this.maxScale = maxScale;
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
		this.rotation.z = rand(-this.rotFactor, this.rotFactor);
	}

	render() {}

	hit() {}
}