import { format } from 'date-fns';

import './style.css';
import { TodoItem, TodoProject } from './todoObjects';

import cancelSVG from './cancel.svg';

const DOMController = (() => {

    const buttonBar = document.querySelector('.button-bar');
    const content = document.querySelector('.content');

    const backButton = document.querySelector('.back-button');

    const projectDialog = document.querySelector('#project-dialog');
    const todoDialog = document.querySelector('#todo-dialog');
    const updateTodoDialog = document.querySelector('#update-todo-dialog');

    const projectForm = document.querySelector('#project-dialog form');
    const todoForm = document.querySelector('#todo-dialog form');
    const updateTodoForm = document.querySelector('#update-todo-dialog form');

    const projectSubmitButton = document.querySelector('.project.submit-button');
    const todoSubmitButton = document.querySelector('.todo.submit-button');
    const updateTodoSubmitButton = document.querySelector('.update-todo.submit-button');

    const projectCancelButton = document.querySelector('.project.cancel-button');
    const todoCancelButton = document.querySelector('.todo.cancel-button');
    const updateTodoCancelButton = document.querySelector('.update-todo.cancel-button')

    const projectTitleBox = document.querySelector('#project-title');
    const projectDescriptionBox = document.querySelector('#project-description');

    const todoTitleBox = document.querySelector('#todo-title');
    const todoDescriptionBox = document.querySelector('#todo-description');
    const todoDueDateBox = document.querySelector('#todo-due-date');
    const todoPriorityBox = document.querySelector('#todo-priority');
    const todoNotesBox = document.querySelector('#todo-notes');

    const updateTodoTitleBox = document.querySelector('#update-todo-title');
    const updateTodoDescriptionBox = document.querySelector('#update-todo-description');
    const updateTodoDueDateBox = document.querySelector('#update-todo-due-date');
    const updateTodoPriorityBox = document.querySelector('#update-todo-priority');
    const updateTodoNotesBox = document.querySelector('#update-todo-notes');

    let currProjectIndex;
    let currTodoIndex;

    const ProjectsController = (() => {
        const projects = [];

        const getProjects = () => projects;

        const addProject = (title, description) => {
            projects.push(TodoProject(title, description));
        }
        const removeProject = (index) => {
            projects.splice(index, 1);
        }
        const addTodoToProject = (title, description, dueDate, priority, notes, index) => {
            projects[index].addTodo(title, description, dueDate, priority, notes);
        }
        const removeTodoFromProject = (projectIndex, todoIndex) => {
            projects[projectIndex].removeTodo(todoIndex);
        }
        const updateDetailsOfProject = (title, description, index) => {
            const targetProject = projects[index];
            targetProject.setTitle(title);
            targetProject.setDescription(description);
        }
        const updateTodoOfProject = (title, description, dueDate, priority, notes, projectIndex, todoIndex) => {
            removeTodoFromProject(projectIndex, todoIndex);
            addTodoToProject(title, description, dueDate, priority, notes, projectIndex);
        }
        const toggleSortModeOfProject = (index) => {
            projects[index].toggleSortMode();
        }

        const saveProjects = () => {
            const numProjects = projects.length;
            localStorage.setItem('numProjects', numProjects);

            for (let projectIndex = 0; projectIndex < numProjects; projectIndex++) {
                const project = projects[projectIndex];

                localStorage.setItem(`project${projectIndex}Title`, project.getTitle());
                localStorage.setItem(`project${projectIndex}Description`, project.getDescription());

                const numTodos = project.getNumTodos();
                localStorage.setItem(`project${projectIndex}NumTodos`, numTodos);

                const todos = project.getTodos();
                for (let todoIndex = 0; todoIndex < numTodos; todoIndex++) {
                    const todo = todos[todoIndex];

                    localStorage.setItem(`project${projectIndex}Todo${todoIndex}Title`, todo.getTitle());
                    localStorage.setItem(`project${projectIndex}Todo${todoIndex}Description`, todo.getDescription());
                    localStorage.setItem(`project${projectIndex}Todo${todoIndex}DueDate`, todo.getDueDate().toString());
                    localStorage.setItem(`project${projectIndex}Todo${todoIndex}Priority`, todo.getPriority());
                    localStorage.setItem(`project${projectIndex}Todo${todoIndex}Notes`, todo.getNotes());
                }
            }
        }

        const loadProjects = () => {
            const numProjects = localStorage.getItem('numProjects');

            for (let projectIndex = 0; projectIndex < numProjects; projectIndex++) {
                const projectTitle = localStorage.getItem(`project${projectIndex}Title`);
                const projectDescription = localStorage.getItem(`project${projectIndex}Description`);
                addProject(projectTitle, projectDescription);

                const numTodos = localStorage.getItem(`project${projectIndex}NumTodos`);
                for (let todoIndex = 0; todoIndex < numTodos; todoIndex++) {
                    const todoTitle = localStorage.getItem(`project${projectIndex}Todo${todoIndex}Title`);
                    const todoDescription = localStorage.getItem(`project${projectIndex}Todo${todoIndex}Description`);
                    const todoDueDate = localStorage.getItem(`project${projectIndex}Todo${todoIndex}DueDate`);
                    const todoPriority = localStorage.getItem(`project${projectIndex}Todo${todoIndex}Priority`);
                    const todoNotes = localStorage.getItem(`project${projectIndex}Todo${todoIndex}Notes`);

                    addTodoToProject(todoTitle, todoDescription, new Date(todoDueDate), todoPriority, todoNotes, projectIndex);
                }
            }
        }

        return { getProjects, addProject, removeProject, addTodoToProject, removeTodoFromProject, updateDetailsOfProject, updateTodoOfProject, toggleSortModeOfProject, saveProjects, loadProjects };
    })();

    function removeAllChildren(element) {
        while (element.hasChildNodes())
            element.removeChild(element.firstChild);
    }

    const clickIntoProject = e => {
        let target = e.target;
        while (!target.classList.contains('project-card')) {
            target = target.parentNode;
        }
        currProjectIndex = target.dataset.projectIndex;
        loadProject(ProjectsController.getProjects()[currProjectIndex]);
    }

    function loadProjects(projects) {
        removeAllChildren(content);
        clearButtonBar();
        loadNewProjectButton();
        loadDeleteProjectButton();
        setBackButtonDisabled(true);

        const projectView = document.createElement('div');
        projectView.classList.add('project-view');

        for (let projectIndex = 0; projectIndex < projects.length; projectIndex++) {
            const project = projects[projectIndex];

            const projectCard = document.createElement('button');
            projectCard.classList.add('project-card');
            projectCard.dataset.projectIndex = projectIndex;

            const projectTitle = document.createElement('div');
            projectTitle.classList.add('project-title');
            projectTitle.textContent = project.getTitle();

            const projectDescription = document.createElement('div');
            projectDescription.classList.add('project-description');
            projectDescription.textContent = project.getDescription();

            projectCard.appendChild(projectTitle);
            projectCard.appendChild(projectDescription);

            const todos = project.getTodos();
            const preview = document.createElement('ol');
            preview.classList.add('preview');

            const limit = Math.min(todos.length, 5);
            for (let todoIndex = 0; todoIndex < limit; todoIndex++) {
                const previewTodo = document.createElement('li');
                previewTodo.classList.add('preview-todo');
                previewTodo.textContent = todos[todoIndex].getTitle();

                const divider = document.createElement('div');
                divider.classList.add('divider');

                preview.appendChild(previewTodo);
                if (todoIndex + 1 !== limit)
                    preview.appendChild(divider);
            }

            projectCard.addEventListener('click', clickIntoProject);

            projectCard.appendChild(preview);

            projectView.appendChild(projectCard);
        }

        content.appendChild(projectView);
    }

    function openUpdateTodoForm(todo) {
        updateTodoDialog.showModal();
        updateTodoTitleBox.value = todo.getTitle();
        updateTodoDescriptionBox.value = todo.getDescription();
        updateTodoDueDateBox.valueAsNumber = todo.getDueDate().valueOf();
        updateTodoPriorityBox.value = todo.getPriority();
        updateTodoNotesBox.value = todo.getNotes();
    }

    const clickIntoTodo = e => {
        let target = e.target;
        while (target.nodeName.toLowerCase() != 'tr') {
            target = target.parentNode;
        }
        currTodoIndex = target.dataset.todoIndex;
        openUpdateTodoForm(ProjectsController.getProjects()[currProjectIndex].getTodos()[currTodoIndex]);
    }

    function loadProject(project) {
        removeAllChildren(content);
        clearButtonBar();
        loadNewTodoButton();
        loadDeleteTodoButton();
        loadToggleSortButton();
        setBackButtonDisabled(false);

        const projectWrapper = document.createElement('div');

        const projectDetails = document.createElement('div');

        const titleArea = document.createElement('div');
        const titleLabel = document.createElement('label');
        const titleBox = document.createElement('input');

        const descriptionArea = document.createElement('div');
        const descriptionLabel = document.createElement('label');
        const descriptionBox = document.createElement('textarea');

        projectWrapper.classList.add('project-wrapper');

        projectDetails.classList.add('project-details');

        titleArea.classList.add('title-area');

        titleLabel.textContent = "Title:"
        titleLabel.htmlFor = "title-box";

        titleBox.value = project.getTitle();
        titleBox.name = "title-box";
        titleBox.id = "title-box";
        titleBox.addEventListener('input', e => {
            ProjectsController.updateDetailsOfProject(titleBox.value, descriptionBox.value, currProjectIndex);
            ProjectsController.saveProjects();
        });

        descriptionArea.classList.add('description-area');

        descriptionLabel.textContent = "Description:";
        descriptionLabel.htmlFor = "desription-box";

        descriptionBox.value = project.getDescription();
        descriptionBox.name = "description-box";
        descriptionBox.id = "description-box";
        descriptionBox.cols = 21;
        descriptionBox.rows = 5;
        descriptionBox.addEventListener('input', e => {
            ProjectsController.updateDetailsOfProject(titleBox.value, descriptionBox.value, currProjectIndex);
            ProjectsController.saveProjects();
        });

        const todoListWrapper = document.createElement('div');
        todoListWrapper.classList.add('todo-list-wrapper');

        const todoListLabel = document.createElement('label');
        todoListLabel.textContent = "Todo Items:";
        todoListWrapper.appendChild(todoListLabel);

        const tableWrapper = document.createElement('div');
        tableWrapper.classList.add('table-wrapper');

        const todoList = document.createElement('table');
        todoList.classList.add('todo-list');

        const tableHeaders = document.createElement('tr');
        tableHeaders.classList.add('table-headers');

        const headers = ['Title', 'Description', 'Due Date', 'Priority', 'Notes'];
        headers.forEach(headerText => {
            const header = document.createElement('th');
            header.textContent = headerText;
            tableHeaders.appendChild(header);
        });
        todoList.appendChild(tableHeaders);

        const todos = project.getTodos();
        for (let todoIndex = 0; todoIndex < todos.length; todoIndex++) {
            const todo = todos[todoIndex];

            const tableRow = document.createElement('tr');
            tableRow.role = 'button';
            tableRow.dataset.todoIndex = todoIndex;
            tableRow.addEventListener('click', clickIntoTodo);

            const todoTitle = document.createElement('td');
            todoTitle.textContent = todo.getTitle();

            const todoDescription = document.createElement('td');
            todoDescription.textContent = todo.getDescription();

            const todoDueDate = document.createElement('td');
            const date = todo.getDueDate();
            todoDueDate.textContent = format(date, 'M-d-y');

            const todoPriority = document.createElement('td');
            todoPriority.textContent = todo.getPriority();

            const todoNotes = document.createElement('td');
            todoNotes.textContent = todo.getNotes();

            tableRow.appendChild(todoTitle);
            tableRow.appendChild(todoDescription);
            tableRow.appendChild(todoDueDate);
            tableRow.appendChild(todoPriority);
            tableRow.appendChild(todoNotes);

            todoList.appendChild(tableRow);
        }
        tableWrapper.appendChild(todoList);
        todoListWrapper.appendChild(tableWrapper);

        titleArea.appendChild(titleLabel);
        titleArea.appendChild(titleBox);

        descriptionArea.appendChild(descriptionLabel);
        descriptionArea.appendChild(descriptionBox);

        projectDetails.appendChild(titleArea);
        projectDetails.appendChild(descriptionArea);

        projectWrapper.appendChild(projectDetails);
        projectWrapper.appendChild(todoListWrapper);

        content.appendChild(projectWrapper);
    }

    function clearButtonBar() {
        while (buttonBar.childElementCount > 1)
            buttonBar.removeChild(buttonBar.lastChild);
    }

    function loadNewProjectButton() {
        const newProjectButton = document.createElement('button');
        newProjectButton.classList.add('new-project-button');
        newProjectButton.textContent = "New Project";
        newProjectButton.addEventListener('click', e => { projectDialog.showModal(); });
        buttonBar.appendChild(newProjectButton);
    }

    const deleteProject = e => {
        let target = e.target;
        while (!target.classList.contains('project-card')) {
            target = target.parentNode;
        }
        ProjectsController.removeProject(target.dataset.projectIndex);
        ProjectsController.saveProjects();
        loadProjects(ProjectsController.getProjects());
    }

    function loadDeleteProjectButton() {
        const deleteProjectButton = document.createElement('button');
        deleteProjectButton.classList.add('delete-project-button');
        deleteProjectButton.textContent = "Delete Project";
        deleteProjectButton.addEventListener('click', e => {
            const projectView = document.querySelector('.project-view');
            if (!deleteProjectButton.classList.contains('active')) {
                for (const projectCard of projectView.children) {
                    projectCard.addEventListener('click', deleteProject);
                    projectCard.removeEventListener('click', clickIntoProject);
                }
                document.querySelector('.new-project-button').disabled = true;
                deleteProjectButton.textContent = "Cancel";
            }
            else {
                for (const projectCard of projectView.children) {
                    projectCard.removeEventListener('click', deleteProject);
                    projectCard.addEventListener('click', clickIntoProject);
                }
                document.querySelector('.new-project-button').disabled = false;
                deleteProjectButton.textContent = "Delete Project";
            }
            deleteProjectButton.classList.toggle('active');
        });
        buttonBar.appendChild(deleteProjectButton);
    }

    function loadNewTodoButton() {
        const newTodoButton = document.createElement('button');
        newTodoButton.classList.add('new-todo-button');
        newTodoButton.textContent = "New Todo";
        newTodoButton.addEventListener('click', e => { todoDialog.showModal(); });
        buttonBar.appendChild(newTodoButton);
    }

    const deleteTodo = e => {
        let target = e.target;
        while (target.nodeName.toLowerCase() != 'tr') {
            target = target.parentNode;
        }
        ProjectsController.removeTodoFromProject(currProjectIndex, target.dataset.todoIndex);
        ProjectsController.saveProjects();
        loadProject(ProjectsController.getProjects()[currProjectIndex]);
    }

    function loadDeleteTodoButton() {
        const deleteTodoButton = document.createElement('button');
        deleteTodoButton.classList.add('delete-todo-button');
        deleteTodoButton.textContent = "Delete Todo";
        deleteTodoButton.addEventListener('click', e => {
            const todoList = document.querySelectorAll('tr:not(:first-child)');
            if (!deleteTodoButton.classList.contains('active')) {
                for (const todo of todoList) {
                    todo.addEventListener('click', deleteTodo);
                    todo.removeEventListener('click', clickIntoTodo);
                }
                setBackButtonDisabled(true);
                document.querySelector('.new-todo-button').disabled = true;
                document.querySelector('.toggle-sort-button').disabled = true;
                deleteTodoButton.textContent = "Cancel";
            }
            else {
                for (const todo of todoList) {
                    todo.removeEventListener('click', deleteTodo);
                    todo.addEventListener('click', clickIntoTodo);
                }
                setBackButtonDisabled(false);
                document.querySelector('.new-todo-button').disabled = false;
                document.querySelector('.toggle-sort-button').disabled = false;
                deleteTodoButton.textContent = "Delete Todo";
            }
            deleteTodoButton.classList.toggle('active');
        });
        buttonBar.appendChild(deleteTodoButton);
    }

    function loadToggleSortButton() {
        const toggleSortButton = document.createElement('button');
        toggleSortButton.classList.add('toggle-sort-button');
        toggleSortButton.textContent = "Toggle Sort";
        toggleSortButton.addEventListener('click', e => {
            ProjectsController.toggleSortModeOfProject(currProjectIndex);
            loadProject(ProjectsController.getProjects()[currProjectIndex]);

        });
        buttonBar.appendChild(toggleSortButton);
    }

    function setBackButtonDisabled(value) {
        backButton.disabled = value;
    }




    document.querySelectorAll('.cancel-button').forEach(button => {
        const image = document.createElement('img');
        image.src = cancelSVG;
        image.alt = "Cancel button";
        image.style.maxWidth = "2rem";
        button.appendChild(image);
    })

    backButton.addEventListener('click', e => { loadProjects(ProjectsController.getProjects()); });

    projectSubmitButton.addEventListener('click', e => {
        if (projectForm.checkValidity()) {
            ProjectsController.addProject(projectTitleBox.value, projectDescriptionBox.value);
            ProjectsController.saveProjects();
            loadProjects(ProjectsController.getProjects());
        }
    });

    todoSubmitButton.addEventListener('click', e => {
        if (todoForm.checkValidity()) {
            const dateValue = todoDueDateBox.value;
            const dateArray = dateValue.split('-');
            const year = parseInt(dateArray[0]);
            const month = parseInt(dateArray[1]) - 1;
            const day = parseInt(dateArray[2]);
            const date = new Date(year, month, day);

            ProjectsController.addTodoToProject(todoTitleBox.value, todoDescriptionBox.value, date, todoPriorityBox.value, todoNotesBox.value, currProjectIndex);
            ProjectsController.saveProjects();
            loadProject(ProjectsController.getProjects()[currProjectIndex]);
        }
    });

    updateTodoSubmitButton.addEventListener('click', e => {
        if (updateTodoForm.checkValidity()) {
            const dateValue = updateTodoDueDateBox.value;
            const dateArray = dateValue.split('-');
            const year = parseInt(dateArray[0]);
            const month = parseInt(dateArray[1]) - 1;
            const day = parseInt(dateArray[2]);
            const date = new Date(year, month, day);

            ProjectsController.updateTodoOfProject(updateTodoTitleBox.value, updateTodoDescriptionBox.value, date, updateTodoPriorityBox.value, updateTodoNotesBox.value, currProjectIndex, currTodoIndex);
            ProjectsController.saveProjects();
            loadProject(ProjectsController.getProjects()[currProjectIndex]);
        }
    });

    projectCancelButton.addEventListener('click', e => { projectDialog.close(); });
    todoCancelButton.addEventListener('click', e => { todoDialog.close(); });
    updateTodoCancelButton.addEventListener('click', e => { updateTodoDialog.close(); });

    if (!localStorage.getItem('pageHasLoadedBefore')) {
        ProjectsController.addProject('Default Project', '');
        ProjectsController.saveProjects();
        localStorage.setItem('pageHasLoadedBefore', true);
    }
    else
        ProjectsController.loadProjects();
    loadProjects(ProjectsController.getProjects());

})();