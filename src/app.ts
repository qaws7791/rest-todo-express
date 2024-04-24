import express from "express";
import tasksRouter from "./routes/tasks.route";
import authRouter from "./routes/auth.route";
import { config } from "dotenv";
import { errorMiddleware } from "./middleware/error.middleware";
import { contentTypeMiddleware } from "./middleware/contentType.middleware";
import { acceptMiddleware } from "./middleware/accept.middleware";
import { AppError } from "./utils/appError";

config();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(contentTypeMiddleware);
app.use(acceptMiddleware);

app.use("/api/v1/tasks", tasksRouter);
app.use("/api/v1/auth", authRouter);

// case of route not found
app.use((req, res, next) => {
  return next(
    new AppError(
      "Route not found",
      404,
      "The requested resource could not be found"
    )
  );
});

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
