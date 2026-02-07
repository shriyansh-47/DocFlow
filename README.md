# DocFlow — Smart Document Approval & Tracking System

DocFlow is a full-stack web application that automates document classification, routing, and multi-stage approval. Students upload documents (`.txt` or `.pdf`), which are automatically classified using **NLP (Naive Bayes)** into one of three categories — **Admissions**, **Scholarship**, or **Internship** — and routed to the appropriate department head for review. After department approval, the document is forwarded to an admin for final sign-off.

---

## Features

- **NLP-Based Document Classification** — Trained Naive Bayes classifier (261 statements) auto-categorizes uploads into Admissions, Scholarship, Internship, or rejects unrelated documents
- **Three-Stage Approval Workflow** — Student Upload → Department Review → Admin Final Approval
- **Role-Based Access Control** — JWT authentication with 3 roles: Student, Department Head, Admin
- **Real-Time Status Tracking** — Students can track document progress through the approval pipeline
- **Dark/Light Theme Toggle** — Persistent theme preference stored in localStorage
- **Clear History** — Students can clear finalized documents from their history

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, Axios, React Router DOM |
| **Backend** | Node.js, Express.js |
| **Authentication** | JWT (jsonwebtoken), bcryptjs |
| **NLP** | [natural](https://www.npmjs.com/package/natural) — Naive Bayes Classifier |
| **File Processing** | Multer (upload), pdf-parse (PDF text extraction) |
| **Data Store** | In-memory (prototype) + JSON file (users) |

---

## Project Structure

```
DocFlow/
├── client/                     # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   └── UploadForm.js
│   │   ├── pages/
│   │   │   ├── LoginPage.js        # Single login page for all roles
│   │   │   ├── StudentPortal.js    # Upload & track documents
│   │   │   ├── DepartmentPortal.js # Review & approve/reject
│   │   │   └── AdminPortal.js      # Final approval
│   │   ├── App.js                  # Role-based portal rendering
│   │   └── index.css               # Themes & styling
│   └── package.json
│
├── server/                     # Node.js Backend
│   ├── config.js                   # App constants (file size, JWT secret, NLP threshold)
│   ├── index.js                    # Express server entry point
│   ├── store.js                    # In-memory document store
│   ├── data/
│   │   ├── users.json              # User database (bcrypt-hashed passwords)
│   │   └── classifier.json         # Trained NLP model
│   ├── middleware/
│   │   └── authMiddleware.js       # JWT verification & role guards
│   ├── routes/
│   │   ├── auth.js                 # POST /api/auth/login
│   │   ├── upload.js               # POST /api/upload
│   │   ├── documents.js            # GET/DELETE /api/documents
│   │   ├── department.js           # Department review endpoints
│   │   └── admin.js                # Admin approval endpoints
│   ├── validators/
│   │   └── documentValidator.js    # NLP-based document classifier
│   ├── utils/
│   │   └── extractText.js          # Text extraction from .txt/.pdf
│   └── scripts/
│       ├── seedUsers.js            # Generate users.json with hashed passwords
│       └── trainClassifier.js      # Train the NLP model (261 statements)
│
└── package.json                # Root package with dev scripts
```

---

## Login Credentials

| Role | Username | Password | Portal Access |
|------|----------|----------|---------------|
| **Student** | `student1` | `student123` | Upload documents & track status |
| **Admissions Head** | `admissions_head` | `admit123` | Review admissions documents |
| **Scholarship Head** | `scholarship_head` | `scholar123` | Review scholarship documents |
| **Internship Head** | `internship_head` | `intern123` | Review internship documents |
| **Admin** | `admin1` | `admin123` | Final approval for all documents |

> **Note:** All passwords are stored as bcrypt hashes in `server/data/users.json`.

---

## How to Run

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- npm (comes with Node.js)

### 1. Clone the Repository

```bash
git clone https://github.com/anasghayas/DocFlow.git
cd DocFlow
```

### 2. Install Dependencies

```bash
# Install backend dependencies (from root)
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### 3. Seed Users & Train NLP Model (first time only)

```bash
# Generate users.json with hashed passwords
node server/scripts/seedUsers.js

# Train the NLP classifier (261 training statements)
node server/scripts/trainClassifier.js
```

### 4. Start the Application

**Option A — Run both servers together:**
```bash
npm run dev
```

**Option B — Run separately (in two terminals):**

```bash
# Terminal 1: Backend (port 5000)
npm run server

# Terminal 2: Frontend (port 3000)
npm run client
```

### 5. Open in Browser

- **Frontend:** [http://localhost:3000](http://localhost:3000)
- **Backend API:** [http://localhost:5000](http://localhost:5000)

---

## Document Approval Workflow

```
Student uploads document (.txt / .pdf)
        │
        ▼
NLP Classifier analyzes text content
        │
        ├── Admissions (≥60% confidence) → Admissions Dept. Head
        ├── Scholarship (≥60% confidence) → Scholarship Dept. Head
        ├── Internship (≥60% confidence) → Internship Dept. Head
        └── Unrelated / Low confidence → ❌ Rejected immediately
        │
        ▼
Department Head reviews
        │
        ├── Approve → Forwarded to Admin
        └── Reject → ❌ Rejected (student notified)
        │
        ▼
Admin performs final review
        │
        ├── Approve → ✅ Fully Approved
        └── Reject → ❌ Rejected (student notified)
```

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/login` | None | Login with username & password |
| `POST` | `/api/upload` | Student | Upload a document |
| `GET` | `/api/documents` | Student | List student's own documents |
| `DELETE` | `/api/documents/clear` | Student | Clear all finalized documents |
| `DELETE` | `/api/documents/:id` | Student | Clear a single finalized document |
| `GET` | `/api/department/pending/:dept` | Department | Pending documents for department |
| `GET` | `/api/department/all/:dept` | Department | All documents for department |
| `POST` | `/api/department/review/:id` | Department | Approve or reject a document |
| `GET` | `/api/admin/pending` | Admin | Documents pending final approval |
| `GET` | `/api/admin/all` | Admin | All documents in the system |
| `POST` | `/api/admin/review/:id` | Admin | Final approve or reject |

---

## Configuration

| Setting | Value | File |
|---------|-------|------|
| Max file size | 2 MB | `server/config.js` |
| Allowed formats | `.txt`, `.pdf` | `server/config.js` |
| JWT expiry | 8 hours | `server/routes/auth.js` |
| NLP confidence threshold | 60% | `server/config.js` |
| Backend port | 5000 | `server/index.js` |
| Frontend port | 3000 | `client/package.json` |

---

## Multi-Tab Usage

Since sessions are stored in `localStorage`, logging in on one tab overwrites another. To test all 3 portals simultaneously:

- Use **Chrome + Incognito + another browser** (e.g., Edge or Firefox)
- Or use separate **Chrome profiles**

---

## License

This project is for educational/demo purposes.
