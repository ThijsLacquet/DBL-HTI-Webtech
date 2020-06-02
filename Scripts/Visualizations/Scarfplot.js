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

	/*
	* Formats the data so it can be used by this visualization.
	*/
    formatData() {
		if (mappedFixationPointX.length != mappedFixationPointY.length ||
			mappedFixationPointX.length != timestamp.length) {
			throw("IllegalArgumentException");
		}

		var n = mappedFixationPointX.length;

		var userData = new Array(n);
		var nUsers = 0;

		for (var i = 0; i < n; i++) {
			//Check if the user already exists. If yes, increase the counter. If not, add it
			for (var j = 0; j < n; j++) {
				if (userData[j] == null) { //We have checked all our users, user does not exist yet
					userData[j] = {user:user[i], amount:1, data:new Array(n),
						minTime:timestamp[i], maxTime:timestamp[i]};
					userData[j].data[0] = {pX:mappedFixationPointX[i], pY:mappedFixationPointY[i],
						timestamp:timestamp[i]};
					nUsers++;
					break;
				}
				if (userData[j].user == user[i]) {//This is the same user
					userData[j].amount++;
					for (var k = 0; k < n; k++) {
						if (userData[j].data[k] == null) {
							userData[j].data[k] = {pX:mappedFixationPointX[i], pY:mappedFixationPointY[i],
								timestamp:timestamp[i]};
							if (timestamp[i] < userData[j].minTime) {
								userData[j].minTime = timestamp[i];
							}

							if (timestamp[i] > userData[j].maxTime) {
								userData[j].maxTime = timestamp[i];
							}
							break;
						}
					}
					break;
				}
			}
		}
		this.userData = userData;
	}

	/*
	* Draws the visualization.
	*/
    drawIfLoaded() {
        super.drawIfLoaded();

        this.drawAoi();
        this.formatData();

        var offSetX = 200 * this.widthScale;
		var userHeight = 100 * this.heightScale;

		var totalTime = 0;
		
		var nUsers = 0;
		while (this.userData[nUsers] != null) {
			nUsers++;
		}

		this.scarfCanvas.height = userHeight * nUsers;

		for (var k = 0; this.userData[k] != null; k++) {
			//Pixels per unit of timestamp
			var deltaPixel = (this.width - offSetX) /
				(this.userData[k].maxTime - this.userData[k].minTime); 

			for (var i = 0; i < this.userData[k].amount - 1; i++) { //Loop over all transitions
				for (var j = 0; j < this.aoi.length; j++) { //Loop over all AOI's
					if (this.isInAoi(aoi[j], this.userData[k].data[i].pX, this.userData[k].data[i].pY)) {
						this.scarfCtx.beginPath();
                        //Draw part of scarfplot
						var timestampZerod = (this.userData[k].data[i].timestamp - this.userData[k].minTime);
						var timestampZerodNext = (this.userData[k].data[i + 1].timestamp
							- this.userData[k].minTime);

                        this.scarfCtx.rect(deltaPixel * timestampZerod + offSetX, userHeight * k,
							deltaPixel * (timestampZerodNext - timestampZerod), userHeight * (k + 1));
                            
                        this.scarfCtx.fillStyle = this.colors[j];
                        this.scarfCtx.fill();
						break;
					}
				}
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