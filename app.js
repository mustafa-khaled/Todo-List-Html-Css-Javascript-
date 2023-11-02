const newTaskInput = document.getElementById("new-task-input");
const addTaskBtn = document.getElementById("add-task");
const taskList = document.getElementById("tasks");

let arrayOfTasks = [];

// Check If There Are Tasks In Local Storeg
if (localStorage.getItem("tasks")) {
  arrayOfTasks = JSON.parse(localStorage.getItem("tasks"));
}

// Trigger Get Data From Local Storage
getTasksFromLocalStorage();

addTaskBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (!newTaskInput.value.trim()) return;
  addTasksToArray(newTaskInput.value);
  newTaskInput.value = "";
});

function addTasksToArray(taskText) {
  // Task Data
  const task = {
    id: Date.now(),
    title: taskText,
    completed: false,
  };
  // Add Task To Tasks Array
  arrayOfTasks.push(task);
  // Add Tasks To Page
  addElementToPage(arrayOfTasks);
  // Add Tasks To Local Storage
  addTasksToLocalStorage(arrayOfTasks);
}

function addTasksToLocalStorage(arrayOfTasks) {
  window.localStorage.setItem("tasks", JSON.stringify(arrayOfTasks));
}

function getTasksFromLocalStorage() {
  const data = window.localStorage.getItem("tasks");
  if (data) {
    let tasks = JSON.parse(data);
    addElementToPage(tasks);
  }
}

function addElementToPage(arrayOfTasks) {
  // Make Tasks Div Empty
  taskList.innerHTML = "";
  arrayOfTasks.forEach((task) => {
    // Task Div
    const taskElement = document.createElement("div");
    taskElement.classList.add("task");
    taskElement.setAttribute("data-id", task.id);

    // Add Special Styles If the Task Completed
    if (task.completed) {
      taskElement.classList.add("done");
    }

    // Task input holder
    const taskContent = document.createElement("div");
    taskContent.classList.add("content");

    // Task input
    const taskInput = document.createElement("input");
    taskInput.value = task.title;
    taskInput.setAttribute("readonly", "readonly");

    // Add input to it's holder
    taskContent.appendChild(taskInput);

    //  Task input actions
    const taskActions = document.createElement("div");
    taskActions.classList.add("actions");

    //  Delete button
    const taskDeleteBtn = document.createElement("button");
    taskDeleteBtn.textContent = "Delete";
    taskDeleteBtn.classList.add("delete-btn");
    taskDeleteBtn.addEventListener("click", (e) => {
      // Remove task from page
      e.target.parentNode.parentNode.remove();
      // Remove task from local storage
      deleteTask(task.id);
    });

    //  Edit button
    const taskEditBtn = document.createElement("button");
    taskEditBtn.textContent = "Edit";
    taskEditBtn.classList.add("edit-btn");
    taskEditBtn.addEventListener("click", () => {
      if (taskEditBtn.textContent.toLowerCase() === "edit") {
        taskInput.removeAttribute("readonly");
        taskInput.focus();
        taskEditBtn.textContent = "Save";
      } else {
        const updatedTitle = taskInput.value;
        updateTaskTitle(task.id, updatedTitle);
        taskInput.setAttribute("readonly", "readonly");
        taskEditBtn.textContent = "Edit";
      }
    });

    //  Completed button
    const taskDoneBtn = document.createElement("button");
    taskDoneBtn.textContent = "Completed";
    taskDoneBtn.classList.add("done-btn");
    taskDoneBtn.addEventListener("click", () => {
      // Toggle done class to add styles
      taskElement.classList.toggle("done");
      taskDoneBtn.textContent === "Completed"
        ? (taskDoneBtn.textContent = "Not Completed")
        : (taskDoneBtn.textContent = "Completed");
      // Toggle task status
      makeTaskCompleted(task.id);
    });

    // Add Two delete and edit and done btn to actions div
    taskActions.append(taskEditBtn, taskDeleteBtn, taskDoneBtn);

    // Add Two content and action div to task div
    taskElement.append(taskContent, taskActions);

    // Add Task Div To Tasks Div
    taskList.appendChild(taskElement);
  });
}

function deleteTask(taskId) {
  arrayOfTasks = arrayOfTasks.filter((task) => task.id !== taskId);
  // Add data to to local storage
  addTasksToLocalStorage(arrayOfTasks);
}

function makeTaskCompleted(taskId) {
  arrayOfTasks = arrayOfTasks.map((task) => {
    if (task.id === taskId) {
      // Toggle the task.completed property
      task.completed = !task.completed;
    }
    return task;
  });
  addTasksToLocalStorage(arrayOfTasks);
}

function updateTaskTitle(taskId, updatedTitle) {
  arrayOfTasks = arrayOfTasks.map((task) => {
    if (task.id === taskId) {
      // Update the task title
      task.title = updatedTitle;
    }
    return task;
  });
  addTasksToLocalStorage(arrayOfTasks);
}
