const validateCreateTask = (req, res, next) => {
  const { title, description, priority } = req.body;

  if (!title || typeof title !== "string" || !title.trim()) {
    return res.status(400).json({
      message: "Task title is required",
    });
  }

  if (
    description !== undefined &&
    typeof description !== "string"
  ) {
    return res.status(400).json({
      message: "Description must be a string",
    });
  }

  if (
    priority !== undefined &&
    !["low", "medium", "high"].includes(priority)
  ) {
    return res.status(400).json({
      message: "Priority must be low, medium, or high",
    });
  }

  next();
};

const validateUpdateTask = (req, res, next) => {
  const { title, description, priority, completed } = req.body;

  if (
    title !== undefined &&
    (typeof title !== "string" || !title.trim())
  ) {
    return res.status(400).json({
      message: "Task title cannot be empty",
    });
  }

  if (
    description !== undefined &&
    typeof description !== "string"
  ) {
    return res.status(400).json({
      message: "Description must be a string",
    });
  }

  if (
    priority !== undefined &&
    !["low", "medium", "high"].includes(priority)
  ) {
    return res.status(400).json({
      message: "Priority must be low, medium, or high",
    });
  }

  if (
    completed !== undefined &&
    typeof completed !== "boolean"
  ) {
    return res.status(400).json({
      message: "Completed must be true or false",
    });
  }

  next();
};

module.exports = {
  validateCreateTask,
  validateUpdateTask,
};