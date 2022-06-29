'use strict';

function TaskListModel() {
    this.list = [];
}


TaskListModel.prototype.add = function(name, text, status) {
    const task = {
        name,
        text,
        status,
    };
    this.list.push(task);

};
TaskListModel.prototype.getTaskIndex = function(task) {
    return this.list.findIndex(elem => elem.name === task.name);
};
TaskListModel.prototype.checkTaskExists = function(task) {
    const errorIndex = -1;
    return this.getTaskIndex(task) !== errorIndex;
};
TaskListModel.prototype.changeStatus = function(id) {
    this.list[id].status = !this.list[id].status;
};
TaskListModel.prototype.remove = function(id) {
    this.list = this.list.filter(({ name }) => name !== id);
};
TaskListModel.prototype.getSummary = function() {
    return {
        total: this.list.length,
        completed: this.list.filter(({ status }) => status === true).length,
    };
};

function TaskListView(model) {

    this.model = model;
    this.form = document.querySelector('.add-task-form');
    this.btnAdd = document.querySelector('.btn-add');
    this.btnClose = document.querySelector('.close-form');
    this.taskList = document.querySelector('.tasks-list');
    this.total = document.querySelector('.total');
    this.completed = document.querySelector('.completed');

    this.initSubmit = function() {
        this.form.addEventListener('submit', e => {
            e.preventDefault();

            const nameNewTask = document.querySelector('#name-new-task').value;
            const textNewTask = document.querySelector('#text-new-task').value;

            if (!this.model.checkTaskExists(this.model.list) && nameNewTask !== '' && textNewTask !== '') {
                this.model.add(nameNewTask, textNewTask, false);
                this.createList();
                this.form.classList.remove('open-form');
                this.form.classList.remove('error');
                this.form.reset();
            } else {
                this.form.classList.add('error');
            }
        });
    };
    this.initSubmit();

    this.createList = function() {
        this.taskList.innerHTML = '';
        this.total.innerHTML = `All : ${this.model.getSummary().total}`;

        if (!this.model.list.length) return;
        const fragment = new DocumentFragment();

        for (const task of this.model.list) {

            const listItem = document.createElement('li');
            listItem.dataset.id = task.name;


            const div = document.createElement('div');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.classList.add('status');

            div.appendChild(checkbox);

            const nameTask = document.createElement('h2');
            nameTask.innerHTML = task.name;

            const textTask = document.createElement('p');
            textTask.innerHTML = task.text;

            const wrapperBtn = document.createElement('div');
            wrapperBtn.classList.add('wrapper-btn');
            const btnEdit = document.createElement('button');
            btnEdit.textContent = 'Edit';
            btnEdit.classList.add('btn-edit');
            const btnRemove = document.createElement('button');
            btnRemove.textContent = 'Remove';
            btnRemove.classList.add('btn-remove');
            wrapperBtn.append(btnEdit, btnRemove);

            const editForm = document.createElement('form');
            editForm.classList.add('edit-form');
            const editName = document.createElement('input');
            editName.type = 'text';
            editName.classList.add('edit-name');
            const editText = document.createElement('textarea');
            editText.classList.add('edit-text');
            const btnEditForm = document.createElement('button');
            btnEditForm.type = 'submit';
            btnEditForm.classList.add('btn-edit-form');
            btnEditForm.innerHTML = 'Ok';
            editForm.append(editName, editText, btnEditForm);

            listItem.append(div, nameTask, textTask, wrapperBtn, editForm);
            fragment.prepend(listItem);

            if (task.status === true) {
                listItem.classList.add('tasks-list-ready');
                checkbox.defaultChecked = true;
            }

        }
        this.taskList.append(fragment);


    };

    this.openForm = function() {
        this.btnAdd.addEventListener('click', () => {
            this.form.classList.add('open-form');
        });
    };
    this.openForm();

    this.closeForm = function() {
        this.btnClose.addEventListener('click', () => {
            this.form.classList.remove('open-form');
            this.form.classList.remove('error');
        });
    };
    this.closeForm();

    this.listListener = function() {
        this.taskList.addEventListener('click', (e) => {
            const element = this.findId(e.target);

            if (e.target.classList.contains('status')) {
                this.changeStatus(element.id, element.parent);
            }
            if (e.target.classList.contains('btn-edit')) {
                this.openEditForm(element.parent, element.id);
            }
            if (e.target.classList.contains('btn-remove')) {
                this.model.remove(element.parent.dataset.id);
                this.createList();
                this.completed.innerHTML = `Ready : ${this.model.getSummary().completed}`;
            }
        });


    };
    this.listListener();

    this.findId = function(target) {
        if (target.dataset.id) {
            const id = this.model.list.findIndex(element => element.name === target.dataset.id);
            const parent = target;
            return {
                id,
                parent,
            };
        } else {
            return this.findId(target.parentElement);
        }
    };

    this.changeStatus = function(id, element) {
        this.model.changeStatus(id);

        if (this.model.list[id].status === true) {
            element.classList.add('tasks-list-ready');
        } else {
            element.classList.remove('tasks-list-ready');
        }
        this.completed.innerHTML = `Ready : ${this.model.getSummary().completed}`;

    };

    this.openEditForm = function(element, i) {
        element.classList.add('edit');

        const nameEdit = element.querySelector('.edit-name');
        const textEdit = element.querySelector('.edit-text');

        nameEdit.value = element.querySelector('h2').textContent;
        textEdit.value = element.querySelector('p').textContent;

        element.addEventListener('submit', (e) => {
            e.preventDefault();
            this.model.list[i].name = nameEdit.value;
            this.model.list[i].text = textEdit.value;
            this.createList();
        });
    };


}

new TaskListView(new TaskListModel);


