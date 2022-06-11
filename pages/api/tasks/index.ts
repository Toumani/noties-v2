import {PrismaClient} from "@prisma/client";
import {withIronSessionApiRoute} from "iron-session/next";
import {sessionOptions} from "../../../lib/session";
import {NextApiRequest, NextApiResponse} from "next";
import {Task} from "./[nid]";

const prisma = new PrismaClient()

export default withIronSessionApiRoute(handler, sessionOptions)

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const task = req.body
  switch (req.method) {
    case 'PUT':
      if (req.session.user) {
        return updateTaskStatus(task)
          .then((result) => res.status(200).json({ result}))
          .finally(async () => {
            await prisma.$disconnect()
          })
      }
      else
        return res.status(401).json({ message: 'unauthorised' })
    default:
      return res.status(405).json({ message: 'Method not allowed' })
  }
}

async function updateTaskStatus(task: Task) {
  const updatedTask = await prisma.todo.update({
    where: { id: task.id },
    data: { done: task.done }
  })
  const nbDone = await prisma.todo.count({ where: { note_id: task.noteId, done: true } })
  await prisma.note.update({
    where: { id: task.noteId },
    data: { nbDone: nbDone }
  })
  return updatedTask;
}