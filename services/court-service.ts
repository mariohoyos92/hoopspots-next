import axios from 'axios';
import { Court } from '../pages/api/_models/court-model';
import { Coordinates } from '../pages/api/_repositories/court-repository';

const baseRoute = '/api/court';

export type CreateCourtParams = Pick<
  Court,
  'courtName' | 'description' | 'geoLocationData' | 'indoorOutdoor' | 'publicPrivate' | 'createdBy' | 'slug'
>;

export function getCourts(coordinates: Coordinates) {
  return axios.get(baseRoute, { params: { coordinates } }).then(({ data }) => data);
}

export function createCourt(court: CreateCourtParams) {
  return axios.post(baseRoute, court).then(({ data }) => data);
}

export function getCourtBySlug(slug: string) {
  return axios.get(baseRoute, { params: { slug } }).then(({ data }) => data);
}
