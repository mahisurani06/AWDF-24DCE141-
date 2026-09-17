import { useState, useEffect } from "react";
import Spinner from "../components/Spinner";
import ErrorMessage from "../components/ErrorMessage";
import Toast from "../components/Toast";

import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../api";

function Projects() {
  const [tasks, setTasks] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [toast, setToast] = useState({
    message: "",
    type: "success",
  });

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");

  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);

  const [actionLoading, setActionLoading] = useState(false);

  // Get all tasks
  const fetchTasks = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      setError(err.message);

      setToast({
        message: "Failed to load tasks",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch tasks when page loads
  useEffect(() => {
    fetchTasks();
  }, []);

  // Clear form
  const clearForm = () => {
    setTitle("");
    setDescription("");
    setPriority("medium");
    setEditId(null);
  };

  // Create or update task
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Task title is required");

      setToast({
        message: "Task title is required",
        type: "error",
      });

      return;
    }

    setActionLoading(true);
    setError("");

    const taskData = {
      title: title.trim(),
      description: description.trim(),
      priority: priority,
    };

    // UPDATE TASK
    if (editId) {
      try {
        const updatedTask = await updateTask(editId, taskData);

        setTasks((oldTasks) =>
          oldTasks.map((task) =>
            task._id === editId ? updatedTask : task
          )
        );

        setToast({
          message: "Task updated successfully",
          type: "success",
        });

        clearForm();
      } catch (err) {
        setError(err.message);

        setToast({
          message: "Failed to update task",
          type: "error",
        });
      } finally {
        setActionLoading(false);
      }

      return;
    }

    // CREATE TASK - OPTIMISTIC UI

    // Temporary task
    const tempTask = {
      _id: `temp-${Date.now()}`,
      title: taskData.title,
      description: taskData.description,
      priority: taskData.priority,
      completed: false,
      optimistic: true,
    };

    // Show task immediately
    setTasks((oldTasks) => [...oldTasks, tempTask]);

    try {
      // Send task to backend
      const newTask = await createTask(taskData);

      // Replace temporary task with real MongoDB task
      setTasks((oldTasks) =>
        oldTasks.map((task) =>
          task._id === tempTask._id ? newTask : task
        )
      );

      setToast({
        message: "Task created successfully",
        type: "success",
      });

      clearForm();
    } catch (err) {
      // Remove temporary task if server fails
      setTasks((oldTasks) =>
        oldTasks.filter(
          (task) => task._id !== tempTask._id
        )
      );

      setError(err.message);

      setToast({
        message: "Failed to create task",
        type: "error",
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Edit task
  const handleEdit = (task) => {
    setEditId(task._id);
    setTitle(task.title);
    setDescription(task.description || "");
    setPriority(task.priority || "medium");

    setError("");
  };

  // Delete task
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmDelete) {
      return;
    }

    setActionLoading(true);
    setError("");

    try {
      await deleteTask(id);

      setTasks((oldTasks) =>
        oldTasks.filter((task) => task._id !== id)
      );

      setToast({
        message: "Task deleted successfully",
        type: "success",
      });

      if (editId === id) {
        clearForm();
      }
    } catch (err) {
      setError(err.message);

      setToast({
        message: "Failed to delete task",
        type: "error",
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Mark task completed or pending
  const handleToggle = async (task) => {
    setActionLoading(true);
    setError("");

    try {
      const updatedTask = await updateTask(task._id, {
        completed: !task.completed,
      });

      setTasks((oldTasks) =>
        oldTasks.map((item) =>
          item._id === task._id ? updatedTask : item
        )
      );

      setToast({
        message: "Task status updated successfully",
        type: "success",
      });
    } catch (err) {
      setError(err.message);

      setToast({
        message: "Failed to update task status",
        type: "error",
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Search tasks
  const filteredTasks = tasks.filter((task) =>
    task.title
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // Loading
  if (loading) {
    return <Spinner />;
  }

  return (
    <div>
      {/* Toast Notification */}
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() =>
          setToast({
            message: "",
            type: "success",
          })
        }
      />

      <h1>Task Management</h1>

      {/* Error Message */}
      {error && (
        <ErrorMessage
          message={error}
          onRetry={fetchTasks}
        />
      )}

      <hr />

      {/* Create / Update Form */}
      <h2>{editId ? "Update Task" : "Create Task"}</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>
          <br />

          <input
            type="text"
            placeholder="Enter task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <br />

        <div>
          <label>Description</label>
          <br />

          <textarea
            placeholder="Enter task description"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
          />
        </div>

        <br />

        <div>
          <label>Priority</label>
          <br />

          <select
            value={priority}
            onChange={(e) =>
              setPriority(e.target.value)
            }
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        <br />

        <button
          type="submit"
          disabled={actionLoading}
        >
          {actionLoading
            ? "Please wait..."
            : editId
            ? "Update Task"
            : "Create Task"}
        </button>

        {" "}

        {editId && (
          <button
            type="button"
            onClick={clearForm}
            disabled={actionLoading}
          >
            Cancel
          </button>
        )}
      </form>

      <hr />

      {/* Search */}
      <h2>Tasks</h2>

      <input
        type="text"
        placeholder="Search tasks"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <br />
      <br />

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <p>No tasks found.</p>
      ) : (
        filteredTasks.map((task) => (
          <div key={task._id}>
            <h3>{task.title}</h3>

            <p>
              <strong>Description:</strong>{" "}
              {task.description || "No description"}
            </p>

            <p>
              <strong>Priority:</strong>{" "}
              {task.priority}
            </p>

            <p>
              <strong>Status:</strong>{" "}
              {task.completed
                ? "Completed"
                : "Pending"}
            </p>

            <button
              onClick={() => handleToggle(task)}
              disabled={actionLoading}
            >
              {task.completed
                ? "Mark Pending"
                : "Mark Completed"}
            </button>

            {" "}

            <button
              onClick={() => handleEdit(task)}
              disabled={actionLoading}
            >
              Edit
            </button>

            {" "}

            <button
              onClick={() =>
                handleDelete(task._id)
              }
              disabled={actionLoading}
            >
              Delete
            </button>

            <hr />
          </div>
        ))
      )}
    </div>
  );
}

export default Projects;