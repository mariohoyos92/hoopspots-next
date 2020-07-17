import { NowRequest, NowResponse } from '@now/node';
import connectToMongoose from '../_database-connections/mongoose-connection';
import { getAllCourts, createCourt, getCourtsNearLocation } from '../_repositories/court-repository';
import { CreateCourtParams } from '../../../services/court-service';
import slugify from '../../../utils/slugify';
import { getUserFromRequest } from '../_utils/protectedRoute';

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
      const user = await getUserFromRequest(req, res);
      const createdCourt = await createCourt({
        ...court,
        createdBy: user.sub,
        slug: createCourtSlug(court),
      });
      res.status(201).json(createdCourt);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }
};
