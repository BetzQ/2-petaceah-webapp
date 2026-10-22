const express = require("express");
const path = require("path");
const initSqlJs = require("sql.js");

const app = express();
const PORT = process.env.PORT || 3000;

// ---- Inisialisasi basis data SQLite (sql.js = pure JavaScript, tanpa native compilation) ----
// sql.js berjalan di memori (in-memory). Cocok untuk demo portofolio di Vercel.
// Data tidak persisten antar invokasi serverless (wajar untuk prototype).
let dbPromise = null;

function getDb() {
  if (!dbPromise) {
    dbPromise = initSqlJs().then((SQL) => {
      const db = new SQL.Database();
      db.run(`
        CREATE TABLE IF NOT EXISTS vulnerabilities (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          vuln_name TEXT NOT NULL,
          target_url TEXT NOT NULL,
          severity TEXT DEFAULT 'Medium',
          status TEXT DEFAULT 'Open',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
      `);
      return db;
    });
  }
  return dbPromise;
}

// Helper: konversi hasil sql.js (array of {columns, values}) menjadi array of object
function rowsToObjects(result) {
  if (!result || result.length === 0) return [];
  const cols = result[0].columns;
  return result[0].values.map((row) => {
    const obj = {};
    cols.forEach((c, i) => (obj[c] = row[i]));
    return obj;
  });
}

// ---- Middleware ----
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware: pastikan DB siap sebelum memproses request
app.use(async (req, res, next) => {
  try {
    req.db = await getDb();
    next();
  } catch (err) {
    console.error("[!] Gagal inisialisasi DB:", err);
    res.status(500).send("Internal Server Error: DB init failed");
  }
});

// ---- Rute ----

// GET / : Dashboard dan tabel kerentanan
app.get("/", async (req, res) => {
  const result = req.db.exec(
    "SELECT * FROM vulnerabilities ORDER BY created_at DESC"
  );
  const vulnerabilities = rowsToObjects(result);
  res.render("index", { vulnerabilities });
});

// POST /add : Simpan kerentanan baru dari form
app.post("/add", async (req, res) => {
  const { vuln_name, target_url, severity, status } = req.body;
  req.db.run(
    "INSERT INTO vulnerabilities (vuln_name, target_url, severity, status) VALUES (?, ?, ?, ?)",
    [vuln_name || "", target_url || "", severity || "Medium", status || "Open"]
  );
  res.redirect("/");
});

// POST /delete/:id : Hapus kerentanan berdasarkan ID
app.post("/delete/:id", async (req, res) => {
  req.db.run("DELETE FROM vulnerabilities WHERE id = ?", [req.params.id]);
  res.redirect("/");
});

// POST /update/:id : Ubah status kerentanan
app.post("/update/:id", async (req, res) => {
  const { status } = req.body;
  req.db.run("UPDATE vulnerabilities SET status = ? WHERE id = ?", [
    status,
    req.params.id,
  ]);
  res.redirect("/");
});

// ---- Jalankan server (lokal) ----
if (require.main === module) {
  getDb().then(() => {
    app.listen(PORT, () => {
      console.log(`[+] PetaCelah berjalan di http://localhost:${PORT}`);
    });
  });
}

module.exports = app;
