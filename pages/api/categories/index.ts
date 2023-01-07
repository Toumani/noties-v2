import {withIronSessionApiRoute} from "iron-session/next";
import {sessionOptions} from "../../../lib/session";
import {NextApiRequest, NextApiResponse} from "next";
import {PrismaClient} from "@prisma/client";
import {cors} from "../../../lib/init-middleware";
import {bypassAuth} from '../../../lib/constants';

const prisma = new PrismaClient()

export interface Category {
  id: number,
  name: string,
  color: string,
  nbNotes: number,
}

export default withIronSessionApiRoute(handler, sessionOptions)

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res);
  const newCategory = req.body;
  if (!req.session.user && !bypassAuth)
    return res.status(401).json({ message: 'unauthorised' });
  const username = req.session.user.username;
  switch (req.method) {
    case 'GET':
      return getCategories(username)
        .then(response => {
          return res.status(200).json(response)
        })
        .catch(e => {
          throw e
        })
        .finally(async () => {
          await prisma.$disconnect()
        })
    case 'POST':
      return createCategories(username, newCategory)
        .then(response => {
          return res.status(201).json(response)
        })
        .catch(e => {
          throw e
        })
        .finally(async () => {
          await prisma.$disconnect()
        })
    case 'PUT':
      return updateCategories(username, newCategory)
        .then(response => {
          return res.status(201).json(response)
        })
        .catch(e => {
          throw e
        })
        .finally(async () => {
          await prisma.$disconnect()
        })
    default:
      return res.status(405).json({ data: null, success: false, reason: 'method-not-allowed' })
  }
}

async function getCategories(username: string) {
  return (await prisma.category.findMany({
    where: { author_id: username },
    include: { _count: true }
  })).map(it => ({
    id: it.id,
    name: it.name,
    color: it.color,
    nbNotes: it._count.note
  }));
}

async function createCategories(username: string, category: Category) {
  return await prisma.category.create({
    data: { name: category.name, color: category.color, author_id: username }
  })
}

async function updateCategories(username: string, category: Category) {
  return await prisma.category.updateMany({
    where: { id: category.id, author_id: username },
    data: { name: category.name, color: category.color }
  })
}