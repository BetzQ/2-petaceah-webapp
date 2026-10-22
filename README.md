# PetaCelah — Red Team Vulnerability Tracker

Dashboard internal untuk tim peretas (Red Team) mencatat dan melacak kerentanan keamanan. Aplikasi CRUD monolitik berbasis Node.js, Express.js, EJS, SQLite (better-sqlite3), dan Tailwind CSS (via CDN) dengan tema gelap (dark mode) konsep hacker.

## Stack Teknologi

- **Node.js** + **Express.js** — backend dan routing
- **EJS** — template engine
- **Supabase PostgreSQL** — basis data cloud permanen (data tidak hilang saat cold start)
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

### Catatan Penting (Supabase di Vercel)

Aplikasi menggunakan **Supabase PostgreSQL** sebagai basis data cloud. Data bersifat **permanen** (tidak hilang saat cold start). Kredensial Supabase sudah di-hardcode di `server.js` sebagai fallback, namun untuk keamanan disarankan set kredensial via **Environment Variables** di Vercel Dashboard.

**Set Environment Variables di Vercel:**
1. Buka Project di Vercel → **Settings** → **Environment Variables**.
2. Tambahkan:
   - `SUPABASE_URL` = `https://unqsjhceoaeomnfwohvl.supabase.co`
   - `SUPABASE_ANON_KEY` = `sb_publishable_DFdpIjykTtHXegcotYT7eg_KNXmfeFS`
3. Klik **Save** → **Redeploy**.

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

## Supabase (Sudah Terintegrasi)

Aplikasi sudah menggunakan **Supabase PostgreSQL**. Tabel `vulnerabilities` sudah dibuat di Supabase dengan skema berikut:

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

RLS (Row Level Security) sudah diaktifkan dengan policy permissive untuk demo. File `db/schema.sql` di repo berisi skema yang sama.

## Lisensi

MIT — bebas digunakan untuk portofolio dan pembelajaran.
