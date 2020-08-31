import LaunchSignupModel from '../_models/launch-signup-model';
import connectToMongo from '../_database-connections/mongoose-connection';

export default async function launchSignup(req, res) {
  try {
    if (req.method === 'POST') {
      await connectToMongo();
      const { hooperName } = req.body;
      await LaunchSignupModel.create(req.body);
      const results = await LaunchSignupModel.find();
      res.status(200).json({ hooperName, users: results.length });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
}
