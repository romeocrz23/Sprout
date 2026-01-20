const express = require("express");
const cors = require("cors");

const app = express();

const healthRoutes = require("./routes/health.routes");
const userRoutes = require("./routes/User.routes");
const schedulerRoutes = require("./routes/scheduler.routes");
const notesRoutes = require("./routes/notes.routes");
const financeRoutes = require("./routes/finance.routes");
const chatbotRoutes = require("./routes/chatbot.routes");

app.use(cors());
app.use(express.json());

app.use("/api/auth", financeRoutes);
app.use("/api/health", healthRoutes);
app.use("/api/users", userRoutes);
app.use("/api/scheduler", schedulerRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/finances", financeRoutes);
app.use("/api/chatbot", chatbotRoutes);

module.exports = app;
