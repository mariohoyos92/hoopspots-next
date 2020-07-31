import { getUserByUserName } from '../_repositories/user-repository';

export default async function userProfile(req, res) {
  try {
    if (req.method === 'GET') {
      const userProfile = await getUserByUserName(req.params.userName);
      if (!userProfile) {
        return res.status(404).json({ message: 'User does not exist' });
      }
      res.json(userProfile);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
}
