const buttonBar = document.querySelector('.button-bar');
const backButton = document.querySelector('.back-button');

const projectDialog = document.querySelector('#project-dialog');
const todoDialog = document.querySelector('#todo-dialog');

function clearButtonBar() {
    while (buttonBar.childElementCount > 1)
        buttonBar.removeChild(buttonBar.lastChild);
}

function loadNewProjectButton() {
    clearButtonBar();

    const newProjectButton = document.createElement('button');
    newProjectButton.classList.add('new-project-button');
    newProjectButton.textContent = "New Project";
    newProjectButton.addEventListener('click', e => { projectDialog.showModal(); });
    buttonBar.appendChild(newProjectButton);
}

function loadNewTodoButton() {
    clearButtonBar();

    const newTodoButton = document.createElement('button');
    newTodoButton.classList.add('new-todo-button');
    newTodoButton.textContent = "New Todo";
    newTodoButton.addEventListener('click', e => { todoDialog.showModal(); });
    buttonBar.appendChild(newTodoButton);
}

function setBackButtonDisabled(value) {
    backButton.disabled = value;
}

export { clearButtonBar, loadNewProjectButton, loadNewTodoButton, setBackButtonDisabled };