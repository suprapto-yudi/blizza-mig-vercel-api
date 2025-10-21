This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

All Steps
1. Inisialisasi project Next.js dengan TypeScript & Tailwind
    --> npx create-next-app@latest blizza-affiliate --ts --tailwind
    --> cd blizza-affiliate
2. Setup Tailwind + PostCSS (brand Blizza theme)
    --> npm install -D tailwindcss postcss autoprefixer
    --> npx tailwindcss-cli@latest init -p
3. Edit tailwind.config.js
    Tambahkan plugin form & tipografi
    --> npm install -D @tailwindcss/forms @tailwindcss/typography
    --> require('@tailwindcss/forms'), require('@tailwindcss/typography')
4. Pastikan `postcss.config.js` berisi:
5. Buat/edit file global CSS `src/styles/globals.css` dengan isi:
6. Buat/edit file tailwind CSS `src/styles/tailwind.css` dengan isi:
7. Import `globals.css` ke layout Next.js (App Router): edit `src/app/layout.tsx` dan tambahkan di paling atas:
8. Ada langkah yang hilang
9. Buat/edit file page.tsx 'src/app/page.tsx' = landing page awal
10. Buat/edit file signup 'src/app/signup/page.tsx' = sign up page
11. Buat/edit file login 'src/app/login/page.tsx' = login page
12. Buat/edit file dashboard 'src/app/dashboard/page.tsx' = dashboard page
13. Buat/edit file profile 'src/app/profile/page.tsx' = profile page
14. Buat/edit file settings 'src/app/settings/page.tsx' = settings page
15. Buat/edit file leaderboard 'src/app/leaderboard/page.tsx' = leaderboard page