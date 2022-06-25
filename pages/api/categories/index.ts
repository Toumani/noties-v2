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
  switch (req.method) {
    case 'GET':
      return getCategories()
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
      return createCategories(newCategory)
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
      return updateCategories(newCategory)
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

async function getCategories() {
  return (await prisma.category.findMany({
    include: { _count: true }
  })).map(it => ({
    id: it.id,
    name: it.name,
    color: it.color,
    nbNotes: it._count.note
  }));
}

async function createCategories(category: Category) {
  return await prisma.category.create({
    data: { name: category.name, color: category.color }
  })
}

async function updateCategories(category: Category) {
  return await prisma.category.update({
    where: { id: category.id },
    data: { name: category.name, color: category.color }
  })
}