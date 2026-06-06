# Social Post App

A full-stack MERN Social Media Application inspired by the TaskPlanet Social Feed. Users can create accounts, share posts with text or images, like posts, and comment on posts.

## 🔗 Live Demo

- Frontend: https://social-post-app-coral.vercel.app
- Backend API: https://social-post-app-hlj8.onrender.com

## 🚀 Features

- User Registration & Login
- JWT Authentication
- Create Text Posts
- Upload Image Posts
- Public Social Feed
- Like & Unlike Posts
- Add Comments
- Responsive UI
- MongoDB Atlas Integration

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Vite
- Material UI (MUI)
- Axios
- React Router DOM

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT
- Multer
- BcryptJS

---

## 📂 Project Structure

```text
social-post-app/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/nehap2110/social-post-app.git
cd social-post-app
```

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🔑 Environment Variables

### Backend (.env)

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secret_key
```

### Frontend (.env)

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 🌐 Deployment

- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

---

## 👩‍💻 Author

**Neha Patel**

GitHub: https://github.com/nehap2110
