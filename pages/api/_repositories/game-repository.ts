import CourtModel, { CourtRequestedDoc } from '../_models/court-model';
import GameModel, { Game, GameRequestedDoc } from '../_models/game-model';
import { getUserById } from './user-repository';

export type CreateGameParams = Omit<Game, 'rsvps'>;

export const createGame = async (game: Game) => {
  const createdGame = await GameModel.create(game);
  return createdGame;
};

export type GamesWithCourtInfo = GameRequestedDoc & { courtDetails: [CourtRequestedDoc] };
export type GameWithCourtInfo = GameRequestedDoc & { courtDetails: CourtRequestedDoc };

export const getGameBySlug = async (slug: string): Promise<GameWithCourtInfo> => {
  const game = await GameModel.findOne({ slug })
    .lean()
    .exec();
  const courtDetails = await CourtModel.findById(game.courtId);
  return { ...game, courtDetails: courtDetails };
};

export const getGamesWithCourtInfo = async (courts: [CourtRequestedDoc]) => {
  // startTime: { $gte: new Date() }
  const gamesWithCourtInfo = await GameModel.aggregate([
    { $match: { courtId: { $in: courts.map(({ _id }) => _id) } } },
    { $sort: { startTime: 1 } },
    {
      $lookup: {
        from: 'courts',
        let: { courtId: { $toObjectId: '$courtId' } },
        pipeline: [{ $match: { $expr: { $eq: ['$_id', '$$courtId'] } } }],
        as: 'courtDetails',
      },
    },
  ]);
  return gamesWithCourtInfo;
};

export const addRSVP = async (gameId: string, userId: string) => {
  const userProfile = await getUserById(userId);
  const updatedGame = await GameModel.findByIdAndUpdate(
    gameId,
    {
      $push: {
        rsvps: { userId: userProfile.userId, profilePhotoUrl: userProfile.profilePhotoUrl, name: userProfile.name },
      },
    },
    { new: true, lean: true }
  ).exec();
  return updatedGame;
};
