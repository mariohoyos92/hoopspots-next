import UserModel, { User, UserRequestedDoc } from '../_models/user-model';

export const getUserById = async (userId: string): Promise<UserRequestedDoc> => {
  return UserModel.findOne({ userId })
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
