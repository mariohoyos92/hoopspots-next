import React from 'react';
import { NextPage } from 'next';
import MetaTags from '../../components/MetaTags';
import { getPlaceBySlug } from '../api/_repositories/place-repository';

import { getCourtsNearLocation } from '../api/_repositories/court-repository';
import { Place } from '../api/_models/place-model';
import Button from '../../components/Button/Button';
import { User } from '../api/_models/user-model';
import { useRouter } from 'next/router';
import appRoutes from '../../types/Routes';
import { CourtRequestedDoc } from '../api/_models/court-model';
import { stringifyForNext } from '../../utils/stringifyForNext';

type Props = {
  placeInfo: Place;
  user?: User;
  courts?: [CourtRequestedDoc];
};

const GameFinder: NextPage<Props> = ({ placeInfo, user, courts }) => {
  const router = useRouter();
  async function handleCreateGame() {
    router.push(user ? appRoutes.newGame : appRoutes.login);
  }

  return (
    <>
      <MetaTags title={'game finder'} description={'place to find courts'} />
      <div>It doesn't looks like there's any courts in your area, start your own here!</div>
      <Button onClick={handleCreateGame}>Create game</Button>
    </>
  );
};

export async function getServerSideProps({ query }) {
  const placeInfo = stringifyForNext(await getPlaceBySlug(query.slug as string));
  const courts = stringifyForNext(await getCourtsNearLocation(placeInfo.center.coordinates));

  return { props: { courts, placeInfo } };
}

export default GameFinder;
