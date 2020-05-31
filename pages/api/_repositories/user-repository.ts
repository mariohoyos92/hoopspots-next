import UserModel, { User, UserRequestedDoc } from '../_models/user-model';

// put service calls here, in the data-repository.
export const getUserById = async (userId: string): Promise<UserRequestedDoc> => {
  return UserModel.find()
    .where({ userId })
    .lean()
    .exec();
};

export const getAllUsers = (): Promise<UserRequestedDoc[]> => {
  return UserModel.find()
    .lean()
    .exec();
};

export const createUser = async (userInfo: User): Promise<UserRequestedDoc> => {
  return UserModel.create(userInfo);
};
