/*
* Author: Marleen van Gent
* using visualization.js
*/
class Scanpath extends Visualization {
	constructor(canvas, img, width, height) {
		super(canvas, img, width, height);
	}
	
	start(size) {
		var array = null;
		var superThis = this;
		$.post( "../connecting.php", function( data ) {
			array = JSON.parse(data);
			superThis.draw(array, size);
		});	
	}
	
	//amount is the number of colours needed, needs to be implemented
	
	draw(data, size) {
		console.log(data);
		console.log("correct one");
		super.draw(data, size);
		var j = 0;
		this.ctx.lineWidth = 3;
		
		for(j = 0; j < this.data.length ; j++) {
			if (j == 0 || this.data[j]['user'] != this.data[j - 1]['user']) {
				//still need to implement the nice color way from Thijs
				var r = Math.floor(Math.random() * 255); 
				var g = Math.floor(Math.random() * 255);
				var b = Math.floor(Math.random() * 255); 
				this.ctx.fillStyle = 'rgb('+ r + ', ' + g + ', ' + b + ')';
				this.ctx.strokeStyle = 'rgb('+ r + ', ' + g + ', ' + b + ')';
				
			}
			
			this.ctx.beginPath();
			this.ctx.arc(this.data[j]['mappedfixationpointx'], this.data[j]['mappedfixationpointy'], (this.data[j]['fixationduration']*this.size), 0, 2 * Math.PI);
			this.ctx.fill();
			this.ctx.moveTo(this.data[j]['mappedfixationpointx'], this.data[j]['mappedfixationpointy']);
			
			if (!(j == (this.data.length - 1)) || this.data[j]['user'] == this.data[j + 1]['user']) {
				this.ctx.lineTo(this.data[j + 1]['mappedfixationpointx'], this.data[j + 1]['mappedfixationpointy']);
				this.ctx.stroke();
			}	
			
		}
	}
}