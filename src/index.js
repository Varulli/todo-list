import { TodoItem, TodoProject } from './todoObjects.js';

const DOMController = (() => {



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
        const updateTodoOfProject = (title, description, dueDate, priority, notes, projectIndex, todoIndex) => {
            removeTodoFromProject(projectIndex, todoIndex);
            addTodoToProject(title, description, dueDate, priority, notes, projectIndex);
        }
        const toggleSortModeOfProject = (index) => {
            getProjects()[index].toggleSortMode();
        }

        return { getProjects, addProject, removeProject, addTodoToProject, removeTodoFromProject, updateTodoOfProject, toggleSortModeOfProject };
    })();

})();