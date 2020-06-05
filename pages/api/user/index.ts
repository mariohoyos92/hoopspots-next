import auth0 from '../../../lib/auth0';
import { createUser, getUserById } from '../_repositories/user-repository';

export default async function userProfile(req, res) {
  try {
    const authResponse = await auth0.getSession(req);

    if (req.method === 'GET') {
      if (!(authResponse && authResponse.user)) {
        return res.status(404).json('You are not logged in');
      }
      const userProfile = await getUserById(authResponse.user.sub);
      if (!userProfile) {
        return res.status(404).json({ message: 'User does not exist' });
      }
      res.json(userProfile);
    }
    if (req.method === 'POST') {
      const { userInfo } = req.body;
      const createdUser = await createUser(userInfo);
      return res.status(200).json(createdUser);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
}
