class ParallelScanpath extends Visualization{

	//This will be called to initialize the visualizations
	//Parameters:
	//	canvas: this is a DOM object of the canvas that the visualization is displayed on
	constructor(canvas){
		super(canvas, null);
	}

	setData(d){
		this.maxtime = d.maxtime;
		this.numofAOIs = d.getAOIs().length + 1;

		this.switchtimes = Array(d.numofActiveUsers);

		var j = 0;

		for(var i=0;i<d.numofUsers;i++){
			if(!d.users[i].enabled){
				continue;
			}

			this.switchtimes[j++] = [d.users[i].getAOI(), d.users[i].getTime()];
		}

		this.numofusers = j;
	}


	//This will be called if the visualization needs to be displayed, or if it needs to be changed
	//Parameters:
	//	data:		the data that will be displayed (we moeten nog wel ff afspreken hoe die er precies uit gaat zien)
	//	AOIs:		an array of AOIs, which are 4-element arrays that represent the coordinates of the areas of interest
	//	selection: 	a boolean array with the same lenght as the data, which represents which indices of the data are selected 
	draw(){
		var maxt = this.maxtime;

		var numofAOIs = this.numofAOIs;

		var numofusers = this.numofusers;

		var linesAOIdist = this.width/numofAOIs;
		var linesuserdist = 0.5*(linesAOIdist/numofusers);

		//this.ctx.clearRect(0, 0, this.width, this.height); //Removed because clearing is done seperately


		var x = linesAOIdist/2;

		this.createColors(numofAOIs - 1);

		this.ctx.lineWidth = 1;

		var p = 0;
		this.ctx.strokeStyle = '#d3d3d3';

		while(x < this.width){
			this.ctx.beginPath();
			for(var i = -numofusers/2;i < numofusers/2; i++){
				this.ctx.moveTo(x + i * linesuserdist, 0);
				this.ctx.lineTo(x + i * linesuserdist, this.height);
			}
			x += linesAOIdist;
			this.ctx.stroke();
			this.ctx.strokeStyle = this.colors[p];
			p++;
		}

		this.createColors(numofusers);



		var lineWidth = this.ctx.lineWidth = 3;

		for(var user = 0; user < numofusers; user++){
			var AOIs = this.switchtimes[user][0];
			var times = this.switchtimes[user][1];

			var prev = (AOIs[0] + 0.5)*linesAOIdist + (user - numofusers/2) * linesuserdist;

			this.ctx.beginPath();
			this.ctx.strokeStyle = this.colors[user];
			this.ctx.moveTo(prev,0);


			for(var i = 1; i < AOIs.length; i++){
				var t = times[i]
				var AOI = AOIs[i];

				var pos = (AOI + 0.5)*linesAOIdist + (user - numofusers/2) * linesuserdist;

				if(pos == prev){
					this.ctx.lineTo(pos, (t/maxt) * this.height);
				}else{
					this.ctx.lineTo(prev,(t/maxt) * this.height - lineWidth);
					this.ctx.lineTo(pos, (t/maxt) * this.height);
				}

				prev = pos;
			}


			this.ctx.stroke();
		}
	}
}