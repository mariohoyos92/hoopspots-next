import { NowRequest, NowResponse } from '@now/node';
import connectToMongoose from '../_database-connections/mongoose-connection';
import { getAllCourts, createCourt, getCourtsNearLocation, Coordinates } from '../_repositories/court-repository';
import { CreateCourtParams } from '../../../services/court-service';
import slugify from '../../../utils/slugify';
import auth0 from '../../../lib/auth0';

function createCourtSlug(court: CreateCourtParams) {
  return `${slugify(court.courtName)}-${slugify(court.geoLocationData.text)}`;
}

export default async (req: NowRequest, res: NowResponse) => {
  await connectToMongoose();
  if (req.method === 'GET') {
    if (req.query['coordinates[]']) {
      // @ts-ignore
      const courts = await getCourtsNearLocation(req.query['coordinates[]']?.map(parseFloat));
      return res.status(200).json(courts);
    }
    const courts = await getAllCourts();
    return res.json(courts);
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
