import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import aiRoutes from "./routes/aiRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import historyRoutes from "./routes/historyRoutes.js";
import errorHandler from "./middleware/errorHandler.js";
import notFound from "./middleware/notFound.js";
import sanitizeRequest from "./middleware/sanitizeRequest.js";

const app = express();

const frontendOrigins = (process.env.FRONTEND_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || frontendOrigins.includes(origin)) {
        return callback(null, true);
      }
      const corsError = new Error("Not allowed by CORS");
      corsError.statusCode = 403;
      return callback(corsError);
    },
    credentials: true,
  }),
);
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: false }));
app.use(sanitizeRequest);
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "ReadAble API" });
});

app.use("/api/auth", authRoutes);
app.use("/api", aiRoutes);
app.use("/api/history", historyRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
