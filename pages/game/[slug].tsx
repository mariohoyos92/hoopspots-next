import React from 'react';
import { NextPage } from 'next';
import MetaTags from '../../components/MetaTags';
import { getGameBySlug, GameWithCourtInfo } from '../api/_repositories/game-repository';

import { User, UserRequestedDoc } from '../api/_models/user-model';
import { stringifyForNext } from '../../utils/stringifyForNext';
import Card from '../../components/Card/Card';
import CardBody from '../../components/Card/CardBody';
import { getGameDate, getGameTimeLong } from '../../components/GameCard/GameCard';
import LocationMarker from '../../components/Icons/LocationMarker';
import BasketballSvg from '../../components/Icons/BasketballSvg';
import UserGroup from '../../components/Icons/UserGroup';
import { getUserById } from '../api/_repositories/user-repository';
import Avatar from '../../components/Avatar';
import Link from 'next/link';
import Clock from '../../components/Icons/Clock';
import ClickToCopy from '../../components/ClickToCopy';
import { uppercaseFirst } from '../../utils/uppercaseFirst';
import PlayerCard from '../../components/PlayerCard';

type Props = {
  gameInfo: GameWithCourtInfo;
  hostInfo: UserRequestedDoc;
  user?: User;
};

const GameDetails: NextPage<Props> = ({ gameInfo, hostInfo }) => {
  const {
    gameName,
    rsvps,
    description: gameDescription,
    courtDetails: { courtName, geoLocationData, description, indoorOutdoor, publicPrivate },
  } = gameInfo;

  const gameDate = getGameDate(gameInfo);
  const addressPieces = geoLocationData.placeName.split(',');
  return (
    <>
      <MetaTags title={'game details'} description={'place to find courts'} />
      <Card className="-mx-4 -mt-4">
        <CardBody>
          <div className="text-gray-500 mb-1">{gameDate}</div>
          <h1 className="text-3xl tracking-tight leading-10 font-extrabold text-gray-900 mb-4">
            {gameName}
            {/* <span className="text-gray-400 font-extrabold">@</span> {courtName} */}
          </h1>
          <div className="flex items-center">
            <Avatar imageUrl={hostInfo.profilePhotoUrl} size="10" className="mr-4" />
            <div>
              Hoop-session by
              <br />{' '}
              <Link href={`/profile/${hostInfo.name}`}>
                <a className="font-semibold">{hostInfo.name}</a>
              </Link>
            </div>
          </div>
        </CardBody>
      </Card>
      <Card className="mt-4 -mx-4">
        <CardBody>
          <h3 className="text-md leading-6 font-semibold text-gray-900 mb-4">Time and Place</h3>
          <div className="flex mb-4">
            <div className="h-5 w-5 mr-2 mt-1 text-gray-400">
              <Clock />
            </div>
            <div>
              {gameDate}
              <br />
              {getGameTimeLong(gameInfo)}
            </div>
          </div>
          <div className="flex">
            <div className="h-5 w-5 mr-2 mt-1 text-gray-400">
              <LocationMarker />
            </div>
            <div>
              <span className="font-medium">{courtName}</span>
              <br />
              {addressPieces[0]}
              <br />
              <div className="flex">
                <span className="mr-2">
                  {addressPieces[1]}, {addressPieces[2]}
                </span>{' '}
                <ClickToCopy textToCopy={geoLocationData.placeName} />
              </div>
              <div className="font-medium mt-2">
                {uppercaseFirst((indoorOutdoor as unknown) as string)},{' '}
                {uppercaseFirst((publicPrivate as unknown) as string)}
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
      <h2 className="text-lg leading-6 font-semibold text-gray-900 mt-6 mb-4 flex items-center">
        <div className="inline-block h-5 w-5 mr-1">
          <BasketballSvg />
        </div>
        The Game{' '}
      </h2>
      <p>
        <span className="text-md font-semibold">Game description: </span>
        {uppercaseFirst(gameDescription)}
        <br />
        <br />
        <span className="text-md font-semibold">Court description: </span>
        {uppercaseFirst(description)}
      </p>
      <h2 className="text-lg leading-6 font-semibold text-gray-900 mt-6 mb-4 flex items-center">
        <div className="inline-block h-5 w-5 mr-1 -mt-1">
          <UserGroup />
        </div>
        The Hoopers ({rsvps.length})
      </h2>
      <div className="flex overflow-x-auto flex-no-wrap scrolling-touch">
        {rsvps.map(({ name, profilePhotoUrl }) => (
          <div className="mr-2">
            <PlayerCard name={name} imageUrl={profilePhotoUrl} />
          </div>
        ))}
      </div>
    </>
  );
};

export async function getServerSideProps({ query }) {
  const gameInfo = stringifyForNext(await getGameBySlug(query.slug as string));
  const hostInfo = stringifyForNext(await getUserById(gameInfo.createdBy));
  return { props: { gameInfo, hostInfo } };
}

export default GameDetails;
