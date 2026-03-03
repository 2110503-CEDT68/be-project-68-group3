[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/iG82Gnyy)

# 🚀 Backend API for CEDT68 Project

<div align="center">

[![GitHub stars](https://img.shields.io/github/stars/2110503-CEDT68/be-project-68-group3?style=for-the-badge)](https://github.com/2110503-CEDT68/be-project-68-group3/stargazers)

[![GitHub forks](https://img.shields.io/github/forks/2110503-CEDT68/be-project-68-group3?style=for-the-badge)](https://github.com/2110503-CEDT68/be-project-68-group3/network)

[![GitHub issues](https://img.shields.io/github/issues/2110503-CEDT68/be-project-68-group3?style=for-the-badge)](https://github.com/2110503-CEDT68/be-project-68-group3/issues)

**A robust and scalable RESTful API backend for your web applications.**

</div>

## 📖 Overview

This repository hosts the backend API for the `be-project-68-group3` project, likely developed for a university course (CEDT68). It is built with Node.js and Express.js, designed to provide a secure and efficient data layer for a modern web application. The API manages data persistence through MongoDB, offers user authentication and authorization via JWT, and is structured to be modular and easy to extend. It serves as the core data and business logic provider, exposing various endpoints for client-side applications to consume.

## ✨ Features

-   🎯 **RESTful API Design**: Clear, consistent API endpoints following REST principles.
-   🔐 **User Authentication & Authorization**: Secure user registration, login, and protected routes using JSON Web Tokens (JWT) and `bcrypt.js` for password hashing.
-   🗄️ **MongoDB Integration**: Seamless data storage and retrieval using Mongoose ODM with MongoDB.
-   ⚙️ **Modular Structure**: Organized codebase with dedicated directories for controllers, models, routes, and middleware, promoting maintainability.
-   🔒 **CORS Handling**: Configured to handle Cross-Origin Resource Sharing for secure communication with frontend applications.
-   🛠️ **Environment Configuration**: Easy management of environment-specific variables using `dotenv`.

## 🛠️ Tech Stack

**Backend:**

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)

[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)

[![JSON Web Tokens](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white)](https://jwt.io/)

[![Bcrypt](https://img.shields.io/badge/Bcrypt-A52A2A?style=for-the-badge&logo=bcrypt&logoColor=white)](https://www.npmjs.com/package/bcryptjs)

[![CORS](https://img.shields.io/badge/CORS-212121?style=for-the-badge)](https://www.npmjs.com/package/cors)

**Database:**

[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

[![Mongoose](https://img.shields.io/badge/Mongoose-800000?style=for-the-badge&logo=mongoose&logoColor=white)](https://mongoosejs.com/)

**Tools:**

[![Dotenv](https://img.shields.io/badge/Dotenv-FAE0D4?style=for-the-badge&logo=dotenv&logoColor=black)](https://www.npmjs.com/package/dotenv)

## 🚀 Quick Start

Follow these steps to get the backend API up and running on your local machine.

### Prerequisites
-   **Node.js**: `^18.x` or `^20.x` (LTS versions recommended)
-   **npm**: Comes with Node.js
-   **MongoDB**: A running instance of MongoDB (local or cloud-hosted via MongoDB Atlas)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/2110503-CEDT68/be-project-68-group3.git
    cd be-project-68-group3
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment setup**
    Create a `.env` file in the root directory of the project, based on the `.env.example` (if present) or the variables used in `server.js` and `config` files.

    ```
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/project_db # Your MongoDB connection string
    JWT_SECRET=your_jwt_secret_key # A strong, unique secret key for JWT
    ```
    *Replace `your_jwt_secret_key` with a long, random string.*
    *Ensure `MONGO_URI` points to your running MongoDB instance.*

4.  **Start development server**
    ```bash
    npm start
    ```
    (If `nodemon` is installed as a dev dependency, you might have `npm run dev` for automatic restarts on file changes).

5.  **Access the API**
    The API will be running on `http://localhost:5000` (or your specified `PORT`).

## 📁 Project Structure

```
be-project-68-group3/
├── config/             # Configuration files (e.g., database settings, constants)
├── controllers/        # Request handlers with business logic
├── middleware/         # Express middleware for authentication, error handling, etc.
├── models/             # Mongoose schemas and models for database entities
├── routes/             # API endpoint definitions and route handlers
├── utils/              # Utility functions and helpers
├── .gitignore          # Specifies intentionally untracked files to ignore
├── package-lock.json   # Records the exact dependency tree
├── package.json        # Project metadata and dependencies
└── server.js           # Main application entry point and server setup
```

## ⚙️ Configuration

### Environment Variables
The application uses environment variables for sensitive information and configuration. Create a `.env` file in the root directory and populate it as follows:

| Variable      | Description                               | Default   | Required |

|---------------|-------------------------------------------|-----------|----------|

| `PORT`        | Port for the API server to listen on.     | `5000`    | Yes      |

| `MONGO_URI`   | Connection string for your MongoDB database. | `None`    | Yes      |

| `JWT_SECRET`  | Secret key used to sign and verify JWTs.  | `None`    | Yes      |

### Configuration Files
-   `config/`: This directory is intended to hold various configuration files. For example, `config/db.js` might contain database connection logic, or `config/constants.js` for application-wide constants. (TODO: Detail specific config files if content becomes available).

## 🔧 Development

### Available Scripts
-   `npm start`: Starts the Node.js server. This is typically used for production or to run the application directly.
-   `npm run dev`: (If configured with `nodemon`) Starts the server using `nodemon`, which automatically restarts the server when file changes are detected. Ideal for development.

### Development Workflow
1.  Ensure prerequisites are installed.
2.  Clone the repository and install dependencies.
3.  Set up your `.env` file.
4.  Run `npm start` (or `npm run dev`) to begin development.
5.  Make changes to controllers, models, routes, or middleware.
6.  Test API endpoints using tools like Postman, Insomnia, or curl.

## 📚 API Reference

The API follows a RESTful architecture, organizing resources around logical entities. Below is a general overview of the expected endpoints and their structure.

### Base URL

`http://localhost:5000/api` (or `http://your-deployed-api.com/api`)

### Authentication

-   **`POST /api/auth/register`**: Register a new user.
    -   Request Body: `{ "username": "...", "email": "...", "password": "..." }`
    -   Response: `{ "token": "...", "user": { ... } }` (JWT token and user details)
-   **`POST /api/auth/login`**: Authenticate a user and get a JWT token.
    -   Request Body: `{ "email": "...", "password": "..." }`
    -   Response: `{ "token": "...", "user": { ... } }`
-   **`GET /api/auth/me`**: Get current authenticated user's profile (requires JWT in `Authorization` header).
    -   Response: `{ "user": { ... } }`

### Users (Example)
-   **`GET /api/users`**: Retrieve a list of all users. (Admin only or protected)
-   **`GET /api/users/:id`**: Retrieve a single user by ID.
-   **`PUT /api/users/:id`**: Update a user's details. (Requires authorization)
-   **`DELETE /api/users/:id`**: Delete a user. (Requires authorization)

## 🙏 Acknowledgments

-   Built with [Node.js](https://nodejs.org/) and [Express.js](https://expressjs.com/).
-   Powered by [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/).
-   Thanks to the `2110503-CEDT68` organization and instructors for providing the project.


<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with ❤️ by our contributors
</div>


