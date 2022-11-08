// Remember to set type: module in package.json or use .mjs extension
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

// File path
export const createConnection = async () => {
  const file = join(process.cwd(), "src/db/db.json");

  // Configure lowdb to write to JSONFile
  const adapter = new JSONFile(file);
  const db = new Low(adapter);

  // Read data from JSON file, this will set db.data content
  await db.read();

  // If db.json doesn't exist, db.data will be null
  // Use the code below to set default data
  // db.data = db.data || { posts: [] } // For Node < v15.x
  db.data ||= {}; // For Node >= 15.x

  // Finally write db.data content to file
  await db.write();
};
