/*
*   Author: Thijs Lacquet
*/

class Scarfplot extends Visualization {
    /*
    var scarfCanvas;
    var scarfCtx;
    */

	/*
	* Initializes the canvas and context for the plots below the image.
	* @throws {IllegalArgumentException} If scarfCanvas is undefined.
	*/
    constructor(canvas, scarfCanvas, img) {
		if (scarfCanvas == undefined) {
			throw("IllegalArgumentException");
		}

        super(canvas, img);
 
        this.scarfCanvas = scarfCanvas;
        this.scarfCanvas.width = this.width;
		this.scarfCtx = this.scarfCanvas.getContext("2d");
    }

	setData(d){
		super.setData(d);
		this.AOI = d.getAOI();

		this.nUsers = d.numofActiveUsers;

		this.numofAOIs = d.getAOIs().length;

		this.userData = Array(d.numofActiveUsers);

		var j = 0;

		for(var i=0;i<d.numofUsers;i++){
			if(!d.users[i].enabled){
				continue;
			}

			this.userData[j++] = {
				AOI: d.users[i].getAOI(),
				time: d.users[i].getTime(),
				maxTime: d.users[i].maxtime,
				amount: d.users[i].numofEntries,
				user: d.users[i].name
			};
		}

		this.numofusers = j;

		this.aoi = d.getAOIs();
		this.createColors(this.numofAOIs);
	}

	/*
	* Draws the visualization.
	*/
    drawIfLoaded() {
        super.drawIfLoaded();

        this.drawAoi();

        var offSetX = 200 * this.widthScale;
		var userHeight = 100 * this.heightScale;

		var totalTime = 0;
		
		var nUsers = this.numofusers;

		this.scarfCanvas.height = userHeight * nUsers;

		for (var k = 0; k < this.numofusers; k++) {
			//Pixels per unit of timestamp

			var deltaPixel = (this.width - offSetX) /
				this.userData[k].maxTime; 

			for (var i = 0; i < this.userData[k].amount - 1; i++) { //Loop over all transitions
				if(this.userData[k].AOI[i] == 0){
					continue;
				}

				this.scarfCtx.beginPath();
                //Draw part of scarfplot
				var timestamp = (this.userData[k].time[i]);
				var timestampNext = (this.userData[k].time[i+1]);

                this.scarfCtx.rect(deltaPixel * timestamp + offSetX, userHeight * k,
					deltaPixel * (timestampNext - timestamp), userHeight * (k + 1));
                    
                this.scarfCtx.fillStyle = this.colors[this.userData[k].AOI[i] - 1];
                this.scarfCtx.fill();
			}

			//Add elements for one single user
			this.scarfCtx.beginPath();
			this.scarfCtx.strokeStyle = 'black';
			this.scarfCtx.lineWidth = 7 * this.heightScale;
			this.scarfCtx.rect(0, userHeight * k, offSetX, userHeight * (k + 1)); //rect around user text
			this.scarfCtx.rect(offSetX, userHeight * k, this.width - offSetX, userHeight * (k + 1));
			this.scarfCtx.stroke();

			this.scarfCtx.font = 30 * this.widthScale + "px Arial";
			this.scarfCtx.fillStyle = 'black';
			this.scarfCtx.textAlign = "center";
			this.scarfCtx.fillText(this.userData[k].user, offSetX / 2, userHeight * (k + 0.5));
		}
    }
}