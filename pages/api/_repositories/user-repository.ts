import UserModel, { User, UserRequestedDoc } from '../_models/user-model';
import connectToMongo from '../_database-connections/mongoose-connection';

export const getUserById = async (userId: string): Promise<UserRequestedDoc> => {
  await connectToMongo();
  return UserModel.findOne({ userId })
    .lean()
    .exec();
};

export const getUserByUserName = async (name: string): Promise<UserRequestedDoc> => {
  await connectToMongo();
  return UserModel.findOne({ name })
    .lean()
    .exec();
};

export const getAllUsers = async (): Promise<UserRequestedDoc[]> => {
  await connectToMongo();
  return UserModel.find()
    .lean()
    .exec();
};

export const createUser = async (userInfo: User): Promise<UserRequestedDoc> => {
  await connectToMongo();
  return UserModel.create(userInfo);
};
