const BASE_URL = "http://localhost:5000";

// GET all tasks
export const getTasks = async () => {
  const response = await fetch(`${BASE_URL}/tasks`);

  if (!response.ok) {
    throw new Error(`Failed to fetch tasks: ${response.status}`);
  }

  return response.json();
};

// GET one task
export const getTask = async (id) => {
  const response = await fetch(`${BASE_URL}/tasks/${id}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch task: ${response.status}`);
  }

  return response.json();
};

// POST - create task
export const createTask = async (task) => {
  const response = await fetch(`${BASE_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(
      `Failed to create task: ${response.status} ${message}`
    );
  }

  return response.json();
};

// PUT - update task
export const updateTask = async (id, task) => {
  const response = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(task),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(
      `Failed to update task: ${response.status} ${message}`
    );
  }

  return response.json();
};

// DELETE - delete task
export const deleteTask = async (id) => {
  const response = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(
      `Failed to delete task: ${response.status} ${message}`
    );
  }

  return response.json();
};