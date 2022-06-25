import {PrismaClient} from "@prisma/client";
import {withIronSessionApiRoute} from "iron-session/next";
import {sessionOptions} from "../../../lib/session";
import {NextApiRequest, NextApiResponse} from "next";
import {cors} from "../../../lib/init-middleware";
import {bypassAuth} from "../../../lib/constants";

const prisma = new PrismaClient()

export default withIronSessionApiRoute(handler, sessionOptions)

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res);
  if (!req.session.user && !bypassAuth)
    return res.status(401).json({ message: 'unauthorised' })

  const noteId = parseInt(req.query.nid as string)
  switch (req.method) {
    case 'DELETE':
      return deleteNote(noteId)
        .then(() => res.status(200).json({ deleted: true}))
        .finally(async () => {
          await prisma.$disconnect()
        })
    default:
      return res.status(405).json({ message: 'Method not allowed' })
  }
}

async function deleteNote(noteId: number) {
  await prisma.note.delete({
    where: { id: noteId }
  })
}