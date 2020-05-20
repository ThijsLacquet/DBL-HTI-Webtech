/*
*   Author: Thijs Lacquet
*/

class visualization {
    /*
    var ctx;
    var canvas;
    var img;
    var colors;
    var aoi;
    var width;
    var height;

    var mappedFixationPointX
    var mappedFixationPointY
    var timestamp
    var user
    */

    constructor(canvas, img, width, height) {
        this.canvas = canvas;
        this.img = img;
        this.ctx = canvas.getContext("2d");
        this.width = width;
        this.height = height;

        this.canvas.width = this.width;
        this.canvas.height = this.height;

        if(img != null){
	        this.img.style.marginLeft = "0px";
	        this.img.style.marginTop = "0px";
	        this.img.style.width = width;
	        this.img.style.height = height;
    	}

        this.canvas.style.marginLeft = "0px";
        this.canvas.style.marginTop = "0px";
        this.canvas.style.width = width;
        this.canvas.style.height = height;

        this.posX = 0;
        this.posY = 0;

        this.canvas.addEventListener("mousedown", this.onMouseDown);
        this.canvas.addEventListener("mousemove", this.onMouseMove);
        this.canvas.addEventListener("wheel", this.onScroll, false);
    }

    /*
    * Creates amount colors on the HSL scale with an equal seperation in hue
    *
    * @param {number} amount - Amount of colors to generate
    * @throws {IllegalArgumentException} If amount is not a number, or if amount < 0
    */
    createColors(amount) {
        var colors = new Array(amount);
        var deltaColor = 360 / amount;
        var saturation = 100;
        var lightness = 50;

        for (var i = 0; i < amount; i++) {
            var hue = i * deltaColor;
            colors[i] = `hsl(${hue},${saturation}%,${lightness}%)`;
        }

        this.colors = colors;

        return colors
    }

    /*
    * Draws the area's of interest on the context of the canvas
    */
    drawAoi() {
        for(var i = 0; i < this.aoi.length; i++) {
            this.ctx.beginPath();
            this.ctx.rect(this.aoi[i].x1, this.aoi[i].y1, this.aoi[i].x2 - this.aoi[i].x1,
                this.aoi[i].y2 - this.aoi[i].y1);
            
            //Stroke
            this.ctx.globalAlpha = 1;
            this.ctx.strokeStyle = this.colors[i];
            this.ctx.lineWidth = 5;
            this.ctx.stroke();

            //Fill
            this.ctx.globalAlpha = 0.1;
            this.ctx.fillStyle = this.colors[i];
            this.ctx.fill();
        }
    }

    /*
    * Checks if a given coordinate is in the given area of interest
    *
    * @param {x1, x2, y1, y2} currentAoi - Area of interest
    * @param {number} currentPointX - X coordinate
    * @param {number} currentPointY - Y coordinate
    * @throws {IllegalArgumentException} if currentPointX or currentPointY are not a number
    */
    isInAoi(currentAoi, currentPointX, currentPointY) {
        if (typeof(currentPointX) != "number" || typeof(currentPointY) != "number") {
            throw("IllegalArgumentException");
        }

        if ((currentAoi.x1 < currentPointX &&
            currentAoi.x2 > currentPointX) &&
            (currentAoi.y1 < currentPointY &&
            currentAoi.y2 > currentPointY)) {
            return true;
        } else {
            return false;
        }
    }

    setAoi(aoi) {
        this.aoi = aoi;
        this.createColors(aoi.length);
    }

    draw(src, mappedFixationPointX, mappedFixationPointY, timestamp, user) {
        this.mappedFixationPointX = mappedFixationPointX;
        this.mappedFixationPointY = mappedFixationPointY;
        this.timestamp = timestamp;
        this.user = user;

        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.img.src = src;
    }

    draw(src, mappedFixationPointX, mappedFixationPointY) {
        this.mappedFixationPointX = mappedFixationPointX;
        this.mappedFixationPointY = mappedFixationPointY;

        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
        this.img.src = src;
    }

    onScroll() {
        //For some reason, these are undefined here
        console.log(this.img, this.canvas);

        event.preventDefault();
    
        var newWidth;
        var newHeight;
        var zoomFactor = 1.5;
        var zoom;
    
        if (event.deltaY < 0) { //Scrolling up
            zoom = zoomFactor;
        } else { //Scrolling down
            zoom = 1 / zoomFactor;
        }
    
        newWidth = (this.img.width * zoom);
        newHeight = (this.img.height * zoom);
        
        var currentZoom = parseFloat(this.img.style.width) / this.width;
        if (isNaN(currentZoom)) {
            currentZoom = 1;
        }
    
        var currentPortionWidth = this.width / currentZoom;
        var newPortionWidth = this.width / currentZoom / zoom;
        var currentPortionHeight = this.height / currentZoom;
        var newPortionHeight = this.height / currentZoom / zoom;
    
        var currOffSetX = parseFloat(this.img.style.marginLeft);
        var offSetX = (currOffSetX - (currentPortionWidth - newPortionWidth) / 2) * zoom;
    
        var currOffSetY = parseFloat(this.img.style.marginTop);
        var offSetY = (currOffSetY - (currentPortionHeight - newPortionHeight) / 2) * zoom;
    
        if (newWidth < this.width || newHeight < this.height) {
            newWidth = visContainer.clientWidth;
            newHeight = visContainer.clientHeight;
            offSetX = 0;
            offSetY = 0;
        }
    
        this.img.style.width = newWidth + "px";
        this.img.style.height = newHeight + "px";
        this.img.style.marginLeft = offSetX + "px";
        this.img.style.marginTop = offSetY + "px";
    
        this.canvas.style.width = newWidth + "px";
        this.canvas.style.height = newHeight + "px";
        this.canvas.style.marginLeft = offSetX + "px";
        this.canvas.style.marginTop = offSetY + "px";

        return false;
    }
    
    onMouseMove() {
        if (event.buttons == 1) {
            if (event.clientX != this.posX || event.clientY != this.posY) {
                var offSetX = parseInt(this.img.style.marginLeft) + event.clientX - this.posX;
                var offSetY = parseInt(this.img.style.marginTop) + event.clientY - this.posY;
    
                this.posX = event.clientX;
                this.posY = event.clientY;
    
                this.img.style.marginLeft = offSetX + "px";
                this.img.style.marginTop = offSetY + "px";
                this.canvas.style.marginLeft = offSetX + "px";
                this.canvas.style.marginTop = offSetY + "px";
            }
        }
    }
    
    onMouseDown() {
        if (event.button == 0) {
            this.posX = event.clientX;
            this.posY = event.clientY;
        }
    }
}