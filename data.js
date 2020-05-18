class data {

	constructor(stimuliname){
		var array = null;
		var superThis = this;
		this.users = [];

		this.totalEntries = 0;

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
			}

			currentUser.addEntry(new dataEntry(array[i], currentUser));
		}

		currentUser.fill();
	}
}

class dataUser {
	constructor(username){
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

		console.log(this.mintime, this.maxtime);
	}

}

class dataEntry {
	constructor(array, user){
		this.user = user;
		this.x = array['mappedfixationpointx'];
		this.y = array['mappedfixationpointy'];
		this.time = array['timestamp'];
	}
}


