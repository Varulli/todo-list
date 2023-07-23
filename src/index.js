import { TodoItem, TodoProject } from './todoObjects.js';

const ProjectsController = (() => {
    const projects = [];

    const addProject = (title) => {
        projects.push(TodoProject(title));
    }

    return { addProject };
})();