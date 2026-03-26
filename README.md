# Wanderlust - Airbnb Clone Project

A full-stack web application built with the MERN stack (MongoDB, Express, Node.js, and EJS templates) that mimics the core functionality of Airbnb. Users can browse property listings, create new listings, edit existing ones, delete listings, and post reviews for properties.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Database Configuration](#database-configuration)
- [API Routes](#api-routes)
- [Models](#models)
- [File Structure Explanation](#file-structure-explanation)
- [How to Run](#how-to-run)
- [Key Components](#key-components)

## Project Overview

Wanderlust is a property listing and review platform that allows users to:
- View all available property listings
- Create new listings with property details
- View detailed information about specific listings
- Edit and update listing details
- Delete listings from the database
- Post reviews and ratings for properties
- Delete reviews from properties

The application uses **MongoDB** for data persistence, **Express** for routing, **Node.js** for the server runtime, and **EJS** templates for server-side rendering.

## Features

✅ **Listings Management**
- Display all listings with index view
- View individual listing details
- Create new listings through form submission
- Edit existing listings
- Delete listings (with cascading review deletion)

✅ **Reviews System**
- Add reviews with comments and ratings (1-5 stars)
- Display reviews on listing detail pages
- Delete reviews from listings
- Timestamp tracking for review creation

✅ **Data Validation**
- Schema validation using Joi for listing data
- Schema validation for review data
- Custom error handling with ExpressError class
- Validation middleware for request data

✅ **Session Management**
- Express session support
- Secure session configuration
- 7-day session expiration
- HTTP-only cookie security

✅ **Error Handling**
- Custom error middleware
- Centralized error handling
- Custom error page display
- Detailed error logging

## Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** (v5.2.1) - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** (v9.2.1) - MongoDB object modeling

### Frontend
- **EJS** (v4.0.1) - Embedded JavaScript templates
- **ejs-mate** (v4.0.0) - Template layout support
- **CSS** - Styling

### Validation & Security
- **Joi** (v18.0.2) - Schema validation library
- **express-session** (v1.19.0) - Session management
- **method-override** (v3.0.0) - HTTP method override support

## Project Structure

```
AIRBNB_Major_project/
├── app.js                    # Main application entry point
├── package.json             # Project dependencies
├── schema.js                # Joi validation schemas
│
├── models/                  # Mongoose schemas and models
│   ├── listing.js          # Listing model with review refs
│   └── reviews.js          # Review model
│
├── routes/                  # Express route handlers
│   ├── listing.js          # Listing CRUD routes
│   └── reviews.js          # Review management routes
│
├── utils/                   # Utility functions
│   ├── ExpressError.js     # Custom error class
│   └── wrapAsync.js        # Async route wrapper
│
├── public/                  # Static assets
│   ├── css/
│   │   └── style.css       # Application styling
│   └── js/
│       └── script.js       # Frontend JavaScript
│
├── views/                   # EJS templates
│   ├── layouts/
│   │   └── boilerplate.ejs # Main layout template
│   ├── includes/
│   │   ├── navbar.ejs      # Navigation bar
│   │   └── footer.ejs      # Footer component
│   └── listings/
│       ├── index.ejs       # All listings view
│       ├── show.ejs        # Individual listing details
│       ├── new.ejs         # New listing form
│       ├── edit.ejs        # Edit listing form
│       └── error.ejs       # Error display page
│
└── init/                    # Database initialization
    ├── index.js            # Init script runner
    └── data.js             # Sample listing data
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm (Node Package Manager)

### Steps

1. **Clone and Navigate to Project**
   ```bash
   cd AIRBNB_Major_project
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Verify Installation**
   ```bash
   npm list
   ```

## Database Configuration

### MongoDB Connection

The application connects to MongoDB at:
```
mongodb://127.0.0.1:27017/wanderlust
```

**To change the connection string**, modify the `MONGO_URL` in [app.js](app.js):

```javascript
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
```

### Database Initialization

To populate the database with sample data:

```bash
node init/index.js
```

This script:
- Deletes all existing listings
- Inserts sample listing data from `init/data.js`

## API Routes

### Listing Routes (`/listings`)

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/listings` | Display all listings |
| GET | `/listings/new` | Show form to create new listing |
| POST | `/listings` | Create new listing in database |
| GET | `/listings/:id` | Display specific listing details with reviews |
| GET | `/listings/:id/edit` | Show form to edit listing |
| PUT | `/listings/:id` | Update listing in database |
| DELETE | `/listings/:id/delete` | Delete listing from database |

### Review Routes (`/listings/:id/reviews`)

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/listings/:id/reviews` | Add new review to listing |
| DELETE | `/listings/:id/reviews/:reviewId` | Delete specific review |

## Models

### Listing Model

**File:** [models/listing.js](models/listing.js)

```javascript
{
  title: String,
  description: String,
  image: {
    filename: String,
    url: String (default: Unsplash image)
  },
  price: Number (required),
  location: String,
  country: String,
  reviews: [ObjectId] // Reference to Review documents
}
```

**Middleware:** 
- Post-delete hook that cascades delete to all associated reviews

### Review Model

**File:** [models/reviews.js](models/reviews.js)

```javascript
{
  comment: String,
  rating: Number (1-5),
  createdAt: Date (default: current timestamp)
}
```

## File Structure Explanation

### [app.js](app.js)
Main application file that:
- Sets up Express server on port 8080
- Configures MongoDB connection
- Sets up EJS templating engine
- Configures middleware (static files, session, body parsing)
- Mounts route handlers
- Implements error handling middleware

### [schema.js](schema.js)
Joi validation schemas for:
- **ListingSchema:** Validates listing data (title, description, location, country, price, image)
- **ReviewsSchema:** Validates review data (comment, rating 1-5)

### [utils/ExpressError.js](utils/ExpressError.js)
Custom error class extending JavaScript Error:
- Accepts statusCode and message
- Used for consistent error handling throughout app

### [utils/wrapAsync.js](utils/wrapAsync.js)
Higher-order function that:
- Wraps async route handlers
- Catches errors and passes to error middleware
- Prevents unhandled promise rejections

### Route Files

**[routes/listing.js](routes/listing.js)**
- Implements all listing CRUD operations
- Validates listing data before create/update
- Handles listing queries with review population

**[routes/reviews.js](routes/reviews.js)**
- Implements review creation and deletion
- Validates review data
- Updates listing review array

## How to Run

1. **Ensure MongoDB is Running**
   ```bash
   # For local MongoDB
   mongod
   ```

2. **Start the Application**
   ```bash
   node app.js
   ```

   Expected output:
   ```
   Connected to DATABASE
   Listening at Port 8080
   ```

3. **Access the Application**
   ```
   http://localhost:8080
   ```

4. **Test Routes**
   - Home: `http://localhost:8080/`
   - All Listings: `http://localhost:8080/listings`
   - New Listing: `http://localhost:8080/listings/new`

## Key Components

### Session Configuration
```javascript
{
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,  // 7 days
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true
  }
}
```

### Middleware Stack
1. Static file serving (`/public`)
2. Method override for PUT/DELETE
3. Express URL encoding
4. Session management
5. Route handlers
6. Error handling middleware

### View Structure
- **Boilerplate Layout:** Main template wrapper
- **Includes:** Reusable navbar and footer
- **Listings Pages:** Index, show, new, edit, error pages

## Future Enhancements

- [ ] User authentication and authorization
- [ ] User profiles and dashboard
- [ ] Image upload functionality
- [ ] Advanced search and filtering
- [ ] Property maps integration
- [ ] Payment integration
- [ ] Booking system
- [ ] Email notifications
- [ ] User ratings and trust system
- [ ] Chat messaging between users

## Dependencies Summary

```json
{
  "ejs": "^4.0.1",
  "ejs-mate": "^4.0.0",
  "express": "^5.2.1",
  "express-session": "^1.19.0",
  "joi": "^18.0.2",
  "method-override": "^3.0.0",
  "mongoose": "^9.2.1"
}
```

## Author

**TUSHAR_KADAM**

## License

ISC

---

**Note:** This is a learning/portfolio project. For production use, implement authentication, use environment variables for sensitive data, and add comprehensive security measures.
