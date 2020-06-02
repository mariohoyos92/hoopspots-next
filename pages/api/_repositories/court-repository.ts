import CourtModel, { Court, CourtRequestedDoc } from '../_models/court-model';

// put service calls here, in the data-repository.
export const getCourtById = async (courtId: string): Promise<CourtRequestedDoc> => {
  return CourtModel.find()
    .where({ courtId })
    .lean()
    .exec();
};

export const getAllCourts = (): Promise<CourtRequestedDoc[]> => {
  return CourtModel.find()
    .lean()
    .exec();
};

export const createCourt = async (court: Court) => {
  return CourtModel.create(court);
};
