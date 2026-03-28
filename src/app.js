import "./config/env.js";
import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import { setupSwagger } from "./config/swagger.js";
import { notFoundHandler, errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: "1mb" }));

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

setupSwagger(app);

app.use("/api", routes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
