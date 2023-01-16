import {Note, Task} from "../model";

interface Action {
	type: string,
	data: any,
}

export const addNote = (note: Note): Action => ({
	type: 'ADD_NOTE',
	data: note
});

export const deleteNote = (note: Note): Action => ({
	type: 'DELETE_NOTE',
	data: note
});

export const addTask = (note: Note, task: Task) => ({
	type: 'ADD_TASK',
	data: { note, task }
});

export const updateTask = (note: Note, task: Task) => ({
	type: 'UPDATE_TASK',
	data: { note, task }
});

export const deleteTask = (note: Note, task: Task) => ({
	type: 'DELETE_TASK',
	data: { note, task }
});

// Settings
export const setDarkMode = (darkMode: boolean) => ({
	type: 'SET_DARK_MODE',
	data: darkMode
})
