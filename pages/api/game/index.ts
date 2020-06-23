import { NowRequest, NowResponse } from '@now/node';
import connectToMongoose from '../_database-connections/mongoose-connection';
import { createGame } from '../_repositories/game-repository';
import { CreateGameParams } from '../../../services/game-service';
import slugify from '../../../utils/slugify';
import auth0 from '../../../lib/auth0';
import { getCourtById } from '../_repositories/court-repository';
import { getUserById } from '../_repositories/user-repository';

function createGameSlug(game: CreateGameParams, courtName: string) {
  return `${slugify(courtName)}-${slugify(game.gameName)}`;
}

export default async (req: NowRequest, res: NowResponse) => {
  await connectToMongoose();
  if (req.method === 'POST') {
    const game = req.body as CreateGameParams;
    try {
      const authResponse = await auth0.getSession(req);
      if (!(authResponse && authResponse.user)) {
        res.status(401).json('You must be logged in to create a game');
      }
      const court = await getCourtById(game.courtId);
      const userProfile = await getUserById(authResponse.user.sub);
      const createdGame = await createGame({
        ...game,
        createdBy: authResponse.user.sub,
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
