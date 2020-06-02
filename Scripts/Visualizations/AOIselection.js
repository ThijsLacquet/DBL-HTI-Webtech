var numofAOIs = 1;

function addAOI() {
	var form = document.getElementById("AOIform");

	form.innerHTML += '<input type="number" name="xmin'+numofAOIs+'" min="0"><input type="number" name="xmax'+numofAOIs+'" min="0"><input type="number" name="ymin'+numofAOIs+'" min="0"><input type="number" name="ymax'+numofAOIs+'" min="0"><br>'
}
var Xfactor = document.getElementById("image").naturalWidth / document.getElementById("image").clientWidth;
var Yfactor = document.getElementById("image").naturalHeight / document.getElementById("image").clientHeight;

var SVG = d3.select("#AOISelection").style("position","relative").append("svg")
	.style("width", "100%").style("height", "100%")
	.style("position", "absolute")
	.style("top", 0).style("left", 0)
	.style("z-index", 2);

var baseColor = Math.floor(Math.random() * 360);
var currAOI;
var currColor;
var startx, starty;
var Created

var AOImaker = d3.drag()
.on("start", function(){
	Created = false;
	startx = d3.event.x;
	starty = d3.event.y;
	currColor = Math.floor(getNextDistFrac() * 360) + baseColor;
})
.on("drag", function(){
	var x = d3.event.x;
	var y = d3.event.y;

	if(Created == false){
		if(Math.abs(x - startx) > 10 || Math.abs(y - starty) > 10){
			var g = SVG.append("g");
			g.append("text")
				.attr("x", startx)
				.attr("y", starty)
				.attr("font-size", "3rem");
			currAOI = g.append("polygon")
				.style("stroke", "hsl("+currColor+", 100%, 50%)")
				.style("fill", "hsla("+currColor+", 100%, 50%, 0.3)");

			currAOI.on("click", function(){
				this.parentNode.remove();
				index();
				coordsShow(getcoords());
			})

			Created = true;
		}
	}else{
		currAOI
			.attr("points", startx+", "+starty+" "+startx+", "+y+" "+x+", "+y+" "+x+", "+starty);
	}
})
.on("end", function(){
	index();
	coordsShow();
});


AOImaker(SVG);

var nom = 1;
var denom = 2;

function getNextDistFrac(){
	var frac = nom/denom;

	if(nom == denom - 1){
		nom = 1;
		denom *= 2;
	}

	if(nom < denom/2){
		nom += denom/2;
	}else{
		nom += 2 - denom/2;
	}

	return frac;
}

function index(){
	SVG.selectAll("g").select("text").text(function(d, i){
		return i + 1;
	})
}

function getcoords(){
	var coords = [];

	SVG.selectAll("g").select("polygon").each(function(){
		coords.push(
			[this.points.getItem(0).x * Xfactor, this.points.getItem(0).y * Yfactor,
			this.points.getItem(2).x * Xfactor, this.points.getItem(2).y * Yfactor]
			);
	})

	return coords
}

function coordsShow(){

	d3.select("#AOIShow")
		.text("")
		.selectAll("li")
		.data(getcoords())
		.enter()
		.append("li")
		.text(function(d){
			return d;
		})
}