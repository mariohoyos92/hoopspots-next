import PlaceModel, { Place } from '../_models/place-model';

export const createPlace = async (place: Place) => {
  return PlaceModel.create(place);
};

export const getPlaceBySlug = async (slug: string) => {
  return PlaceModel.findOne({ slug })
    .lean()
    .exec();
};
