import './style.css';
import { TodoItem, TodoProject } from './todoObjects';
import { clearContent, loadProjects, loadProject, currProjectIndex } from './contentLoaders';
import { clearButtonBar, loadNewProjectButton, loadNewTodoButton } from './buttonBarLoaders';

const DOMController = (() => {

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
            getProjects()[index].addTodo(title, description, dueDate, priority, notes);
        }
        const removeTodoFromProject = (projectIndex, todoIndex) => {
            getProjects()[projectIndex].removeTodo(todoIndex);
        }
        const updateDetailsOfProject = (title, description, index) => {
            const targetProject = getProjects()[index];
            targetProject.setTitle(title);
            targetProject.setDescription(description);
        }
        const updateTodoOfProject = (title, description, dueDate, priority, notes, projectIndex, todoIndex) => {
            removeTodoFromProject(projectIndex, todoIndex);
            addTodoToProject(title, description, dueDate, priority, notes, projectIndex);
        }
        const toggleSortModeOfProject = (index) => {
            getProjects()[index].toggleSortMode();
        }

        return { getProjects, addProject, removeProject, addTodoToProject, removeTodoFromProject, updateDetailsOfProject, updateTodoOfProject, toggleSortModeOfProject };
    })();

    backButton.addEventListener('click', e => { loadProjects(ProjectsController.getProjects()); });

    projectSubmitButton.addEventListener('click', e => {
        if (projectForm.checkValidity()) {
            ProjectsController.addProject(projectTitleBox.value, projectDescriptionBox.value);
            loadProjects(ProjectsController.getProjects());
        }
    });

    todoSubmitButton.addEventListener('click', e => {
        if (todoForm.checkValidity()) {
            ProjectsController.addTodoToProject(todoTitleBox.value, todoDescriptionBox.value, new Date(todoDueDateBox.value), todoPriorityBox.value, todoNotesBox.value, currProjectIndex);
            loadProject(ProjectsController.getProjects()[currProjectIndex]);
        }
    });

    projectCancelButton.addEventListener('click', e => { projectDialog.close(); });
    todoCancelButton.addEventListener('click', e => { todoDialog.close(); });

    ProjectsController.addProject('Default Project', '');
    loadProjects(ProjectsController.getProjects());

})();