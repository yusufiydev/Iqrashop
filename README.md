# Iqrashop

Vite + React asosidagi frontend loyiha. Backend olib tashlangan, shuning uchun Netlify yoki Vercel’da oddiy static app sifatida deploy qilinadi.

## Ishga tushirish

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Build natijasi `dist/` papkaga chiqadi.

## Deploy

Netlify:

- Build command: `npm run build`
- Publish directory: `dist`

Vercel:

- Framework preset: `Vite`
- Build command: `npm run build`
- Output directory: `dist`

`netlify.toml` va `vercel.json` SPA route fallback uchun tayyorlab qo‘yilgan.

## Environment

AI yordamchi ishlashi uchun deploy platformasida quyidagini kiriting:

```bash
VITE_GROQ_API_KEY=your_groq_api_key
VITE_GROQ_MODEL=llama-3.3-70b-versatile
```

Eslatma: `VITE_` bilan boshlanadigan qiymatlar browser bundle ichida ko‘rinadi. Production’da maxfiy AI kalitni yashirish kerak bo‘lsa, keyin alohida serverless API qo‘shish yaxshi bo‘ladi.
