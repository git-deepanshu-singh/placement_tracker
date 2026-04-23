# Deployment Guide

This guide deploys the application with:

- Frontend on **Vercel**
- Backend on **Render**
- MongoDB on **MongoDB Atlas**
- Analytics computed directly from **MongoDB**

## 1. MongoDB Atlas

1. Create a cluster and database user.
2. Add your Render IP access or temporarily allow broader access during setup.
3. Copy the connection string into `MONGO_URI`.

## 2. Backend on Render

1. Create a new Web Service from the `backend/` directory, or use the repo-root [render.yaml](/c:/Users/Mohd.%20Shaquib/OneDrive/Desktop/project/render.yaml) blueprint.
2. Build command:

```bash
npm ci
```

3. Start command:

```bash
npm start
```

4. Add environment variables from [backend/.env.example](/c:/Users/Mohd.%20Shaquib/OneDrive/Desktop/project/backend/.env.example).
5. Set `CLIENT_URL` to your Vercel production URL.
6. If you want dedicated reminder execution, add a Render background worker for the scheduler.

## 3. Frontend on Vercel

1. Import the repo and set the root directory to `frontend/`.
2. Framework preset: `Vite`.
3. Build command:

```bash
npm run build
```

4. Output directory: `dist`.
5. Add environment variables from [frontend/.env.example](/c:/Users/Mohd.%20Shaquib/OneDrive/Desktop/project/frontend/.env.example).
6. Set `VITE_API_URL` to `https://your-render-service.onrender.com/api`.
7. Set `VITE_SOCKET_URL` to `https://your-render-service.onrender.com`.

## 4. Google APIs

1. Add your service-account secrets to Render.
2. Confirm the Forms, Sheets, and Drive APIs are enabled.
3. If the institution uses Google Workspace policies, whitelist the service account.

## 5. SMTP

1. Configure SMTP secrets in Render.
2. Verify the sender domain if using an enterprise mail provider.

## 6. Production Checklist

- `JWT_SECRET` is rotated and strong
- HTTPS is enforced by hosting platforms
- CORS `CLIENT_URL` includes only known origins
- MongoDB uses a least-privilege database user
- Power BI connects with read-only MongoDB credentials or exported reports
- Admin seed credentials are changed after first login

## 7. Scaling Notes

- Move the scheduler into a worker or cron service
- Add Redis if notification fan-out grows
- Add object storage for resumes and exported reports
- Add observability through Sentry, OpenTelemetry, or platform-native logs
