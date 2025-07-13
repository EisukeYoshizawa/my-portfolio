function addTask(data = null) {
  const input = document.getElementById("taskInput");
  const dueDateInput = document.getElementById("dueDateInput");

  const taskText = data?.text || input.value.trim();
  const dueDateValue = data?.dueDate || dueDateInput?.value;

  if (taskText === "") return;

  const li = document.createElement("li");

  // タスクテキスト
  const textSpan = document.createElement("span");
  textSpan.textContent = taskText;

  // チェックボックス
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.onchange = () => {
  if (checkbox.checked) {
    textSpan.classList.add("completed"); // ← spanにクラス付与

    // アニメーション付きで削除
    setTimeout(() => {
      li.remove();
      saveTasks();
    }, 500);
  }
};

  // 期日と残り日数
  const dueSpan = document.createElement("span");
  dueSpan.classList.add("due-info");
  if (dueDateValue) {
    const today = new Date();
    const dueDate = new Date(dueDateValue);
    const diffTime = dueDate - today;
    const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    dueSpan.textContent = `｜期日: ${dueDateValue}（残り${daysLeft}日）`;
  }

  // 三点リーダーボタン
  const menuBtn = document.createElement("button");
  menuBtn.textContent = "⋯";
  menuBtn.classList.add("menu-btn");

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
  wrapper.appendChild(checkbox);
  wrapper.appendChild(textSpan);
  wrapper.appendChild(dueSpan);
  wrapper.appendChild(menuBtn);
  wrapper.appendChild(menu);

  li.appendChild(wrapper);
  document.getElementById("taskList").appendChild(li);

  input.value = "";
  if (dueDateInput) dueDateInput.value = "";
  saveTasks();
}

function saveTasks() {
  const tasks = [];
  document.querySelectorAll("#taskList li").forEach(li => {
    const text = li.querySelector("span").textContent;
    const dueInfo = li.querySelector(".due-info")?.textContent;
    const dueMatch = dueInfo?.match(/期日: (\d{4}-\d{2}-\d{2})/);
    const dueDate = dueMatch ? dueMatch[1] : "";
    tasks.push({ text, dueDate });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function clearTasks() {
  document.getElementById("taskList").innerHTML = "";
  localStorage.removeItem("tasks");
}

window.onload = function () {
  const saved = localStorage.getItem("tasks");
  if (saved) {
    JSON.parse(saved).forEach(task => addTask(task));
  }
};

document.getElementById("taskInput").addEventListener("keydown", function (e) {
  if (e.ctrlKey && e.key === "Enter") {
    addTask();
  }
});
