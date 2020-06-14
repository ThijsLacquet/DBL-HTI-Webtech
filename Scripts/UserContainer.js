/*
* Author: Thijs Lacquet
*/

class UserContainer {
    constructor(userContainerID) {
        this.userContainerID = userContainerID;
        userContainerID.innerHTML = '<a> Users are not loaded yet</a>';
    }

    draw(data) {
        delete this.DraggableUsers;
        this.DraggableUsers = Array(data.numofUsers);

        var tempHtml = "";

        if (data.numofUsers == 0) {
            this.userContainerID.innerHTML = '<a>No users are available</a>';
        }

        for (var i = 0; i < data.numofUsers; i++) {
            tempHtml = tempHtml + '<a id="draggableUser' + i + '" draggable="true"></a>';
        }
        this.userContainerID.innerHTML = tempHtml;

        for (var i = 0; i < data.numofUsers; i++) {
            var draggableUserElement = document.getElementById('draggableUser' + i);
            this.DraggableUsers[i] = new DraggableUser(draggableUserElement, data, i);

            if (data.users[i].enabled) {
                draggableUserElement.className = "userEnabled";
            } else {
                draggableUserElement.className = "userDisabled";
            }

        }
    }
}
