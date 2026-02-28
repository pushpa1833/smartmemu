# Govindha Canteen - Deployment Guide for Render

## Prerequisites
1. GitHub account
2. Render account (free tier)

---

## Step 1: Prepare Your Code for Deployment

### 1.1 Create MongoDB Atlas Database
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a free cluster
4. Create a database user (username/password)
5. Get your connection string (replace password in the string)
6. Network Access: Add IP address `0.0.0.0/0` for global access

### 1.2 Update Environment Variables
Create a `.env` file in `backend-nodejs/`:
```
env
MONGO_URI=your-mongodb-atlas-connection-string
JWT_SECRET=any-random-secret-string-at-least-32-chars
PORT=5000
```

---

## Step 2: Push Code to GitHub

1. Create a new repository on GitHub
2. Initialize git and push your code:
```
bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/your-username/govindha-canteen.git
git push -u origin main
```

---

## Step 3: Deploy Backend to Render

### 3.1 Create Backend Service
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: govindha-canteen-backend
   - **Environment**: Node
   - **Build Command**: npm install
   - **Start Command**: node server.js
5. Add Environment Variables:
   - `MONGO_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: Any random string
   - `PORT`: 5000
6. Click "Create Web Service"

### 3.2 Get Backend URL
After deployment, copy your backend URL (e.g., `https://govindha-canteen-backend.onrender.com`)

---

## Step 4: Deploy Frontend to Render

### 4.1 Update API Configuration
Update `frontend-react/src/api/axios.js` to use environment variable:
```
javascript
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;
```

### 4.2 Update package.json for Build
Add homepage field:
```
json
{
  "name": "frontend",
  "private": true,
  "version": "0.0.0",
  "homepage": "https://your-frontend-url.onrender.com",
  "type": "module",
  ...
}
```

### 4.3 Create Frontend Service
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: govindha-canteen-frontend
   - **Environment**: Static Site
   - **Build Command**: npm run build
   - **Publish directory**: dist
5. Add Environment Variables:
   - `VITE_API_URL`: Your backend URL + /api (e.g., https://govindha-canteen-backend.onrender.com/api)
6. Click "Create Web Service"

---

## Step 5: Verify Deployment

1. Frontend URL: `https://govindha-canteen-frontend.onrender.com`
2. Backend API: `https://govindha-canteen-backend.onrender.com/api`
3. Test the endpoints:
   - Health: `https://govindha-canteen-backend.onrender.com/api/health`

---

## Default Admin Credentials
- Email: admin@govindha.com
- Password: admin123

---

## Important Notes

1. **Free Tier Limitations**:
   - Backend goes to sleep after 15 minutes of inactivity
   - First request after sleep takes ~30 seconds
   - 750 hours of runtime per month

2. **Database**: The free tier of MongoDB Atlas provides 512MB storage

3. **CORS**: Backend is already configured to allow all origins (`origin: "*"`)

---

## Troubleshooting

### Backend Issues
- Check Render logs for errors
- Verify MongoDB connection string
- Ensure environment variables are set correctly

### Frontend Issues
- Rebuild the frontend after API URL changes
- Check browser console for CORS errors

### Database Connection
- Verify MongoDB Atlas IP whitelist includes 0.0.0.0/0
- Check that username/password in connection string are correct
