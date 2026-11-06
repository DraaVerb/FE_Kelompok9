import db from "./db.js";

export function getMenu() {
  return db.prepare("SELECT * FROM menu").all();
}
