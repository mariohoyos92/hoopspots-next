import CourtModel, { CourtRequestedDoc } from '../_models/court-model';
import GameModel, { Game, GameRequestedDoc } from '../_models/game-model';

export type CreateGameParams = Omit<Game, 'rsvps'>;

export const createGame = async (game: Game) => {
  const createdGame = await GameModel.create(game);
  return createdGame;
};

export type GameWithCourtInfo = GameRequestedDoc & { courtDetails: [CourtRequestedDoc] };

export const getGameBySlug = async (slug: string): Promise<GameWithCourtInfo> => {
  const game = await GameModel.findOne({ slug })
    .lean()
    .exec();
  const courtDetails = await CourtModel.findOne({ courtId: game.courtId });
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
