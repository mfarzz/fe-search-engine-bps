# Frontend Aplikasi Manajemen Link

Proyek ini adalah frontend untuk aplikasi manajemen link yang dibangun menggunakan React + Vite dengan JavaScript.

## Teknologi yang Digunakan

- React 18
- Vite
- JavaScript
- Tailwind CSS
- ESLint
- PostCSS

## Persyaratan Sistem

- Node.js (versi 14 ke atas)
- npm atau yarn sebagai package manager
- Backend API harus sudah berjalan

## Cara Instalasi dan Penggunaan

### 1. Clone Repository

```bash
git clone https://github.com/mfarzz/fe-search-engine-bps.git
cd front-end
```

### 2. Install Dependensi

```bash
npm install
# atau
yarn install
```

### 3. Konfigurasi Environment

Sesuaikan konfigurasi di `vite.config.js` sesuai kebutuhan.

### 4. Menjalankan Aplikasi

```bash
# Mode development
npm run dev
# atau
yarn dev

# Build untuk production
npm run build
# atau
yarn build
```

Aplikasi akan berjalan di `http://localhost:5173`

## Struktur Folder

```
.
├── dist/               # Folder hasil build
├── node_modules/       # Dependensi
├── public/            # File publik statis
├── src/
│   ├── assets/        # Gambar, font, dan aset statis
│   ├── components/    # Komponen React yang reusable
│   ├── hooks/         # Custom React hooks
│   ├── lib/           # Library dan utilitas
│   ├── pages/         # Komponen halaman
│   ├── services/      # Layanan API
│   │   ├── auth.service.jsx
│   │   ├── dashboard.service.jsx
│   │   ├── feedback.service.jsx
│   │   ├── manajemenLink.service.jsx
│   │   ├── manajemenUser.service.jsx
│   │   ├── pencarianLink.service.jsx
│   │   └── riwayatLink.service.jsx
│   ├── App.jsx        # Komponen utama
│   ├── index.css      # File CSS utama
│   ├── main.jsx       # Entry point
│   └── ProtectedRoute.jsx # Komponen route protection
├── .eslintrc.cjs      # Konfigurasi ESLint
├── .gitignore         # Git ignore
├── components.json    # Konfigurasi komponen
├── index.html         # File HTML utama
├── jsconfig.json      # Konfigurasi JavaScript
├── package-lock.json  # Lock file dependensi
├── package.json       # Metadata dan dependensi
├── postcss.config.js  # Konfigurasi PostCSS
├── README.md          # Dokumentasi
├── tailwind.config.js # Konfigurasi Tailwind CSS
└── vite.config.js     # Konfigurasi Vite
```

## Fitur Aplikasi

1. Autentikasi
   - Login dengan email dan password
   - Login dengan Google
   - Manajemen sesi pengguna
   - Protected routes

2. Dashboard Admin
   - Statistik penggunaan
   - Monitoring link
   - Manajemen pengguna

3. Manajemen Link
   - Tambah, edit, hapus link
   - Upload gambar
   - Preview link

4. Pencarian Link
   - Pencarian link
   - Eksplorasi link
   - Riwayat pencarian

5. Riwayat Link
   - Riwayat kunjungan
   - Link populer
   - Statistik penggunaan

6. Feedback
   - Sistem umpan balik pengguna

## Services

### Auth Service
```javascript
// src/services/auth.service.jsx
// Menangani autentikasi, login, logout
```

### Dashboard Service
```javascript
// src/services/dashboard.service.jsx
// Menangani data dan statistik dashboard
```

### Manajemen Link Service
```javascript
// src/services/manajemenLink.service.jsx
// Menangani operasi CRUD untuk link
```

### Manajemen User Service
```javascript
// src/services/manajemenUser.service.jsx
// Menangani operasi CRUD untuk user
```

### Pencarian Link Service
```javascript
// src/services/pencarianLink.service.jsx
// Menangani pencarian dan eksplorasi link
```

### Riwayat Link Service
```javascript
// src/services/riwayatLink.service.jsx
// Menangani riwayat dan statistik link
```

## Perintah yang Tersedia

- `npm run dev` - Menjalankan aplikasi dalam mode development
- `npm run build` - Build aplikasi untuk production
- `npm run preview` - Preview build production secara lokal
- `npm run lint` - Menjalankan ESLint

## Troubleshooting

### Masalah Umum

1. **CORS Error**
   - Periksa konfigurasi CORS di backend
   - Pastikan URL API sudah benar

2. **Build Gagal**
   - Hapus node_modules dan package-lock.json
   - Jalankan `npm install` ulang

3. **Error saat Development**
   - Periksa console browser untuk error
   - Pastikan semua service sudah diimport dengan benar

## Cara Berkontribusi

1. Fork repository ini
2. Buat branch fitur baru (`git checkout -b fitur/FiturBaru`)
3. Commit perubahan Anda (`git commit -m 'Menambahkan fitur baru'`)
4. Push ke branch (`git push origin fitur/FiturBaru`)
5. Buat Pull Request

## Lisensi

Proyek ini dilisensikan di bawah Lisensi MIT - lihat file [LICENSE.md](LICENSE.md) untuk detail lebih lanjut.

## Kontak

Nama Anda - Muhammad Fariz
Email - mfarix730@gmail.com

Link Proyek: https://github.com/mfarzz/fe-search-engine-bps.git
