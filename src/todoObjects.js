function TodoItem(title, description, dueDate, priority, notes) {
    const getTitle = () => title;
    const getDescription = () => description;
    const getDueDate = () => dueDate;
    const getPriority = () => priority;
    const getNotes = () => notes;

    const setTitle = (newTitle) => title = newTitle;
    const setDescription = (newDescription) => description = newDescription;
    const setDueDate = (newDueDate) => dueDate = newDueDate;
    const setPriority = (newPriority) => priority = newPriority;
    const setNotes = (newNotes) => notes = newNotes;

    return {
        getTitle, getDescription, getDueDate, getPriority, getNotes,
        setTitle, setDescription, setDueDate, setPriority, setNotes
    };
}

function TodoProject(title) {
    const todos = [];
    let sortMode = 'dueDate';

    const getTitle = () => title;
    const getTodos = () => todos;
    const getSortMode = () => sortMode;

    const setTitle = (newTitle) => title = newTitle;
    const toggleSortMode = () => {
        sortMode = sortMode === 'dueDate' ? 'priority' : 'dueDate';
        sortTodos();
    }

    const sortTodos = () => {
        if (sortMode === 'dueDate')
            todos.sort((a, b) => {
                if (a.getDueDate() < b.getDueDate()) return -1;
                else if (a.getDueDate() > b.getDueDate()) return 1;
                else if (a.getDueDate() === b.getDueDate()) return 0;
            });
        else if (sortMode === 'priority')
            todos.sort((a, b) => {
                if (a.getPriority() < b.getPriority()) return -1;
                else if (a.getPriority() > b.getPriority()) return 1;
                else if (a.getPriority() === b.getPriority()) return 0;
            });
    }
    const addTodo = (title, description, dueDate, priority, notes) => {
        todos.push(TodoItem(title, description, dueDate, priority, notes));
        sortTodos();
    }
    const removeTodo = (index) => {
        todos.splice(index, 1);
    }

    return { getTitle, getTodos, getSortMode, setTitle, toggleSortMode, addTodo, removeTodo };
}

export { TodoItem, TodoProject };