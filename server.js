const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static('web'));

let todos = [
  { id: 1, text: "Buy milk", done: false }
];
let nextId = 2;

app.get('/api/todos', (req, res) => {
  res.status(200).json(todos);
});

app.post('/api/todos', (req, res) => {
  const { text } = req.body;
  if (!text || typeof text !== 'string' || text.trim() === '') {
    return res.status(400).json({ error: 'Text is required' });
  }
  const newTodo = { id: nextId++, text: text.trim(), done: false };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

app.patch('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const todo = todos.find(t => t.id === id);
  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  const { text, done } = req.body;
  if (text !== undefined) {
    if (typeof text !== 'string' || text.trim() === '') {
      return res.status(400).json({ error: 'Text cannot be empty' });
    }
    todo.text = text.trim();
  }
  if (done !== undefined) {
    todo.done = Boolean(done);
  }
  res.status(200).json(todo);
});

app.delete('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = todos.findIndex(t => t.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  todos.splice(index, 1);
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
