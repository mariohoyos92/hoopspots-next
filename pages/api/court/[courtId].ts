import { NowRequest, NowResponse } from '@now/node';
import connectToMongoose from '../_database-connections/mongoose-connection';
import { getCourtById } from '../_repositories/court-repository';

export default async (req: NowRequest, res: NowResponse) => {
  await connectToMongoose();
  if (req.method === 'GET') {
    const { courtId } = req.query;
    const court = await getCourtById(courtId as string);
    res.json({ court });
  }
};
