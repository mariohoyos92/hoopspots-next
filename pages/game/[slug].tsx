import React from 'react';
import { NextPage } from 'next';
import MetaTags from '../../components/MetaTags';
import { getGameBySlug, GameWithCourtInfo } from '../api/_repositories/game-repository';

import { User, UserRequestedDoc } from '../api/_models/user-model';
import { stringifyForNext } from '../../utils/stringifyForNext';
import Card from '../../components/Card/Card';
import CardBody from '../../components/Card/CardBody';
import { getGameDate, getGameTimeLong } from '../../components/GameCard/GameCard';
import BasketballSvg from '../../components/Icons/BasketballSvg';
import UserGroup from '../../components/Icons/UserGroup';
import { getUserById } from '../api/_repositories/user-repository';
import Avatar from '../../components/Avatar';
import Link from 'next/link';
import Clock from '../../components/Icons/Clock';
import { uppercaseFirst } from '../../utils/uppercaseFirst';
import PlayerCard from '../../components/PlayerCard';
import Button from '../../components/Button';
import { useRouter } from 'next/router';
import { setToStorage } from '../../utils/browserStorageHelpers';
import appRoutes from '../../types/Routes';
import { addUserToRSVPS } from '../../services/game-service';
import CourtCard from '../../components/CourtCard';

type Props = {
  gameInfo: GameWithCourtInfo;
  hostInfo: UserRequestedDoc;
  user?: User;
};

const GameDetails: NextPage<Props> = ({ gameInfo, hostInfo, user }) => {
  const { gameName, rsvps, description: gameDescription, courtDetails, slug } = gameInfo;

  const router = useRouter();
  const gameDate = getGameDate(gameInfo);
  const loggedInUserIsAttending = rsvps.some(rsvp => rsvp.userId === user.userId);

  async function handleRSVP() {
    if (user.userId) {
      await addUserToRSVPS(gameInfo._id);
      router.reload();
    } else {
      setToStorage({
        type: 'localStorage',
        key: 'routeBeforeLeavingToLogin',
        value: `/game/${slug}`,
        expiry: { unit: 'minutes', value: 5 },
      });
      return router.push(appRoutes.login);
    }
  }
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
              <Link href={`/hooper/${hostInfo.name}`}>
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
          <CourtCard court={courtDetails} />
        </CardBody>
      </Card>
      <h2 className="text-lg leading-6 font-semibold text-gray-900 mt-6 mb-4 flex items-center">
        <div className="inline-block h-5 w-5 mr-1">
          <BasketballSvg />
        </div>
        The Game{' '}
      </h2>
      <Card>
        <CardBody>
          <p>
            <span className="text-md font-semibold">Game description: </span>
            {uppercaseFirst(gameDescription)}
            <br />
            <br />
            <span className="text-md font-semibold">Court description: </span>
            {uppercaseFirst(courtDetails.description)}
          </p>
        </CardBody>
      </Card>
      <h2 className="text-lg leading-6 font-semibold text-gray-900 mt-6 mb-4 flex items-center justify-between">
        <div>
          <div className="inline-block h-5 w-5 mr-1 -mt-1">
            <UserGroup />
          </div>
          The Hoopers ({rsvps.length})
        </div>
        {user && !loggedInUserIsAttending && new Date() < new Date(gameInfo.startTime) && (
          <Button onClick={handleRSVP}>Count me in!</Button>
        )}
      </h2>
      <div className="flex overflow-x-auto flex-no-wrap scrolling-touch">
        {rsvps.map(({ name, profilePhotoUrl, userId }) => (
          <div className="mr-2" key={userId}>
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
