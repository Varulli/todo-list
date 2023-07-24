import { TodoItem, TodoProject } from './todoObjects.js';

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

    return { addProject, removeProject, getProjects };
})();