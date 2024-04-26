import express from "express";
import { config } from "dotenv";
// Routes
import tasksRouter from "./routes/tasks.route";
import authRouter from "./routes/auth.route";
import notFountRouter from "./routes/notFount.route";
// Middleware
import { errorMiddleware } from "./middleware/error.middleware";
import { contentTypeMiddleware } from "./middleware/contentType.middleware";
import { acceptMiddleware } from "./middleware/accept.middleware";

config();

const app = express();
const PORT = 3000;

app.use(
  express.json({
    type: ["json", "+json"],
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(contentTypeMiddleware);
app.use(acceptMiddleware);

app.use("/api/v1/tasks", tasksRouter);
app.use("/api/v1/auth", authRouter);

// case of route not found
app.use(notFountRouter);

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
