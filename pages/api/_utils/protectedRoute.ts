import auth0 from '../../../lib/auth0';
import { NowRequest, NowResponse } from '@now/node';

export async function getUserFromRequest(req: NowRequest, res: NowResponse) {
  const authResponse = await auth0.getSession(req);
  if (!(authResponse && authResponse.user)) {
    res.status(401).json('You must be logged in to create a game');
  }
  return authResponse.user;
}
