import { NowRequest, NowResponse } from '@now/node';
import connectToMongoose from '../_database-connections/mongoose-connection';
import { createGame } from '../_repositories/game-repository';
import { CreateGameParams } from '../../../services/game-service';
import slugify from '../../../utils/slugify';
import { getCourtById } from '../_repositories/court-repository';
import { getUserById } from '../_repositories/user-repository';
import { getUserFromRequest } from '../_utils/protectedRoute';

function createGameSlug(game: CreateGameParams, courtName: string) {
  return `${slugify(courtName)}-${slugify(game.gameName)}`;
}

export default async (req: NowRequest, res: NowResponse) => {
  await connectToMongoose();
  if (req.method === 'POST') {
    const game = req.body as CreateGameParams;
    try {
      const user = await getUserFromRequest(req, res);
      const court = await getCourtById(game.courtId);
      const userProfile = await getUserById(user.sub);
      const createdGame = await createGame({
        ...game,
        createdBy: user.sub,
        slug: createGameSlug(game, court.courtName),
        rsvps: [{ profilePhotoUrl: userProfile.profilePhotoUrl, userId: userProfile.userId, name: userProfile.name }],
      });
      res.status(201).json(createdGame);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }
};
