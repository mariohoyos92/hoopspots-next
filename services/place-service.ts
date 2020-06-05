import axios from 'axios';
import { Place } from '../pages/api/_models/place-model';

const baseRoute = '/api/place';

export function createPlace(place: Place) {
  return axios.post(baseRoute, place).then(({ data }) => data);
}

export function getPlace(slug: string) {
  return axios.get(baseRoute, { params: { slug } }).then(({ data }) => data);
}
