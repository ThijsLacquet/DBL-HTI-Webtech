/*
*   Author: Thijs Lacquet
*/

class Heatmap extends Visualization {
    constructor(canvas, img, width, height) {
        super(canvas, img, width, height);
    }

    /*
    * Creates a matrix which contains the intensity of every pixel
    */
    createMatrix(radius) {
        //Create two dimensional array for every pixel
        var data = new Array(this.width);
        this.maxHeat = 0;
        for (var x = 0; x < this.width; x++) {
            data[x] = new Array(this.height);
            for (var y = 0; y < this.height; y++) {
                data[x][y] = 0;
            }
        }

        var pX = this.mappedFixationPointX;
        var pY = this.mappedFixationPointY;
        for (var i = 0; i < pX.length; i++) {
            for (var x = pX[i] - radius; (x < pX[i] + radius) && (x < this.width); x++) {
                for (var y = pY[i] - radius; y < pY[i] + radius && y < this.height; y++) {
                    var distance = Math.sqrt(Math.pow(pX[i] - x, 2) + Math.pow(pY[i] - y, 2));

                    if (distance < radius && x >= 0 && y >= 0) {
                        data[x][y] = data[x][y] + ((1 - distance / radius) * this.duration[i]);
                        if (data[x][y] > this.maxHeat) {
                            this.maxHeat = data[x][y];
                        }
                    }
                }
            }
        }
        this.data = data;
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
    draw(src, mappedFixationPointX, mappedFixationPointY, duration) {
        this.duration = duration;
        super.draw(src, mappedFixationPointX, mappedFixationPointY);

        var nColors = 100;
        
        this.createMatrix(40);
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
}