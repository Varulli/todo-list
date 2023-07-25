import { TodoItem, TodoProject } from './todoObjects.js';
import { clearContent, loadProjects, loadProject } from './contentLoaders.js';

const DOMController = (() => {

    const createProjectButton = document.querySelector('.create-project-button');
    const content = document.querySelector('.content');
    const projectDialog = document.querySelector('#project-dialog');
    const todoDialog = document.querySelector('#todo-dialog');

    const ProjectsController = (() => {
        const projects = [];

        const getProjects = () => projects;

        const addProject = (title) => {
            projects.push(TodoProject(title));
            console.log(projects);
        }
        const removeProject = (index) => {
            projects.splice(index, 1);
            console.log(projects);
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

    createProjectButton.addEventListener('click', e => { projectDialog.showModal(); });

    // Test***
    // ---
    // ProjectsController.addProject('Yo-yo');
    // ProjectsController.addTodoToProject('Flick down', '', new Date(2023, 5), 1, '', 0);
    // loadProjects(ProjectsController.getProjects());
    // ---
})();