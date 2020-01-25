import axios from "axios";
import appRoutes from "../types/Routes";

export function getUserProfile() {
  // knows the user based on the cookie
  return axios.get(`${process.env.BASE_URL}${appRoutes.api.user.getUser}`);
}
