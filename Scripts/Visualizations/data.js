//By Nathan
class data {

	//the constuctor makes a new instance of this data object
	//Parameters:
	//	stimuliname: the name of the picture and the corresponding fixationdata
	constructor(stimuliname, callback){
		var array = null;
		var superThis = this;
		this.users = [];

		this.AOIs = [];

		this.totalEntries = 0;
		this.numofUsers = 0;

		$.post( "../connecting.php", {stimuliPicture: stimuliname}, function( data ) {
			array = JSON.parse(data);
			superThis.totalEntries = array.length;

			superThis.interpret(array);

			callback();
		});
	}

	//a function that is called to interpret the data from the server and add it to this data structure
	//Parameters:
	//	array: this is the JSON parsed output of the file connecting.php
	interpret(array){
		var currentUser;
		var currentName = null;

		this.maxtime = 0;
		var maxt;


		for(var i=0;i<this.totalEntries;i++){
			if(array[i].user != currentName){
				if(currentUser !=  null){
					maxt = currentUser.fill();
					if(maxt > this.maxtime){
						this.maxtime = maxt;
					}
				}
				currentName = array[i].user;
				currentUser = new dataUser(currentName);
				this.users.push(currentUser);
				this.numofUsers++;
			}

			currentUser.addEntry(new dataEntry(array[i], currentUser));
		}

		currentUser.fill();
	}

	setAOIs(AOIs){
		this.AOIs = AOIs;
	}

	getAOIs(){
		return this.AOIs;
	}


	//this function selects the users that you want to be selected
	//Parameters:
	//	users: either a name of a user (string) or a array of names
	//	append: a bool, that determinds if the users will be append to the current selection, or if the selection will be reset
	selectUsers(users, append){
		if(typeof(users) == "object"){
			for(var i=0;i<this.numofUsers;i++){

				if(!append){
					this.users[i].enabled = false;
				}

				for(var j=0;j<users.length;j++){
					if(this.users[i].name == users[j]){
						this.users[i].enabled = true;
						break;
					}
				}
			}
		}else{
			for(var i=0;i<this.numofUsers;i++){
				if(this.users[i].name == users){
					this.users[i].enabled = true;
				}else{
					if(!append){
						this.users[i].enabled = false;
					}
				}
			}
		}
	}
	//this filters the data base on the function parameter
	//Parameters:
	//	func: a function with the follow requirements:
	//		Parameters:
	//			class dataEntry: the entry that can either by filtered out or not 
	//		Return value:
	//			bool: weither it is filtered out or not (true => it stays in the data, false => it is removed from the data)
	filter(func){
		for(var i=0;i<this.numofUsers;i++){
			for(var j=0;j<this.users[i].numofEntries;j++){
				if(func(this.users[i].entries[j])){
					this.users[i].entries[j].enabled = true;
				}else{
					this.users[i].entries[j].enabled = false;
				}
			}
		}
	}

	//this resets the filter
	resetfilter(){
		for(var i=0;i<this.numofUsers;i++){
			this.users[i].enabled = true;
			for(var j=0;j<this.users[i].numofEntries;j++){
				this.users[i].entries[j].enabled = true;
			}
		}
	}

	//filters the data on the time
	//Parameters:
	//	min: the minimal time
	//	max: the maximal time
	timeRange(min, max){
		this.filter(function(x){
			if((min < x.time) && (x.time < max)){
				return true;
			}else{
				return false;
			}
		});
	}

	//filters the data on the duration
	//Parameters:
	//	min: the minimal duration
	//	max: the maximal duration
	durationRange(min, max){
		this.filter(function(x){
			if((min < x.duration) && (x.duration < max)){
				return true;
			}else{
				return false;
			}
		});
	}

	//This return the data in the format the heatmap can use
	//Parameters:
	//	filtered: a bool, true gives the filtered data, false gives all the data
	//Return value:
	//	[x, y, dt]
	//		x: an array of x-coordinates
	//		y: an array of y-coordinates
	//		dt: an array of durations

class dataUser {
	constructor(username){
		this.enabled = true;
		this.name = username;
		this.entries = [];
		this.numofEntries = 0;
	}

	addEntry(entry){
		this.numofEntries++;
		this.entries.push(entry);
	}

	fill(){
		var offset = this.entries[0].time;
		for(var i=0;i<this.numofEntries;i++){
			this.entries[i].time -= offset;
		}

		return this.maxtime = this.entries[this.numofEntries - 1].time;
	}

}

class dataEntry {
	constructor(array, user){
		this.enabled = true;
		this.user = user;
		this.x = Number(array['mappedfixationpointx']);
		this.y = Number(array['mappedfixationpointy']);
		this.time = Number(array['timestamp']);
		this.duration = Number(array['fixationduration']);
	}
}


