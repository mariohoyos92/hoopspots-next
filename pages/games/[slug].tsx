import React, { useState, ChangeEvent } from 'react';
import { NextPage } from 'next';
import MetaTags from '../../components/MetaTags';
import { getPlaceBySlug } from '../api/_repositories/place-repository';

import { getCourtsNearLocation, CourtWithDistanceInformation } from '../api/_repositories/court-repository';
import { Place } from '../api/_models/place-model';
import Button from '../../components/Button/Button';
import { User } from '../api/_models/user-model';
import { useRouter } from 'next/router';
import appRoutes from '../../types/Routes';
import { stringifyForNext } from '../../utils/stringifyForNext';
import { getGamesWithCourtInfo, GameWithCourtInfo } from '../api/_repositories/game-repository';
import { setToStorage } from '../../utils/browserStorageHelpers';
import GameCard from '../../components/GameCard/GameCard';
import { compareAsc, compareDesc } from 'date-fns';
import GeoCodeAutoComplete from '../../components/GeoCodeAutoComplete';
import slugify from '../../utils/slugify';
import Card from '../../components/Card/Card';
import CardBody from '../../components/Card/CardBody';
import BasketballEmoji from '../../components/Icons/BasketballEmoji';
import { getMiles } from '../../utils/distanceConversions';

type Props = {
  placeInfo: Place;
  user?: User;
  courts?: [CourtWithDistanceInformation];
  games?: [GameWithCourtInfo];
};

const GameFinder: NextPage<Props> = ({ placeInfo, user, courts, games }) => {
  const router = useRouter();

  const [distance, setDistance] = useState(router.query.distance || 20);

  async function handleCreateGame() {
    if (!user) {
      setToStorage({
        type: 'localStorage',
        key: 'routeBeforeLeavingToLogin',
        value: appRoutes.newGame,
        expiry: { unit: 'minutes', value: 5 },
      });
      return router.push(appRoutes.login);
    }
    return router.push(appRoutes.newGame);
  }

  const gamesExist = games?.length > 0;

  const upcomingGames =
    gamesExist &&
    games
      .filter(game => new Date(game.startTime) > new Date())
      .sort((a, b) => compareAsc(new Date(a.startTime), new Date(b.startTime)));

  const pastGames =
    gamesExist &&
    games
      .filter(game => new Date(game.startTime) < new Date())
      .sort((a, b) => compareDesc(new Date(a.startTime), new Date(b.startTime)));

  const getCourtDistance = (gameCourtId: string) => {
    const gameCourt = courts.find(({ _id }) => gameCourtId === _id);
    console.log({ name: gameCourt.courtName, distance: getMiles(gameCourt.distanceInMeters).toFixed(1) || '0' });
    return getMiles(gameCourt.distanceInMeters).toFixed(1) || '0';
  };

  function handleDistanceChange(e: ChangeEvent<HTMLSelectElement>) {
    setDistance(e.target.value);
    router.push(
      { pathname: appRoutes.gameFinder, query: { distance: e.target.value, slug: router.query.slug } },
      `/games/${placeInfo.slug}?distance=${e.target.value}`
    );
  }

  function handleLocationChange(mapboxResults: any) {
    const placeName = slugify(mapboxResults.mapboxPlaceName);
    router.push(
      { pathname: appRoutes.gameFinder, query: { distance: distance, slug: placeName } },
      `/games/${placeName}?distance=${distance}`
    );
  }

  const distanceOptions = [10, 20, 30, 40];
  const hasUpcomingGames = upcomingGames?.length > 0;
  const hasPastGames = pastGames?.length > 0;

  return (
    <>
      <MetaTags title={'game finder'} description={'place to find courts'} />
      <div className="mb-5">
        <h2 className="text-lg font-semibold leading-6 text-gray-900">Searching within</h2>
        <div className="flex flex-col lg:flex-row lg:items-center ">
          <div className="lg:mr-4">
            <label htmlFor="distance" className="hidden block text-sm font-medium leading-5 text-gray-700">
              Distance
            </label>
            <select
              id="distance"
              className="block w-full py-2 pl-3 pr-10 my-2 text-base leading-6 border-gray-300 form-select focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5"
              onChange={handleDistanceChange}
              value={distance}
            >
              {distanceOptions.map(distance => (
                <option value={distance} key={distance}>
                  {distance} miles of
                </option>
              ))}
            </select>
          </div>
          <GeoCodeAutoComplete id="game-finder-lookup" placeHolder={placeInfo.text} onResult={handleLocationChange} />
        </div>
      </div>
      <div className="flex items-center justify-between w-full mb-5">
        <h2 className="text-lg font-semibold leading-6 text-gray-900">Upcoming games</h2>
        {hasUpcomingGames ? <Button onClick={handleCreateGame}>Create game</Button> : null}
      </div>
      {hasUpcomingGames ? (
        upcomingGames.map(game => <GameCard game={game} key={game._id} distance={getCourtDistance(game.courtId)} />)
      ) : (
        <Card className="mb-5">
          <CardBody>
            <div className="flex flex-col items-center">
              <h3 className="mb-2 text-lg font-medium leading-6 text-center text-gray-900">
                No upcoming games, it's all you! <BasketballEmoji />
              </h3>
              <Button onClick={handleCreateGame}>Create game</Button>
            </div>
          </CardBody>
        </Card>
      )}
      {hasPastGames ? (
        <>
          <h2 className="mb-5 text-lg font-semibold leading-6 text-gray-900">Past games</h2>
          {pastGames.map(game => (
            <GameCard game={game} key={game._id} distance={getCourtDistance(game.courtId)} />
          ))}
        </>
      ) : null}
      {hasUpcomingGames && hasPastGames ? (
        <Button className="float-right mb-5" onClick={handleCreateGame}>
          Create game
        </Button>
      ) : null}
    </>
  );
};

export async function getServerSideProps({ query }) {
  console.log({ query });
  const placeInfo = stringifyForNext(await getPlaceBySlug(query.slug as string));
  console.log({ placeInfo });
  const courts = stringifyForNext(await getCourtsNearLocation(placeInfo.center.coordinates, query.distance));
  console.log({ courts });
  const games = stringifyForNext(await getGamesWithCourtInfo(courts));
  console.log({ games });
  return { props: { courts, placeInfo, games } };
}

export default GameFinder;
