import {withIronSessionApiRoute} from "iron-session/next";
import {sessionOptions} from "../../lib/session";
import {NextApiRequest, NextApiResponse} from "next";
import {PrismaClient} from "@prisma/client";
import {cors} from "../../lib/init-middleware";

const prisma = new PrismaClient()

export interface Category {
  id: number,
  name: string,
  color: string
}

export default withIronSessionApiRoute(handler, sessionOptions)

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res);
  switch (req.method) {
    case 'GET':
      if (req.session.user)
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
      else
        return res.status(401).json({ message: 'unauthorised' })
    default:
      return res.status(405).json({ data: null, success: false, reason: 'method-not-allowed' })
  }
}

async function getCategories() {
  return await prisma.category.findMany();
}