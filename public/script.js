const form = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const addToListBtn = document.getElementById('add-to-list-btn');
const taskList = document.getElementById('task-list');
function renderTodo(todo) {
    const listItem = document.createElement('li');
    listItem.dataset.id = todo.id;
    if (todo.done) {
        listItem.classList.add('completed');
    }
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.done;
    checkbox.addEventListener('change', async function () {
        const newDone = checkbox.checked;
        try {
            const response = await fetch(`/api/todos/${todo.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ done: newDone })
            });
            if (!response.ok) {
                throw new Error(`Failed to update todo: ${response.status}`);
            }
            const updatedTodo = await response.json();
            listItem.classList.toggle('completed', updatedTodo.done);
        } catch (error) {
            console.error('Error updating todo:', error);
            checkbox.checked = !newDone; // Revine la starea anterioară dacă a eșuat
        }
    });
    const span = document.createElement('span');
    span.textContent = todo.text;
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.type = 'button';
    deleteButton.addEventListener('click', async function () {
        try {
            const response = await fetch(`/api/todos/${todo.id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error(`Failed to delete todo: ${response.status}`);
            }

            listItem.remove();
        } catch (error) {
            console.error('Error deleting todo:', error);
        }
    });
    listItem.appendChild(checkbox);
    listItem.appendChild(span);
    listItem.appendChild(deleteButton);
    taskList.appendChild(listItem);
}
async function loadTodos() {
    try {
        const response = await fetch('/api/todos');
        if (!response.ok) {
            throw new Error(`Failed to load todos: ${response.status}`);
        }
        const todos = await response.json();
        taskList.innerHTML = '';
        todos.forEach(renderTodo);
    } catch (error) {
        console.error('Error loading todos:', error);
    }
}
form.addEventListener('submit', async function (event) {
    event.preventDefault();
    const taskText = taskInput.value.trim();
    if (taskText === '') {
        return;
    }
    try {
        const response = await fetch('/api/todos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: taskText })
        });

        if (!response.ok) {
            throw new Error(`Failed to add todo: ${response.status}`);
        }
        const newTodo = await response.json();
        renderTodo(newTodo);
        taskInput.value = '';
    } catch (error) {
        console.error('Error adding todo:', error);
    }
});

loadTodos();