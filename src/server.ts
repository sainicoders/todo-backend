import { app } from "./app";
import { connectDb } from "./config/db";
import { env } from "./config/env";

connectDb()
  .then(() => {
    app.listen(env.port, () => {
      console.log(`API listening on http://localhost:${env.port}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server", error);
    process.exit(1);
  });
