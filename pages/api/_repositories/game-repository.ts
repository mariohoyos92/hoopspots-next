import CourtModel from '../_models/court-model';
import { Game } from '../_models/game-model';

export const createGame = async (game: Game & { courtId: string }) => {
  const updatedCourt = await CourtModel.findByIdAndUpdate(
    game.courtId,
    { $push: { games: game } },
    { new: true, runValidators: true, setDefaultsOnInsert: true }
  )
    .lean()
    .exec();
  return updatedCourt;
};
