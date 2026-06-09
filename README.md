<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=32&pause=1000&color=6C63FF&center=true&vCenter=true&width=600&lines=TexTora+%F0%9F%92%AC;Real-Time+Chat+Application;MERN+Stack+%7C+Socket.IO+%7C+Cloudinary" alt="TexTora Typing SVG" />

<br/>

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-textora.onrender.com-6C63FF?style=for-the-badge&logoColor=white)](https://textora.onrender.com)
[![GitHub](https://img.shields.io/badge/GitHub-Sourish73%2FTexTora-181717?style=for-the-badge&logo=github)](https://github.com/Sourish73/TexTora)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

<br/>

```
  ████████╗███████╗██╗  ██╗████████╗ ██████╗ ██████╗  █████╗
     ██╔══╝██╔════╝╚██╗██╔╝╚══██╔══╝██╔═══██╗██╔══██╗██╔══██╗
     ██║   █████╗   ╚███╔╝    ██║   ██║   ██║██████╔╝███████║
     ██║   ██╔══╝   ██╔██╗    ██║   ██║   ██║██╔══██╗██╔══██║
     ██║   ███████╗██╔╝ ██╗   ██║   ╚██████╔╝██║  ██║██║  ██║
     ╚═╝   ╚══════╝╚═╝  ╚═╝   ╚═╝    ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝
```

> **A full-stack real-time chat application where conversations happen instantly.**  
> Built with the MERN stack, powered by Socket.IO and Cloudinary.

</div>

---

## ✨ What is TexTora?

TexTora is a real-time messaging web app where users can sign up, log in, and start chatting with anyone else on the platform — instantly. Messages fly back and forth without any page refresh, online/offline status updates in real time, and you can share images directly in the chat using Cloudinary.

Think of it as a lightweight, deployable WhatsApp Web — built entirely from scratch.

---

## 🎯 Features

| Feature | Description |
|---|---|
| 🔐 **Auth System** | Secure signup & login with JWT tokens stored in cookies |
| ⚡ **Real-Time Messaging** | Instant two-way messaging powered by Socket.IO |
| 🟢 **Online Status** | See who's active — live green dot indicators |
| 📩 **Unread Count** | Badge shows unread messages per conversation |
| 🖼️ **Image Sharing** | Upload and send images, stored via Cloudinary CDN |
| 🔔 **Toast Notifications** | Clean, non-intrusive alerts for key events |
| 🛡️ **Protected Routes** | Unauthenticated users can't access the chat |
| 📱 **Responsive Design** | Works on desktop and mobile screens |

---

## 🧱 Tech Stack

<div align="center">

### Frontend
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Redux](https://img.shields.io/badge/Redux_Toolkit-764ABC?style=for-the-badge&logo=redux&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.IO-010101?style=for-the-badge&logo=socket.io)

### Backend
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

### Cloud & Deployment
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)
![MongoDB Atlas](https://img.shields.io/badge/MongoDB_Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

</div>

---

## 📂 Project Structure

```
TexTora/
│
├── 📁 Backend/
│   ├── 📁 controllers/       # Route handler logic
│   ├── 📁 models/            # Mongoose schemas (User, Message)
│   ├── 📁 middlewares/       # JWT auth middleware
│   ├── 📁 config/            # DB connection & env setup
│   ├── 📄 server.js          # Entry point + Socket.IO setup
│   └── 📄 cloudinary.js      # Cloudinary configuration
│
├── 📁 Frontend/
│   └── 📁 src/
│       ├── 📁 apiCalls/      # Axios API functions
│       ├── 📁 components/    # Reusable UI components
│       ├── 📁 pages/         # Login, Signup, Chat pages
│       ├── 📁 redux/         # State management slices
│       └── 📄 App.jsx        # Root component & routes
│
└── 📄 README.md
```

---

## ⚙️ Local Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Cloudinary account

### 1. Clone the repo

```bash
git clone https://github.com/Sourish73/TexTora.git
cd TexTora
```

### 2. Backend setup

```bash
cd Backend
npm install
```

Create a `config.env` file in `/Backend/config/`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_strong_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

```bash
npm run dev
```

### 3. Frontend setup

```bash
cd ../Frontend
npm install
```

Create a `.env` file in `/Frontend/`:

```env
VITE_API_BASE_URL=http://localhost:5000
```

```bash
npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 🔐 How Authentication Works

```
User fills Signup/Login form
        │
        ▼
Server validates credentials
        │
        ▼
JWT token generated → stored as HTTP-only cookie
        │
        ▼
Socket.IO connection established (authenticated user)
        │
        ▼
User enters chat — real-time events begin
```

---

## 🖼️ How Image Sharing Works

```
User selects image in chat input
        │
        ▼
Frontend converts to Base64
        │
        ▼
Sent to backend API endpoint
        │
        ▼
Backend uploads to Cloudinary → gets secure URL
        │
        ▼
URL stored in MongoDB message document
        │
        ▼
Rendered in chat for both users via Socket.IO
```

---

## 🌐 Deployment

| Service | Platform | URL |
|---|---|---|
| Frontend | Render (Static Site) | [textora.onrender.com](https://textora.onrender.com) |
| Backend | Render (Web Service) | [textora-backend-2ggr.onrender.com](https://textora-backend-2ggr.onrender.com) |
| Database | MongoDB Atlas | Cloud-hosted |
| Media | Cloudinary | CDN-delivered |

---


---

## 👨‍💻 Author

<div align="center">

**Sourish Sinha**  
B.Tech CSE | Full Stack Developer  

[![GitHub](https://img.shields.io/badge/GitHub-Sourish73-181717?style=for-the-badge&logo=github)](https://github.com/Sourish73)

</div>

---

<div align="center">

**If you found this useful, drop a ⭐ — it genuinely helps!**

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&size=16&pause=1000&color=6C63FF&center=true&vCenter=true&width=400&lines=Thanks+for+visiting+TexTora!+💬" alt="Thanks" />

</div>
