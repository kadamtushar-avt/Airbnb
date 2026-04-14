# Wanderlust - Airbnb Clone Project

A full-stack web application built with Node.js, Express, MongoDB, and EJS that mimics core Airbnb functionality. Users can browse listings, create and manage properties, leave reviews, and authenticate with sessions.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Database](#database)
- [Application Routes](#application-routes)
- [Models](#models)
- [Important Notes](#important-notes)
- [Run the App](#run-the-app)
- [Developer Utilities](#developer-utilities)
- [License](#license)

## Project Overview

Wanderlust is a property listing platform where users can:
- Browse all property listings
- View listing details and reviews
- Create new listings with images, location, and price
- Edit and delete listings they own
- Add and remove reviews for listings
- Sign up, log in, and manage user sessions

The app uses MongoDB for storing data, Express for route handling, Mongoose for object modeling, and EJS for server-rendered pages.

## Features

- User authentication with Passport.js
- Secure sessions and flash notifications
- Listing creation, editing, and deletion
- Review creation and deletion
- Image upload via Cloudinary
- Geocoding using OpenStreetMap Nominatim
- Authorization checks for owners and authors
- Validation with Joi
- Custom error handling with `ExpressError`

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- Passport.js
- EJS + ejs-mate
- Cloudinary
- Joi
- express-session
- method-override
- multer

## Project Structure

```
AIRBNB_Major_project/
├── app.js                    # Main application entry point
├── package.json              # Project dependencies
├── schema.js                 # Joi validation schemas
├── cloudConfig.js            # Cloudinary storage configuration
├── middleware.js             # Auth and validation middleware

├── models/                   # Mongoose models
│   ├── listing.js            # Listing schema and delete hook
│   ├── reviews.js            # Review schema
│   └── user.js               # User schema with Passport plugin

├── controllers/              # Route controller logic
│   ├── listing.js            # Listings CRUD operations
│   ├── review.js             # Review create/delete operations
│   └── user.js               # User auth handlers

├── routes/                   # Express routers
│   ├── listing.js            # Listing routes
│   ├── reviews.js            # Review routes
│   └── user.js               # Auth routes

├── utils/                    # Utility helpers
│   ├── ExpressError.js       # Custom error class
│   └── wrapAsync.js          # Async route wrapper

├── public/                   # Static frontend assets
│   ├── css/
│   │   ├── style.css
│   │   └── rating.css
│   └── js/
│       └── script.js

├── views/                    # EJS view templates
│   ├── layouts/
│   │   └── boilerplate.ejs
│   ├── includes/
│   │   ├── navbar.ejs
│   │   ├── footer.ejs
│   │   └── flash.ejs
│   ├── listings/
│   │   ├── index.ejs
│   │   ├── show.ejs
│   │   ├── new.ejs
│   │   ├── edit.ejs
│   │   └── error.ejs
│   └── users/
│       ├── login.ejs
│       └── signup.ejs

└── init/                     # Seed data utilities
    ├── index.js              # Data initialization runner
    └── data.js               # Sample listing data
```

## Installation

### Prerequisites
- Node.js
- npm
- MongoDB (local or cloud)

### Setup

1. Clone the repository and navigate to the folder:
   ```bash
   cd AIRBNB_Major_project
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with required environment variables.

## Environment Variables

Add a `.env` file in the project root with:

```env
MONGO_URL=mongodb://127.0.0.1:27017/wanderlust
SECRET=your-session-secret
CLOUD_NAME=your-cloudinary-cloud-name
CLOUD_API_KEY=your-cloudinary-api-key
CLOUD_API_SECRET=your-cloudinary-api-secret
```

- `MONGO_URL` is used by `mongoose.connect()` in `app.js`
- `SECRET` secures session cookies
- Cloudinary variables support image uploads

## Database

### Default Connection
The app connects to MongoDB using the `MONGO_URL` environment variable.

### Seed Data
Populate the database with sample listings:

```bash
node init/index.js
```

This script clears existing listings and inserts sample data from `init/data.js`.

## Application Routes

### Listing Routes

- `GET /listings` - Show all listings
- `GET /listings/new` - Show new listing form
- `POST /listings` - Create a listing
- `GET /listings/:id` - Show listing details
- `GET /listings/:id/edit` - Show edit form
- `PUT /listings/:id` - Update listing
- `DELETE /listings/:id/delete` - Delete listing

### Review Routes

- `POST /listings/:id/reviews` - Add a review
- `DELETE /listings/:id/reviews/:reviewId` - Delete a review

### User Routes

- `GET /signup` - Signup page
- `POST /signup` - Register new user
- `GET /login` - Login page
- `POST /login` - Authenticate user
- `GET /logout` - Log out

### Utility Route

- `GET /demoUser` - Creates a demo user for development

## Models

### Listing
- `title`: String
- `description`: String
- `image`: Object with `url` and `filename`
- `price`: Number
- `location`: String
- `country`: String
- `reviews`: Array of `Review` ObjectIds
- `owner`: `User` ObjectId
- `lat`: Number
- `lng`: Number

### Review
- `comment`: String
- `rating`: Number (1-5)
- `createdAt`: Date
- `author`: `User` ObjectId

### User
- `username`: String
- `email`: String

Authentication is handled by `passport-local-mongoose`.

## Important Notes

- Images are uploaded to Cloudinary.
- Geocoding is performed through OpenStreetMap Nominatim.
- Authentication is required for creating/editing/deleting listings and reviews.
- Only listing owners can edit/delete their listings.
- Only review authors can delete their reviews.
- When a listing is deleted, associated reviews are also deleted by Mongoose middleware.
- Flash messages display success/error notifications.

## Run the App

Start the server:

```bash
node app.js
```

Open the app at:

```text
http://localhost:8080/listings
```

## Developer Utilities

- `app.js` sets up the server, middleware, Passport, and routes.
- `cloudConfig.js` configures Cloudinary storage.
- `middleware.js` contains authentication and validation guards.
- `schema.js` defines Joi schemas for listings and reviews.

## License

This project is authored by `TUSHAR_KADAM` and released under the `ISC` license.


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
