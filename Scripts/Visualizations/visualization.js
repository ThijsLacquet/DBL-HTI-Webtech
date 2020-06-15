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
    var zoom;

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

        this.width = this.canvas.clientWidth;
        this.height = this.canvas.clientWidth;

        if(img != null) {
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

        this.zoom = 1;

        this.canvas.addEventListener("mousedown", function(){this.onMouseDown();}.bind(this), false);
        this.canvas.addEventListener("mousemove", function(){this.onMouseMove();}.bind(this), false);
        this.canvas.addEventListener("wheel", function(){this.onScroll();}.bind(this), false);
    }



    /*
    * Creates amount colors on the HSL scale with an equal seperation in hue
    *
    * @param {number} amount - Amount of colors to generate
    * @throws {IllegalArgumentException} If amount is not a number, or if amount < 0
    */
    createColors(amount) {
        if (!(amount > 0)) {
            this.colors = undefined;
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
        this.d = d;
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

    clearVisualization() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
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
    * Sets the size of the canvas and image for non null parameters. If the image is null, it's size is not set.
     */
    setSize(width, height, offsetX, offsetY) {
        if (offsetX > 0) {
            offsetX = 0;
        }
        if (offsetY > 0) {
            offsetY = 0;
        }

        if (width != null) {
            if (this.img != null) this.img.style.width = width + "px";
            this.canvas.style.width = width + "px";
        }
        if (height != null) {
            if (this.img != null) this.img.style.height = height + "px";
            this.canvas.style.height = height + "px";
        }

        if (offsetX < -this.canvas.clientWidth + this.canvas.width) {
            offsetX = -this.canvas.clientWidth + this.canvas.width;
        }

        if (offsetY < -this.canvas.clientHeight + this.canvas.height) {
            offsetY = -this.canvas.clientHeight + this.canvas.height;
        }

        if (offsetX != null) {
            if (this.img != null) this.img.style.marginLeft = offsetX + "px";
            this.canvas.style.marginLeft = offsetX + "px";
        }
        if (offsetY != null) {
            if (this.img != null) this.img.style.marginTop = offsetY + "px";
            this.canvas.style.marginTop = offsetY + "px";
        }
    }

    /*
    * Is executed when the wheel event fires. Handles zooming in and out.
    * @throws {NullPointerException} if event is undefined
    */
    onScroll() {
        if (event == undefined) {
            throw("NullPointerException");
        }
        
        event.preventDefault();

        if (event.deltaY < 0) { //Scrolling up
            var zoomFactor = 1.5;
        } else { //Scrolling down
            var zoomFactor = 1 / 1.5;
        }

        this.zoom = this.zoom * zoomFactor;

        if (this.zoom < 1) {
            this.zoom = 1;
        }

        var newWidth = this.width * this.zoom;
        var newHeight = this.height * this.zoom;

        var offsetX = parseFloat(this.canvas.style.marginLeft) * zoomFactor;
        var offsetY = parseFloat(this.canvas.style.marginTop) * zoomFactor;

        this.setSize(newWidth, newHeight, offsetX, offsetY);

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
                var offsetX = parseInt(this.canvas.style.marginLeft) + event.clientX - this.posX;
                var offsetY = parseInt(this.canvas.style.marginTop) + event.clientY - this.posY;

                this.posX = event.clientX;
                this.posY = event.clientY;

                this.setSize(null, null, offsetX, offsetY);
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

    getDownloadName() {
        var aoiString = "aoi[";
        for (var aoi of this.d.AOIs) {
            aoiString += "{" + Math.round(aoi['x1']) + "," + Math.round(aoi['x2']) + "," + Math.round(aoi['y1'])
                + "," + Math.round(aoi['y2']) + "}";
        }
        aoiString += "]";

        var userString = "users[";
        for (var user of this.d.users) {
            if (user.getEnabled()) {
                userString += "{" + user.name + "}";
            }
        }
        userString += "]";

        var timeString = "time[" + Math.round(this.d.minTime) + "-" + Math.round(this.d.maxTime) + "]";
        var durationString = "duration[" + Math.round(this.d.minDuration) + "-" + Math.round(this.d.maxDuration) + "]";

        var name = "_";

        if (d.minTime != undefined) {
            name += timeString + "_";
        }

        if (d.minDuration != undefined) {
            name += durationString + "_";
        }

        name += aoiString + "_" + userString;

        return name;
    }

    /*
    * Downloads an image of the canvas when the download button is pressed
    * @param download_button ElementId of the html downloadbutton
    * @param canvas Canvas of the image which should be downloaded
     */
    setDownloadButton(download_button, canvas, visualizationName) {
        if (download_button == undefined) {
            throw("Download button is undefined in setDownloadButton");
        }
        if (canvas == undefined) {
            throw("Canvas is undefined in setDownloadButton");
        }

        var superThis = this; //Transfers this to new scope

        download_button.addEventListener("click", function() {
            //Clear context, add background, draw visualization
            superThis.clearVisualization();
            superThis.ctx.globalAlpha = 1;

            if (superThis.img != null) {
                superThis.ctx.drawImage(this.img, 0, 0, this.width, this.height);
            }

            superThis.draw();

            //Setup download
            var filename = visualizationName + superThis.getDownloadName();
            var imgurl = canvas.toDataURL(); //Save graphics as png

            var element = document.createElement('a');
            element.setAttribute('href', imgurl);
            element.setAttribute('download', filename);

            document.body.appendChild(element);

            element.click();

            document.body.removeChild(element);

            //Clear context and draw visualization again (to remove image)
            superThis.clearVisualization();
            superThis.draw();
        }.bind(superThis), false);
    }
}