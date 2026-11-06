const Database = require("better-sqlite3");

const db = new Database("./database/gudeg.db");

const tables = db.prepare(`
  SELECT name FROM sqlite_master
  WHERE type = 'table'
`).all();

console.log("Tabel database:", tables);

db.close();
