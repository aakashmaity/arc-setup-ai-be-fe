import mongoose from "mongoose";
import app from "./app.js";
import connectDB from "./config/dbConfig.js";

const port = Number(process.env.PORT ?? 4000);
const mongoUri = process.env.MONGODB_URI;

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("PORT must be an integer between 1 and 65535.");
}

if (!mongoUri) {
  throw new Error("MONGODB_URI is required. Set it in backend/.env.");
}

await connectDB(mongoUri);

const server = app.listen(port, () => {
  console.info(`API listening on http://localhost:${port}`);
});

function shutdown(signal) {
  console.info(`Received ${signal}; shutting down.`);
  server.close(async (error) => {
    if (error) {
      console.error("HTTP server shutdown failed:", error);
      process.exitCode = 1;
    }

    try {
      await mongoose.disconnect();
    } catch (disconnectError) {
      console.error("MongoDB shutdown failed:", disconnectError);
      process.exitCode = 1;
    }
  });
}

process.once("SIGINT", () => shutdown("SIGINT"));
process.once("SIGTERM", () => shutdown("SIGTERM"));
