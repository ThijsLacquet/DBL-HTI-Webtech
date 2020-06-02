class ParallelScanpath extends visualization{

	//This will be called to initialize the visualizations
	//Parameters:
	//	canvas: this is a DOM object of the canvas that the visualization is displayed on
	constructor(canvas, img){
		super(canvas, img);
	}


	//This will be called if the visualization needs to be displayed, or if it needs to be changed
	//Parameters:
	//	data:		the data that will be displayed (we moeten nog wel ff afspreken hoe die er precies uit gaat zien)
	//	AOIs:		an array of AOIs, which are 4-element arrays that represent the coordinates of the areas of interest
	//	selection: 	a boolean array with the same lenght as the data, which represents which indices of the data are selected 
	draw(d){
		var maxt = d.maxtime;

		var numofAOIs = d.getAOIs().length;

		var numofusers = AOIs.length;

		var linesAOIdist = this.width/numofAOIs;
		var linesuserdist = 0.5*(linesAOIdist/numofusers);

		this.ctx.clearRect(0, 0, this.width, this.height);

		this.ctx.beginPath();

		var x = linesAOIdist/2;

		var colors = this.createColors(numofusers);

		while(x < this.width){
			for(var i = -numofusers/2;i < numofusers/2; i++){
				this.ctx.moveTo(x + i * linesuserdist, 0);
				this.ctx.lineTo(x + i * linesuserdist, this.height);
			}
			x += linesAOIdist;
		}
		this.ctx.stroke();

		this.ctx.lineWidth = linesuserdist/4;

		for(var user = 0; user < numofusers; user++){
			var currentUser = d.users[i];

			var AOIs = currentUser.getAOI();
			var times = currentUser.getTime();

			var prev = (AOIs[0] + 0.5)*linesAOIdist + (user - numofusers/2) * linesuserdist;

			this.ctx.beginPath();
			this.ctx.moveTo(prev,0);


			for(var i = 1; i < switchtimes.length; i++){
				var t = times[i]
				var AOI = AOIs[i];

				var pos = (AOI + 0.5)*linesAOIdist + (user - numofusers/2) * linesuserdist;

				this.ctx.lineTo(prev,(t/maxt) * this.height);
				this.ctx.lineTo(pos, (t/maxt) * this.height);

				prev = pos;
			}

			this.ctx.strokeStyle = colors[user];
			this.ctx.stroke();
		}
	}
}