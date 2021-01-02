import logger from "./logger";
import * as dotenv from "dotenv";
import * as fs from "fs";

if (fs.existsSync(".env")) {
  logger.debug("Secrets: Using .env file to supply config environment variables");
  dotenv.config({ path: ".env" });
} else {
  logger.debug("Secrets: Using .env.example file to supply config environment variables");
  dotenv.config({ path: ".env.example" });  // you can delete this after you create your own .env file!
}

export const ENVIRONMENT = process.env.NODE_ENV;
const prod = ENVIRONMENT === "production"; // Anything else is treated as 'dev'

export const GITHUB_TOKEN = process.env["GITHUB_TOKEN"];

if (!GITHUB_TOKEN) {
  logger.error("Secrets: No Github token provided.")
  process.exit(1);
}
