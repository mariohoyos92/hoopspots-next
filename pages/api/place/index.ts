import { NowRequest, NowResponse } from '@now/node';
import connectToMongoose from '../_database-connections/mongoose-connection';
import { createPlace, getPlaceBySlug } from '../_repositories/place-repository';

export default async (req: NowRequest, res: NowResponse) => {
  await connectToMongoose();
  if (req.method === 'GET') {
    const { slug } = req.query;
    if (!slug) {
      res.status(400).json('Need to provide a slug');
    }
    const place = await getPlaceBySlug(slug as string);
    res.status(200).json(place);
  }
  if (req.method === 'POST') {
    const place = req.body;
    try {
      const createdPlace = await createPlace(place);
      res.status(201).json(createdPlace);
    } catch (err) {
      if (err.errmsg && err.errmsg.includes('duplicate key')) {
        res.status(201).send('Place already exists');
      } else {
        console.log({ err });
        res.status(500).json(err);
      }
    }
  }
};
