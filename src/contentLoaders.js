import { loadNewProjectButton, loadNewTodoButton, setBackButtonDisabled } from "./buttonBarLoaders";

const content = document.querySelector('.content');
let currProjectIndex;

function clearContent() {
    while (content.hasChildNodes())
        content.removeChild(content.firstChild);
}

function loadProjects(projects) {
    clearContent();
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

        const limit = Math.min(todos.length, 3);
        for (let todoIndex = 0; todoIndex < limit; todoIndex++) {
            const previewTodo = document.createElement('li');
            previewTodo.classList.add('preview-todo');
            previewTodo.dataset.todoIndex = todoIndex;
            previewTodo.textContent = todos[todoIndex].getTitle();

            const divider = document.createElement('div');
            divider.classList.add('divider');

            preview.appendChild(previewTodo);
            if (todoIndex + 1 !== limit)
                preview.appendChild(divider);
        }

        projectCard.addEventListener('click', e => {
            currProjectIndex = e.target.dataset.projectIndex;
            loadProject(project);
        });

        projectCard.appendChild(preview);

        projectView.appendChild(projectCard);
    }

    content.appendChild(projectView);
}

function loadProject(project) {
    clearContent();
    loadNewTodoButton();
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
    titleBox.addEventListener('input', e => { project.setTitle(titleBox.value); });

    descriptionArea.classList.add('description-area');

    descriptionLabel.textContent = "Description:";
    descriptionLabel.htmlFor = "desription-box";

    descriptionBox.value = project.getDescription();
    descriptionBox.name = "description-box";
    descriptionBox.id = "description-box";
    descriptionBox.addEventListener('input', e => { project.setDescription(descriptionBox.value); });

    const todoList = document.createElement('ol');
    todoList.classList.add('todo-list');

    const todos = project.getTodos();
    for (let todoIndex = 0; todoIndex < todos.length; todoIndex++) {
        const todoWrapper = document.createElement('li');
        todoWrapper.classList.add('todo-wrapper');

        const todo = document.createElement('button');
        todo.classList.add('todo');
        todo.dataset.todoIndex = todoIndex;

        const todoTitle = document.createElement('div');
        todoTitle.textContent = todos[todoIndex].getTitle();
        todoTitle.classList.add('todo-title');

        const todoDescription = document.createElement('div');
        todoDescription.textContent = todos[todoIndex].getDescription();
        todoDescription.classList.add('todo-description');

        const todoDueDate = document.createElement('div');
        const date = todos[todoIndex].getDueDate();
        todoDueDate.textContent = `${date.getMonth()}/${date.getDate()}/${date.getFullYear()}`;

        const divider = document.createElement('div');
        divider.classList.add('divider');

        todo.appendChild(todoTitle);
        todo.appendChild(todoDescription);
        todo.appendChild(todoDueDate);

        todoWrapper.appendChild(todo);
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

export { clearContent, loadProjects, loadProject, currProjectIndex };