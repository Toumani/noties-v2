import {PrismaClient} from "@prisma/client";
import {withIronSessionApiRoute} from "iron-session/next";
import {sessionOptions} from "../../../lib/session";
import {NextApiRequest, NextApiResponse} from "next";
import {cors} from "../../../lib/init-middleware";
import {bypassAuth} from '../../../lib/constants';

const prisma = new PrismaClient()

export default withIronSessionApiRoute(handler, sessionOptions)

export interface Task {
  id: number,
  title: string,
  done: boolean,
  index: number,
  noteId: number,
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res);
  switch (req.method) {
    case 'GET':
      if (req.session.user || bypassAuth)
        return getTasksOfNote(parseInt(req.query.nid as string))
          .then(async response => {
            return res.status(200).json(response)
          })
          .catch((e) => {
            throw e
          })
          .finally(async () => {
            await prisma.$disconnect()
          })
      else {
        return res.status(401).json({
          data: null,
          success: false,
          reason: 'unauthorised'
        })
      }
    default:
      return res.status(405).json({ message: 'Method not allowed' })
  }
}

async function getTasksOfNote(noteId: number) {
  return (await prisma.todo.findMany({
    where: {
      note_id: noteId
    }
  })).map(it => ({
    id: it.id,
    title: it.task,
    done: it.done,
    index: it.id, // Does not actually correspond to the index. Must update database model to include tasks indexes.
    noteId: it.note_id
  }))
}