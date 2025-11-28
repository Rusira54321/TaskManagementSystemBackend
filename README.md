🚀 Task Manager API

A secure and fully tested Node.js + Express + PostgreSQL backend for managing user tasks.
Includes JWT authentication, Postman documentation, and Jest unit tests.

⭐ Features

    🔐 User Authentication (Register/Login)

    👤 User Management (Update profile)

    📝 Task CRUD Operations

    🔄 Task Status Updates

    📄 Pagination & Filtering

    🧪 Jest Unit Tests (90%+ coverage)

    📬 Postman Collection (Well-documented, export included)

    🛡️ Input Validation & Error Handling

    🗄️ PostgreSQL Database Integration

    🔒 Password Hashing with bcrypt

    💡 Clean folder structure & production-ready code

📁 Project Structure
```
TaskManagerAPI
├── controllers/
│   ├── authController.js
│   ├── userController.js
│   └── taskController.js
│
├── services/
│   ├── authServices.js
│   ├── userServices.js
│   └── taskServices.js
│
├── authMiddlewares/
│   └── authMiddleware.js
│
├── routers/
│   ├── authRouter.js
│   ├── taskRouter.js
│   └── userRouter.js
│
├── model/
│   ├── Users.js
│   └── Task.js
│
├── config/
│   └── database.js
│
├── test/
│   └── ... (Jest unit test files)
│
├── coverage/
│   └── ... (auto-generated Jest coverage reports)
│
├── postman/
│   └── TaskManagerCollection.json
│
├── .env
├── index.js
├── .gitignore
└── README.md
```

🛠️ Tech Stack
```
Node.js + Express.js

PostgreSQL + Sequelize

JWT Authentication

Jest for testing

Postman for API documentation
```
⚙️ Installation & Setup
```
1️⃣ Clone the repository
git clone https://github.com/Rusira54321/TaskManagementSystemBackend.git

2️⃣ Install dependencies
npm install

3️⃣ Create environment variables

Create a .env file:

PORT=3000
DB_HOST=localhost
DB_PORT=5433
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_NAME=TaskManager
JWT_SECRET=your_jwt_secret


4️⃣ Setup PostgreSQL

Create the database:

CREATE DATABASE TaskManager;


5️⃣ Start the server
npm start


Server runs at:
👉 http://localhost:3000

🧪 Running Unit Tests
npm test

58 unit tests included

90%+ coverage

Tests for Auth, User, and Task services + controllers
```
📬 Postman Documentation
```
A fully documented Postman collection is included.

You can import it from:

postman/TaskManagerAPI.postman_collection.json


The documentation includes:

✔ Success responses
✔ Error responses
✔ Auth requirements
✔ Example requests
✔ Pagination & filtering

```
🔐 Authentication Flow
```
Register → Login → Use JWT

Register

POST {{Base_URL}}/api/auth/register

Login

POST {{Base_URL}}/api/auth/login

Returns:

{
  "token": "JWT_TOKEN_HERE"
}


Use token in all protected routes

Authorization: Bearer JWT_TOKEN_HERE
```
📝 API Endpoints Overview
```
🔐 Auth
Method	Endpoint	                    Description
POST	{{Base_URL}}/api/auth/register	Register a new user
POST	{{Base_URL}}/api/auth/login	    Login and get JWT

👤 User
Method	Endpoint	                    Description
POST	{{Base_URL}}/api/user/update	Update email/password (auth)

📝 Tasks
Method	Endpoint	                                Description
POST	{{Base_URL}}/api/tasks/create	            Create a task
GET	    {{Base_URL}}/api/tasks/getAllTasks	        Get tasks (pagination + filter)
PUT	    {{Base_URL}}/api/tasks/updateStatus/:id	    Update task status
DELETE	{{Base_URL}}/api/tasks/delete/:id	        Delete a task

Full details available in the Postman collection.
```
🧱 Error Handling
```
The API returns consistent JSON error structures such as:

{
  "message": "Invalid email format"
}


or

{
  "error": "The task is not found"
}


This improves frontend debugging and developer experience.
```
🎯 Why This Project Is Recruiter-Friendly
```
Clean architecture (Services + Controllers + Middleware)

High test coverage

Professionally written documentation

Follows real-world API design patterns

Uses industry-standard technologies

Easy to read, maintain, and extend
```
🤝 Contributing
```
Pull requests are welcome!
Feel free to fork the repo and submit improvements.
```
📄 License
```
This project is open-source under the MIT License.
```
