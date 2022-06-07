import type {NextApiRequest, NextApiResponse} from 'next'
import {PrismaClient} from '@prisma/client'
import {withIronSessionApiRoute} from 'iron-session/next'
import {sessionOptions} from "../../lib/session";

const prisma = new PrismaClient()

export type Note = {
  id: number,
  created: Date,
  title: string,
  categoryId: number,
}

export type NoteWithCategory = {
  id: number,
  created: Date,
  title: string,
  category: { name: string, color: string },
  nbElementDone: number,
  nbElement: number,
  author: string
}

export default withIronSessionApiRoute(handler, sessionOptions)

async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      if (req.session.user)
        getNotesWithCategory()
          .then(async response => {
            req.session.notes = response as unknown as NoteWithCategory[]
            await req.session.save()
            res.status(200).json({
              data: response,
              success: true,
              reason: null
            })
          })
          .catch((e) => {
            throw e
          })
          .finally(async () => {
            await prisma.$disconnect()
          })
      else {
        res.status(401).json({
          data: null,
          success: false,
          reason: 'unauthorised'
        })
      }
      break;
    default:
      res.status(405).json({ data: null, success: false, reason: 'method-not-allowed' })
  }
}

async function getNotesWithCategory() {
  return (await prisma.note.findMany({
    include: {
      category: true,
    }
  })).map(it => ({
    id: it.id,
    created: new Date(),
    title: it.title,
    category: it.category,
    nbElementDone: it.nbDone,
    nbElement: it.nbTotal,
    author: 'Kenza'
  }))
}