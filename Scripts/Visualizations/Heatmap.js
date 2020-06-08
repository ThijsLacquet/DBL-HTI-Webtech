/*
*   Author: Thijs Lacquet
*/

class Heatmap extends Visualization {
    constructor(canvas, img, slider) {
        super(canvas, img);
        this.radius = 40;

        var superThis = this;

        slider.addEventListener('change', function() {
            superThis.setRadius(slider.value);
        }.bind(superThis), false);
    }

    /*
    * Creates a matrix which contains the intensity of every pixel
    */
    createMatrix() {
        //Create two dimensional array for every pixel
        var data = new Array(this.width);
        this.maxHeat = 0;
        for (var x = 0; x < this.width; x++) {
            data[x] = new Array(this.height);
            for (var y = 0; y < this.height; y++) {
                data[x][y] = 0;
            }
        }

        //Scale points to local size
        var pX = new Array(this.mappedFixationPointX.length);
        var pY = new Array(this.mappedFixationPointY.length);

        for (var i = 0; i < this.mappedFixationPointX.length; i++) {
            pX[i] = this.mappedFixationPointX[i] * this.widthScale;
            pY[i] = this.mappedFixationPointY[i] * this.heightScale;
        }

        for (var i = 0; i < pX.length; i++) {
            for (var x = Math.round(pX[i] - this.radius); (x < pX[i] + this.radius) && (x < this.width); x++) {
                for (var y = Math.round(pY[i] - this.radius); y < pY[i] + this.radius && y < this.height; y++) {
                    var distance = Math.sqrt(Math.pow(pX[i] - x, 2) + Math.pow(pY[i] - y, 2));

                    if (distance < this.radius && x >= 0 && y >= 0) {
                        data[x][y] = data[x][y] + ((1 - distance / this.radius) * this.duration[i]);
                        if (data[x][y] > this.maxHeat) {
                            this.maxHeat = data[x][y];
                        }
                    }
                }
            }
        }
        this.data = data;
    }

    setData(d) {
        this.aoi = d.getAOIs();
        this.mappedFixationPointX = d.getX();
        this.mappedFixationPointY = d.getY();
        this.duration = d.getDuration();
    }

    /*
    * Creates an array of amount colors, gradually going from red to yellow to green.
    */
    createColors(amount) {
        var colors = new Array(amount);
        
        var deltaColor = 255 / amount * 2;

        for (var i = 0; i < amount / 2; i++) {
            colors[i] = `rgb(255,${Math.round(deltaColor * i)},0)`;
        }
        for (var i = amount / 2; i < amount; i++) {
            colors[i] = `rgb(${Math.round(255 - deltaColor * (i - amount / 2))},255,0)`;
        }
        this.colors = colors;        
    }

    /*
    * Draws the visualization.
    */
    drawIfLoaded() {
        super.drawIfLoaded();

        var nColors = 100;
        
        this.createMatrix();
        this.createColors(nColors);

        this.ctx.globalAlpha = 0.5;

        for (var x = 0; x < this.width; x++) {
            for (var y = 0; y < this.height; y++) {
                var intensity = Math.round(this.data[x][y] / this.maxHeat * nColors);

                this.ctx.beginPath();
                this.ctx.fillStyle = this.colors[intensity];
                this.ctx.rect(x, y, 1, 1);
                this.ctx.fill();
            }
        }
    }

    /*
    * Sets the radius of the visualizations and redraws the visualization.
    */
    setRadius(radius) {
        this.radius = radius;
        this.clearVisualization();
        this.draw();
    }
}