/*
* Author: Marleen van Gent
* using visualization.js
*/
class Scanpath extends Visualization {
	constructor(canvas, img) {
		super(canvas, img);
	}
	
	start(size) {
		var array = null;
		var superThis = this;

		$.post( "../Scripts/connecting.php", function( data ) {
			array = JSON.parse(data);
			superThis.drawOld(array, size);
		});	
	}
	
	//amount is the number of colours needed, needs to be implemented

	setData(d, size){
		super.setData(d);
		this.size = size;

		this.data = Array(d.numofActiveUsers);

		var j = 0;

		for(var i=0;i<d.numofUsers;i++){
			if(!d.users[i].enabled){
				continue;
			}

			this.data[j++] = {X: d.users[i].getX(), Y: d.users[i].getY(), duration: d.users[i].getDuration()};
		}

		this.numofusers = j;

		this.createColors(j);
	}
	
	drawIfLoaded() {
		super.drawIfLoaded();
		
		var size = this.size;

		var j;
		this.ctx.lineWidth = 3;
		
		for(var user = 0; user < this.numofusers; user++) {
		
			var currentUser = this.data[user];

			if(currentUser.X.length == 0){
				continue;
			}
			this.ctx.beginPath();

			this.ctx.strokeStyle = this.colors[user];
			this.ctx.fillStyle = this.colors[user];

			this.ctx.arc(this.data[user].X[0], this.data[user].Y[0] * this.widthScale, (this.data[user].duration[0]*this.size) * this.heightScale, 0, 2 * Math.PI);
			this.ctx.fill();

			for(var i = 0;i < currentUser.X.length;i++){
				this.ctx.beginPath();
				
				this.ctx.strokeStyle = this.colors[user];
				this.ctx.fillStyle = this.colors[user];

				this.ctx.arc(this.data[user].X[i] * this.widthScale, this.data[user].Y[i]  * this.heightScale, (this.data[user].duration[i]*this.size), 0, 2 * Math.PI);
				this.ctx.fill();
				this.ctx.moveTo(this.data[user].X[i -1] * this.widthScale, this.data[user].Y[i - 1] * this.heightScale);
				this.ctx.lineTo(this.data[user].X[i] * this.widthScale, this.data[user].Y[i] * this.heightScale);
				this.ctx.stroke();
			}
		}
	}

	getDownloadName() {
		var radiusString = "range[" + this.size * 1000 + "]";

		return (super.getDownloadName() + "_" + radiusString);
	}
}