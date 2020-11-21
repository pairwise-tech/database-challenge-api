import getenv from "getenv";
import dotenv from "dotenv";
dotenv.config();

/** ===========================================================================
 * Environment Variables Setup
 * ============================================================================
 */

export const PORT = getenv.int("PORT", 5000);
export const NODE_ENV = getenv.string("NODE_ENV", "development");
export const MONGO_DATABASE_URL = getenv.string("MONGO_DATABASE_URL");
