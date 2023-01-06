import {withIronSessionApiRoute} from "iron-session/next";
import {sessionOptions} from "../../../lib/session";
import {PrismaClient} from "@prisma/client";
import {NextApiRequest, NextApiResponse} from "next";
import {cors} from "../../../lib/init-middleware";
import {bypassAuth} from "../../../lib/constants";
import {Category} from "./index";

const prisma = new PrismaClient()

export default withIronSessionApiRoute(handler, sessionOptions)

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res);
  if (!req.session.user && !bypassAuth)
    return res.status(401).json('unauthorised')
  const categoryId = parseInt(req.query.cid as string);

  switch (req.method) {
    case 'GET':
      return getCategory(categoryId)
        .then(response => res.status(200).json(response))
        .finally(async () => { await prisma.$disconnect() });
    case 'DELETE':
      return deleteCategory(categoryId)
        .then(response => {
          if (response.deleted)
            return res.status(200).json(response)
          else
            return res.status(409).json(response)
        })
        .finally(async () => {
          await prisma.$disconnect()
        })
    default:
      return res.status(405).json({ message: 'Method not allowed' })
  }
}

async function getCategory(categoryId: number): Promise<Category> {
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    include: { _count: true }
  });
  return {
    id: categoryId,
    name: category.name,
    color: category.color,
    nbNotes: category._count.note
  }
}
async function deleteCategory(categoryId: number) {
  const nbNotes = await prisma.note.count({
    where: { category_id: categoryId }
  })
  if (nbNotes > 0)
    return { deleted: false, nbNotes }

  await prisma.category.delete({
    where: { id: categoryId }
  })
  return { deleted: true, nbNotes }
}