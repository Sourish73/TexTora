🚀 TexTora — Real-Time Chat Application

TexTora is a full-stack real-time chat application built using the MERN stack.
It supports secure authentication, real-time messaging, online status, unread counts, and image sharing with a modern UI.

🌐 Live App: https://textora.onrender.com

🔗 Backend API: https://textora-backend-2ggr.onrender.com

✨ Features

🔐 JWT-based Authentication (Login & Signup)

💬 Real-time 1-to-1 messaging (Socket.IO)

🟢 Online / Offline user status

📩 Unread message counter

🖼️ Image sharing using Cloudinary

🔔 Toast notifications

🛡️ Protected routes

⚡ Fast Vite + React frontend

📱 Responsive UI

🧱 Tech Stack
Frontend

React (Vite)

React Router

Redux Toolkit

Socket.IO Client

Axios

React Hot Toast

Backend

Node.js

Express.js

MongoDB & Mongoose

Socket.IO

JWT Authentication

Cloudinary

Deployment

Frontend: Render

Backend: Render

Database: MongoDB Atlas

📂 Project Structure
TexTora/
│
├── Backend/
│   ├── controllers/
│   ├── models/
│   ├── middlewares/
│   ├── config/
│   ├── server.js
│   └── cloudinary.js
│
├── Frontend/
│   ├── src/
│   │   ├── apiCalls/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── redux/
│   │   └── App.jsx
│   └── vite.config.js
│
└── README.md

🔐 Environment Variables
Backend (config.env)
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

Frontend (Render)
VITE_API_BASE_URL=https://textora-backend-2ggr.onrender.com

🛠️ Local Setup
1️⃣ Clone repository
git clone https://github.com/Sourish73/TexTora.git
cd TexTora

2️⃣ Backend
cd Backend
npm install
npm run dev

3️⃣ Frontend
cd Frontend
npm install
npm run dev

🔐 Authentication Flow

User registers or logs in

JWT token is generated and validated

Protected routes block unauthorized access

Socket connection starts after authentication

👨‍💻 Author

Sourish Sinha
B.Tech CSE | MERN Stack Developer
🔗 GitHub: https://github.com/Sourish73

⭐ Support

If you like this project, give it a star ⭐
It really helps!