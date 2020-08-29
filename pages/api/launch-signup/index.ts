import LaunchSignupModel from '../_models/launch-signup-model';
import connectToMongo from '../_database-connections/mongoose-connection';

export default async function launchSignup(req, res) {
  try {
    if (req.method === 'POST') {
      await connectToMongo();
      await LaunchSignupModel.create({ email: req.body.email });
      res.status(201).end();
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
}
