import type {NextApiRequest, NextApiResponse} from 'next'
import {PrismaClient} from '@prisma/client'
import {withIronSessionApiRoute} from 'iron-session/next'
import {sessionOptions} from "../../../lib/session";
import {cors} from "../../../lib/init-middleware";
import {bypassAuth} from '../../../lib/constants';

const prisma = new PrismaClient()

export interface Note {
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
  await cors(req, res);
  if (!req.session.user && !bypassAuth)
    return res.status(401).json({
      data: null,
      success: false,
      reason: 'unauthorised'
    })
  switch (req.method) {
    case 'GET':
      const categoryId =  isNaN(parseInt(req.query.categoryId as string)) ? undefined : parseInt(req.query.categoryId as string)
      return getNotesWithCategory(categoryId)
        .then(async response => {
          return res.status(200).json({
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
    case 'POST':
      return createNote(req.body)
        .then(response => {
          return res.status(201).json(response)
        })
        .finally(async () => {
          await prisma.$disconnect()
        })
    default:
      return res.status(405).json({ data: null, success: false, reason: 'method-not-allowed' })
  }
}

async function getNotesWithCategory(categoryId?: number) {
  return (await prisma.note.findMany({
    where: {
      category_id: categoryId
    },
    include: {
      category: true,
    },
    orderBy: {
      created: 'desc',
    },
    take: categoryId ? undefined : 10,
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

async function createNote(note: Note) {
  return await prisma.note.create({
    data: {
      id: undefined,
      created: new Date(),
      title: note.title,
      category_id: note.categoryId,
      nbDone: 0,
      nbTotal: 0
    }
  })
}