
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const Task = require("./models/Task");
const User = require("./models/User");
const cache = require("./utils/cache");

// Practical 10: Event-driven processing
const taskEvents = require("./events");
require("./listeners");

const authMiddleware = require("./middleware/auth");

const {
  validateCreateTask,
  validateUpdateTask,
} = require("./middleware/validateTask");

const app = express();

let cacheHits = 0;
let cacheMisses = 0;

// ======================
// BASIC MIDDLEWARE
// ======================
app.use(cors());
app.use(express.json());

// ======================
// LOGGING MIDDLEWARE
// ======================
app.use((req, res, next) => {
  console.log(
    `${req.method} ${req.url} - ${new Date().toISOString()}`
  );
  next();
});

// ======================
// CONTENT-TYPE VALIDATION
// ======================
app.use((req, res, next) => {
  if (
    (req.method === "POST" || req.method === "PUT") &&
    !req.is("application/json")
  ) {
    return res.status(400).json({
      error: "Content-Type must be application/json",
    });
  }

  next();
});

// ======================
// HEALTH CHECK
// ======================
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
  });
});

// ======================
// REGISTER
// ======================
app.post("/auth/register", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Email is already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email: email.toLowerCase().trim(),
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (err) {
    next(err);
  }
});

// ======================
// LOGIN
// ======================
app.post("/auth/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({
      message: "Login successful",
      token: token,
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (err) {
    next(err);
  }
});

// ======================
// CURRENT USER
// ======================
app.get("/auth/me", authMiddleware, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select(
      "-password"
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
});

// ======================
// CACHE STATISTICS
// ======================
app.get("/cache/stats", authMiddleware, (req, res) => {
  res.status(200).json({
    hits: cacheHits,
    misses: cacheMisses,
  });
});

// ======================
// GET ALL TASKS
// ======================
app.get("/tasks", authMiddleware, async (req, res, next) => {
  try {
    const cachedTasks = cache.get("all_tasks");

    if (cachedTasks) {
      cacheHits += 1;
      return res.status(200).json(cachedTasks);
    }

    cacheMisses += 1;

    const tasks = await Task.find();
    cache.set("all_tasks", tasks);

    res.status(200).json(tasks);
  } catch (err) {
    next(err);
  }
});

// ======================
// GET TASK BY ID
// ======================
app.get("/tasks/:id", authMiddleware, async (req, res, next) => {
  try {
    const taskCacheKey = `task_${req.params.id}`;
    const cachedTask = cache.get(taskCacheKey);

    if (cachedTask) {
      cacheHits += 1;
      return res.status(200).json(cachedTask);
    }

    cacheMisses += 1;

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    cache.set(taskCacheKey, task);
    res.status(200).json(task);
  } catch (err) {
    next(err);
  }
});

// ======================
// CREATE TASK
// ======================
app.post(
  "/tasks",
  authMiddleware,
  validateCreateTask,
  async (req, res, next) => {
    try {
      const task = await Task.create(req.body);

      // Invalidate cache after creating a task.
      cache.del("all_tasks");

      // Emit background notification event.
      taskEvents.emit("task-created", task);

      console.log(
        "[API] Response sent at:",
        new Date().toISOString()
      );

      return res.status(201).json(task);
    } catch (err) {
      next(err);
    }
  }
);

// ======================
// UPDATE TASK
// ======================
app.put(
  "/tasks/:id",
  authMiddleware,
  validateUpdateTask,
  async (req, res, next) => {
    try {
      const task = await Task.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

      if (!task) {
        return res.status(404).json({
          message: "Task not found",
        });
      }

      // Invalidate cache after updating a task.
      cache.del(`task_${req.params.id}`);
      cache.del("all_tasks");

      res.status(200).json(task);
    } catch (err) {
      next(err);
    }
  }
);

// ======================
// DELETE TASK
// ======================
app.delete(
  "/tasks/:id",
  authMiddleware,
  async (req, res, next) => {
    try {
      const task = await Task.findByIdAndDelete(
        req.params.id
      );

      if (!task) {
        return res.status(404).json({
          message: "Task not found",
        });
      }

      // Invalidate cache after deleting a task.
      cache.del(`task_${req.params.id}`);
      cache.del("all_tasks");

      // Emit task-deleted event.
      taskEvents.emit("task-deleted", task);

      return res.status(200).json({
        message: "Task Deleted Successfully",
      });
    } catch (err) {
      next(err);
    }
  }
);

// ======================
// 404 HANDLER
// ======================
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
  });
});

// ======================
// GLOBAL ERROR HANDLER
// ======================
app.use((err, req, res, next) => {
  console.error(err);

  if (err.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "Duplicate value already exists",
    });
  }

  res.status(500).json({
    success: false,
    message: "Something went wrong",
  });
});

// ======================
// EXPORT APP FOR TESTING
// ======================
module.exports = app;

// ======================
// START SERVER
// ======================
const PORT = process.env.PORT || 5000;

if (require.main === module) {
  // Connect to MongoDB only when starting the server.
  if (process.env.MONGO_URI) {
    mongoose
      .connect(process.env.MONGO_URI)
      .then(() => console.log("MongoDB Connected"))
      .catch((err) => console.error(err));
  }

  app.listen(PORT, () => {
    console.log(`Server running on Port ${PORT}`);
  });
}
