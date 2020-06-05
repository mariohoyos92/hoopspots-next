import { NowRequest, NowResponse } from '@now/node';
import connectToMongoose from '../_database-connections/mongoose-connection';
import { getAllCourts, createCourt } from '../_repositories/court-repository';
import { CreateCourtParams } from '../../../services/court-service';
import slugify from '../../../utils/slugify';
import auth0 from '../../../lib/auth0';

function createCourtSlug(court: CreateCourtParams) {
  return `${slugify(court.courtName)}-${slugify(court.geoLocationData.text)}`;
}

export default async (req: NowRequest, res: NowResponse) => {
  await connectToMongoose();
  if (req.method === 'GET') {
    const courts = await getAllCourts();
    res.json({ courts });
  }
  if (req.method === 'POST') {
    const court = req.body as CreateCourtParams;
    try {
      const authResponse = await auth0.getSession(req);
      if (!(authResponse && authResponse.user)) {
        res.status(401).json('You must be logged in to create a court');
      }
      const createdCourt = await createCourt({
        ...court,
        createdBy: authResponse.user.sub,
        slug: createCourtSlug(court),
      });
      res.status(201).json(createdCourt);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }
};
