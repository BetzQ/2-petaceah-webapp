-- Skema basis data SQLite untuk PetaCelah (Vulnerability Tracker)
-- Tabel: vulnerabilities

CREATE TABLE IF NOT EXISTS vulnerabilities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  vuln_name TEXT NOT NULL,
  target_url TEXT NOT NULL,
  severity TEXT CHECK(severity IN ('Low', 'Medium', 'High', 'Critical')) DEFAULT 'Medium',
  status TEXT CHECK(status IN ('Open', 'Mitigated', 'Closed')) DEFAULT 'Open',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Contoh data awal (opsional, hapus jika tidak diperlukan)
-- INSERT INTO vulnerabilities (vuln_name, target_url, severity, status)
-- VALUES
--   ('SQL Injection', 'https://target.com/login', 'High', 'Open'),
--   ('XSS Reflected', 'https://target.com/search', 'Medium', 'Open'),
--   ('IDOR', 'https://target.com/api/user/1', 'Critical', 'Mitigated');
