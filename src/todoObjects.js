function TodoItem(title, description, dueDate, priority, notes) {
    const getTitle = () => title;
    const getDescription = () => description;
    const getDueDate = () => dueDate;
    const getPriority = () => priority;
    const getNotes = () => notes;
    return { getTitle, getDescription, getDueDate, getPriority, getNotes };
}

function TodoProject(title) {
    const todos = [];
    let sortMode = 'dueDate';

    const addTask = (title, description, dueDate, priority, notes) => {
        todos.push(TodoItem(title, description, dueDate, priority, notes));
    }
    const removeTask = (index) => {
        todos.splice(index, 1);
    }
    const toggleSortMode = () => {
        sortMode = sortMode === 'dueDate' ? 'priority' : 'dueDate';
    }

    const getTitle = () => title;
    const getTodos = () => todos;
    const getSortMode = () => sortMode;

    return { addTask, removeTask, toggleSortMode, getTitle, getTodos, getSortMode };
}