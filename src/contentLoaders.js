const content = document.querySelector('.content');

function clearContent() {
    while (content.hasChildNodes())
        content.removeChild(content.firstChild);
}

function loadProjects(projects) {
    for (const project of projects) {
        const projectWrapper
    }
}

function loadProject(projects, index) {

}

export { clearContent, loadProjects, loadProject };