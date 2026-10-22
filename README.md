# PetaCelah — Red Team Vulnerability Tracker

Dashboard internal untuk tim peretas (Red Team) mencatat dan melacak kerentanan keamanan. Aplikasi CRUD monolitik berbasis Node.js, Express.js, EJS, SQLite (better-sqlite3), dan Tailwind CSS (via CDN) dengan tema gelap (dark mode) konsep hacker.

## Stack Teknologi

- **Node.js** + **Express.js** — backend dan routing
- **EJS** — template engine
- **SQLite** via **better-sqlite3** — basis data file (nol konfigurasi server)
- **Tailwind CSS** (via CDN) — styling
- **Vercel** — deployment

## Skema Basis Data (SQLite)

Tabel: `vulnerabilities`

| Kolom | Tipe | Keterangan |
|-------|------|------------|
| `id` | INTEGER PRIMARY KEY AUTOINCREMENT | ID otomatis |
| `vuln_name` | TEXT | Nama kerentanan |
| `target_url` | TEXT | URL target |
| `severity` | TEXT | Low / Medium / High / Critical |
| `status` | TEXT | Open / Mitigated / Closed |
| `created_at` | DATETIME | Waktu pembuatan (default now) |

File schema ada di: `db/schema.sql`

## Rute API / Web

| Metode | Rute | Keterangan |
|--------|------|------------|
| GET | `/` | Tampilkan dashboard dan tabel kerentanan |
| POST | `/add` | Simpan kerentanan baru dari form |
| POST | `/delete/:id` | Hapus kerentanan berdasarkan ID |
| POST | `/update/:id` | Ubah status kerentanan |

## Cara Menjalankan Secara Lokal

### 1. Masuk ke folder proyek

```bash
cd 2-petaceah-webapp
```

### 2. Install dependensi

```bash
npm install
```

### 3. Jalankan server

```bash
npm start
```

Buka browser di: `http://localhost:3000`

Basis data SQLite akan dibuat otomatis di folder `data/vulnerabilities.db` saat pertama kali dijalankan.

## Deployment ke Vercel

Pastikan semua file sudah diunggah ke repositori GitHub (akun `betzq`):

```
2-petaceah-webapp/
├── server.js
├── package.json
├── vercel.json
├── views/
│   └── index.ejs
├── db/
│   └── schema.sql
└── README.md
```

### Langkah di Vercel

1. Masuk ke [https://vercel.com](https://vercel.com) dengan akun GitHub Anda (`betzq`).
2. Klik **Add New** → **Project**.
3. Pilih repositori `2-petaceah-webapp` (atau impor semua repositori portofolio).
4. Vercel akan mendeteksi `vercel.json` secara otomatis.
   - Build Command: `npm install` (atau biarkan kosong)
   - Output Directory: (kosongkan, karena ini @vercel/node)
   - Development Command: `npm run dev`
5. Klik **Deploy**.
6. Setelah selesai, Vercel akan memberikan tautan publik (mis. `https://petaceah.vercel.app`).

### Catatan Penting (SQLite di Vercel)

Karena Vercel menggunakan serverless filesystem yang read-only kecuali `/tmp`, basis data SQLite disimpan di `/tmp` saat berjalan di Vercel. Ini cocok untuk demonstrasi portofolio. Data tidak akan permanen di antara invokasi serverless pada Vercel. Untuk data produksi yang permanen, disarankan bermigrasi ke **Supabase PostgreSQL** (lihat bagian bawah).

## Struktur Repositori

```
2-petaceah-webapp/
├── server.js              # Aplikasi Express + SQLite
├── package.json           # Dependensi Node.js
├── vercel.json            # Konfigurasi Vercel
├── db/
│   └── schema.sql         # Skema tabel SQLite
├── views/
│   └── index.ejs          # Tampilan dashboard (EJS + Tailwind)
├── data/                  # (Dibuat otomatis) File SQLite lokal
└── README.md              # Dokumentasi ini
```

## Alternatif: Supabase (PostgreSQL)

Jika Anda ingin basis data permanen di Supabase, buat tabel ini di SQL Editor Supabase:

```sql
CREATE TABLE IF NOT EXISTS vulnerabilities (
  id BIGSERIAL PRIMARY KEY,
  vuln_name TEXT NOT NULL,
  target_url TEXT NOT NULL,
  severity TEXT CHECK (severity IN ('Low', 'Medium', 'High', 'Critical')) DEFAULT 'Medium',
  status TEXT CHECK (status IN ('Open', 'Mitigated', 'Closed')) DEFAULT 'Open',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

Lalu ganti `better-sqlite3` di `server.js` dengan klien `@supabase/supabase-js` dan sesuaikan rute CRUD. File `db/schema.sql` di atas dapat Anda gunakan sebagai referensi.

## Lisensi

MIT — bebas digunakan untuk portofolio dan pembelajaran.
