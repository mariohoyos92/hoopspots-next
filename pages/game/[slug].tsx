import React from 'react';
import { NextPage } from 'next';
import MetaTags from '../../components/MetaTags';
import { getGameBySlug, GameWithCourtInfo } from '../api/_repositories/game-repository';

import { User } from '../api/_models/user-model';
import { stringifyForNext } from '../../utils/stringifyForNext';
import { GameRequestedDoc } from '../api/_models/game-model';

type Props = {
  gameInfo: GameWithCourtInfo;
  user?: User;
};

const GameDetails: NextPage<Props> = ({ user, gameInfo }) => {
  return (
    <>
      <MetaTags title={'game details'} description={'place to find courts'} />
    </>
  );
};

export async function getServerSideProps({ query }) {
  const gameInfo = stringifyForNext(await getGameBySlug(query.slug as string));
  return { props: { gameInfo } };
}

export default GameDetails;
