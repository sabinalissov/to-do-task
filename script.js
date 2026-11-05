
const form = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const addToListBtn = document.getElementById('add-to-list-btn');
const taskList = document.getElementById('task-list');

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const taskText = taskInput.value.trim();

    if (taskText === "") {
        return;
    }

    const listItem = document.createElement('li');

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";

    checkbox.addEventListener("change", function() {
        listItem.classList.toggle("completed");
    });

    const span = document.createElement("span");
    span.textContent = taskText;

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.type = "button";

    deleteButton.addEventListener("click", function() {
        listItem.remove();
    });

    listItem.appendChild(checkbox);
    listItem.appendChild(span);
    listItem.appendChild(deleteButton);

    taskList.appendChild(listItem);

    taskInput.value = "";

    console.log("Task added:", taskText);
});
