
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Define the path for the SQLite database file
const dbDir = path.join(process.cwd(), '.db');
const dbPath = path.join(dbDir, 'blockarmor.sqlite');

// Ensure the .db directory exists
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

let dbInstance: Database.Database | null = null;

export function getDb() {
  if (!dbInstance) {
    dbInstance = new Database(dbPath, { verbose: console.log }); // Remove verbose in production
    // Enable WAL mode for better concurrency and performance
    dbInstance.pragma('journal_mode = WAL');
    initializeSchema(dbInstance);
  }
  return dbInstance;
}

function initializeSchema(db: Database.Database) {
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      displayName TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      hashedPassword TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `;
  db.exec(createUsersTable);

  // You can add other table initializations here
  // For example:
  // const createProjectsTable = `
  //   CREATE TABLE IF NOT EXISTS projects (
  //     id INTEGER PRIMARY KEY AUTOINCREMENT,
  //     userId INTEGER NOT NULL,
  //     name TEXT NOT NULL,
  //     createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  //     FOREIGN KEY (userId) REFERENCES users (id)
  //   );
  // `;
  // db.exec(createProjectsTable);
}

// Graceful shutdown
// process.on('exit', () => {
//   if (dbInstance) {
//     dbInstance.close();
//     console.log('Database connection closed.');
//   }
// });
// Note: For Next.js serverless functions, managing connections explicitly like this
// can be tricky. better-sqlite3 is synchronous, so each Server Action invocation
// might re-establish a connection if dbInstance is not properly cached across invocations.
// For development, this setup is generally fine. For production, consider connection pooling
// or a different DB strategy if using serverless extensively.
