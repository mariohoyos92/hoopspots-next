import axios from 'axios';
import { User } from '../pages/api/_models/user-model';

const baseRoute = '/api/user';

export function getUserProfile() {
  // knows the user based on the cookie
  return axios.get<User>(baseRoute);
}
