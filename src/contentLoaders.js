const content = document.querySelector('.content');

function clearContent() {
    while (content.hasChildNodes())
        content.removeChild(content.firstChild);
}

function loadProjects(projects) {

}

function loadProject(projects, index) {

}

export { clearContent, loadProjects, loadProject };