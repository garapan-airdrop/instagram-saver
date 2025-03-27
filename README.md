File .env (Token Bot Telegram)
Buat file .env di folder yang sama, lalu isi dengan:
```
BOT_TOKEN=ISI_TOKEN_BOT_MU_DISINI
```
Ganti ISI_TOKEN_BOT_MU_DISINI dengan token bot Telegram kamu.


Instalasi Dependensi
Pastikan semua package sudah diinstal dengan perintah:

```
npm install telegraf dotenv puppeteer
```
Jika yt-dlp belum terinstal, jalankan:

```
pip install -U yt-dlp
```
atau jika pakai sistem global:

```
apt install yt-dlp
```

Menjalankan Bot
Gunakan perintah berikut untuk menjalankan bot:

```
node main.js
```

Kesimpulan
✅ File utama: main.js
✅ File konfigurasi: .env
✅ Bot bisa mengunduh video dan gambar dari Instagram
✅ Pakai yt-dlp untuk video, pakai Puppeteer untuk gambar
