# DOIT: Task Management Application

**DOIT** is a task management application designed to help users efficiently organize, prioritize, and track their tasks. It features a user-friendly interface and customizable themes to enhance productivity.

## Features
- **Create & Organize Tasks**: Add detailed, prioritized to-do lists tailored to specific needs.
- **Modify, Complete & Delete Tasks**: Update tasks, mark them as complete, or remove them as needed.
- **Theme Support**: Switch between light and dark themes for optimal viewing comfort.
- **Session Management**: Tasks are associated with session IDs for personalized task management.

## Installation

### Clone the Repository:
```bash
git clone <repository-url>
cd Doit-V2
```

### Install Dependencies:
```bash
npm install
```

### Set Environment Variables: 
Create a `.env` file in the root directory and add the following:
```plaintext
PORT=3001
MONGODB_URI=<your-mongodb-uri>
```

### Run the Application:
```bash
npm start
```
The server will start on the specified port (default: 3001).

## Usage
1. Visit `http://localhost:3001` to access the application.
2. Create tasks by entering descriptions and clicking **"Add"**.
3. Use the **"Update"** button to edit tasks and **"Delete"** to remove them.
4. Toggle task completion status with the check button.
5. Switch themes using the theme selectors.

## API Endpoints

- `GET /api/tasks?sessionId=`: Retrieve all tasks for a session.
- `POST /api/tasks`: Add a new task.
- `PUT /api/tasks/:id`: Update task details.
- `DELETE /api/tasks/:id`: Delete a task.

## Technologies Used
- **Frontend**: EJS, HTML, CSS, JavaScript
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Additional Packages**: Mongoose, dotenv, nodemon

## Contributing
1. Fork the repository.
2. Create a new branch:
    ```bash
    git checkout -b feature/YourFeature
    ```
3. Commit your changes:
    ```bash
    git commit -m 'Add YourFeature'
    ```
4. Push to the branch:
    ```bash
    git push origin feature/YourFeature
    ```
5. Open a pull request.

## License
This project is licensed under the [MIT License](https://mit-license.org/).

## Author
Developed by [**Ali Elgamal**](https://www.linkedin.com/in/ali-elgamal-951093214/) and [**Ali Reda**](https://www.linkedin.com/in/alli-reda).
