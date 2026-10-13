
const taskEvents = require("./events");

// Listener for task creation
taskEvents.on("task-created", (task) => {
  setTimeout(() => {
    try {
      console.log("\n--- Background Notification ---");
      console.log("Task Title:", task.title);
      console.log("Notification Timestamp:", new Date().toISOString());
      console.log("Notification completed.");
      console.log("--------------------------------\n");
    } catch (err) {
      taskEvents.emit("error", err);
    }
  }, 2000);
});

// Listener for task deletion
taskEvents.on("task-deleted", (task) => {
  console.log("\n[Notification] Task deleted");
  console.log("Task Title:", task.title);
  console.log("Timestamp:", new Date().toISOString());
});

// Error listener
taskEvents.on("error", (err) => {
  console.error("[Event Error]", err.message);
});

console.log("Task event listeners registered.");
