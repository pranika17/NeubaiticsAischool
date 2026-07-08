# Free Deployment Guide

This project can run with:

- Frontend: Vercel free plan
- Backend API: Render free web service
- PostgreSQL: Neon free database, or Render PostgreSQL free for short testing

Important: Render's free PostgreSQL is useful for demos, but it currently has a 30-day limit. For a longer free PostgreSQL option, use Neon free and paste its connection string into Render as `DATABASE_URL`.

## 1. Backend on Render

Create a new Render web service from this repository.

Use these settings:

- Root Directory: leave empty
- Build Command: `bash backend/build.sh`
- Start Command: `cd backend && python -m gunicorn lms_api.wsgi:application`
- Plan: Free

Add these environment variables in Render:

```text
DEBUG=False
SECRET_KEY=<generate a strong secret>
ALLOWED_HOSTS=<your-render-service>.onrender.com
FRONTEND_BASE_URL=https://<your-vercel-app>.vercel.app
CSRF_TRUSTED_ORIGINS=https://<your-vercel-app>.vercel.app
DATABASE_URL=<your PostgreSQL connection string>
OPENAI_API_KEY=<your OpenAI key>
RAZORPAY_KEY_ID=<your Razorpay key id>
RAZORPAY_KEY_SECRET=<your Razorpay secret>
EMAIL_HOST_USER=<your email>
EMAIL_HOST_PASSWORD=<your email app password>
DEFAULT_FROM_EMAIL=<your email>
DJANGO_SUPERUSER_USERNAME=<admin username>
DJANGO_SUPERUSER_EMAIL=<admin email>
DJANGO_SUPERUSER_PASSWORD=<admin password>
```

Render will install Python packages, collect static files, and run migrations from `backend/build.sh`.
If the `DJANGO_SUPERUSER_*` variables are set, the build also creates or updates that Django admin user in the live database.

## 2. PostgreSQL

Recommended free setup:

1. Create a free Neon project.
2. Copy the pooled PostgreSQL connection string.
3. Paste it into Render as `DATABASE_URL`.

For a temporary demo, you can also use the `render.yaml` database block to create a Render free PostgreSQL database.

## 3. Frontend on Vercel

Create a Vercel project from this repository.

Use these settings:

- Root Directory: `frontend/frontend`
- Framework Preset: Create React App
- Build Command: `npm run build`
- Output Directory: `build`

Add these Vercel environment variables:

```text
REACT_APP_API_BASE_URL=https://<your-render-service>.onrender.com/api
REACT_APP_SITE_URL=https://<your-render-service>.onrender.com
REACT_APP_ADMIN_URL=https://<your-render-service>.onrender.com/admin/login/?next=/admin/
```

After Vercel deploys, copy the Vercel URL and update Render:

```text
FRONTEND_BASE_URL=https://<your-vercel-app>.vercel.app
CSRF_TRUSTED_ORIGINS=https://<your-vercel-app>.vercel.app
```

Then redeploy the Render service.

## 4. After Deployment

The live Render database is separate from your local SQLite/MySQL database. A local admin account will not work live unless you create the same account in production.

Preferred: set these Render environment variables and redeploy:

```text
DJANGO_SUPERUSER_USERNAME=<admin username>
DJANGO_SUPERUSER_EMAIL=<admin email>
DJANGO_SUPERUSER_PASSWORD=<admin password>
```

Alternative: run this once from the Render shell if you need an admin account manually:

```bash
cd backend
python manage.py createsuperuser
```

Uploaded media files on Render free storage may not be permanent after redeploys. For client production, move uploads to Cloudinary, S3, or another external storage service.
