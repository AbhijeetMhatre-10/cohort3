const form = document.getElementById("form");
const addTaskBtn = document.getElementById("addTask");
const cancelForm = document.getElementById("cancelForm");
const saveForm = document.getElementById("saveForm");

const taskTitle = document.getElementById("taskTitle");
const taskCategory = document.getElementById("taskCategory");

const allTasks = document.getElementById("allTasks");

const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");

const allBtn = document.getElementById("allBtn");
const completedBtn = document.getElementById("completedBtn");
const pendingBtn = document.getElementById("pendingBtn");

const totalCount = document.getElementById("totalCount");
const completedCount = document.getElementById("completedCount");
const pendingCount = document.getElementById("pendingCount");

const formHeading = document.getElementById("formHeading");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentId = tasks.length > 0 ? Math.max(...tasks.map((task) => task.id)) + 1 : 1;

let editingTaskId = null;

let statusFilter = "All";

const categories = [
  "Study",
  "Project",
  "Job Preparation",
  "Health",
  "Personal",
  "Finance",
  "Other",
];

categories.forEach((category) => {
  const option = document.createElement("option");
  option.value = category;
  option.textContent = category;
  categoryFilter.append(option);
});

function saveToLocalStorage() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function handleCounters() {
  totalCount.textContent = tasks.length;

  completedCount.textContent = tasks.filter(
    (task) => task.status === "Completed",
  ).length;

  pendingCount.textContent = tasks.filter(
    (task) => task.status === "Pending",
  ).length;
}

function renderTasks(tasksToRender) {
  allTasks.innerHTML = "";

  // no task available
  if (tasksToRender.length === 0) {
    allTasks.innerHTML = `
      <div class="empty">
        No Tasks Found
      </div>
    `;

    return;
  }

  // render available tasks
  tasksToRender.forEach((x) => {

    const card = document.createElement("div");
    card.classList.add("task");

    if (x.status === "Completed") {
      card.classList.add("completed");
    }

    card.dataset.id = x.id;
    card.dataset.category = x.category;
    card.dataset.status = x.status;

    card.innerHTML = `
      <div>
        <h1>${x.title}</h1>
        <p>${x.category}</p>
        <p class="${x.status === "Completed" ? "done" : "pending"}">
          ${x.status}
        </p>
        <p>
          Last Modified:
          ${x.updatedAt}
        </p>
      </div>
      <div>
        <p class="edit-btn">
          Edit Task
        </p>
        <p class="delete-btn">
          Delete Task
        </p>
        <p class="complete-btn">
          ${x.status === "Completed" ? "Undo" : "Complete Task"}
        </p>
      </div>
    `;

    allTasks.append(card);
  });
}

function applyFilters() {
  // 1. take a safe tasks array
  let filteredTasks = [...tasks];

  // 2. take safe search input and category
  const searchTerm = searchInput.value.trim().toLowerCase();
  const selectedCategory = categoryFilter.value;

  // 3. filter the search input 
  if (searchTerm) {
    filteredTasks = filteredTasks.filter((x) =>
      x.title.toLowerCase().includes(searchTerm),
    );
  }

  // 3. filter the search category 
  if (selectedCategory && selectedCategory !== "All") {
    filteredTasks = filteredTasks.filter(
      (task) => task.category === selectedCategory,
    );
  }

  // 4. filter categories
  if (statusFilter === "Completed") {
    filteredTasks = filteredTasks.filter((task) => task.status === "Completed");
  }
  if (statusFilter === "Pending") {
    filteredTasks = filteredTasks.filter((task) => task.status === "Pending");
  }

  renderTasks(filteredTasks);
  handleCounters();
}

addTaskBtn.addEventListener("click", () => {
  form.style.display = "flex";
});

function closeForm() {
  form.style.display = "none";
  taskTitle.value = "";
  taskCategory.selectedIndex = 0;
  editingTaskId = null;
  formHeading.textContent = "Create New Task";
}

cancelForm.addEventListener("click", closeForm);

saveForm.addEventListener("click", () => {
  const title = taskTitle.value.trim();
  const category = taskCategory.value;

  if (!title || !category) {
    alert("Please fill all fields");
    return;
  }

  if (editingTaskId) {
    const task = tasks.find((task) => task.id === editingTaskId);
    task.title = title;
    task.category = category;
    task.updatedAt = new Date().toLocaleString();
  } else {
    const task = {
      id: currentId++,
      title,
      category,
      status: "Pending",
      updatedAt: new Date().toLocaleString(),
    };

    tasks.push(task);
  }

  saveToLocalStorage();

  applyFilters();

  closeForm();
});

allTasks.addEventListener("click", (e) => {
  const card = e.target.closest(".task");

  if (!card) return;

  const id = Number(card.dataset.id);

  if (e.target.classList.contains("delete-btn")) {
    tasks = tasks.filter((task) => task.id !== id);

    saveToLocalStorage();
    applyFilters();
  }

  if (e.target.classList.contains("edit-btn")) {
    const task = tasks.find((task) => task.id === id);
    editingTaskId = id;
    taskTitle.value = task.title;
    taskCategory.value = task.category;
    formHeading.textContent = "Edit Task";
    form.style.display = "flex";
  }

  if (e.target.classList.contains("complete-btn")) {
    const task = tasks.find((task) => task.id === id);
    task.status = task.status === "Pending" ? "Completed" : "Pending";
    task.updatedAt = new Date().toLocaleString();

    saveToLocalStorage();
    applyFilters();
  }
});

searchInput.addEventListener("input", applyFilters);

categoryFilter.addEventListener("change", applyFilters);

allBtn.addEventListener("click", () => {
  statusFilter = "All";

  applyFilters();
});

completedBtn.addEventListener("click", () => {
  statusFilter = "Completed";

  applyFilters();
});

pendingBtn.addEventListener("click", () => {
  statusFilter = "Pending";

  applyFilters();
});

applyFilters();

// theme logic :
const themeToggle = document.getElementById("themeToggle");

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
  document.body.classList.add("dark");
  themeToggle.textContent = "☀️ Light Mode";
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");

    themeToggle.textContent = "☀️ Light Mode";
  } else {
    localStorage.setItem("theme", "light");

    themeToggle.textContent = "🌙 Dark Mode";
  }
});
