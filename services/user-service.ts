import axios from 'axios';
import { UserRequestedDoc } from '../pages/api/_models/user-model';

const baseRoute = '/api/user';

export function getUserProfile() {
  // knows the user based on the cookie
  return axios.get<UserRequestedDoc>(baseRoute).then(({ data }) => data);
}
