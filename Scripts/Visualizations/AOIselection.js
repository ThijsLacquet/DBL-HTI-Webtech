class AOIselection {

	constructor(){

		this.numofAOIs = 0;

		this.Xfactor = document.getElementById("aoiImage").naturalWidth / document.getElementById("aoiImage").clientWidth;
		this.Yfactor = document.getElementById("aoiImage").naturalHeight / document.getElementById("aoiImage").clientHeight;

		this.SVG = d3.select("#AOISelection").style("position","relative").append("svg")
			.style("width", "100%").style("height", "100%")
			.style("position", "absolute")
			.style("top", 0).style("left", 0)
			.style("z-index", 2);

		this.baseColor = Math.floor(Math.random() * 360);
		this.currAOI;
		this.currColor;
		this.startx;
		this.starty;
		this.colors;

		this.nom = 1;
		this.denom = 2;

		var superThis = this;

		var AOImaker = d3.drag()
		.on("start", function(){
			superThis.Created = false;
			superThis.startx = d3.event.x;
			superThis.starty = d3.event.y;
		})
		.on("drag", function(){
			var x = d3.event.x;
			var y = d3.event.y;

			if(superThis.Created == false){
				if(Math.abs(x - superThis.startx) > 10 || Math.abs(y - superThis.starty) > 10){
					superThis.addAOI();
				}
			}else{
				superThis.currAOI
					.attr("points", superThis.startx+", "+superThis.starty+" "+superThis.startx+", "+y+" "+x+", "+y+" "+x+", "+superThis.starty);
			}
		})
		.on("end", function(){
			superThis.index();
		});


		AOImaker(this.SVG);
	}


	//adds an extra AOI
	addAOI(){

		this.numofAOIs++;
		this.Created = true;

		var superThis = this;

		var g = this.SVG.append("g");
		g.append("text")
			.attr("x", this.startx)
			.attr("y", this.starty)
			.attr("font-size", "3rem");
		this.currAOI = g.append("polygon")
			.style("stroke",	"hsl(0, 0%, 50%)")
			.style("fill",		"hsla(0, 0%, 50%, 0.3)");

		this.currAOI.on("click", function(){
			this.parentNode.remove();
			superThis.numofAOIs--;
			superThis.index();
		});


	}

	//this recolors all AOIs
	index(){
		if(this.numofAOIs == 0){
			return;
		}

		this.createColors(this.numofAOIs);

		var superThis = this;


		this.SVG.selectAll("g").select("polygon")
			.style("stroke", function(d, i){
				return superThis.colors[i]
			})
			.style("fill", function(d, i){
				return "hsla"+superThis.colors[i].slice(3, -1) + ", 0.3)";
			})
	}

	//returns the coordinates of all AOIs
	getcoords(){
		var coords = [];

		var superThis = this;

		this.SVG.selectAll("g").select("polygon").each(function(){
			coords.push(
				{
					x1: this.points.getItem(0).x * superThis.Xfactor,	y1: this.points.getItem(0).y * superThis.Yfactor,
				 	x2: this.points.getItem(2).x * superThis.Xfactor,	y2: this.points.getItem(2).y * superThis.Yfactor
				});
		})

		return coords
	}

	//by Thijs
	//Creates an array of colors that are equidistant 
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
}