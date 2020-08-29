import PlaceModel, { Place, PlaceRequestedDoc } from '../_models/place-model';
import connectToMongo from '../_database-connections/mongoose-connection';

export const createPlace = async (place: Place) => {
  await connectToMongo();
  return PlaceModel.create(place);
};

export const getPlaceBySlug = async (slug: string) => {
  await connectToMongo();
  return PlaceModel.findOne({ slug })
    .lean()
    .exec() as PlaceRequestedDoc;
};
