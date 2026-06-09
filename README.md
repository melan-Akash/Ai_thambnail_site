# Thumblify - AI Thumbnail Generator 🎨✨

Welcome to **Thumblify**, the ultimate AI-powered YouTube thumbnail generator. Built with modern web technologies, Thumblify allows creators to instantly generate visually stunning, highly clickable thumbnails using state-of-the-art AI models, without needing any graphic design skills!

## 🚀 Features

* **AI Image Generation**: Powered by the newest AI Image generation models (e.g., FLUX.1) for photorealistic and stylistic designs.
* **Responsive Design**: Flawless UI that looks great on Mobile, Tablet, and Desktop displays.
* **Credit System & Payments**: Integrated with **Stripe** for purchasing thumbnail generation credits.
* **My Generations Dashboard**: Save, preview, delete, and force-download all your past AI-generated thumbnails.
* **Modern UI/UX**: Built with React, TailwindCSS, Framer Motion, and beautiful custom styles.
* **Secure Authentication**: Backend-secured login and registration system.

## 🛠️ Tech Stack

### Frontend (Client)
* **Framework**: React 18 (Vite)
* **Routing**: React Router DOM
* **Styling**: TailwindCSS
* **Animations**: Framer Motion
* **Notifications**: React Hot Toast
* **Icons**: Lucide React

### Backend (Server)
* **Runtime**: Node.js & Express.js
* **Database**: MongoDB (Mongoose)
* **AI Model**: Hugging Face Inference API (FLUX.1-schnell)
* **Image Hosting**: Cloudinary
* **Payments**: Stripe Checkout

## 📂 Project Structure

```text
Ai_thambnail/
├── client/              # React Frontend
│   ├── public/          # Static assets (logo, etc.)
│   ├── src/             # Source files
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Route-based pages (Generate, MyGenerations, etc.)
│   │   ├── sections/    # Homepage sections
│   │   └── assets/      # Local assets and dummy data
│   └── package.json
└── server/              # Express Backend
    ├── config/          # MongoDB & Environment configs
    ├── controllers/     # API logic (ThumbnailController, AuthController, etc.)
    ├── models/          # Database schemas (User, Thumbnail)
    ├── routes/          # Express route definitions
    ├── middlewares/     # JWT Authentication middlewares
    └── server.ts        # Entry point
```

## ⚙️ Getting Started

### Prerequisites
* Node.js (v18+)
* MongoDB URI
* Stripe API Keys
* Cloudinary Keys
* Hugging Face API Key (Free tier works!)

### 1. Clone & Install Dependencies
First, clone the repository. Then, install dependencies in both the `client` and `server` directories:
```bash
# In the client folder
cd client
npm install

# In the server folder
cd ../server
npm install
```

### 2. Environment Variables (.env)
Create a `.env` file in the `server` directory and add your keys:
```env
PORT=3000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
STRIPE_SECRET_KEY=your_stripe_secret_key
HUGGING_FACE_API_KEY=your_hf_token
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### 3. Run the App
Run both servers simultaneously:

**Start the Backend:**
```bash
cd server
npm run server
```

**Start the Frontend:**
```bash
cd client
npm run dev
```

Visit `http://localhost:5173` to see your app live! 🎉

## 📝 License
This project is created for personal and educational purposes. Feel free to fork and customize it!
