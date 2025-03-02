document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const cargoInput = document.getElementById('cargo-input');
    const taskList = document.getElementById('task-list');
    const statusFilter = document.getElementById('status-filter');
    const searchInput = document.getElementById('search-input');
    const dateFilter = document.getElementById('date-filter');
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    function renderTasks() {
        taskList.innerHTML = '';
        let filteredTasks = tasks;

        if (statusFilter.value) {
            filteredTasks = filteredTasks.filter(task => task.status === statusFilter.value);
        }

        if (searchInput.value) {
            filteredTasks = filteredTasks.filter(task => task.name.toLowerCase().includes(searchInput.value.toLowerCase()));
        }

        if (dateFilter.value) {
            filteredTasks = filteredTasks.filter(task => task.date === dateFilter.value);
        }

        filteredTasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span class="${task.status}">${task.name}</span> - 
                <span class="cargo">${task.cargo}</span> - 
                <span class="date">${task.date}</span>
                <div>
                    <button class="edit-btn" onclick="editTask(${index})">Editar</button>
                    <button class="delete-btn" onclick="deleteTask(${index})">Excluir</button>
                    <button class="complete-btn" onclick="completeTask(${index})">
                        ${task.status === 'concluída' ? 'Reabrir' : 'Concluir'}
                    </button>
                </div>
            `;
            taskList.appendChild(li);
        });
        saveTasks();
    }

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (taskInput.value.trim() && cargoInput.value.trim()) {
            tasks.push({
                name: taskInput.value.trim(),
                cargo: cargoInput.value.trim(),
                status: 'pendente',
                date: new Date().toISOString().split('T')[0]
            });
            taskInput.value = '';
            cargoInput.value = '';
            renderTasks();
        }
    });

    window.editTask = (index) => {
        const newTaskName = prompt('Editar Tarefa: ', tasks[index].name);
        const newCargo = prompt('Editar Cargo: ', tasks[index].cargo);

        const originalDate = tasks[index].date;  

        if (newTaskName !== null && newCargo !== null) {
            tasks[index].name = newTaskName.trim();
            tasks[index].cargo = newCargo.trim();
            tasks[index].date = originalDate;  
            renderTasks();
        }
    };

    window.deleteTask = (index) => {
        if (confirm('Tem certeza que deseja excluir essa tarefa?')) {
            tasks.splice(index, 1);
            renderTasks();
        }
    };

    window.completeTask = (index) => {
        tasks[index].status = tasks[index].status === 'concluída' ? 'pendente' : 'concluída';
        renderTasks();
    };

    statusFilter.addEventListener('change', renderTasks);
    searchInput.addEventListener('input', renderTasks);
    dateFilter.addEventListener('change', renderTasks);

    renderTasks();
});
