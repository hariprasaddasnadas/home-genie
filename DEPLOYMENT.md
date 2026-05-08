# Deployment Guide

## Backend

Set these production environment variables:

- `DJANGO_DEBUG=False`
- `DJANGO_SECRET_KEY=<strong-secret>`
- `DJANGO_ALLOWED_HOSTS=your-backend-domain.example.com`
- `DJANGO_CORS_ALLOWED_ORIGINS=https://your-frontend-domain.example.com`
- `DJANGO_CSRF_TRUSTED_ORIGINS=https://your-frontend-domain.example.com`
- `DATABASE_URL=<your-production-database-url>`
- `RAZORPAY_KEY_ID=<your-live-razorpay-key-id>`
- `RAZORPAY_KEY_SECRET=<your-live-razorpay-key-secret>`

Then run:

```bash
python backend/manage.py migrate
python backend/manage.py collectstatic --noinput
```

Serve the Django backend with Gunicorn:

```bash
gunicorn config.wsgi --chdir backend
```

## Frontend

Create a production frontend env file using `.env.production.example` and set:

```bash
REACT_APP_API_BASE_URL=https://your-backend-domain.example.com
```

Build the frontend:

```bash
npm run build
```

Deploy the generated `build/` directory to your static hosting provider.

## Production checklist

- Use a managed production database instead of SQLite.
- Use Razorpay live keys only after test mode is fully verified.
- Keep `DJANGO_DEBUG=False` in production.
- Confirm frontend and backend domains match your CORS and CSRF settings.
- Run `python backend/manage.py check` before go-live.
