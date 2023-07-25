const content = document.querySelector('.content');

function clearContent() {
    while (content.hasChildNodes())
        content.removeChild(content.firstChild);
}

function loadProjects(projects) {
    clearContent();

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

        projectCard.appendChild(preview);

        projectView.appendChild(projectCard);
    }

    content.appendChild(projectView);
}

function loadProject(projects, index) {

}

export { clearContent, loadProjects, loadProject };