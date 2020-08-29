import getenv from "getenv";
import dotenv from "dotenv";
dotenv.config();

/** ===========================================================================
 * Environment Variables Setup
 * ============================================================================
 */

export const PORT = getenv.int("PORT", 5000);
export const MONGO_DATABASE_URL = getenv.string("MONGO_DATABASE_URL");
