# HomeGenie

HomeGenie is a home-services marketplace with a React frontend and a Django REST backend.

## What works now

- User signup and login with token-based authentication
- Partner signup and login with token-based authentication
- Service catalog API backed by the Django database
- Customer checkout that creates real saved bookings
- Customer "My Bookings" page
- Partner dashboard with saved partner services
- Partner request inbox with authenticated accept/decline actions

## Project structure

- `src/` - React frontend
- `backend/` - Django backend and API

## Frontend setup

```bash
npm install
npm start
```

The frontend runs on `http://localhost:3000`.

## Backend setup

Install Python dependencies:

```bash
python -m pip install -r backend/requirements.txt
```

Run migrations:

```bash
python backend/manage.py migrate
```

Start the backend:

```bash
python backend/manage.py runserver
```

The backend runs on `http://127.0.0.1:8000`.

## Environment variables

Optional backend environment variables:

- `DJANGO_SECRET_KEY`
- `DJANGO_DEBUG`
- `DJANGO_ALLOWED_HOSTS`
- `DJANGO_CORS_ALLOWED_ORIGINS`
- `DATABASE_URL`

Optional frontend environment variables:

- `REACT_APP_API_BASE_URL`

## Important routes

- `/` - Home page
- `/services` - Services and partner search
- `/checkout` - Customer checkout
- `/my-bookings` - Customer booking history
- `/partner` - Partner signup
- `/partner/login` - Partner login
- `/partner/dashboard` - Partner dashboard

## Admin access

Create an admin user:

```bash
python backend/manage.py createsuperuser
```

Then open:

`http://127.0.0.1:8000/admin/`
