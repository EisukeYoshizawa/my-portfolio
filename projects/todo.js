function addTask() {
  const input = document.getElementById('taskInput');
  const list = document.getElementById('taskList');

  const item = document.createElement('li');
  item.textContent = input.value;
  list.appendChild(item);

  input.value = '';
}
