import {NextApiRequest, NextApiResponse} from "next";
import {withIronSessionApiRoute} from "iron-session/next";
import {sessionOptions} from '../../lib/session';
import {cors} from "../../lib/init-middleware";

export default withIronSessionApiRoute(handler, sessionOptions)

async function handler(req: NextApiRequest, res: NextApiResponse) {
  await cors(req, res);
  req.session.destroy()
  res.json({ success: true })
}