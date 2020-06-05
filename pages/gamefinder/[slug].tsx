import React from 'react';
import { NextPage } from 'next';
import MetaTags from '../../components/MetaTags';
import { getPlace } from '../../services/place-service';
import isServer from '../../utils/isServer';
import { getPlaceBySlug } from '../api/_repositories/place-repository';
import { Place } from '../api/_models/place-model';
import Button from '../../components/Button/Button';
import { User } from '../api/_models/user-model';
import { useRouter } from 'next/router';
import appRoutes from '../../types/Routes';

type Props = {
  placeInfo: Place;
  user?: User;
};

const GameFinder: NextPage<Props> = ({ placeInfo, user }) => {
  const router = useRouter();
  async function handleCreateGame() {
    router.push(user ? appRoutes.newGame : appRoutes.login);
  }

  return (
    <>
      <MetaTags title={'game finder'} description={'place to find games'} />
      <div>It doesn't looks like there's any games in your area, start your own here!</div>
      <Button onClick={handleCreateGame}>Create game</Button>
    </>
  );
};

GameFinder.getInitialProps = async ({ query }) => {
  let placeInfo;
  if (isServer()) {
    placeInfo = await getPlaceBySlug(query.slug as string);
  } else {
    placeInfo = await getPlace(query.slug as string);
  }
  return { placeInfo };
};

export default GameFinder;
