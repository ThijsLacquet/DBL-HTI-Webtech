/*
*   Author: Thijs Lacquet
*/

/*
* Creates amount colors on the HSL scale with an equal seperation in hue
*
* @param {number} amount - Amount of colors to generate
* @returns {hsl array} colors
* @throws {IllegalArgumentException} If amount is not a number, or if amount < 0
*/
function createColors(amount) {
    if (typeof(amount) != "number") {
        throw("IllegalArgumentException");
    }

    if (amount < 0) {
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
    return colors;
}

/*
* Draws the area's of interest on the context of the canvas
* 
* @param ctx - Context of the canvas
* @param {{x1, x2, y1, y2} aoi array} - Coordinates of the edges of the area's of interest
* @param {hsl array} colors - Colors of the area's of interest
* @throws {IllegalArgumentException} If aoi.length != colors.length
*/
function drawAoi(ctx, aoi, colors) {
    if (aoi.length != colors.length) {
        throw("IllegalArgumentException");
    }

    for(var i = 0; i < aoi.length; i++) {
        ctx.beginPath();
        ctx.rect(aoi[i].x1, aoi[i].y1, aoi[i].x2 - aoi[i].x1, aoi[i].y2 - aoi[i].y1);
        
        //Stroke
        ctx.globalAlpha = 1;
        ctx.strokeStyle = colors[i];
        ctx.lineWidth = 5;
        ctx.stroke();

        //Fill
        ctx.globalAlpha = 0.1;
        ctx.fillStyle = colors[i];
        ctx.fill();
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
function isInAoi(currentAoi, currentPointX, currentPointY) {
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