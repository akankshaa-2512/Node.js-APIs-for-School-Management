const mysql = require("mysql2");
require("dotenv").config();

let db;

if (process.env.DATABASE_URL) {
  const url = new URL(process.env.DATABASE_URL);

  db = mysql.createConnection({
    host: url.hostname,
    user: url.username,
    password: url.password,
    database: url.pathname.replace("/", ""),
    port: url.port,
  });
} else {
  db = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "school",
  });
}

db.connect((err) => {
  if (err) throw err;
  console.log("MySQL Connected...");
});

module.exports = db;
