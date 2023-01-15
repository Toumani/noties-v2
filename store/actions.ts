import { Note } from "../model";

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
