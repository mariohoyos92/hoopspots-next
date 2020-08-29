import CourtModel, { CourtRequestedDoc } from '../_models/court-model';
import { getMeters } from '../../../utils/distanceConversions';
import { CreateCourtParams } from '../../../services/court-service';
import connectToMongo from '../_database-connections/mongoose-connection';
export type Coordinates = [number, number];

// put service calls here, in the data-repository.
export const getCourtById = async (courtId: string): Promise<CourtRequestedDoc> => {
  await connectToMongo();
  return CourtModel.findById(courtId)
    .lean()
    .exec();
};

export const getAllCourts = async (): Promise<CourtRequestedDoc[]> => {
  await connectToMongo();
  return CourtModel.find()
    .lean()
    .exec();
};

export type CourtWithDistanceInformation = CourtRequestedDoc & {
  distanceInMeters: number;
  locationUsedForCalculation: Coordinates;
};

export const getCourtsNearLocation = async (
  coordinates: Coordinates,
  distanceInMiles = 20,
  skip = 0,
  limit = 100
): Promise<[CourtWithDistanceInformation]> => {
  await connectToMongo();
  const courts = await CourtModel.aggregate([
    {
      $geoNear: {
        near: {
          type: 'Point',
          coordinates,
        },
        distanceField: 'distanceInMeters',
        includeLocs: 'locationUsedForCalculation',
        spherical: true,
        maxDistance: getMeters(distanceInMiles),
      },
    },
    { $skip: skip },
    { $limit: limit },
  ]).exec();

  return courts;
};

export const createCourt = async (court: CreateCourtParams) => {
  await connectToMongo();
  return CourtModel.create(court);
};
