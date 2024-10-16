import express from "express";
import { config } from "dotenv";
// Routes
import tasksRouter from "./routes/tasks.route";
import authRouter from "./routes/auth.route";
import notFoundRouter from "./routes/notFound.route";
// Middleware
import { errorMiddleware } from "./middleware/error.middleware";
import { contentTypeMiddleware } from "./middleware/contentType.middleware";
import { acceptMiddleware } from "./middleware/accept.middleware";
import cors from "cors";
import cookieParser from "cookie-parser";

config();

const app = express();
const PORT = 4000;

app.use(
  express.json({
    type: ["json", "+json"],
  })
);

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:4000"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(contentTypeMiddleware);
app.use(acceptMiddleware);

app.use("/api/v1/tasks", tasksRouter);
app.use("/api/v1/auth", authRouter);

// case of route not found
app.use(notFoundRouter);

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
