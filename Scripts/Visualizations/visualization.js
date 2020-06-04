/*
*   Author: Thijs Lacquet
*/

class Visualization {
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

    /*
    * Configures canvas and image; Adds eventlisteners for zooming and panning interactions
    *
    * @param canvas - Canvas where the visualization is drawn on
    * @param img - Background image of the visualization
    * @param width - Width of the canvas and image
    * @param height - Height of the canvas and image
    * @throws {IllegalArgumentException} If the canvas or img are undefined
    */
    constructor(canvas, img) {
        if (canvas == undefined) {
            throw("IllegalArgumentException");
        }

        this.canvas = canvas;
        this.img = img;
        this.ctx = canvas.getContext("2d");

        if(img == null){
            this.width = this.canvas.width;
            this.height = this.canvas.height;
        }else{
            this.width = this.img.width;
            this.height = this.img.height;
            this.img.style.marginLeft = "0px";
            this.img.style.marginTop = "0px";
            this.img.style.width = this.width;
            this.img.style.height = this.height;
        }

        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.canvas.style.marginLeft = "0px";
        this.canvas.style.marginTop = "0px";
        this.canvas.style.width = this.width;
        this.canvas.style.height = this.height;

        this.posX = 0;
        this.posY = 0;

        this.canvas.addEventListener("mousedown", function(){this.onMouseDown();}.bind(this), false);
        this.canvas.addEventListener("mousemove", function(){this.onMouseMove();}.bind(this), false);
        this.canvas.addEventListener("wheel", function(){this.onScroll();}.bind(this), false);

        if(img != null){
            this.width = this.img.width;
        }    
    }



    /*
    * Creates amount colors on the HSL scale with an equal seperation in hue
    *
    * @param {number} amount - Amount of colors to generate
    * @throws {IllegalArgumentException} If amount is not a number, or if amount < 0
    */
    createColors(amount) {
        if (!(amount > 0)) {
            throw("IllegalArgumentException");
        }

        var colors = new Array(amount);
        var deltaColor = 360 / amount;
        var saturation = 100;
        var lightness = 50;

        for (var i = 0; i < amount; i++) {
            var hue = i * deltaColor;
            colors[i] = `hsl(${hue},${saturation}%,${lightness}%)`;
        }

        this.colors = colors;
    }

    /*
    * Draws the area's of interest on the context of the canvas
    */
    drawAoi() {
        if (this.heightScale == undefined || this.widthScale == undefined) {
            throw("Scale is undefined");
        }

        for(var i = 0; i < this.aoi.length; i++) {
            this.ctx.beginPath();
            this.ctx.rect(this.aoi[i].x1 * this.widthScale, this.aoi[i].y1* this.heightScale,
                (this.aoi[i].x2 - this.aoi[i].x1) * this.widthScale,
                (this.aoi[i].y2 - this.aoi[i].y1) * this.heightScale);

            //Stroke
            this.ctx.globalAlpha = 1;
            this.ctx.strokeStyle = this.colors[i];
            this.ctx.lineWidth = 5 * this.widthScale;
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
    * @returns true if the given coordinate is in the area of interest
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

    /*
    * Sets the area of interests of the visualization
    * @param {Array {x1, x2, y1, y2}} aoi - Array of the area's of interest
    */
    setAoi(aoi) {
        this.aoi = aoi;
        this.createColors(aoi.length);
    }

    /*
    * Sets the source of the image
    */
    setImage(src) {
        this.img.src = src;
    }

    setData(d) {
        this.mappedFixationPointX = d.getX();
        this.mappedFixationPointY = d.getY();
        this.duration = d.getDuration();
        this.timestamp = d.getTime();
        this.user = d.getUser();
    }

    /*
    * Draws the visualization by calling drawIfLoaded. If the image has not been loaded yet, 
    * draw the visualization on the next img.onload event.
    */
    draw() {
        if (this.img.naturalWidth != 0) { //Image is already loaded
            this.drawIfLoaded();
        } else { //Image is not loaded yet. Draw as soon as the image is loaded
            var visThis = this;

            this.img.onload = function() { //Draw image, then reset the onload function
                visThis.drawIfLoaded();

                visThis.img.onload = function() {} //Reset onload function

            }.bind(visThis) //Make sure that the onload function can access the scope of the current this
        }
    }

    /*
    * Draws the visualization. Assumes that the image has already been loaded.
    */
    drawIfLoaded() {
        if (this.img.naturalWidth == undefined) {
            throw("NaturalWidth is undefined");
        }

        if (this.img.naturalWidth <= 0) {
            throw("NaturalWidth <= 0");
        }

        if(this.img == null){
            this.widthScale = this.width / this.canvas.naturalWidth;
            this.heightScale = this.height / this.canvas.naturalHeight;
        }else{
            this.widthScale = this.width / this.img.naturalWidth;
            this.heightScale = this.height / this.img.naturalHeight;
        }

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /*
    * Old draw code. Not resizable in css
    */
    drawOld(data, size) {
    	this.data = data;
    	this.size = size;
    	this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    /*
    * Is executed when the wheel event fires. Handles zooming in and out.
    * @throws {NullPointerException} if event is undefined
    */
    onScroll() {
        if (event == undefined) {
            throw(NullPointerException);
        }
        
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
            newWidth = this.width;
            newHeight = this.height;
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

    /*
    * Is executed when the mousemove event fires. Pans the visualization if the left mousebutton is pressed
    * @throws {NullPointerException} if event is undefined
    */
    onMouseMove() {
        if (event == undefined) {
            throw(NullPointerException);
        
        }
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

    /*
    * Is executed when the mousedown event fires. Sets the current mouse position as the origin for panning.
    */
    onMouseDown() {
        if (event.buttons == 1) {
            this.posX = event.clientX;
            this.posY = event.clientY;
        }
    }

    /*
    * Downloads an image of the canvas when the download button is pressed
    * @param download_button ElementId of the html downloadbutton
    * @param canvas Canvas of the image which should be downloaded
     */
    setDownloadButton(download_button, canvas) {
        if (download_button == undefined) {
            throw("Download button is undefined in setDownloadButton");
        }
        if (canvas == undefined) {
            throw("Canvas is undefined in setDownloadButton");
        }

        var superThis = this; //Transfers this to new scope

        download_button.addEventListener("click", function() {
            //Add background image
            superThis.ctx.drawImage(this.img, 0, 0, this.width, this.height); //Lowers quality of image

            var filename = 'visualization.png';
            var imgurl = canvas.toDataURL(); //Save graphics as png

            var element = document.createElement('a');
            element.setAttribute('href', imgurl);
            element.setAttribute('download', filename);

            document.body.appendChild(element);

            element.click();

            document.body.removeChild(element);

            superThis.draw();
        }.bind(superThis), false);
    }
}
