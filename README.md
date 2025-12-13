# 🗂️ Notice Board Management System

A full-stack **Notice Board Management System** that allows HR/Admin users to create, publish, and manage notices for departments or individual employees. The system supports **Published** and **Draft** notices with dynamic status handling and a clean, professional UI.

---

## 📌 Project Overview

This project is designed to simplify internal communication within an organization. Admins can:

* Create notices with title, type, target audience, and attachments
* Publish notices instantly or save them as drafts
* View all notices in a single table
* Track notice status (Published / Unpublished)
* Manage notices from a centralized dashboard

The application follows a **client-server architecture** using React for the frontend and Node.js + Express for the backend, with MongoDB as the database.

---

## 🛠️ Tech Stack

### Frontend

* **React** (Vite)
* **React Router**
* **Tailwind CSS**
* **React Icons**
* **SweetAlert2**

### Backend

* **Node.js**
* **Express.js**
* **MongoDB** (MongoDB Atlas)
* **dotenv**
* **CORS**

---

## ⚙️ Installation Steps

### 1️⃣ Clone the Repository

```bash
git clone <your-repository-url>
cd notice-board-project
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create a **.env** file in the backend root directory (see ENV section below).

Run the backend server:

```bash
npm start
```

Server will run on:

```
http://localhost:3000
```

---

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on:

```
http://localhost:5173
```

---

## 🔐 Environment Variables (.env)

Create a `.env` file in the **backend root directory** and add the following variables:

```env
DB_USER=your_mongodb_username
DB_PASS=your_mongodb_password
```

🔹 These credentials are used to securely connect to **MongoDB Atlas**.

⚠️ **Important:** Never push the `.env` file to GitHub. Make sure it is included in `.gitignore`.

---





