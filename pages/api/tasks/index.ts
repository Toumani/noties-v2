import {PrismaClient} from "@prisma/client";
import {withIronSessionApiRoute} from "iron-session/next";
import {sessionOptions} from "../../../lib/session";
import {NextApiRequest, NextApiResponse} from "next";
import {Task} from "./[nid]";

const prisma = new PrismaClient()

export default withIronSessionApiRoute(handler, sessionOptions)

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!req.session.user)
    return res.status(401).json({ message: 'unauthorised' })

  const task = req.body
  switch (req.method) {
    case 'POST':
      return createTask(task)
        .then((result) => res.status(201).json(result))
        .finally(async () => {
          await prisma.$disconnect()
        })
    case 'PUT':
        return updateTaskStatus(task)
          .then((result) => res.status(200).json({ result }))
          .finally(async () => {
            await prisma.$disconnect()
          })
    case 'DELETE':
      return deleteTask(task)
        .then((result) => res.status(200).json(result))
        .finally(async () => {
          await prisma.$disconnect()
        })
    default:
      return res.status(405).json({ message: 'Method not allowed' })
  }
}

async function createTask(task: Task) {
  const noteId = parseInt(task.noteId + '')

  const todo = await prisma.todo.create({
    data: {
      done: false,
      task: task.title,
      note: { connect: { id: noteId } }
    }
  })
  const nbTotal = await prisma.todo.count({ where: { note_id: noteId } })
  await prisma.note.update({
    where: {id: noteId},
    data: {
      nbTotal,
    }
  });

  return {
    id: todo.id,
    title: todo.task,
    done: todo.done,
    index: todo.id,
    noteId: todo.note_id
  } as Task
}

async function updateTaskStatus(task: Task) {
  const updatedTask = await prisma.todo.update({
    where: { id: task.id },
    data: { task: task.title, done: task.done }
  })
  const nbDone = await prisma.todo.count({ where: { note_id: task.noteId, done: true } })
  await prisma.note.update({
    where: { id: task.noteId },
    data: { nbDone: nbDone }
  })
  return {
    id: updatedTask.id,
    title: updatedTask.task,
    done: updatedTask.done,
    index: updatedTask.id,
    noteId: updatedTask.note_id
  } as Task;
}

async function deleteTask(task: Task) {
  const deletedTask = await prisma.todo.delete({
    where: { id: task.id }
  })
  const nbTotal = await prisma.todo.count({ where: { note_id: task.noteId } })
  const nbDone = await prisma.todo.count({ where: { note_id: task.noteId, done: true } })
  await prisma.note.update({
    where: { id: task.noteId },
    data: { nbDone, nbTotal }
  })
  return {
    id: deletedTask.id,
    title: deletedTask.task,
    done: deletedTask.done,
    index: deletedTask.id,
    noteId: deletedTask.note_id
  } as Task;
}