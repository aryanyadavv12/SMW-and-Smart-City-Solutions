# Solid Waste Management and Smart City Solutions

A comprehensive full-stack MERN (MongoDB, Express.js, React.js, Node.js) application for efficient waste management, route optimization, and sustainable city solutions.

## Features

### Core Functionality
- **User Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (Citizen, Collector, Admin)
  - Secure password hashing with bcrypt

- **Waste Management**
  - Create and manage waste collection requests
  - Multiple request types (Regular Pickup, Bulk Waste, Hazardous Waste, Recycling)
  - Request status tracking (Pending, Assigned, In Progress, Completed, Cancelled)
  - Priority-based request handling

- **Collection Route Management**
  - Create and optimize collection routes
  - Assign collectors to routes
  - Real-time route status tracking
  - Distance and duration calculations

- **Complaint Management**
  - Submit and track complaints
  - Multiple complaint categories
  - Priority-based complaint handling
  - Resolution tracking

- **Analytics & Reporting**
  - Dashboard with key metrics
  - Waste statistics by type and status
  - Collection route analytics
  - Complaint statistics
  - Visual charts and graphs

- **User Management**
  - User profiles with address information
  - Admin user management
  - Collector assignment

## Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **express-rate-limit** - Rate limiting

### Frontend
- **React.js** - UI library
- **React Router** - Routing
- **Material-UI (MUI)** - Component library
- **React Query** - Data fetching and caching
- **Axios** - HTTP client
- **Recharts** - Data visualization
- **React Hook Form** - Form handling
- **React Toastify** - Notifications

## Project Structure

```
SWM/
├── backend/
│   ├── controllers/      # Request handlers
│   ├── models/           # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   ├── server.js        # Entry point
│   └── package.json
├── frontend/
│   ├── public/          # Static files
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── context/     # React context
│   │   ├── utils/       # Utility functions
│   │   ├── App.js       # Main app component
│   │   └── index.js     # Entry point
│   └── package.json
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file inside the backend folder using `env.example` as reference.
```

4. Start the backend server:
```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory (optional):
```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/updatedetails` - Update user details
- `PUT /api/auth/updatepassword` - Update password

### Users
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user by ID
- `GET /api/users/collectors` - Get all collectors
- `POST /api/users` - Create user (Admin only)
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (Admin only)

### Waste Requests
- `GET /api/waste-requests` - Get all waste requests
- `GET /api/waste-requests/:id` - Get waste request by ID
- `POST /api/waste-requests` - Create waste request
- `PUT /api/waste-requests/:id` - Update waste request
- `PUT /api/waste-requests/:id/assign` - Assign collector
- `PUT /api/waste-requests/:id/status` - Update status
- `DELETE /api/waste-requests/:id` - Delete waste request

### Collection Routes
- `GET /api/collection-routes` - Get all collection routes
- `GET /api/collection-routes/:id` - Get route by ID
- `POST /api/collection-routes` - Create collection route
- `POST /api/collection-routes/optimize` - Optimize route
- `PUT /api/collection-routes/:id` - Update route
- `DELETE /api/collection-routes/:id` - Delete route (Admin only)

### Complaints
- `GET /api/complaints` - Get all complaints
- `GET /api/complaints/:id` - Get complaint by ID
- `POST /api/complaints` - Create complaint
- `PUT /api/complaints/:id` - Update complaint
- `PUT /api/complaints/:id/resolve` - Resolve complaint (Admin only)
- `DELETE /api/complaints/:id` - Delete complaint

### Analytics
- `GET /api/analytics/dashboard` - Get dashboard stats (Admin only)
- `GET /api/analytics/waste` - Get waste statistics
- `GET /api/analytics/collection` - Get collection statistics
- `GET /api/analytics/complaints` - Get complaint statistics

## User Roles

### Citizen
- Create waste collection requests
- View own requests and their status
- Submit complaints
- Update profile

### Collector
- View assigned waste requests
- Update request status
- Create and manage collection routes
- View collection statistics

### Admin
- Full system access
- Manage all users
- View all requests, routes, and complaints
- Access analytics dashboard
- Resolve complaints
- Assign collectors to requests

## Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Role-based access control
- Input validation
- Rate limiting
- CORS configuration
- Secure error handling

## Development

### Running in Development Mode

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm start
```

### Building for Production

**Frontend:**
```bash
cd frontend
npm run build
```

The production build will be in the `frontend/build` directory.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Support

For support, email support@swm-solutions.com or create an issue in the repository.

## Acknowledgments

- Material-UI for the component library
- React Query for data fetching
- MongoDB for the database solution
- Express.js community for excellent documentation

# SWM-and-Smart-City-Solution
---

## 👨‍💻 Author

Aryan Yadav  
Full Stack Developer (MERN)  
🔗 GitHub: https://github.com/aryanyadavv12
