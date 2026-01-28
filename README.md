## Subscription Management Dashboard
A full-stack SaaS admin dashboard for managing subscriptions with user authentication, subscription management, and admin features. Built as a technical assessment for GNXTace Technologies.

## Features
### Authentication & Authorization
- JWT-based authentication with access & refresh tokens

- Role-based access control (Admin/User)

- Secure password hashing with bcrypt

- Auto-logout and silent token refresh

### Subscription Management
- Browse available subscription plans

- Subscribe to plans with automatic date calculation

- View active subscription details

- Track subscription status (active/expired/cancelled)

### Admin Dashboard
- View all user subscriptions

- Filter subscriptions by status

- User management interface

- Create and manage subscription plans

### UI/UX Features
- Responsive design with Tailwind CSS

- Dark/Light theme toggle (Bonus Feature)

- Clean, professional interface

- Real-time status indicators

- Loading states and error handling

### Technical Features
- RESTful API with Express.js

- PostgreSQL database with Knex.js ORM

- Input validation with Joi

- Error handling with structured responses

- Database seeding with sample plans

## Tech Stack
### Backend
- **Runtime:** Node.js 25.5.0

- **Framework:** Express.js

- **Database:** PostgreSQL

- **ORM:** Knex.js

- **Authentication:** JWT + Refresh Tokens

- **Validation:** Joi

- **Security:** bcryptjs, helmet, cors

### Frontend
- **Framework:** React.js 18.2.0

- **Build Tool:** Vite

- **Styling:** Tailwind CSS

- **State Management:** Redux Toolkit

- **Routing:** React Router DOM

- **HTTP Client:** Axios

- **Icons:** React Icons

- **Notifications:** React Hot Toast

## Project Structure

```
subscription-dashboard-task/
├── server/                 # Backend API
│   ├── config/            # Database & JWT configuration
│   ├── middleware/        # Auth & validation middleware
│   ├── routes/           # API routes
│   ├── validation/       # Joi validation schemas
│   ├── db/              # Database schema
│   ├── .env.example     # Environment variables template
│   ├── server.js        # Main server file
│   ├── seed.js          # Database seeder
│   └── package.json
├── client/               # Frontend React App
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── store/       # Redux slices & store
│   │   ├── services/    # API services
│   │   ├── hooks/       # Custom hooks
│   │   ├── App.jsx      # Main App component
│   │   └── main.jsx     # Entry point
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── vite.config.js
├── README.md
├── LICENSE
└── .gitignore
```

## Setup Instructions
### Prerequisites
- Node.js 25.5.0 or higher

- PostgreSQL 12 or higher

- Git

### Step 1: Clone the Repository

git clone https://github.com/suryasiddharth02/subscription-dashboard-task.git

cd subscription-dashboard-task
### Step 2: Database Setup
### Option A: Using PostgreSQL CLI
bash
### Connect to PostgreSQL
psql -U postgres

### Create database
CREATE DATABASE subscription_db;

### Exit psql
\q
### Option B: Using SQL File
bash
### Run the schema file
psql -U postgres -d subscription_db -f server/db/schema.sql
### Step 3: Backend Setup
bash
### Navigate to server directory
cd server

### Install dependencies
npm install

### Configure environment variables
cp .env.example .env
### Edit .env with your database credentials

### Seed the database
npm run seed

### Start the backend server
npm run dev

### Default Backend Port: http://localhost:5000

### Step 4: Frontend Setup
bash
### Navigate to client directory
cd client

### Install dependencies
npm install

### Start the frontend server
npm run dev

### Default Frontend Port: http://localhost:5173

## API Endpoints
### Authentication
- POST /api/auth/register - Register a new user

- POST /api/auth/login - User login

- POST /api/auth/refresh - Refresh access token

### Plans
- GET /api/plans - Get all available plans

- GET /api/plans/:id - Get specific plan details

### Subscriptions
- POST /api/subscriptions/subscribe/:planId - Subscribe to a plan

- GET /api/subscriptions/my-subscription - Get user's active subscription

### Admin (Admin Only)
- GET /api/admin/subscriptions - Get all subscriptions

- GET /api/admin/users - Get all users

- POST /api/admin/plans - Create new plan

### Pages & Routes
## Public Routes
- /login - User login page

- /register - User registration page

### Protected Routes (Authenticated Users)
- /dashboard - User dashboard with subscription details

- /plans - Browse and subscribe to plans

### Admin Routes (Admin Only)
- /admin/subscriptions - Admin dashboard for all subscriptions

## User Roles
### Regular User
- Can register and login

- Can browse available plans

- Can subscribe to a plan

- Can view their own subscription

- Cannot access admin routes

### Admin User
- All regular user permissions

- Can view all subscriptions

- Can view all users

- Can create new plans

- Can access /admin/* routes

## Default Credentials
### Admin Account
- **Email:** admin@example.com

- **Password:** admin123

- **Role:** Admin

### Regular User Account
- **Email:** user@example.com

- **Password:** user123

- **Role:** User

## Dark/Light Theme
The application includes a theme toggle feature:

- Click the theme toggle button in the navigation bar

- Theme preference is saved in localStorage

- Follows system theme preference by default

- Smooth transitions between themes

## Testing the Application
### 1. Registration & Login
- Navigate to /register to create a new account

- Or use demo credentials to login at /login

### 2. Browse Plans
- Navigate to /plans to view available subscription plans

- Each plan shows features, price, and duration

### 3. Subscribe to Plan
- Click "Subscribe Now" on any plan

- System will create an active subscription

- Redirects to dashboard with subscription details

### 4. View Subscription
- Navigate to /dashboard to view active subscription

- Shows plan details, pricing, and expiration date

### 5. Admin Features
- Login with admin credentials

- Navigate to /admin/subscriptions

- View all user subscriptions with filtering options

## Deployment
### Backend Deployment (Render/Railway)
1. Connect your GitHub repository

2. Set environment variables from .env.example

3. Set start command: npm start

4. Add PostgreSQL database

### Frontend Deployment (Vercel/Netlify)
1. Connect your GitHub repository

2. Set build command: npm run build

3. Set output directory: dist

4. Add environment variable: VITE_API_URL = your backend URL

## Database Schema
### Users Table

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
### Plans Table

CREATE TABLE plans (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    duration INTEGER NOT NULL,
    features TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
### Subscriptions Table

CREATE TABLE subscriptions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    plan_id INTEGER REFERENCES plans(id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
## Environment Variables
### Backend (.env)

NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=subscription_db
ACCESS_TOKEN_SECRET=your_jwt_secret
REFRESH_TOKEN_SECRET=your_refresh_secret
CLIENT_URL=http://localhost:5173

### Frontend (.env)

VITE_API_URL=http://localhost:5000/api

## Troubleshooting
### Common Issues
### 1. Database Connection Failed

- Ensure PostgreSQL is running

- Check credentials in .env file

- Verify database subscription_db exists

### 2. Frontend Not Connecting to Backend

- Check if backend is running on port 5000

- Verify CORS configuration

- Check browser console for errors

### 3. Authentication Issues

- Clear browser localStorage

- Check JWT token expiration

- Verify user exists in database

### 4. Port Already in Use

netstat -ano | findstr :5000
taskkill /PID <PID> /F

## Debug Commands
node --version

pg_isready

netstat -ano | findstr :5000
netstat -ano | findstr :5173
## API Testing with Postman
### Authentication
http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
}
### Get Plans
http
GET http://localhost:5000/api/plans
Authorization: Bearer <access_token>
### Subscribe to Plan
http
POST http://localhost:5000/api/subscriptions/subscribe/1
Authorization: Bearer <access_token>
## Bonus Features Implemented
### Dark/Light Theme Toggle

- Persistent theme preference

- System theme detection

- Smooth transitions

### Responsive Design

- Mobile-first approach

- Tablet and desktop optimized

- Consistent across devices

### Enhanced UI/UX

- Loading states

- Error boundaries

- Toast notifications

- Form validation


## Author
### Surya Siddharth

GitHub: @suryasiddharth02

Email: suryasiddharth02@gmail.com

LinkedIn: https://www.linkedin.com/in/suryasiddharth75/

## Acknowledgements
GNXTace Technologies for the assessment opportunity

React and Node.js communities

Tailwind CSS for the amazing utility-first framework

All open-source contributors

## Support
For support, email suryasiddharth02@gmail.com or create an issue in the GitHub repository.

