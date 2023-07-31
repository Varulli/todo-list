import './style.css';
import { TodoItem, TodoProject } from './todoObjects';
// import { clearContent, loadProjects, loadProject, currProjectIndex } from './contentLoaders';
// import { clearButtonBar, loadNewProjectButton, loadNewTodoButton } from './buttonBarLoaders';

const DOMController = (() => {

    const buttonBar = document.querySelector('.button-bar');
    const content = document.querySelector('.content');

    const backButton = document.querySelector('.back-button');

    const projectDialog = document.querySelector('#project-dialog');
    const todoDialog = document.querySelector('#todo-dialog');

    const projectForm = document.querySelector('#project-dialog form');
    const todoForm = document.querySelector('#todo-dialog form');

    const projectSubmitButton = document.querySelector('.project.submit-button');
    const todoSubmitButton = document.querySelector('.todo.submit-button');

    const projectCancelButton = document.querySelector('#project-dialog form .cancel-button');
    const todoCancelButton = document.querySelector('#todo-dialog form .cancel-button');

    const projectTitleBox = document.querySelector('#project-title');
    const projectDescriptionBox = document.querySelector('#project-description');

    const todoTitleBox = document.querySelector('#todo-title');
    const todoDescriptionBox = document.querySelector('#todo-description');
    const todoDueDateBox = document.querySelector('#todo-due-date');
    const todoPriorityBox = document.querySelector('#todo-priority');
    const todoNotesBox = document.querySelector('#todo-notes');

    let currProjectIndex;

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
                    localStorage.setItem(`project${projectIndex}Todo${todoIndex}DueDate`, todo.getDueDate().toISOString());
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

    function clearContent() {
        while (content.hasChildNodes())
            content.removeChild(content.firstChild);
    }

    function loadProjects(projects) {
        clearContent();
        clearButtonBar();
        loadNewProjectButton();
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

            projectCard.addEventListener('click', e => {
                currProjectIndex = projectCard.dataset.projectIndex;
                loadProject(project);
            });

            projectCard.appendChild(preview);

            projectView.appendChild(projectCard);
        }

        content.appendChild(projectView);
    }

    function loadProject(project) {
        clearContent();
        clearButtonBar();
        loadNewTodoButton();
        loadToggleSortButton();
        setBackButtonDisabled(false);

        const projectDetails = document.createElement('div');

        const titleArea = document.createElement('div');
        const titleLabel = document.createElement('label');
        const titleBox = document.createElement('input');

        const descriptionArea = document.createElement('div');
        const descriptionLabel = document.createElement('label');
        const descriptionBox = document.createElement('textarea');

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
        descriptionBox.addEventListener('input', e => {
            ProjectsController.updateDetailsOfProject(titleBox.value, descriptionBox.value, currProjectIndex);
            ProjectsController.saveProjects();
        });

        const todoList = document.createElement('ol');
        todoList.classList.add('todo-list');

        const todos = project.getTodos();
        for (let todoIndex = 0; todoIndex < todos.length; todoIndex++) {
            const todo = todos[todoIndex];

            const todoWrapper = document.createElement('li');
            todoWrapper.classList.add('todo-wrapper');

            const todoElement = document.createElement('button');
            todoElement.classList.add('todo');
            todoElement.dataset.todoIndex = todoIndex;
            todoElement.addEventListener('click', e => {
                openTodoForm(todo);
                todoSubmitButton.addEventListener('click', e => {
                    ProjectsController.updateTodoOfProject(todoTitleBox.value, todoDescriptionBox.value, new Date(todoDueDateBox.value), todoPriorityBox.value, todoNotesBox.value, currProjectIndex, todoIndex);
                    ProjectsController.saveProjects();
                    loadProject(ProjectsController.getProjects()[currProjectIndex]);
                }, { once: true });
            });

            const todoTitle = document.createElement('div');
            todoTitle.textContent = todo.getTitle();
            todoTitle.classList.add('todo-title');

            const todoDescription = document.createElement('div');
            todoDescription.textContent = todo.getDescription();
            todoDescription.classList.add('todo-description');

            const todoDueDate = document.createElement('div');
            const date = todo.getDueDate();
            todoDueDate.textContent = `${date.getMonth() + 1}/${date.getDate() + 1}/${date.getFullYear()}`;
            todoDueDate.textContent = date.toISOString().slice(0, 10);
            todoDueDate.classList.add('todo-due-date');

            const todoPriority = document.createElement('div');
            todoPriority.textContent = todo.getPriority();
            todoPriority.classList.add('todo-priority');

            const divider = document.createElement('div');
            divider.classList.add('divider');

            todoElement.appendChild(todoTitle);
            todoElement.appendChild(todoDescription);
            todoElement.appendChild(todoDueDate);
            todoElement.appendChild(todoPriority);

            todoWrapper.appendChild(todoElement);
            todoList.appendChild(todoWrapper);
            if (todoIndex + 1 !== todos.length)
                todoList.appendChild(divider);
        }

        titleArea.appendChild(titleLabel);
        titleArea.appendChild(titleBox);

        descriptionArea.appendChild(descriptionLabel);
        descriptionArea.appendChild(descriptionBox);

        projectDetails.appendChild(titleArea);
        projectDetails.appendChild(descriptionArea);
        projectDetails.appendChild(todoList);

        content.appendChild(projectDetails);
    }

    function openTodoForm(todo) {
        todoDialog.showModal();
        todoTitleBox.value = todo.getTitle();
        todoDescriptionBox.value = todo.getDescription();
        todoDueDateBox.valueAsNumber = todo.getDueDate().valueOf();
        todoPriorityBox.value = todo.getPriority();
        todoNotesBox.value = todo.getNotes();
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

    function loadNewTodoButton() {
        const newTodoButton = document.createElement('button');
        newTodoButton.classList.add('new-todo-button');
        newTodoButton.textContent = "New Todo";
        newTodoButton.addEventListener('click', e => {
            todoDialog.showModal();
            todoSubmitButton.addEventListener('click', e => {
                if (todoForm.checkValidity()) {
                    ProjectsController.addTodoToProject(todoTitleBox.value, todoDescriptionBox.value, new Date(todoDueDateBox.value), todoPriorityBox.value, todoNotesBox.value, currProjectIndex);
                    ProjectsController.saveProjects();
                    loadProject(ProjectsController.getProjects()[currProjectIndex]);
                }
            }, { once: true });
        });
        buttonBar.appendChild(newTodoButton);
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




    backButton.addEventListener('click', e => { loadProjects(ProjectsController.getProjects()); });

    projectSubmitButton.addEventListener('click', e => {
        if (projectForm.checkValidity()) {
            ProjectsController.addProject(projectTitleBox.value, projectDescriptionBox.value);
            ProjectsController.saveProjects();
            loadProjects(ProjectsController.getProjects());
        }
    });

    projectCancelButton.addEventListener('click', e => { projectDialog.close(); });
    todoCancelButton.addEventListener('click', e => { todoDialog.close(); });

    if (!localStorage.getItem('pageHasLoadedBefore')) {
        ProjectsController.addProject('Default Project', '');
        ProjectsController.saveProjects();
        localStorage.setItem('pageHasLoadedBefore', true);
    }
    ProjectsController.loadProjects();
    loadProjects(ProjectsController.getProjects());

})();