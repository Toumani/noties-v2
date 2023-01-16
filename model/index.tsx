export interface Category {
	id: string,
	name: string,
	color: string,
}

export interface Note {
	id: string,
	created: Date,
	title: string,
	categoryId?: string,
	tasks: Task[]
}

export interface Task {
	id: string,
	title: string,
	index: number,
	done: boolean
}