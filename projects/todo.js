// タスク追加・保存・編集・削除・UIメニュー付き
function addTask(text = "") {
  const taskText = text || document.getElementById("taskInput").value.trim();
  if (taskText === "") return;

  const li = document.createElement("li");

  // テキスト部分
  const textSpan = document.createElement("span");
  textSpan.textContent = taskText;

  // 三点リーダーボタン
  const menuBtn = document.createElement("button");
  menuBtn.textContent = "⋯";
  menuBtn.classList.add("menu-btn");

  // メニュー（編集・削除）
  const menu = document.createElement("ul");
  menu.classList.add("menu");
  menu.style.display = "none";

  const editOption = document.createElement("li");
  editOption.textContent = "編集";
  editOption.onclick = () => {
    const newText = prompt("編集内容を入力してください", textSpan.textContent);
    if (newText) {
      textSpan.textContent = newText;
      saveTasks();
    }
  };

  const deleteOption = document.createElement("li");
  deleteOption.textContent = "削除";
  deleteOption.onclick = () => {
    li.remove();
    saveTasks();
  };

  menu.appendChild(editOption);
  menu.appendChild(deleteOption);

  menuBtn.onclick = () => {
    menu.style.display = menu.style.display === "none" ? "block" : "none";
  };

  const wrapper = document.createElement("div");
  wrapper.classList.add("task-wrapper");
  wrapper.appendChild(textSpan);
  wrapper.appendChild(menuBtn);
  wrapper.appendChild(menu);

  li.appendChild(wrapper);
  document.getElementById("taskList").appendChild(li);

  document.getElementById("taskInput").value = "";
  saveTasks();
}

// ローカルストレージに保存
function saveTasks() {
  const tasks = [];
  document.querySelectorAll("#taskList li span").forEach(span => {
    tasks.push(span.textContent);
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// タスクを全て削除する（クリアボタン用）
function clearTasks() {
  document.getElementById("taskList").innerHTML = "";
  localStorage.removeItem("tasks");
}

// 初期表示でタスクを復元
window.onload = function () {
  const saved = localStorage.getItem("tasks");
  if (saved) {
    JSON.parse(saved).forEach(task => addTask(task));
  }
};

// Ctrl + Enter でタスク追加
document.getElementById("taskInput").addEventListener("keydown", function (e) {
  if (e.ctrlKey && e.key === "Enter") {
    addTask();
  }
});
