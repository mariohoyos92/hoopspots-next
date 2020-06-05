import axios from 'axios';
import { Court } from '../pages/api/_models/court-model';

const baseRoute = '/api/court';

export type CreateCourtParams = Pick<
  Court,
  'courtName' | 'description' | 'geoLocationData' | 'indoorOutdoor' | 'publicPrivate'
>;

export function createCourt(court: CreateCourtParams) {
  return axios.post(baseRoute, court).then(({ data }) => data);
}

export function getCourtBySlug(slug: string) {
  return axios.get(baseRoute, { params: { slug } }).then(({ data }) => data);
}
