// script.js — Clean Final Version

const today = new Date().toISOString().split("T")[0];

/* -------------------------
   Helpers for localStorage
   ------------------------- */
function getTasks() {
  return JSON.parse(localStorage.getItem("tasks") || "[]");
}
function saveTasks(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}
function getLogs() {
  return JSON.parse(localStorage.getItem("logs") || "{}");
}
function saveLogs(logs) {
  localStorage.setItem("logs", JSON.stringify(logs));
}

/* -------------------------
   Render tasks
   ------------------------- */
function loadTasks() {
  const listEl = document.getElementById("routineList");
  if (!listEl) return;

  const tasks = getTasks();
  const logs = getLogs();
  listEl.innerHTML = "";

  tasks.forEach((task, index) => {
    const isChecked = logs[today]?.includes(index);

    const row = document.createElement("div");
    row.className = "routine-item";
    row.innerHTML = `
      <label class="task-row">
        <input class="complete" type="checkbox" data-index="${index}" ${isChecked ? "checked" : ""}>
        <span class="task-label"><b>${task.time}</b> : ${task.text}</span>
      </label>
    `;
    listEl.appendChild(row);
  });

  // auto-log when a task is checked/unchecked
  listEl.querySelectorAll(".complete").forEach(cb => {
    cb.addEventListener("change", (e) => {
      const index = parseInt(e.target.dataset.index, 10);
      const logs = getLogs();
      if (!logs[today]) logs[today] = [];

      if (e.target.checked) {
        if (!logs[today].includes(index)) logs[today].push(index);
      } else {
        logs[today] = logs[today].filter(x => x !== index);
      }
      saveLogs(logs);
    });
  });
}

/* -------------------------
   Add new task
   ------------------------- */
function addTask() {
  const time = document.getElementById("timeInput").value;
  const text = document.getElementById("taskInput").value.trim();
  if (!time || !text) return alert("Enter time and task.");

  const tasks = getTasks();
  tasks.push({ time, text });
  saveTasks(tasks);

  document.getElementById("timeInput").value = "";
  document.getElementById("taskInput").value = "";
  loadTasks();
}

/* -------------------------
   Clear all (delete everything)
   ------------------------- */
function clearAll() {
  localStorage.removeItem("tasks");
  const logs = getLogs();
  logs[today] = [];
  saveLogs(logs);

  const listEl = document.getElementById("routineList");
  if (listEl) listEl.innerHTML = "";
}

/* -------------------------
   Init
   ------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  loadTasks();
});

// expose functions for buttons
window.addTask = addTask;
window.clearAll = clearAll;
