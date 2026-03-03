# Quick Setup Guide

## Prerequisites
- Node.js (v14+) installed
- MongoDB installed and running
- npm or yarn package manager

## Step-by-Step Setup

### 1. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# Windows
net start MongoDB

# macOS (if installed via Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file (copy from env.example)
# Windows
copy env.example .env

# Linux/macOS
cp env.example .env

# Edit .env file and update:
# - MONGODB_URI (if different from default)
# - JWT_SECRET (use a strong random string)

# Start backend server
npm run dev
```

Backend will run on `http://localhost:5000`

### 3. Frontend Setup

Open a new terminal:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

Frontend will run on `http://localhost:3000`

### 4. Access the Application

1. Open browser and go to `http://localhost:3000`
2. Register a new account (or login if you have one)
3. Start using the application!

## Creating Your First Admin User

To create an admin user, you can either:

1. **Using MongoDB Shell:**
```javascript
use swm_db
db.users.insertOne({
  name: "Admin User",
  email: "admin@example.com",
  password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyY5Y5Y5Y5Y5", // password: admin123
  role: "admin",
  isActive: true
})
```

2. **Or register normally and manually update the role in MongoDB:**
```javascript
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

## Default Test Accounts

After setup, you can create test accounts:
- **Citizen**: Register with role "citizen"
- **Collector**: Register with role "collector"
- **Admin**: Create manually in MongoDB (see above)

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check MONGODB_URI in backend/.env
- Default: `mongodb://localhost:27017/swm_db`

### Port Already in Use
- Backend: Change PORT in backend/.env
- Frontend: Change port in frontend/package.json scripts or use `PORT=3001 npm start`

### CORS Errors
- Ensure FRONTEND_URL in backend/.env matches your frontend URL
- Default: `http://localhost:3000`

### Module Not Found
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

## Production Deployment

### Backend
1. Set `NODE_ENV=production` in .env
2. Use `npm start` instead of `npm run dev`
3. Consider using PM2 for process management

### Frontend
1. Run `npm run build`
2. Serve the `build` folder using a web server (nginx, Apache, etc.)
3. Or use services like Vercel, Netlify, etc.

## Next Steps

1. Explore the dashboard
2. Create waste requests
3. Test route optimization
4. Submit complaints
5. View analytics (admin only)

Happy coding! 🚀

