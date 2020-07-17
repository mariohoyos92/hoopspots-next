import { NowRequest, NowResponse } from '@now/node';
import connectToMongoose from '../_database-connections/mongoose-connection';

import { getUserFromRequest } from '../_utils/protectedRoute';
import { addRSVP } from '../_repositories/game-repository';

export default async (req: NowRequest, res: NowResponse) => {
  await connectToMongoose();
  if (req.method === 'POST') {
    try {
      const user = await getUserFromRequest(req, res);
      const { gameId } = req.query;
      const updatedGame = await addRSVP(gameId as string, user.sub);
      res.status(200).json(updatedGame);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }
};
