# MIET Placement Tracker Dashboard

Production-ready full-stack placement tracker for **Meerut Institute of Engineering and Technology, Meerut**. The platform supports Admin, Faculty, and Student roles with placement-drive management, Google Forms integration, analytics sync, email communication, and real-time notifications.

## Stack

- Frontend: React + Vite, Tailwind CSS, Framer Motion, Three.js, Redux Toolkit
- Backend: Node.js, Express.js, JWT auth, Socket.io, Nodemailer
- Database: MongoDB for operational data and analytics
- Integrations: Google Forms API, Power BI, Excel export

## Project Structure

```text
backend/
  src/
    config/
    controllers/
    middleware/
    models/
    routes/
    utils/
    validators/
frontend/
  src/
    components/
    lib/
    pages/
    store/
```

## Core Modules

- Authentication with JWT, bcrypt password hashing, role-based access control, rate limiting, and validation
- Placement drive lifecycle with eligibility rules, deadlines, auto-close behavior, and drive applications
- Smart form workflow using Google Forms API with local fallback and MongoDB response persistence
- Real-time notifications over Socket.io with optional email delivery
- Student readiness scoring driven by academics, skills, strengths, and weaknesses
- Analytics powered directly from MongoDB aggregates

## Backend Setup

1. Open [backend/.env.example](/c:/Users/Mohd.%20Shaquib/OneDrive/Desktop/project/backend/.env.example) and create `backend/.env`.
2. Set MongoDB, SMTP, JWT, and Google service-account credentials.
3. Install dependencies:

```bash
cd backend
npm install
```

4. Start the API:

```bash
npm run dev
```

The backend exposes:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `PATCH /api/auth/me`
- `GET /api/users`
- `PATCH /api/users/:id/status`
- `GET /api/drives`
- `POST /api/drives`
- `GET /api/drives/:id`
- `POST /api/drives/:id/apply`
- `GET /api/drives/:id/applications`
- `GET /api/drives/:id/applications/export`
- `PATCH /api/drives/:id/toggle-registration`
- `PATCH /api/drives/applications/:applicationId/status`
- `GET /api/notifications`
- `POST /api/notifications`
- `PATCH /api/notifications/:id/read`
- `GET /api/analytics/overview`
- `GET /api/analytics/student`
- `GET /api/analytics/historical`
- `GET /api/forms/drive/:driveId`

### Local MongoDB on `localhost:27017`

If you are running MongoDB locally, use this in `backend/.env`:

```env
MONGO_URI=mongodb://127.0.0.1:27017
MONGO_DB_NAME=placement_tracker
```

This project connects to MongoDB in [backend/src/config/mongo.js](/c:/Users/Mohd.%20Shaquib/OneDrive/Desktop/project/backend/src/config/mongo.js), and Mongoose will use the `placement_tracker` database name by default.

### Minimum Local Backend `.env`

Use this as a practical starter setup for local development:

```env
PORT=5000
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb://127.0.0.1:27017
MONGO_DB_NAME=placement_tracker
JWT_SECRET=super_secret_jwt_key
JWT_EXPIRES_IN=7d
ADMIN_NAME=Placement Admin
ADMIN_EMAIL=admin@miet.ac.in
ADMIN_PHONE=9999999999
ADMIN_PASSWORD=StrongPassword123!
```

## Frontend Setup

1. Open [frontend/.env.example](/c:/Users/Mohd.%20Shaquib/OneDrive/Desktop/project/frontend/.env.example) and create `frontend/.env`.
2. Point `VITE_API_URL` and `VITE_SOCKET_URL` to your backend.
3. Install dependencies:

```bash
cd frontend
npm install
```

4. Start the frontend:

```bash
npm run dev
```

## How To Register And Login

The frontend auth screen is in [frontend/src/pages/LoginPage.jsx](/c:/Users/Mohd.%20Shaquib/OneDrive/Desktop/project/frontend/src/pages/LoginPage.jsx) and the backend routes are in [backend/src/routes/authRoutes.js](/c:/Users/Mohd.%20Shaquib/OneDrive/Desktop/project/backend/src/routes/authRoutes.js).

1. Start MongoDB on `127.0.0.1:27017`.
2. Run the backend with `npm run dev` inside `backend/`.
3. Run the frontend with `npm run dev` inside `frontend/`.
4. Open `http://localhost:5173/login`.
5. To register, switch to the `Register` tab, choose `student` or `faculty`, fill the form, and submit.
6. To log in, use the same email and password on the `Login` tab.
7. For admin login, use the seeded admin account from `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `backend/.env`.

Important auth notes:

- Public registration allows only `student` and `faculty`.
- Passwords are hashed with bcrypt before saving to MongoDB.
- After login or registration, the JWT token is stored in browser `localStorage`.
- Existing sessions are restored through `GET /api/auth/me`.

If registration fails, first verify that MongoDB is running and that `MONGO_URI=mongodb://127.0.0.1:27017` is correctly set in `backend/.env`.

## Google Forms Integration

The backend service in [backend/src/utils/googleForms.js](/c:/Users/Mohd.%20Shaquib/OneDrive/Desktop/project/backend/src/utils/googleForms.js) creates a Google Form for each drive when service-account credentials are present.

- Required scopes: Forms, Drive, and Sheets access
- The service account must be allowed to create Forms in the target Google Workspace
- If credentials are not configured, the app falls back to a local application URL so drive publishing still works

Suggested service-account flow:

1. Create a Google Cloud project.
2. Enable `Google Forms API`, `Google Drive API`, and `Google Sheets API`.
3. Create a service account and download the JSON key.
4. Map `client_email` to `GOOGLE_CLIENT_EMAIL`.
5. Map `private_key` to `GOOGLE_PRIVATE_KEY`, preserving line breaks as `\n`.

## Email Notifications

The mailer in [backend/src/utils/mailer.js](/c:/Users/Mohd.%20Shaquib/OneDrive/Desktop/project/backend/src/utils/mailer.js) uses SMTP through Nodemailer.

- New placement drives trigger student notifications and email
- Deadline reminders are sent by the scheduler
- Application status updates trigger direct emails

For Gmail SMTP, generate an App Password and use:

- `SMTP_HOST=smtp.gmail.com`
- `SMTP_PORT=587`
- `SMTP_USER=<gmail address>`
- `SMTP_PASS=<app password>`

## MongoDB Analytics

Analytics are computed directly from MongoDB collections for placement summaries, company performance, and yearly trends.

## Deployment

Deployment guidance is documented in [docs/deployment-guide.md](/c:/Users/Mohd.%20Shaquib/OneDrive/Desktop/project/docs/deployment-guide.md).

- Backend target: Render
- Frontend target: Vercel
- Data services: MongoDB Atlas

## Recommended Production Hardening

- Put Render and Vercel behind institution-owned domains
- Store secrets in platform environment-variable vaults only
- Add audit logging for administrative actions
- Run scheduled jobs using platform cron or a worker process
- Add CI checks for linting, build, and API tests

## Notes

- The repo now contains the full backend and frontend application scaffold wired to the required services.
- Dependency installation was not completed inside this session, so run the install commands locally before starting the apps.
