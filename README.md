# 🗂️ Notice Board Management System

This is the **frontend client** for the Notice Board Management System — a full-stack application that allows HR/Admin users to create, publish, edit, and manage notices for departments or individual employees, with a clean and professional UI.

---

## 📌 Project Overview

This project is designed to simplify internal communication within an organization. Admins can:

* Create notices with title, type, target audience, and an optional attachment
* Publish notices instantly or save them as drafts
* Edit, publish, or delete a notice directly from the notices table
* Track notice status (Published / Unpublished)
* See active and draft notice counts on the dashboard

The application follows a **client-server architecture** using React for the frontend and Node.js + Express for the backend, with MongoDB as the database.

---

- **🔗 Live Website:** [Visit Website](https://notice-board-client.vercel.app/)
- **💻 Client Repository:** [Client Code](https://github.com/Zannat02/Notice-board-client)
- **⚙️ Server Repository:** [Server Code](https://github.com/Zannat02/Notice-Board-server)

---

## ✨ Features

- Create, edit, and delete notices
- Publish notices or save them as drafts (a draft only needs a title)
- Publish a draft straight from the table with one click
- Dedicated **Draft Notices** page
- Active vs Draft notice count on the dashboard
- Form validation with clear error messages on the missing fields
- Custom dropdowns (single and multi select) that work with touch on mobile and tablet
- Optional JPG/PNG attachment with click or drag and drop (only the file name is saved for now)
- Loading screen and error page, so a slow server never leaves a blank page
- REST API integration with a MongoDB Atlas database
- Fully responsive UI — optimized layouts for Mobile, Tablet, and Desktop (collapsible sidebar drawer with hamburger menu on smaller screens, card view instead of the table on mobile/tablet)

---

## 🛠️ Tech Stack

### Frontend

* **React** (Vite)
* **React Router** (route loaders for data fetching)
* **Tailwind CSS**
* **React Icons**
* **SweetAlert2**
* **date-fns**

### Backend

* **Node.js**
* **Express.js**
* **MongoDB** (MongoDB Atlas)
* **dotenv**
* **CORS**

---

## 🧭 App Routes

| Route                | Page                                              |
| -------------------- | ------------------------------------------------- |
| `/`                  | Notice Management dashboard with all notices      |
| `/notice-board`      | Create a notice                                   |
| `/notice-board/:id`  | Edit a notice                                     |
| `/draft-notices`     | All draft (Unpublished) notices                   |

---

## 📂 Project Structure

```
Notice-board-client/
│
├── vercel.json              # Rewrites all routes to index.html (needed for refresh on Vercel)
├── src/
│   ├── main.jsx             # Router, loaders, loading and error screens
│   ├── config.js            # API base URL (local vs deployed)
│   ├── layout/
│   │   └── MainLayout.jsx   # Sidebar, header and page outlet
│   ├── components/
│   │   ├── AddNotice.jsx    # Create / edit notice form
│   │   ├── NoticeTable.jsx  # Table and mobile cards with publish, edit, delete
│   │   ├── Header.jsx
│   │   └── LeftAside.jsx
│   └── Pages/
│       ├── Home.jsx
│       └── DraftNotices.jsx
└── package.json
```

---

## ⚙️ Installation Steps

### 1️⃣ Clone the Repositories

```bash
git clone https://github.com/Zannat02/Notice-board-client.git
git clone https://github.com/Zannat02/Notice-Board-server.git
```

---

### 2️⃣ Backend Setup

```bash
cd Notice-Board-server
npm install
```

Create a **.env** file in the backend root directory (see the Environment Variables section below).

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
cd Notice-board-client
npm install
npm run dev
```

Frontend will run on:

```
http://localhost:5173
```

In development the client calls the local server at `http://localhost:3000`. In production it calls the deployed server. This is set in `src/config.js`:

```js
const API_URL = import.meta.env.DEV
    ? 'http://localhost:3000'
    : 'https://notice-board-server.onrender.com';

export default API_URL;
```

---

## 🔐 Environment Variables (.env)

The frontend needs no `.env` file. Create a `.env` file in the **backend root directory** and add:

```env
DB_USER=your_mongodb_username
DB_PASS=your_mongodb_password
CLIENT_URL=http://localhost:5173
```

- `DB_USER` / `DB_PASS` are used to securely connect to **MongoDB Atlas**.
- `CLIENT_URL` is the frontend URL the server allows through CORS. For the deployed server, set it to the Vercel URL (no trailing `/`), for example `https://notice-board-client.vercel.app`.

⚠️ **Important:** Never push the `.env` file to GitHub. Make sure it is included in `.gitignore`.

---

## 🚀 Deployment

- **Client:** deployed on **Vercel**. The `vercel.json` file rewrites every route to `index.html`, so refreshing a page like `/draft-notices` does not show a 404.
- **Server:** deployed on **Render**. Set `DB_USER`, `DB_PASS`, and `CLIENT_URL` in the Render dashboard.

### ⏳ First load can be slow

The server runs on Render's free plan, which puts it to sleep after about 15 minutes without traffic. The first visit after that can take up to a minute while it wakes up, and a loading screen is shown meanwhile. After that, the app is fast again.

---

## 📌 Known Limitations

- No authentication yet, anyone with the link can create, edit, and delete notices
- Attachments are not uploaded to a server, only the file name is saved
- No pagination on the notices list