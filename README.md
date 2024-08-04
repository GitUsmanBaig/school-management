# Student Management System

This project is a comprehensive Student Management System designed to streamline the administrative, teaching, and learning processes. It includes functionalities for admins, teachers, and students.

## Table of Contents

1. [Features](#features)
2. [Technologies Used](#technologies-used)
3. [Installation](#installation)
4. [Backend Setup](#backend-setup)
5. [Frontend Setup](#frontend-setup)
6. [Usage](#usage)

## Features

### Admin

- Admin login and logout
- Manage users (add, update, delete)
- Manage courses (add, update, delete)
- View all courses and enrolled students

### Teacher

- Teacher login and logout
- Manage attendance for students
- Manage marks for students (Quiz, Sessionals, Project, Final)
- View all assigned courses and students

### Student

- Student login and logout
- View attendance
- View marks
- Enroll in courses
- View enrolled courses

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- Angular
- JWT (JSON Web Tokens)
- SCSS

## Installation

### Prerequisites

- Node.js and npm installed on your machine
- MongoDB installed and running

### Backend Setup

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/student-management-system.git
    cd student-management-system/backend
    ```

2. Install backend dependencies:
    ```sh
    npm install
    ```

3. Create a `.env` file in the backend directory and add your environment variables:
    ```env
    SECRET_KEY=your_jwt_secret_key
    MONGODB_URI=mongodb://localhost:27017/student_management
    ```

4. Run the backend server:
    ```sh
    npm start
    ```

### Frontend Setup

1. Navigate to the frontend directory:
    ```sh
    cd ../frontend
    ```

2. Install frontend dependencies:
    ```sh
    npm install
    ```

3. Run the Angular development server:
    ```sh
    ng serve
    ```

## Usage

1. Access the application in your web browser:
    ```sh
    http://localhost:4200
    ```

2. Login with admin, teacher, or student credentials.

3. Use the sidebar to navigate between different sections.

### Admin Usage

- Manage Users: Add, update, or delete users.
- Manage Courses: Add, update, or delete courses.
- View Courses: View all courses and enrolled students.

### Teacher Usage

- Mark Attendance: Select the course and date, mark students as present or absent, and save the attendance.
- Manage Marks: Select the course and enter marks for quizzes, sessionals, project, and final exams. Save and update marks as needed.

### Student Usage

- View Attendance: Select the course to view attendance records.
- View Marks: Select the course to view marks for quizzes, sessionals, project, and final exams.
- Enroll in Courses: Browse and enroll in available courses.
- View Enrolled Courses: View a list of all enrolled courses.

## Contributing

Feel free to fork the repository and make changes. Pull requests are welcome!


