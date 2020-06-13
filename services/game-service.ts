import axios from 'axios';
import { Game, GameRequestedDoc } from '../pages/api/_models/game-model';

const baseRoute = '/api/game';

export type CreateGameParams = Pick<Game, 'gameName' | 'description' | 'startTime' | 'endTime'> & { courtId: string };

export function createGame(game: CreateGameParams) {
  return axios.post<GameRequestedDoc>(baseRoute, game).then(({ data }) => data);
}

export function getGameBySlug(slug: string) {
  return axios.get(baseRoute, { params: { slug } }).then(({ data }) => data);
}
