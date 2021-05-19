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
		for(let point of points) {
			ctx.lineTo(point[0], point[1]);
			ctx.moveTo(point[0], point[1]);
		}
		ctx.closePath();
		ctx.stroke();

		ctx.lineWidth = 1;
		ctx.strokeStyle = '#000000';
	}

	/**
	 * Draws a rounded rectangle using the current state of the canvas.
	 * If you omit the last three params, it will draw a rectangle
	 * outline with a 5 pixel border radius
	 * @param {CanvasRenderingContext2D} ctx
	 * @param {Number} x The top left x coordinate
	 * @param {Number} y The top left y coordinate
	 * @param {Number} width The width of the rectangle
	 * @param {Number} height The height of the rectangle
	 * @param {Number} [radius = 5] The corner radius; It can also be an object 
	 *                 to specify different radii for corners
	 * @param {Number} [radius.tl = 0] Top left
	 * @param {Number} [radius.tr = 0] Top right
	 * @param {Number} [radius.br = 0] Bottom right
	 * @param {Number} [radius.bl = 0] Bottom left
	 * @param {Boolean} [fill = false] Whether to fill the rectangle.
	 * @param {Boolean} [stroke = true] Whether to stroke the rectangle.
	 */
	roundRect(x, y, width, height, fill = true, radius = 5, stroke = false) {
		if (typeof stroke === 'undefined') {
			stroke = true;
		}
		if (typeof radius === 'undefined') {
			radius = 5;
		}
		if (typeof radius === 'number') {
			radius = {tl: radius, tr: radius, br: radius, bl: radius};
		} else {
			var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
			for (var side in defaultRadius) {
				radius[side] = radius[side] || defaultRadius[side];
			}
		}
		ctx.beginPath();
		ctx.moveTo(x + radius.tl, y);
		ctx.lineTo(x + width - radius.tr, y);
		ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
		ctx.lineTo(x + width, y + height - radius.br);
		ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
		ctx.lineTo(x + radius.bl, y + height);
		ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
		ctx.lineTo(x, y + radius.tl);
		ctx.quadraticCurveTo(x, y, x + radius.tl, y);
		ctx.closePath();
		if (fill) {
			ctx.fill();
		}
		if (stroke) {
			ctx.stroke();
		}
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
			this.roundRect(...params);
			// ctx.strokeRect(...params);
		}

	}

/*


let hitTime = new Date.getTime();
while(new Date.getTime() - hitTime < powerup.cooldown * 1000) {

	make the cooldown bar the right height based on powerup.cooldown
	
}
*/

	containsPowerup(powerup) {
		for(const obj of this.powerupBars)
			if(obj.obj.uuid == powerup.uuid)
				return true;

		return false;
	}

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