const express = require("express");
const path = require("path");
const fs = require("fs");
const Database = require("better-sqlite3");

const app = express();
const PORT = process.env.PORT || 3000;

// ---- Konfigurasi path database SQLite ----
// Di Vercel (serverless), hanya /tmp yang dapat ditulis.
// Secara lokal, gunakan folder ./data agar file persist.
const isVercel = process.env.VERCEL === "1";
const dbDir = isVercel ? "/tmp" : path.join(__dirname, "data");

if (!isVercel) {
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }
}

const dbPath = path.join(dbDir, "vulnerabilities.db");
const db = new Database(dbPath);

// Inisialisasi schema tabel (idempoten)
db.exec(`
  CREATE TABLE IF NOT EXISTS vulnerabilities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    vuln_name TEXT NOT NULL,
    target_url TEXT NOT NULL,
    severity TEXT DEFAULT 'Medium',
    status TEXT DEFAULT 'Open',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// ---- Middleware ----
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ---- Rute ----

// GET / : Dashboard dan tabel kerentanan
app.get("/", (_req, res) => {
  const rows = db
    .prepare(
      "SELECT * FROM vulnerabilities ORDER BY created_at DESC"
    )
    .all();
  res.render("index", { vulnerabilities: rows });
});

// POST /add : Simpan kerentanan baru dari form
app.post("/add", (req, res) => {
  const { vuln_name, target_url, severity, status } = req.body;
  db.prepare(
    "INSERT INTO vulnerabilities (vuln_name, target_url, severity, status) VALUES (?, ?, ?, ?)"
  ).run(
    vuln_name || "",
    target_url || "",
    severity || "Medium",
    status || "Open"
  );
  res.redirect("/");
});

// POST /delete/:id : Hapus kerentanan berdasarkan ID
app.post("/delete/:id", (req, res) => {
  db.prepare("DELETE FROM vulnerabilities WHERE id = ?").run(req.params.id);
  res.redirect("/");
});

// POST /update/:id : Ubah status kerentanan
app.post("/update/:id", (req, res) => {
  const { status } = req.body;
  db.prepare("UPDATE vulnerabilities SET status = ? WHERE id = ?").run(
    status,
    req.params.id
  );
  res.redirect("/");
});

// ---- Jalankan server ----
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`[+] PetaCelah berjalan di http://localhost:${PORT}`);
  });
}

module.exports = app;
