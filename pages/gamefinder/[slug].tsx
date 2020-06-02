import React from 'react';
import { NextPage } from 'next';
import MetaTags from '../../components/MetaTags';
import { getPlace } from '../../services/place-service';
import isServer from '../../utils/isServer';
import { getPlaceBySlug } from '../api/_repositories/place-repository';
import { Place } from '../api/_models/place-model';
import Button from '../../components/Button/Button';

type Props = {
  placeInfo: Place;
};

const GameFinder: NextPage<Props> = ({ placeInfo }) => {
  return (
    <>
      <MetaTags title={'game finder'} description={'place to find games'} />
      <div>
        <h1>Pickup Games in {placeInfo.text}</h1>
      </div>
      <div>It doesn't looks like there's any games in your area, start your own here!</div>
      <Button onClick={() => console.log('here')}>Create game</Button>
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
