const express = require("express");

const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// Logging Middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// In-memory data
let tasks = [
    { id: 1, title: "Study Node.js" },
    { id: 2, title: "Complete Express Practical" }
];

// GET All Tasks
app.get("/tasks", (req, res) => {
    res.status(200).json(tasks);
});

// POST Create Task
app.post("/tasks", (req, res) => {
    const { title } = req.body;

    const newTask = {
        id: tasks.length + 1,
        title
    };

    tasks.push(newTask);

    res.status(201).json(newTask);
});

// PUT Update Task
app.put("/tasks/:id", (req, res) => {

    const id = parseInt(req.params.id);

    const task = tasks.find(t => t.id === id);

    if (!task) {
        return res.status(404).json({
            message: "Task not found"
        });
    }

    task.title = req.body.title;

    res.status(200).json(task);
});

// DELETE Task
app.delete("/tasks/:id", (req, res) => {

    const id = parseInt(req.params.id);

    const index = tasks.findIndex(t => t.id === id);

    if (index === -1) {
        return res.status(404).json({
            message: "Task not found"
        });
    }

    tasks.splice(index, 1);

    res.status(200).json({
        message: "Task deleted"
    });
});

// Undefined Route
app.use((req, res) => {
    res.status(404).json({
        error: "Route Not Found"
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);

    res.status(500).json({
        error: "Internal Server Error"
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});