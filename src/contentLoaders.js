const content = document.querySelector('.content');

function clearContent() {
    while (content.hasChildNodes())
        content.removeChild(content.firstChild);
}

function loadProjects(projects) {
    clearContent();

    const projectView = document.createElement('div');
    projectView.classList.add('project-view');

    for (const project of projects) {
        const projectCard = document.createElement('button');
        projectCard.classList.add('project-card');

        const projectTitle = document.createElement('div');
        projectTitle.classList.add('project-title');
        projectTitle.textContent = project.getTitle();

        const projectDescription = document.createElement('div');
        projectDescription.classList.add('project-description');
        projectDescription.textContent = project.getDescription();

        projectCard.appendChild(projectTitle);
        projectCard.appendChild(projectDescription);

        const todos = project.getTodos();
        if (todos.length > 0) {
            const preview = document.createElement('ol');
            preview.classList.add('preview');

            const limit = todos.length > 3 ? 3 : todos.length;
            for (let i = 0; i < limit; i++) {
                const previewItem = document.createElement('li');
                previewItem.classList.add('preview-item');
                previewItem.textContent = todos[i].getTitle();
                preview.appendChild(previewItem);
            }

            projectCard.appendChild(preview);
        }

        projectView.appendChild(projectCard);
    }

    content.appendChild(projectView);
}

function loadProject(projects, index) {

}

export { clearContent, loadProjects, loadProject };