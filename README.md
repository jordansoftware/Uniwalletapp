# 🎓 UniPass Mobile - Student Digital Wallet

UniPass Mobile is a modern **Progressive Web App (PWA)** designed to digitize student IDs and transportation tickets. The application offers a seamless user experience with touch gestures, full offline support, and real-time synchronization with Supabase.

![Project Status](https://img.shields.io/badge/Status-Development-green)
![Technology](https://img.shields.io/badge/Stack-React%20%7C%20Vite%20%7C%20Supabase%20%7C%20Tailwind-blue)

## ✨ Features

- 📱 **Mobile-First Interface**: Premium design inspired by Apple Wallet.
- 🔄 **Interactive Carousel**: Smooth navigation between different cards (Student ID, Transport Ticket).
- ⚡ **Supabase Synchronization**: Dynamic fetching of QR codes and profile photos from the database.
- 📶 **Offline Mode (PWA)**: Thanks to the Service Worker, access your cards even without a network connection.
- 🌓 **Dark Mode**: Full support for dark theme.
- 🔐 **Security**: Secure integration with Supabase using environment variables.

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, TypeScript
- **Styling**: Tailwind CSS v4
- **Backend & Storage**: Supabase (PostgreSQL + Storage Buckets)
- **PWA**: Service Workers, Web Manifest

## 🚀 Local Installation

### 1. Clone the project
```bash
git clone https://github.com/your-username/unipass-mobile.git
cd unipass-mobile
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env.local` file in the project root:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run the application
```bash
npm run dev
```
The application will be available at `http://localhost:3000`.

## 📦 Database Structure (Supabase)

To make synchronization work, your Supabase table should be configured as follows:

**Table: `walletid`**
- `id`: int8 (Primary Key)
- `qr_path`: text (Path to the file in the `walletdata` bucket)
- `photo_path`: text (Path to the file in the `walletdata` bucket)

**Storage: Bucket `walletdata`**
- Must be configured as **Public** or have appropriate read access Policies.

## 📱 Mobile Installation (PWA)

1. Open the application URL on your phone (e.g., via Vercel or Netlify).
2. **On iOS (Safari)**: Tap the Share button 📤 then "Add to Home Screen".
3. **On Android (Chrome)**: Tap the three dots ⋮ then "Install app".

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
