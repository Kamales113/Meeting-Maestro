# 🏢 Meeting Maestro

**Meeting Maestro** is a modern and minimal web application designed to streamline meeting room booking.  
Built with **Next.js**, **TypeScript**, **Tailwind CSS**, and **Firebase**, it offers a real-time, responsive, and elegant experience for managing workspace bookings.

---

## 🌿 Vision

> “A modern and minimal web platform for booking meeting rooms efficiently.”

Meeting Maestro is designed to provide clarity, speed, and simplicity for employees and teams to view room availability, book slots, and manage reservations—all from one intuitive dashboard.

---

## 🚀 Features

- 🔐 **User Authentication** — Secure login and registration using Firebase Authentication.
- 🏢 **Room Availability Display** — Real-time room availability updates (Available / Occupied).
- 📅 **Daily Calendar View** — Visualize all room bookings for the day in a clean calendar layout.
- 🕓 **Room Booking** — Easily book rooms for specific time slots.
- 👤 **Personal Reservation Management** — View, edit, or cancel personal bookings.
- ⚡ **Responsive UI** — Built with TailwindCSS for fast, consistent design across devices.
- 🎨 **Green Accent Theme** — Clean and modern green variant to align with eco-friendly productivity design.

---

## 🧩 Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend Framework** | Next.js (React + TypeScript) |
| **Styling** | Tailwind CSS |
| **State Management** | React Context API |
| **Routing** | Next.js Router |
| **Database & Auth** | Firebase (Firestore + Authentication) |
| **Deployment** | Vercel / Firebase Hosting |

---

## 📁 Project Structure

Meeting-Maestro/
│
├── .next/ # Auto-generated Next.js build (ignored by Git)
├── docs/ # Optional project documentation
├── node_modules/ # Dependencies (ignored by Git)
├── src/
│ ├── components/ # Reusable UI elements (Navbar, RoomCard, etc.)
│ ├── contexts/ # Global state (AuthContext, BookingContext)
│ ├── pages/ # App pages (login, dashboard, bookings, etc.)
│ ├── services/ # Firebase configuration and room/booking services
│ ├── styles/ # Tailwind global and component styles
│ └── utils/ # Helper functions (date formatting, etc.)
│
├── .gitignore # Files and folders ignored by Git
├── apphosting.yaml # Firebase Hosting config (optional)
├── package.json # Project metadata and dependencies
├── tailwind.config.ts # Tailwind CSS configuration
├── tsconfig.json # TypeScript configuration
├── next.config.ts # Next.js app configuration
├── postcss.config.mjs # PostCSS configuration for Tailwind
└── README.md # Project documentation

yaml

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository
```bash
git clone https://github.com/Kamales113/Meeting-Maestro.git
2️⃣ Move into the project folder
bash

cd Meeting-Maestro
3️⃣ Install dependencies
bash

npm install
4️⃣ Set up Firebase configuration
Create a .env.local file in the project root with your Firebase credentials:

env

NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
5️⃣ Run the development server
bash

npm run dev
Now open http://localhost:3000 in your browser to view the app.

🎨 Design Guidelines
Font: Inter — clean, readable, and consistent

Color Palette: Green variant with neutral background

Layout: Grid-based for clear organization

Icons: Minimal and modern

Animations: Subtle feedback for user interactions (book, hover, confirm)

🧠 Firebase Setup (Quick Guide)
1️⃣ Go to Firebase Console
2️⃣ Create a new project → Add a Web App
3️⃣ Copy your configuration keys into .env.local
4️⃣ Enable:

Authentication → Email/Password

Cloud Firestore → Start in test mode

Your Firebase setup is now complete ✅

📦 Deployment
You can deploy the app in one of two ways:

🔹 Vercel (Recommended)
bash
Copy code
npm run build
Then connect your GitHub repo to Vercel for instant deployment.

🔹 Firebase Hosting
bash
Copy code
firebase deploy
🧾 Example Workflows
Login / Signup → Firebase Auth

Room Booking → Firestore document created under bookings/{id}

Room Availability → Query Firestore by date/time

User Bookings → Fetch bookings filtered by user ID

🧑‍💻 Author
Developed by: Kamales M
