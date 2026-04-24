# 🚀 SmartHire AI

AI-powered recruitment platform for job posting, resume analysis, and candidate shortlisting.

vercel URL :  https://smart-hire-ai-kappa.vercel.app

Admin UserName : admin@gmail.com
Admin password : admin123

---

## 📌 Features

### 👤 Candidate

* Register & Login
* Browse Jobs
* Apply with Resume (PDF)
* AI Resume Scoring (ATS + AI)

### 🧑‍💼 HR

* Create Jobs
* View Candidates
* Filter Top Candidates
* Approve / Reject Candidates
* View & Download Resume
* Email Notifications (with Resume Attachment)

---

## 🛠 Tech Stack

### Backend

* Django + Django REST Framework
* MongoDB (PyMongo)
* JWT Authentication

### Frontend

* React.js
* Tailwind CSS

### AI

* Resume Parsing
* Keyword Matching
* AI Scoring

---

## 📁 Project Structure

smart-hire-ai/
│
├── backend/
│   ├── recruitment/
│   ├── users/
│   ├── db.py
│
├── frontend/
│   ├── src/
│
└── README.md

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository

git clone https://github.com/YOUR_USERNAME/smart-hire-ai.git

---

### 2️⃣ Backend Setup

cd backend
python -m venv venv
venv\Scripts\activate   # Windows

pip install -r requirements.txt

---

### 3️⃣ Environment Variables

Create `.env` file:

MONGO_URI=mongodb://localhost:27017/
EMAIL_USER=[your_email@gmail.com](mailto:your_email@gmail.com)
EMAIL_PASS=your_app_password

---

### 4️⃣ Run Backend

python manage.py runserver

---

### 5️⃣ Frontend Setup

cd ../frontend
npm install
npm start

---

## 🔑 Default HR Login

Email: [admin@gmail.com](mailto:admin@gmail.com)
Password: admin123

---

## 📡 API Endpoints

| Endpoint             | Method | Description        |
| -------------------- | ------ | ------------------ |
| /api/auth/register/  | POST   | Register           |
| /api/auth/login/     | POST   | Login              |
| /api/jobs/           | GET    | Get Jobs           |
| /api/apply/          | POST   | Apply Job          |
| /api/hr/pending/     | GET    | Pending Candidates |
| /api/hr/approve/:id/ | POST   | Approve            |
| /api/hr/reject/:id/  | POST   | Reject             |
| /api/resume/:id/     | GET    | View Resume        |

---

## 📸 Screenshots

(Add later)

---

## 👨‍💻 Author

Dhanush Bandary

---

## ⭐ GitHub

If you like this project, give it a ⭐
