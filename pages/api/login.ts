import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt';

const prisma = new PrismaClient()

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { username, password } = req.body;
  switch (req.method) {
    case 'POST':
      getUser(username, password)
        .then(result => {
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

async function getUser(username: string, password: string) {
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
