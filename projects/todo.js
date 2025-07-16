let tasks = [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  const saved = localStorage.getItem("tasks");
  tasks = saved ? JSON.parse(saved) : [];
}

function renderTasks(filter = "all") {
  const list = document.getElementById("taskList");
  list.innerHTML = "";

  const today = new Date();
  const weekEnd = new Date();
  weekEnd.setDate(today.getDate() + 6);

  // ✅ フィルタ＋締切順ソート
  const filteredTasks = tasks.filter(task => {
    const dueDate = new Date(task.dueDate);
    if (filter === "today" && !isSameDay(today, dueDate)) return false;
    if (filter === "week" && !(dueDate >= today && dueDate <= weekEnd)) return false;
    return true;
  });

  filteredTasks.sort((a, b) => {
    if (!a.dueDate) return 1;
    if (!b.dueDate) return -1;
    return new Date(a.dueDate) - new Date(b.dueDate);
  });

  // ✅ 並び替え後のタスクを表示
  filteredTasks.forEach((task, index) => {
    const dueDate = new Date(task.dueDate);

    const li = document.createElement("li");
    li.className = task.completed ? "completed" : "";

    const wrapper = document.createElement("div");
    wrapper.className = "task-wrapper";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.onchange = () => {
      task.completed = checkbox.checked;
      saveTasks();
      renderTasks(filter);
    };

    const text = document.createElement("span");
    text.textContent = task.text;
    if (task.completed) text.classList.add("completed");

    const dueInfo = document.createElement("span");
    dueInfo.className = "due-info";
    const daysLeft = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
    dueInfo.textContent = `｜期限: ${task.dueDate}（残り${daysLeft}日）`;

    const editBtn = document.createElement("button");
    editBtn.textContent = "編集";
    editBtn.className = "edit-btn";
    editBtn.onclick = () => {
      const newText = prompt("タスク内容を編集してください：", task.text);
      const newDate = prompt("新しい期日を入力（YYYY-MM-DD）：", task.dueDate);

      if (newText !== null && newText.trim() !== "") {
        task.text = newText.trim();
      }
      if (newDate !== null && /^\d{4}-\d{2}-\d{2}$/.test(newDate)) {
        task.dueDate = newDate;
      }

      saveTasks();
      renderTasks(filter);
    };

    wrapper.appendChild(checkbox);
    wrapper.appendChild(text);
    wrapper.appendChild(dueInfo);
    wrapper.appendChild(editBtn);

    li.appendChild(wrapper);
    list.appendChild(li);
  });
}


function isSameDay(date1, date2) {
  return date1.toISOString().slice(0, 10) === date2.toISOString().slice(0, 10);
}

function addTask() {
  const input = document.getElementById("taskInput");
  const dateInput = document.getElementById("dueDateInput");
  const text = input.value.trim();
  const dueDate = dateInput.value;

  if (!text) return;

  tasks.push({ text, dueDate, completed: false });
  saveTasks();
  renderTasks(document.getElementById("filterSelect").value);
  input.value = "";
  dateInput.value = "";
}

function clearTasks() {
  tasks = [];
  saveTasks();
  renderTasks();
}

function onFilterChange() {
  const filter = document.getElementById("filterSelect").value;
  renderTasks(filter);
}

window.onload = () => {
  loadTasks();
  renderTasks();
};

function toggleCompletedTasks() {
  const hideCompleted = document.getElementById("hideCompletedToggle").checked;
  const allTasks = document.querySelectorAll("#taskList li");

  allTasks.forEach(li => {
    const isCompleted = li.querySelector("span").classList.contains("completed");
    li.style.display = (hideCompleted && isCompleted) ? "none" : "flex";
  });
}

checkbox.addEventListener("change", () => {
  span.classList.toggle("completed");
  saveTasks();
  toggleCompletedTasks(); // ←これを追加！
});

