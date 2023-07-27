import { loadNewProjectButton, loadNewTodoButton, setBackButtonDisabled } from "./buttonBarLoaders";

const content = document.querySelector('.content');

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

        projectCard.addEventListener('click', e => { loadProject(project); });

        projectCard.appendChild(preview);

        projectView.appendChild(projectCard);
    }

    content.appendChild(projectView);
}

function loadProject(project) {
    clearContent();
    loadNewTodoButton();
    setBackButtonDisabled(false);

    const titleField = document.createElement('div');
    const titleLabel = document.createElement('label');
    const titleBox = document.createElement('input');

    titleLabel.textContent = "Title: "
    titleLabel.htmlFor = "title-box";

    titleBox.value = project.getTitle();
    titleBox.name = "title-box";
    titleBox.id = "title-box";
    titleBox.addEventListener('input', e => { project.setTitle(titleBox.value); });

    const todoList = document.createElement('ol');
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

        const divider = document.createElement('div');
        divider.classList.add('divider');

        todo.appendChild(todoTitle);
        todo.appendChild(todoDescription);

        todoList.appendChild(todo);
        if (todoIndex + 1 !== todos.length)
            preview.appendChild(divider);
    }

    titleField.appendChild(titleLabel);
    titleField.appendChild(titleBox);
    content.appendChild(titleField);
}

export { clearContent, loadProjects, loadProject };