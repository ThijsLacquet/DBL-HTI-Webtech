/*
* Author: Thijs Lacquet
*/

class UserContainer {
    constructor(userContainerID) {
        this.userContainerID = userContainerID;
        userContainerID.innerHTML = '<a> Users are not loaded yet</a>';
    }

    draw(data) {
        this.data = data;
        delete this.DraggableUsers;
        this.DraggableUsers = Array(data.numofUsers);

        var tempHtml = '<a id="userEnableAll" class="userAll">Enable all users</a> ';
        var tempHtml = tempHtml + '<a id="userDisableAll" class="userAll">Disable all users</a> ';

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

            if (data.users[i].getEnabled()) {
                draggableUserElement.className = "userEnabled";
            } else {
                draggableUserElement.className = "userDisabled";
            }

        }

        //Make userAll button work
        var userEnableAll = document.getElementById('userEnableAll');
        var userDisableAll = document.getElementById('userDisableAll');

        userEnableAll.onclick = function() {
            event.preventDefault();
            this.data.enableAllUsers(true);
            this.data.update();
        }.bind(this);

        userDisableAll.onclick = function() {
            event.preventDefault();
            this.data.enableAllUsers(false);
            this.data.update();
        }.bind(this);
    }
}
