class data {

	constructor(stimuliname){
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
		});
	}

	interpret(array){
		var currentUser;
		var currentName = null;

		for(var i=0;i<this.totalEntries;i++){
			if(array[i].user != currentName){
				if(currentUser !=  null){
					currentUser.fill();
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

	selectUsers(users){
		if(typeof(users) == "object"){
			for(var i=0;i<this.numofUsers;i++){

				this.users[i].enabled = false;

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
					this.users[i].enabled = false;
				}
			}
		}
	}

	toHeatmapformat(filtered){
		var x = [];
		var y = [];
		var dt = [];

		if(filtered){
			for(var i=0;i<this.numofUsers;i++){
				if(this.users[i].enabled == false){
					continue;
				}

				for(var j=0;j<this.users[i].numofEntries;j++){
					if(this.users[i].entries[j].enabled == false){
						continue;
					}

					x.push(this.users[i].entries[j].x);
					y.push(this.users[i].entries[j].y);
					dt.push(this.users[i].entries[j].duration);
				}
			}
		}else{
			x = Array(this.totalEntries);
			y = Array(this.totalEntries);
			dt = Array(this.totalEntries);

			var k = 0;

			for(var i=0;i<this.numofUsers;i++){
				for(var j=0;j<this.users[i].numofEntries;j++){
					x[k] = this.users[i].entries[j].x;
					y[k] = this.users[i].entries[j].y;
					dt[k] = this.users[i].entries[j].duration;
					k++;
				}
			}
		}

		return [x, y, dt];
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

	fill(){
		this.mintime = this.entries[0].time;
		this.maxtime = this.entries[this.numofEntries - 1].time;
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


