// Selectors
const toDoInput = document.querySelector('.todo-input');
const toDoBtn = document.querySelector('.todo-btn');
const toDoList = document.querySelector('.todo-list');
const standardTheme = document.querySelector('.standard-theme');
const lightTheme = document.querySelector('.light-theme');
const darkerTheme = document.querySelector('.darker-theme');

// Store the current task ID for updating
let currentTaskId = null;

// Event Listeners
toDoBtn.addEventListener('click', handleSubmit);
toDoList.addEventListener('click', handleActions);
document.addEventListener("DOMContentLoaded", getTodos);
standardTheme.addEventListener('click', () => changeTheme('standard'));
lightTheme.addEventListener('click', () => changeTheme('light'));
darkerTheme.addEventListener('click', () => changeTheme('darker'));

// Check if one theme has been set previously and apply it
let savedTheme = localStorage.getItem('savedTheme');
savedTheme === null ? changeTheme('standard') : changeTheme(savedTheme);

// Functions
async function handleSubmit(event) {
    event.preventDefault(); // Prevent form submission

    const taskDescription = toDoInput.value.trim();
    if (taskDescription === '') {
        alert("You must write something!");
        return;
    }

    if (currentTaskId) {
        // Update the existing task
        await updateTask(currentTaskId, taskDescription);
        currentTaskId = null; // Reset current task ID after updating
        toDoBtn.innerText = 'Add'; // Reset button text after update
    } else {
        // Add a new task
        await addTask(taskDescription);
    }

    toDoInput.value = ''; // Clear input field after submit
}

async function addTask(description) {
    const sessionId = getSessionId(); // Get session ID
    const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ description, sessionId }) // Include sessionId in the request
    });

    const newTask = await response.json();
    appendTaskToTable(newTask);
}

async function updateTask(id, description) {
    const sessionId = getSessionId(); // Get session ID
    const response = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ description, completed: false, sessionId }) // Include sessionId in the request
    });

    const updatedTask = await response.json();
    const taskRow = document.querySelector(`tr[data-id="${id}"]`);
    taskRow.children[0].innerText = updatedTask.description; // Update the description in the table
}


function appendTaskToTable(task) {
    const row = document.createElement('tr');
    row.dataset.id = task._id; // Set the task ID

    const taskCell = document.createElement('td');
    taskCell.innerText = task.description;
    row.appendChild(taskCell);

    const statusCell = document.createElement('td');
    statusCell.innerText = task.completed ? 'Completed' : 'Pending';
    row.appendChild(statusCell);

    const timestampCell = document.createElement('td');
    timestampCell.innerText = timeAgo(task.createdAt); // Correctly format the createdAt timestamp
    row.appendChild(timestampCell);

    const actionsCell = document.createElement('td');
    
    const updateBtn = document.createElement('button');
    updateBtn.innerHTML = '<i class="fas fa-edit"></i>';
    updateBtn.classList.add('update-btn');
    actionsCell.appendChild(updateBtn);

    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
    deleteBtn.classList.add('delete-btn');
    actionsCell.appendChild(deleteBtn);

    const checkBtn = document.createElement('button');
    checkBtn.innerHTML = '<i class="fas fa-check"></i>';
    checkBtn.classList.add('check-btn');
    actionsCell.appendChild(checkBtn);

    row.appendChild(actionsCell);
    toDoList.appendChild(row);
}

async function handleActions(event) {
    const item = event.target.closest('button');

    if (item && item.classList.contains('delete-btn')) {
        const todoElement = item.closest('tr');
        const taskId = todoElement.dataset.id;
        const sessionId = getSessionId(); // Get session ID

        // Pass sessionId as a query parameter in the DELETE request
        await fetch(`/api/tasks/${taskId}?sessionId=${sessionId}`, { method: 'DELETE' });
        todoElement.remove();
    }

    if (item && item.classList.contains('update-btn')) {
        const todoElement = item.closest('tr');
        const taskId = todoElement.dataset.id;

        toDoInput.value = todoElement.children[0].innerText; // Set input value to the current task
        currentTaskId = taskId; // Store the current task ID
        toDoBtn.innerText = 'Update'; // Change button text to 'Update'
    }

    if (item && item.classList.contains('check-btn')) {
        const todoElement = item.closest('tr');
        const taskId = todoElement.dataset.id;
        const completed = todoElement.children[1].innerText === 'Completed' ? false : true; // Toggle completion
        const sessionId = getSessionId(); // Get session ID
    
        // Send the updated status to the server
        await fetch(`/api/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ completed, sessionId }) // Include sessionId in the request
        });
    
        // Update the status cell and task row style
        todoElement.children[1].innerText = completed ? 'Completed' : 'Pending'; // Update the status text
        todoElement.classList.toggle('completed', completed); // Add 'completed' class if completed
    }
    
}

async function getTodos() {
    const sessionId = getSessionId(); // Get session ID
    const response = await fetch(`/api/tasks?sessionId=${sessionId}`);
    const tasks = await response.json();

    tasks.forEach(task => {
        appendTaskToTable(task);
    });
}
// Function to display time ago format for task creation
function timeAgo(timestamp) {
    const date = new Date(timestamp); // Create a Date object from the timestamp
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    // Check for valid date
    if (isNaN(date.getTime())) {
        return 'Invalid Date'; // Return 'Invalid Date' if the date is not valid
    }

    if (seconds < 60) {
        return `${seconds} seconds ago`; // Return seconds if less than a minute
    } else if (seconds < 3600) {
        const minutes = Math.floor(seconds / 60);
        return `${minutes} minutes ago`; // Return minutes if less than an hour
    } else if (seconds < 86400) {
        const hours = Math.floor(seconds / 3600);
        return `${hours} hours ago`; // Return hours if less than a day
    } else {
        return date.toLocaleString(); // Fallback to a full date format
    }
}

// Theme Change function
function changeTheme(color) {
    localStorage.setItem('savedTheme', color);
    savedTheme = localStorage.getItem('savedTheme');

    document.body.className = color;
    color === 'darker' ? 
        document.getElementById('title').classList.add('darker-title')
        : document.getElementById('title').classList.remove('darker-title');

    document.querySelector('input').className = `${color}-input`;
    document.querySelectorAll('.todo').forEach(todo => {
        Array.from(todo.classList).some(item => item === 'completed') ? 
            todo.className = `todo ${color}-todo completed` 
            : todo.className = `todo ${color}-todo`;
    });
    document.querySelectorAll('button').forEach(button => {
        Array.from(button.classList).some(item => {
            if (item === 'check-btn') {
                button.className = `check-btn ${color}-button`;
            } else if (item === 'delete-btn') {
                button.className = `delete-btn ${color}-button`;
            } else if (item === 'update-btn') {
                button.className = `update-btn ${color}-button`;
            }
        });
    });
}

// generate a session id
function getSessionId() {
    let sessionId = localStorage.getItem('sessionId');
    if (!sessionId) {
        sessionId = generateSessionId(); // Generate a random session ID
        localStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
}
//create a session Id
function generateSessionId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}
// Display the current date and time
const dt = new Date();
document.getElementById("datetime").innerHTML = dt.toLocaleString();
