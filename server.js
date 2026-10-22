const express = require("express");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

const app = express();
const PORT = process.env.PORT || 3000;

// ---- Konfigurasi Supabase ----
// Kredensial bisa di-set via environment variable (Vercel) atau .env (lokal)
const SUPABASE_URL = process.env.SUPABASE_URL || "https://unqsjhceoaeomnfwohvl.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY || "sb_publishable_DFdpIjykTtHXegcotYT7eg_KNXmfeFS";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ---- Middleware ----
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ---- Rute ----

// GET / : Dashboard dan tabel kerentanan
app.get("/", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("vulnerabilities")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.render("index", { vulnerabilities: data || [] });
  } catch (err) {
    console.error("[!] Error GET /:", err.message);
    res.status(500).send("Error: " + err.message);
  }
});

// POST /add : Simpan kerentanan baru dari form
app.post("/add", async (req, res) => {
  try {
    const { vuln_name, target_url, severity, status } = req.body;
    const { error } = await supabase.from("vulnerabilities").insert([
      {
        vuln_name: vuln_name || "",
        target_url: target_url || "",
        severity: severity || "Medium",
        status: status || "Open",
      },
    ]);
    if (error) throw error;
    res.redirect("/");
  } catch (err) {
    console.error("[!] Error POST /add:", err.message);
    res.status(500).send("Error: " + err.message);
  }
});

// POST /delete/:id : Hapus kerentanan berdasarkan ID
app.post("/delete/:id", async (req, res) => {
  try {
    const { error } = await supabase
      .from("vulnerabilities")
      .delete()
      .eq("id", req.params.id);
    if (error) throw error;
    res.redirect("/");
  } catch (err) {
    console.error("[!] Error POST /delete:", err.message);
    res.status(500).send("Error: " + err.message);
  }
});

// POST /update/:id : Ubah status kerentanan
app.post("/update/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const { error } = await supabase
      .from("vulnerabilities")
      .update({ status })
      .eq("id", req.params.id);
    if (error) throw error;
    res.redirect("/");
  } catch (err) {
    console.error("[!] Error POST /update:", err.message);
    res.status(500).send("Error: " + err.message);
  }
});

// ---- Jalankan server (lokal) ----
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`[+] PetaCelah berjalan di http://localhost:${PORT}`);
    console.log(`[+] Supabase: ${SUPABASE_URL}`);
  });
}

module.exports = app;
