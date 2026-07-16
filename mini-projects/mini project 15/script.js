const featureOverlay = document.getElementById("featureOverlay");
const featureTitle = document.getElementById("featureTitle");
const featureKicker = document.getElementById("featureKicker");
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const themeToggle = document.getElementById("themeToggle");
const dateDisplay = document.getElementById("dateDisplay");
const timeDisplay = document.getElementById("timeDisplay");
const weatherTemp = document.getElementById("weatherTemp");
const weatherCondition = document.getElementById("weatherCondition");
const weatherPrecip = document.getElementById("weatherPrecip");
const weatherHumidity = document.getElementById("weatherHumidity");
const weatherWind = document.getElementById("weatherWind");
const quoteText = document.getElementById("quoteText");
const quoteAuthor = document.getElementById("quoteAuthor");
const newQuoteBtn = document.getElementById("newQuoteBtn");
const timerDisplay = document.getElementById("timerDisplay");
const sessionLabel = document.getElementById("sessionLabel");
const timerMinutesInput = document.getElementById("timerMinutesInput");
const setTimerBtn = document.getElementById("setTimerBtn");
const startTimerBtn = document.getElementById("startTimerBtn");
const pauseTimerBtn = document.getElementById("pauseTimerBtn");
const resetTimerBtn = document.getElementById("resetTimerBtn");
const goalInput = document.getElementById("goalInput");
const addGoalBtn = document.getElementById("addGoalBtn");
const goalList = document.getElementById("goalList");
const goalProgress = document.getElementById("goalProgress");
let userLocation = document.querySelector(".location");

function safeParseStorage(key, fallback) {
  const rawValue = localStorage.getItem(key);

  if (!rawValue) {
    return fallback;
  }

  try {
    return JSON.parse(rawValue);
  } catch (error) {
    console.warn(`Invalid storage data for ${key}:`, error);
    localStorage.removeItem(key);
    return fallback;
  }
  
}

let tasks = safeParseStorage("todoTasks", []);
let plannerEntries = safeParseStorage("plannerEntries", []);
let theme = localStorage.getItem("theme") || "light";
let timerInterval = null;
let timerDuration = Number(safeParseStorage("pomodoroMinutes", 25)) || 25;
let timeLeft = timerDuration * 60;
let timerRunning = false;

function getTodayKey() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function getInitialGoals() {
  const storedGoals = safeParseStorage("dailyGoals", []);
  const todayKey = getTodayKey();

  if (!Array.isArray(storedGoals)) {
    return [];
  }

  const normalizedGoals = storedGoals
    .map((goal) => {
      if (typeof goal === "string") {
        return { text: goal.trim(), completed: false, date: todayKey };
      }

      return {
        text: goal?.text?.trim() || "",
        completed: Boolean(goal?.completed),
        date: goal?.date || todayKey,
      };
    })
    .filter((goal) => goal.text);

  const todaysGoals = normalizedGoals.filter((goal) => goal.date === todayKey);
  if (todaysGoals.length !== normalizedGoals.length) {
    localStorage.setItem("dailyGoals", JSON.stringify(todaysGoals));
  }

  return todaysGoals;
}

let goals = getInitialGoals();

function saveTasks() {
  localStorage.setItem("todoTasks", JSON.stringify(tasks));
}

function saveGoals() {
  const goalsToStore = goals
    .filter((goal) => goal.text && goal.text.trim())
    .map((goal) => ({
      text: goal.text.trim(),
      completed: Boolean(goal.completed),
      date: goal.date || getTodayKey(),
    }));

  localStorage.setItem("dailyGoals", JSON.stringify(goalsToStore));
}

function syncDailyGoals() {
  const todayKey = getTodayKey();
  const storedGoals = safeParseStorage("dailyGoals", []);

  if (!Array.isArray(storedGoals)) {
    goals = [];
    saveGoals();
    renderGoals();
    return;
  }

  const normalizedGoals = storedGoals
    .map((goal) => {
      if (typeof goal === "string") {
        return { text: goal.trim(), completed: false, date: todayKey };
      }

      return {
        text: goal?.text?.trim() || "",
        completed: Boolean(goal?.completed),
        date: goal?.date || todayKey,
      };
    })
    .filter((goal) => goal.text);

  const todaysGoals = normalizedGoals.filter((goal) => goal.date === todayKey);
  const needsReset =
    todaysGoals.length !== goals.length ||
    todaysGoals.some((goal, index) => {
      const currentGoal = goals[index];
      return (
        !currentGoal ||
        goal.text !== currentGoal.text ||
        goal.completed !== currentGoal.completed ||
        goal.date !== currentGoal.date
      );
    });

  if (needsReset) {
    goals = todaysGoals;
    saveGoals();
    renderGoals();
  }
}

function savePlanner() {
  localStorage.setItem("plannerEntries", JSON.stringify(plannerEntries));
}

function saveTimerSettings() {
  localStorage.setItem("pomodoroMinutes", String(timerDuration));
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = value;
  }
}

function renderTasks() {
  taskList.innerHTML = "";

  if (tasks.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.className = "empty-state";
    emptyItem.textContent = "No tasks yet. Add one to get started.";
    taskList.appendChild(emptyItem);
    taskCount.textContent = "0 tasks";
    return;
  }

  tasks.forEach((task, index) => {
    const item = document.createElement("li");
    if (task.completed) {
      item.classList.add("completed");
    }

    const main = document.createElement("div");
    main.className = "task-main";

    const checkBtn = document.createElement("button");
    checkBtn.className = task.completed ? "task-check checked" : "task-check";
    checkBtn.dataset.action = "toggle-complete";
    checkBtn.dataset.index = index;
    checkBtn.textContent = "✓";

    const text = document.createElement("span");
    text.className = "task-text";
    text.textContent = task.text;

    const actions = document.createElement("div");
    actions.className = "actions";

    const importantBtn = document.createElement("button");
    importantBtn.className = task.important ? "important active" : "important";
    importantBtn.dataset.action = "toggle-important";
    importantBtn.dataset.index = index;
    importantBtn.textContent = "⭐";

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete";
    deleteBtn.dataset.action = "delete";
    deleteBtn.dataset.index = index;
    deleteBtn.textContent = "🗑";

    main.appendChild(checkBtn);
    main.appendChild(text);
    actions.appendChild(importantBtn);
    actions.appendChild(deleteBtn);
    item.appendChild(main);
    item.appendChild(actions);
    taskList.appendChild(item);
  });

  taskCount.textContent = `${tasks.length} ${tasks.length === 1 ? "task" : "tasks"}`;
}

function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;

  tasks.unshift({ text, important: false, completed: false });
  taskInput.value = "";
  saveTasks();
  renderTasks();
}

function handleTaskActions(event) {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const action = button.dataset.action;
  const index = Number(button.dataset.index);

  if (action === "toggle-complete") {
    tasks[index].completed = !tasks[index].completed;
  } else if (action === "toggle-important") {
    tasks[index].important = !tasks[index].important;
  } else if (action === "delete") {
    tasks.splice(index, 1);
  }

  saveTasks();
  renderTasks();
}

function renderGoals() {
  goalList.innerHTML = "";

  if (goals.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.className = "empty-state";
    emptyItem.textContent = "No goals yet.";
    goalList.appendChild(emptyItem);
    goalProgress.textContent = "0 of 0 completed";
    return;
  }

  goals.forEach((goal, index) => {
    const item = document.createElement("li");
    item.className = goal.completed ? "goal-item completed" : "goal-item";
    if (goal.editing) {
      item.classList.add("editing");
    }

    if (goal.editing) {
      const input = document.createElement("input");
      input.className = "goal-edit-input";
      input.dataset.index = index;
      input.value = goal.text;
      item.appendChild(input);
    } else {
      const text = document.createElement("span");
      text.className = "goal-text";
      text.textContent = goal.text;
      item.appendChild(text);
    }

    const actions = document.createElement("div");
    actions.className = "actions";

    if (goal.editing) {
      const saveBtn = document.createElement("button");
      saveBtn.className = "save";
      saveBtn.dataset.index = index;
      saveBtn.dataset.action = "save-goal-edit";
      saveBtn.textContent = "✓";

      const cancelBtn = document.createElement("button");
      cancelBtn.className = "cancel";
      cancelBtn.dataset.index = index;
      cancelBtn.dataset.action = "cancel-goal-edit";
      cancelBtn.textContent = "✕";

      actions.appendChild(saveBtn);
      actions.appendChild(cancelBtn);
    } else {
      const doneBtn = document.createElement("button");
      doneBtn.dataset.index = index;
      doneBtn.dataset.action = "toggle-goal";
      doneBtn.textContent = goal.completed ? "✓" : "○";

      const editBtn = document.createElement("button");
      editBtn.className = "edit";
      editBtn.dataset.index = index;
      editBtn.dataset.action = "edit-goal";
      editBtn.textContent = "✎";

      const deleteBtn = document.createElement("button");
      deleteBtn.className = "delete";
      deleteBtn.dataset.index = index;
      deleteBtn.dataset.action = "delete-goal";
      deleteBtn.textContent = "🗑";

      actions.appendChild(doneBtn);
      actions.appendChild(editBtn);
      actions.appendChild(deleteBtn);
    }

    item.appendChild(actions);
    goalList.appendChild(item);
  });

  const completedCount = goals.filter((goal) => goal.completed).length;
  goalProgress.textContent = `${completedCount} of ${goals.length} completed`;
}

function addGoal() {
  const text = goalInput.value.trim();
  if (!text) return;

  goals.unshift({
    text,
    completed: false,
    date: getTodayKey(),
  });
  goalInput.value = "";
  saveGoals();
  renderGoals();
}

function handleGoalActions(event) {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const action = button.dataset.action;
  const index = Number(button.dataset.index);

  if (action === "toggle-goal") {
    goals[index].completed = !goals[index].completed;
    saveGoals();
    renderGoals();
    return;
  }

  if (action === "edit-goal") {
    goals[index].editing = true;
    renderGoals();
    setTimeout(() => {
      const input = goalList.querySelector(
        `.goal-edit-input[data-index="${index}"]`,
      );
      input?.focus();
      input?.select();
    }, 0);
    return;
  }

  if (action === "save-goal-edit") {
    const item = button.closest("li");
    const input = item?.querySelector(".goal-edit-input");
    const nextText = input?.value.trim();

    if (nextText) {
      goals[index].text = nextText;
    }

    if (goals[index]) {
      delete goals[index].editing;
    }
    saveGoals();
    renderGoals();
    return;
  }

  if (action === "cancel-goal-edit") {
    if (goals[index]) {
      delete goals[index].editing;
    }
    renderGoals();
    return;
  }

  if (action === "delete-goal") {
    goals.splice(index, 1);
    saveGoals();
    renderGoals();
  }
}

function handleGoalKeydown(event) {
  if (!event.target.classList.contains("goal-edit-input")) return;

  const index = Number(event.target.dataset.index);
  if (event.key === "Enter") {
    event.preventDefault();
    const nextText = event.target.value.trim();

    if (nextText) {
      goals[index].text = nextText;
    }

    if (goals[index]) {
      delete goals[index].editing;
    }
    saveGoals();
    renderGoals();
  } else if (event.key === "Escape") {
    event.preventDefault();
    if (goals[index]) {
      delete goals[index].editing;
    }
    renderGoals();
  }
}

function renderPlanner() {
  const inputs = document.querySelectorAll(".planner-input");
  inputs.forEach((input, index) => {
    input.value = plannerEntries[index] || "";
    input.oninput = () => {
      plannerEntries[index] = input.value;
      savePlanner();
    };
  });
}

function updateClock() {
  const now = new Date();
  const date = now.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const time = now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  });
  dateDisplay.textContent = date;
  timeDisplay.textContent = time;

  const hour = now.getHours();
  const center = document.querySelector(".center");
  if (center) {
    if (hour >= 5 && hour < 12) {
      center.className = "center morning";
    } else if (hour >= 12 && hour < 17) {
      center.className = "center afternoon";
    } else if (hour >= 17 && hour < 21) {
      center.className = "center evening";
    } else {
      center.className = "center night";
    }
  }
}

function applyTheme() {
  document.body.classList.toggle("theme-dark", theme === "dark");
}

function toggleTheme() {
  theme = theme === "dark" ? "light" : "dark";
  localStorage.setItem("theme", theme);
  applyTheme();
}

async function updateQuote() {
  quoteText.textContent = "Loading a fresh boost...";
  quoteAuthor.textContent = "Please wait";

  try {
    const response = await fetch("https://api.quotable.io/random");

    if (!response.ok) {
      throw new Error("Unable to fetch quote");
    }

    const data = await response.json();
    quoteText.textContent = data.content;
    quoteAuthor.textContent = data.author ? `— ${data.author}` : "— Unknown";
  } catch (error) {
    console.error("Quote fetch failed:", error);
    quoteText.textContent = "Small steps every day still move you forward.";
    quoteAuthor.textContent = "Keep going";
  }
}

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

function updateTimerDisplay() {
  timerDisplay.textContent = formatTime(timeLeft);
}

function setTimerDuration() {
  const minutes = Number(timerMinutesInput?.value);
  if (!Number.isFinite(minutes) || minutes < 1 || minutes > 90) {
    if (timerMinutesInput) {
      timerMinutesInput.value = timerDuration;
    }
    return;
  }

  timerDuration = Math.round(minutes);
  timeLeft = timerDuration * 60;
  clearInterval(timerInterval);
  timerRunning = false;
  saveTimerSettings();
  updateTimerDisplay();
  sessionLabel.textContent = "Work Session";
}

function startTimer() {
  if (timerRunning) return;
  timerRunning = true;
  sessionLabel.textContent = "Focus Session";
  timerInterval = setInterval(() => {
    timeLeft -= 1;
    updateTimerDisplay();
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      timerRunning = false;
      sessionLabel.textContent = "Session Complete";
      updateTimerDisplay();
    }
  }, 1000);
}

function pauseTimer() {
  clearInterval(timerInterval);
  timerRunning = false;
  if (timeLeft > 0) {
    sessionLabel.textContent = "Paused";
  }
}

function resetTimer() {
  clearInterval(timerInterval);
  timerRunning = false;
  timeLeft = timerDuration * 60;
  updateTimerDisplay();
  sessionLabel.textContent = "Work Session";
}

function openFeature(name) {
  featureOverlay.classList.add("active");
  document.body.classList.add("modal-open");

  const sections = document.querySelectorAll(".feature-section");
  sections.forEach((section) => {
    section.classList.toggle("active", section.dataset.feature === name);
  });

  const titles = {
    todo: ["To-Do List", "Focus Mode"],
    planner: ["Daily Planner", "Plan Ahead"],
    motivation: ["Motivation", "Daily Boost"],
    pomodoro: ["Pomodoro Timer", "Stay Focused"],
    goals: ["Daily Goals", "Track Progress"],
  };

  const [title, kicker] = titles[name] || ["Feature", "Focus Mode"];
  featureTitle.textContent = title;
  featureKicker.textContent = kicker;
}

function closeFeature() {
  featureOverlay.classList.remove("active");
  document.body.classList.remove("modal-open");
}

addTaskBtn.addEventListener("click", addTask);
taskInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    addTask();
  }
});
taskList.addEventListener("click", handleTaskActions);

addGoalBtn.addEventListener("click", addGoal);
goalInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    addGoal();
  }
});
goalList.addEventListener("click", handleGoalActions);
goalList.addEventListener("keydown", handleGoalKeydown);

newQuoteBtn.addEventListener("click", () => updateQuote());
setTimerBtn.addEventListener("click", setTimerDuration);
if (timerMinutesInput) {
  timerMinutesInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      setTimerDuration();
    }
  });
}
startTimerBtn.addEventListener("click", startTimer);
pauseTimerBtn.addEventListener("click", pauseTimer);
resetTimerBtn.addEventListener("click", resetTimer);
themeToggle.addEventListener("click", toggleTheme);

featureOverlay.addEventListener("click", (event) => {
  if (event.target === featureOverlay) {
    closeFeature();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && featureOverlay.classList.contains("active")) {
    closeFeature();
  }
});

applyTheme();
updateClock();
updateQuote();
renderTasks();
renderGoals();
renderPlanner();
syncDailyGoals();
setInterval(updateClock, 1000);
setInterval(syncDailyGoals, 60000);
if (timerMinutesInput) {
  timerMinutesInput.value = timerDuration;
}
updateTimerDisplay();

// extra code
async function getLocationAndWeather() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser."));
      return;
    }

    const isLocalhost = ["localhost", "127.0.0.1", "::1"].includes(window.location.hostname);
    if (!window.isSecureContext && window.location.protocol !== "https:" && !isLocalhost) {
      reject(new Error("Geolocation requires HTTPS or localhost."));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const { latitude, longitude } = coords;

          const [geoRes, weatherRes] = await Promise.all([
            fetch(
              `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
            ),
            fetch(
              `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m`,
            ),
          ]);

          const geo = await geoRes.json();
          const weatherData = await weatherRes.json();
          const current = weatherData.current;

          const weatherMap = {
            0: "Clear",
            1: "Mainly Clear",
            2: "Partly Cloudy",
            3: "Cloudy",
            45: "Fog",
            48: "Fog",
            51: "Light Drizzle",
            53: "Drizzle",
            55: "Heavy Drizzle",
            61: "Light Rain",
            63: "Rain",
            65: "Heavy Rain",
            71: "Light Snow",
            73: "Snow",
            75: "Heavy Snow",
            80: "Rain Showers",
            81: "Heavy Showers",
            82: "Violent Showers",
            95: "Thunderstorm",
            96: "Thunderstorm with Hail",
            99: "Severe Thunderstorm",
          };

          resolve({
            country: geo.address?.country || "",
            state: geo.address?.state || "",
            city: geo.address?.city || geo.address?.town || geo.address?.village || "",
            latitude,
            longitude,
            temperature: current.temperature_2m,
            weather: weatherMap[current.weather_code] || "Unknown",
            precipitation: current.precipitation,
            humidity: current.relative_humidity_2m,
            windSpeed: current.wind_speed_10m,
          });
        } catch (err) {
          reject(err);
        }
      },
      (error) => {
        reject(new Error(`Geolocation failed: ${error.message}`));
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  });
}

(async () => {
  try {
    const data = await getLocationAndWeather();
    console.log("Weather data:", data);

    const locationText = [data.city, data.state]
      .filter(Boolean)
      .join(", ");

    if (userLocation) {
      userLocation.textContent = locationText || "Location unavailable";
    }

    weatherTemp.textContent = `${data.temperature}°C`;
    weatherCondition.textContent = data.weather;
    weatherPrecip.textContent = `Precipitation: ${data.precipitation}%`;
    weatherHumidity.textContent = `Humidity: ${data.humidity}%`;
    weatherWind.textContent = `Wind: ${data.windSpeed}km/h`;
  } catch (err) {
    console.error("Weather lookup failed:", err);

    if (userLocation) {
      userLocation.textContent = "Location unavailable";
    }

    weatherTemp.textContent = "—";
    weatherCondition.textContent = "Weather unavailable";
    weatherPrecip.textContent = "Precipitation: —";
    weatherHumidity.textContent = "Humidity: —";
    weatherWind.textContent = "Wind: —";
  }
})();

