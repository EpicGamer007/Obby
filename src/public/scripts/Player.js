import { Object3D, Raycaster, Vector3 } from '/lib/three.min.js';

export default class Player extends Object3D {
	
	constructor(camera, ui, vars) {
		super();

		this.camera = camera;
		this.ui = ui;
		this.vars = vars;
		this.platforms = undefined;
		this.powerupManager = undefined;

		this.add(camera);
		this.position.z = 3;
		this.position.y = 5;

		this.height = 3;
		this.dir = new Vector3();

		this.down = new Raycaster(
			this.position,
			new Vector3(0, -1, 0),
			0.1,
			this.height
		);

		this.up = new Raycaster(
			this.position,
			new Vector3(0, 1, 0),
			0.1,
			1
		);

		this.dirRay = new Raycaster(
			this.position,
			new Vector3(0, 1, 0),
			0.1,
			2
		);

	}

	addDir(x, z) {
		this.dir.add(new Vector3(x, 0, z));
	}

	render() {

		if(this.dir.x != 0 || this.dir.z != 0) {
			const angle = Math.atan2(this.dir.z, this.dir.x) + this.rotation.y - Math.PI/2;
			const trueDir = new Vector3(-Math.sin(angle), 0, -Math.cos(angle));
			this.dirRay.set(this.position, trueDir);

			this.position.addScaledVector(trueDir, this.vars.fs);
		}

		let objs = this.down.intersectObjects(this.platforms);
		if(objs.length == 0)  {
			this.position.y -= this.vars.fg;
			this.vars.fg += this.vars.g;
		} else this.vars.fg = 0;

		objs = this.up.intersectObjects(this.platforms);
		if(objs.length) {
			this.vars.fj = 0;
		}

		objs = this.dirRay.intersectObjects(this.platforms);
		if(objs.length) {

			let normal = new Vector3(0, 0, 1);
			normal.applyQuaternion(objs[0].object.quaternion);
			this.position.addScaledVector(normal, this.vars.pushback);

		}	

		[this.down, this.up, this.dirRay].forEach(ray => {

			objs = ray.intersectObjects(this.powerupManager.children);

			if(objs.length) {
				objs[0].object.hit();
				this.ui.addPowerupBar(objs[0].object);
				this.powerupManager.remove(objs[0].object);
			}

		});

	}
}