import { join } from "path";
import { Low, JSONFile } from "lowdb";

export let db;

export const createConnection = async () => {
  // Use JSON file for storage
  const file = join(process.cwd(), "src/db/db.json");
  const adapter = new JSONFile(file);
  db = new Low(adapter);

  // Read data from JSON file, this will set db.data content
  await db.read();

  // If file.json doesn't exist, db.data will be null
  // Set default data
  // db.data = db.data || { posts: [] } // Node < v15.x
  db.data ||= { users: [], company: [], stocks: [] }; // Node >= 15.x

  // Create and query items using plain JS
  // db.data.posts.push("hello world");
  // const firstPost = db.data.posts[0];

  // Alternatively, you can also use this syntax if you prefer
  // const { posts } = db.data;
  // posts.push("hello world");

  // Finally write db.data content to file
  await db.write();
};
