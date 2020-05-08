//Author: Marleen van Gent
//Provides the drawing via Javascript of the scanpath visualization

function start(){ 
	array = null; 
	$.post( "../connecting.php", function( data ) {
		array = JSON.parse(data);
		drawScanpath(array);
	});	
}

function drawScanpath(data) {
	console.log("start drawing at time " + performance.now())
	var canvas = document.getElementById("myCanvas");
	var ctx = canvas.getContext("2d");
	var j = 0;
	ctx.lineWidth = 3;
	for (j = 0; j < data.length; j++) {
//to do implement colours same as Thijs
		if (j == 0 || data[j]['user'] != data[j - 1]['user']) {
			var r = Math.floor(Math.random() * 255); 
			var g = Math.floor(Math.random() * 255);
			var b = Math.floor(Math.random() * 255); 
			ctx.fillStyle = 'rgb('+ r + ', ' + g + ', ' + b + ')';
			ctx.strokeStyle = 'rgb('+ r + ', ' + g + ', ' + b + ')';
		}
		ctx.beginPath();
		ctx.arc(data[j]['mappedfixationpointx'], data[j]['mappedfixationpointy'], data[j]['fixationduration']/20, 0, 2 * Math.PI);
		ctx.fill();
		ctx.moveTo(data[j]['mappedfixationpointx'], data[j]['mappedfixationpointy']);
		if (!(j == (data.length - 1)) || data[j]['user'] == data[j + 1]['user']) {
			ctx.lineTo(data[j + 1]['mappedfixationpointx'], data[j + 1]['mappedfixationpointy'])
			ctx.stroke();
		}
	}
	console.log("end drawing at time " + performance.now())
}