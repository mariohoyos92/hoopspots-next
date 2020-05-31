import axios from "axios";
import appRoutes from "../types/Routes";
import { User } from "../pages/api/_models/user-model";

export function getUserProfile() {
  // knows the user based on the cookie
  return axios.get<User>(appRoutes.api.user.getUser);
}
