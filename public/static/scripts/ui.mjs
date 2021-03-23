const canvas = document.getElementById('ui');
const ctx = canvas.getContext('2d');
canvas.width = innerHeight * 4 / 3;
canvas.height = innerHeight;
const w = canvas.width, h = canvas.height;

class UI {

	constructor() {

		this.powerupBars = [];
		this.xBarMargin = h/50;
		this.yBarMargin = h/50;
		this.barWidth = h/50;
		this.barHeight = h/2;

		const crosshairLength = w/100;

		ctx.lineWidth = 1;
		ctx.strokeStyle = '#f8f8ff';

		ctx.beginPath();
		ctx.moveTo(w/2, h/2 - crosshairLength);
		ctx.lineTo(w/2, h/2 + crosshairLength);
		ctx.moveTo(w/2 - crosshairLength, h/2);
		ctx.lineTo(w/2 + crosshairLength, h/2);
		ctx.closePath();
		ctx.stroke();
		
		ctx.strokeStyle = '#ffffff';
	}

	line(startX, startY, stopX, stopY, width = 1, color = '#000000') {
		ctx.strokeStyle = color;
		ctx.lineWidth = width;

		ctx.beginPath();
		ctx.moveTo(startX, startY);
		ctx.lineTo(stopX, stopY);
		ctx.closePath();
		ctx.stroke();
		
		ctx.lineWidth = 1;
		ctx.strokeStyle = '#000000';
	}

	path(points, width = 1, color = '#000000') {
		
		ctx.strokeStyle = color;
		ctx.lineWidth = width;

		ctx.beginPath();
		for(point of points) {
			ctx.lineTo(point[0], point[1]);
			ctx.moveTo(point[0], point[1]);
		}
		ctx.closePath();
		ctx.stroke();

		ctx.lineWidth = 1;
		ctx.strokeStyle = '#000000';
	}

	rect(startX, startY, width, height) {
		ctx.fillRect(startX, startY, width, height);
	}

	clearRect(startX, startY, width, height) {
		ctx.clearRect(startX, startY, width, height);
	}

	// in script.js
	// ui.render({cooldown})

	render() {
		// this.rect(0, 0, canvas.width, canvas.height);
		// console.log(this.powerupBars);
		// ctx.fillRect(0, 0, 500, 500);
		
		ctx.clearRect(0, h - this.barHeight - this.yBarMargin - 10, w, this.barHeight + this.yBarMargin);
		for(let i = 0; i < this.powerupBars.length; i++) {

			const current = new Date().getTime();
			const powerupObject = this.powerupBars[i];		

			const timePassed = current - powerupObject.hitTime;
			const cooldown = powerupObject.obj.cooldown * 1000;
			
			if(timePassed >= cooldown) {
				this.powerupBars.splice(i, 1);
				i--;
				continue;
			}

			powerupObject.obj.apply();

			ctx.fillStyle = `#${powerupObject.obj.material.emissive.getHexString()}`;
			const params = [
				i * this.barWidth + this.xBarMargin,
				h - this.yBarMargin - (1 - timePassed / cooldown) * this.barHeight,
				this.barWidth,
				(1 - timePassed / cooldown) * this.barHeight
			];
			ctx.fillRect(...params);
			ctx.strokeRect(...params);
		}

	}

/*


let hitTime = new Date.getTime();
while(new Date.getTime() - hitTime < powerup.cooldown * 1000) {

	make the cooldown bar the right height based on powerup.cooldown
	
}
*/

	addPowerupBar(obj) {

		this.powerupBars.push({
			obj,
			hitTime: new Date().getTime()
		});

	}

}

export default new UI();

// ctx.fillRect(0, 0, canvas.width, canvas.height);

/*
// Set line width
ctx.lineWidth = 10;

// Wall
ctx.strokeRect(75, 140, 150, 110);

// Door
ctx.fillRect(130, 190, 40, 60);

// Roof
ctx.beginPath();
ctx.moveTo(50, 140);
ctx.lineTo(150, 60);
ctx.lineTo(250, 140);
ctx.closePath();
ctx.stroke();*/