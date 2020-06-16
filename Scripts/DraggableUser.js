/*
* Author: Thijs Lacquet
 */

class DraggableUser{
    constructor(draggableElement, data, i) {
        this.data = data;
        this.index = i;
        this.draggableElement = draggableElement;

        this.draw();

        draggableElement.getDraggableUser = function() {
            return this;
        }.bind(this);

        draggableElement.ondragstart = function(){this.ondragstartEvent();}.bind(this);
        draggableElement.ondragover = function(){this.ondragoverEvent();}.bind(this);
        draggableElement.ondrop = function(){this.ondropEvent();}.bind(this);
        draggableElement.onclick = function(){this.onclickEvent();}.bind(this);
    }

    ondragstartEvent() {
        event.dataTransfer.setData("id", event.target.id);
    }

    ondragoverEvent() {
        event.preventDefault();
    }

    ondropEvent() {
        event.preventDefault();
        var data = event.dataTransfer.getData("id");

        var droppedFrom = document.getElementById(data);
        var droppedFromDraggableUser = droppedFrom.getDraggableUser();

        this.data.switchUsers(this.index, droppedFromDraggableUser.index);
        this.data.update();
        this.draw();
        droppedFromDraggableUser.draw();
    }

    onclickEvent() {
        var user = this.data.users[this.index];
        if (user.getEnabled()) {
            user.setEnabled(false);
        } else {
            user.setEnabled(true);
        }
        this.data.update();
    }

    draw() {
        this.draggableElement.innerHTML = this.data.users[this.index].name;
    }
}