import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt';
import { withIronSessionApiRoute } from 'iron-session/next'
import {sessionOptions} from '../../lib/session'

const prisma = new PrismaClient()

export type User = {
  username: string
}

export default withIronSessionApiRoute(handler, sessionOptions)

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { username, password } = req.body;
  switch (req.method) {
    case 'POST':
      authenticate(username, password)
        .then(async (result) => {
          req.session.user = { username: result.username }
          await req.session.save()
          res.status(200).json({
            data: 'eyaa;dkfajei', // jwt goes here
            success: true,
            reason: null,
          })
        })
        .catch(error => {
          res.status(401).json({
            data: null,
            success: false,
            reason: 'unauthorised'
          })
        })
        .finally(async () => {
          await prisma.$disconnect()
        })
      break;
    default:
      res.status(405).json({ reason: 'method-not-allowed' })
  }
}

async function authenticate(username: string, password: string) {
  const user = await prisma.users.findFirst({
    where: { username }
  });
  if (user) {
    const match = await bcrypt.compare(password, user.password)
    if (match)
      return user;
  }

  throw new Error('Username and/or password incorrect')
}
