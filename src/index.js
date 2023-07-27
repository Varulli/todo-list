import './style.css';
import { TodoItem, TodoProject } from './todoObjects.js';
import { clearContent, loadProjects, loadProject } from './contentLoaders.js';
import { clearButtonBar, loadNewProjectButton, loadNewTodoButton } from './buttonBarLoaders.js';

const DOMController = (() => {

    const projectSubmitButton = document.querySelector('.project.submit-button');
    const todoSubmitButton = document.querySelector('.todo.submit-button');
    const cancelButton = document.querySelector('cancel-button');

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
            // console.log(projects);
        }
        const removeProject = (index) => {
            projects.splice(index, 1);
            // console.log(projects);
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

    loadNewProjectButton();

    projectSubmitButton.addEventListener('click', e => {
        if (projectTitleBox.checkValidity()) {
            ProjectsController.addProject(projectTitleBox.value, projectDescriptionBox.value);
            loadProjects(ProjectsController.getProjects());
        }
    });

    ProjectsController.addProject('Default Project', '');
    loadProjects(ProjectsController.getProjects());

})();