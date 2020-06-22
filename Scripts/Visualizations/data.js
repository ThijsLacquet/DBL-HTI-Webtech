//By Nathan
class data {

	//the constuctor makes a new instance of this data object
	//Parameters:
	//	stimuliname: the name of the picture and the corresponding fixationdata
	constructor(stimuliname, callback, init){
		this.imagename = stimuliname;
		var array = null;
		var superThis = this;
		this.users = [];

		this.callback = callback;
		this.firstinit = init;

		this.AOIs = [];

		this.totalEntries = 0;
		this.numofUsers = 0;
		this.numofActiveUsers = 0;

		this.editedTime = true;
		this.editedX	= true;
		this.editedY	= true;
		this.editedDuration	= true;
		this.editedUser	= true;
		this.editedAOI	= true;

		$.post( "../Scripts/connecting.php", {stimuliPicture: stimuliname}, function( data ) {
			array = JSON.parse(data);
			if (data != "null") {
				superThis.totalEntries = array.length;

				if (array.length == 0) {
					throw("No data");
				}


				superThis.interpret(array);

				superThis.numofActiveUsers = superThis.numofUsers;
			}

			callback(superThis);
			init(superThis);
		});
	}

	//This function is called each time the data needs to be updated, for example if filters are applied
	update(){

		var currentUser;
		var maxt;
		this.maxtime = 0;

		for(var i=0;i<this.numofUsers;i++){
			currentUser = this.users[i];
			if(!currentUser.enabled){
				continue;
			}
			maxt = currentUser.fill();
			if(maxt > this.maxtime){
				this.maxtime = maxt;
			}
		}
		return this.callback(this);
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

		maxt = currentUser.fill();
		if(maxt > this.maxtime){
			this.maxtime = maxt;
		}
	}

	///Quite self-explanatory
	getmaxduration(){
		var currentUser;
		var currentEntry;


		var maxdt = 0;

		for(var i=0;i<this.numofUsers;i++){
			currentUser = this.users[i];
			if(!currentUser.enabled){
				continue;
			}

			for(var j=0;j<currentUser.numofEntries;j++){
				currentEntry = currentUser.entries[j];
				if(currentEntry.enabled){
					if(currentEntry.duration > maxdt){
						maxdt = currentEntry.duration;
					}
				}
			}
		}

		return maxdt;
	}

	setAOIs(AOIs){
		this.AOIs = AOIs;
	}

	addAOI(AOI){
		this.AOIs = AOI;
	}

	getAOIs(){
		return this.AOIs;
	}

	//returns the time-stamp of each data entry
	getTime(filtered = true){
		var array;

		if(filtered){
			/*if(!this.editedTime){
				return this.Time;
			}*/
			array = [];

			var currentUser;
			var currentEntry;

			for(var i=0;i<this.numofUsers;i++){
				currentUser = this.users[i];

				if(!currentUser.enabled){
					continue;
				}

				for(var j=0;j<currentUser.numofEntries;j++){
					currentEntry = currentUser.entries[j];

					if(!currentEntry.enabled){
						continue;
					}

					array.push(currentEntry.time);
				}
			}

			this.Time = array;
			this.editedTime = false;
		}else{
			array = Array(this.totalEntries);

			var currentUser;
			var currentEntry;

			var k = 0;

			for(var i=0;i<this.numofUsers;i++){
				currentUser = this.users[i];

				for(var j=0;j<currentUser.numofEntries;j++){
					currentEntry = currentUser.entries[j];

					array[k++] = currentEntry.time;
				}
			}
		}


		return array;
	}

	//returns the x coordinate of each data entry
	getX(filtered = true){
		var array;

		if(filtered){
			/*if(!this.editedX){
				return this.X;
			}*/
			array = [];

			var currentUser;
			var currentEntry;

			for(var i=0;i<this.numofUsers;i++){
				currentUser = this.users[i];

				if(!currentUser.enabled){
					continue;
				}

				for(var j=0;j<currentUser.numofEntries;j++){
					currentEntry = currentUser.entries[j];

					if(!currentEntry.enabled){
						continue;
					}

					array.push(currentEntry.x);
				}
			}

			this.X = array;
			this.editedX = false;
		}else{
			array = Array(this.totalEntries);

			var currentUser;
			var currentEntry;

			var k = 0;

			for(var i=0;i<this.numofUsers;i++){
				currentUser = this.users[i];

				for(var j=0;j<currentUser.numofEntries;j++){
					currentEntry = currentUser.entries[j];

					array[k++] = currentEntry.x;
				}
			}
		}

		return array;
	}

	//returns the y coordinate of each data entry
	getY(filtered = true){
		var array;

		if(filtered){
			/*if(!this.editedY){
				return this.Y;
			}*/
			array = [];

			var currentUser;
			var currentEntry;

			for(var i=0;i<this.numofUsers;i++){
				currentUser = this.users[i];

				if(!currentUser.enabled){
					continue;
				}

				for(var j=0;j<currentUser.numofEntries;j++){
					currentEntry = currentUser.entries[j];

					if(!currentEntry.enabled){
						continue;
					}

					array.push(currentEntry.y);
				}
			}

			this.Y = array;
			this.editedY = false;
		}else{
			array = Array(this.totalEntries);

			var currentUser;
			var currentEntry;

			var k = 0;

			for(var i=0;i<this.numofUsers;i++){
				currentUser = this.users[i];

				for(var j=0;j<currentUser.numofEntries;j++){
					currentEntry = currentUser.entries[j];

					array[k++] = currentEntry.y;
				}
			}
		}

		return array;
	}

	//returns the fixation duration of each data entry
	getDuration(filtered = true){
		var array;

		if(filtered){
			/*if(!this.editedDuration){
				return this.duration;
			}*/
			array = [];

			var currentUser;
			var currentEntry;

			for(var i=0;i<this.numofUsers;i++){
				currentUser = this.users[i];

				if(!currentUser.enabled){
					continue;
				}

				for(var j=0;j<currentUser.numofEntries;j++){
					currentEntry = currentUser.entries[j];

					if(!currentEntry.enabled){
						continue;
					}

					array.push(currentEntry.duration);
				}
			}

			this.duration = array;
			this.editedDuration = false;
		}else{
			array = Array(this.totalEntries);

			var currentUser;
			var currentEntry;

			var k = 0;

			for(var i=0;i<this.numofUsers;i++){
				currentUser = this.users[i];

				for(var j=0;j<currentUser.numofEntries;j++){
					currentEntry = currentUser.entries[j];

					array[k++] = currentEntry.duration;
				}
			}
		}

		return array;
	}

	//returns the user of each data entry
	getUser(filtered = true){
		var array;

		if(filtered){
			if(!this.editedUser){
				return this.user;
			}
			array = [];

			var currentUser;
			var currentEntry;

			for(var i=0;i<this.numofUsers;i++){
				currentUser = this.users[i];

				if(!currentUser.enabled){
					continue;
				}

				for(var j=0;j<currentUser.numofEntries;j++){
					currentEntry = currentUser.entries[j];

					if(!currentEntry.enabled){
						continue;
					}

					array.push(currentEntry.user.name);
				}
			}

			this.user = array;
			this.editedUser = false;
		}else{
			array = Array(this.totalEntries);

			var currentUser;
			var currentEntry;

			var k = 0;

			for(var i=0;i<this.numofUsers;i++){
				currentUser = this.users[i];

				for(var j=0;j<currentUser.numofEntries;j++){
					currentEntry = currentUser.entries[j];

					array[k++] = currentEntry.user.name;
				}
			}
		}

		return array;
	}

	//returns the AOI index of each data entry
	getAOI(filtered = true){
		var array;

		if(filtered){
			if(!this.editedAOI){
				return this.AOI;
			}
			array = [];

			var currentUser;
			var currentEntry;

			for(var i=0;i<this.numofUsers;i++){
				currentUser = this.users[i];

				if(!currentUser.enabled){
					continue;
				}

				for(var j=0;j<currentUser.numofEntries;j++){
					currentEntry = currentUser.entries[j];

					if(!currentEntry.enabled){
						continue;
					}

					array.push(currentEntry.AOI);
				}
			}

			this.AOI = array;
			this.editedAOI = false;
		}else{
			array = Array(this.totalEntries);

			var currentUser;
			var currentEntry;

			var k = 0;

			for(var i=0;i<this.numofUsers;i++){
				currentUser = this.users[i];

				for(var j=0;j<currentUser.numofEntries;j++){
					currentEntry = currentUser.entries[j];

					array[k++] = currentEntry.AOI;
				}
			}
		}

		return array;
	}

	//this function selects the users that you want to be selected
	//Parameters:
	//	users: either a name of a user (string) or a array of names
	//	append: a bool, that determinds if the users will be append to the current selection, or if the selection will be reset
	selectUsers(users, append){
		this.editedTime = true;
		this.editedX	= true;
		this.editedY 	= true;
		this.editedDuration	= true;
		this.editedUser	= true;
		this.editedAOI	= true;

		if(!append){
			this.numofActiveUsers = 0;
		}


		if(typeof(users) == "object"){
			for(var i=0;i<this.numofUsers;i++){

				if(!append){
					this.users[i].enabled = false;
				}

				for(var j=0;j<users.length;j++){
					if(this.users[i].name == users[j]){
						if(!this.users[i].enabled){
							this.numofActiveUsers++;
						}

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

			this.numofActiveUsers++;
		}
	}

	/*
	* Switches the order of two users
	* Author: Thijs Lacquet
	*/
	switchUsers(user1, user2) {
		var temp = this.users[user2];
		this.users[user2] = this.users[user1];
		this.users[user1] = temp;

		this.editedX = true;
		this.editedY = true;
		this.editedDuration = true;
		this.editedTime = true;
		this.editedUser = true;
	}

	/*
	* Enabled or disables all users
	* Author: Thijs Lacquet
	*/
	enableAllUsers(enabled) {
		for(var user of this.users) {
			user.setEnabled(enabled);
		}
	}

	/*
	* Author: Nathan
	 */
	//this filters the data base on the function parameter
	//Parameters:
	//	func: a function with the follow requirements:
	//		Parameters:
	//			class dataEntry: the entry that can either by filtered out or not 
	//		Return value:
	//			bool: weither it is filtered out or not (true => it stays in the data, false => it is removed from the data)
	filter(func, append){
		this.editedTime = true;
		this.editedX	= true;
		this.editedY 	= true;
		this.editedDuration	= true;
		this.editedUser	= true;
		this.editedAOI	= true;

		for(var i=0;i<this.numofUsers;i++){
			for(var j=0;j<this.users[i].numofEntries;j++){
				if(func(this.users[i].entries[j])){
					if(!append){
						this.users[i].entries[j].enabled = true;
					}
				}else{
					this.users[i].entries[j].enabled = false;
				}
			}
		}
	}

	//this resets the filter
	resetfilter(){
		this.numofActiveUsers = this.numofUsers;

		for(var i=0;i<this.numofUsers;i++){
			this.users[i].enabled = true;
			for(var j=0;j<this.users[i].numofEntries;j++){
				this.users[i].entries[j].enabled = true;
			}
		}
	}

	resetentryfilter(){
		this.numofActiveUsers = this.numofUsers;

		for(var i=0;i<this.numofUsers;i++){
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
		this.minTime = min;
		this.maxTime = max;

		this.filter(function(x){
			if((min < x.time) && (x.time < max)){
				return true;
			}else{
				return false;
			}
		}, true);
	}

	//filters the data on the duration
	//Parameters:
	//	min: the minimal duration
	//	max: the maximal duration
	durationRange(min, max){
		this.minDuration = min;
		this.maxDuration = max;

		this.filter(function(x){
			if((min < x.duration) && (x.duration < max)){
				return true;
			}else{
				return false;
			}
		}, true);
	}

	//for each data entry this function sets the AOI aspect to the index of the AOI in which it belongs. If it belong in no AOI then it is set to 0.
	divideInAOIs(){
		this.editedAOI = true;

		var AOIs = this.getAOIs();

		for(var i=0;i<this.numofUsers;i++){
			if(this.users[i].enabled){
				this.users[i].divideInAOIs(AOIs);
			}
		}
	}
}

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

	/*
	* Enables or disables a single user
	* Author: Thijs Lacquet
 	*/
	setEnabled(enabled) {
		this.enabled = enabled;
	}

	/*
	* Checks whether this user is enabled
	* Author: Thijs Lacquet
	 */
	getEnabled() {
		return this.enabled;
	}

	//This sets the maxtime field to the maximum time of this user, it also removes the offset from all the entries, such that it starts at 0. I dont know why I called this fill.
	fill(){
		var offset = this.entries[0].time;
		var LastEntry = null;

		for(var i=0;i<this.numofEntries;i++){
			if(this.entries[i].enabled){
				LastEntry = this.entries[i];
				LastEntry.time -= offset;
			}
		}

		if(LastEntry == null){
			this.maxtime = 0;
			return 0;
		}

		return this.maxtime = LastEntry.time;
	}

	//for each data entry this function sets the AOI aspect to the index of the AOI in which it belongs. If it belong in no AOI then it is set to 0.
	divideInAOIs(AOIs){
		
		var currentEntry;

		for(var i=0;i<this.numofEntries;i++){
			currentEntry = this.entries[i];
			if(currentEntry.enabled){
				currentEntry.AOI = 0;

				for(var j=0;j<AOIs.length;j++){
					if(currentEntry.isInAOI(AOIs[j])){
						currentEntry.AOI = j + 1;
						break;
					}
				}
			}
		}
	}

	//gets time of each data entry
	getTime(filtered = true){
		var array;

		if(filtered){

			array = [];

			var currentEntry;

			for(var i=0;i<this.numofEntries;i++){
				currentEntry = this.entries[i];

				if(!currentEntry.enabled){
					continue;
				}

				array.push(currentEntry.time);
			}
		}else{

			array = Array(this.numofEntries);

			for(var i=0;i<this.numofEntries;i++){
				array[i] = this.entries[i].time;
			}
		}

		return array;
	}

	//gets X coordinate of each data entry
	getX(filtered = true){
		var array;

		if(filtered){

			array = [];

			var currentEntry;

			for(var i=0;i<this.numofEntries;i++){
				currentEntry = this.entries[i];

				if(!currentEntry.enabled){
					continue;
				}

				array.push(currentEntry.x);
			}
		}else{

			array = Array(this.numofEntries);

			for(var i=0;i<this.numofEntries;i++){
				array[i] = this.entries[i].x;
			}
		}

		return array;
	}

	//gets Y coordinate of each data entry
	getY(filtered = true){
		var array;

		if(filtered){

			array = [];

			var currentEntry;

			for(var i=0;i<this.numofEntries;i++){
				currentEntry = this.entries[i];

				if(!currentEntry.enabled){
					continue;
				}

				array.push(currentEntry.y);
			}
		}else{

			array = Array(this.numofEntries);

			for(var i=0;i<this.numofEntries;i++){
				array[i] = this.entries[i].y;
			}
		}

		return array;
	}

	//gets fixation duration of each data entry
	getDuration(filtered = true){
		var array;

		if(filtered){

			array = [];

			var currentEntry;

			for(var i=0;i<this.numofEntries;i++){
				currentEntry = this.entries[i];

				if(!currentEntry.enabled){
					continue;
				}

				array.push(currentEntry.duration);
			}
		}else{

			array = Array(this.numofEntries);

			for(var i=0;i<this.numofEntries;i++){
				array[i] = this.entries[i].duration;
			}
		}

		return array;
	}

	//gets AOI index of each data entry
	getAOI(filtered = true){
		var array;

		if(filtered){

			array = [];

			var currentEntry;

			for(var i=0;i<this.numofEntries;i++){
				currentEntry = this.entries[i];

				if(!currentEntry.enabled){
					continue;
				}

				array.push(currentEntry.AOI);
			}
		}else{

			array = Array(this.numofEntries);

			for(var i=0;i<this.numofEntries;i++){
				array[i] = this.entries[i].AOI;
			}
		}

		return array;
	}
}

class dataEntry {
	constructor(array, user){
		this.AOI = 0;
		this.enabled = true;
		this.user = user;
		this.x = Number(array['mappedfixationpointx']);
		this.y = Number(array['mappedfixationpointy']);
		this.time = Number(array['timestamp']);
		this.duration = Number(array['fixationduration']);
	}

	//checks if this entry is in a certain AOI
	isInAOI(AOI) {
	    return ((AOI.x1 < this.x && AOI.x2 > this.x) || (AOI.x2 < this.x && AOI.x1 > this.x))
	    	&& ((AOI.y1 < this.y && AOI.y2 > this.y) || (AOI.y2 < this.y && AOI.y1 > this.y));
	}
}


