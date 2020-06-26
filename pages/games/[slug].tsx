import React, { useState, ChangeEvent } from 'react';
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
import { getGamesWithCourtInfo, GameWithCourtInfo } from '../api/_repositories/game-repository';
import { setToStorage } from '../../utils/browserStorageHelpers';
import GameCard from '../../components/GameCard/GameCard';
import { compareAsc, compareDesc } from 'date-fns';
import GeoCodeAutoComplete from '../../components/GeoCodeAutoComplete';
import slugify from '../../utils/slugify';

type Props = {
  placeInfo: Place;
  user?: User;
  courts?: [CourtRequestedDoc];
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

  function handleDistanceChange(e: ChangeEvent<HTMLSelectElement>) {
    setDistance(e.target.value);
    router.push(
      { pathname: appRoutes.gameFinder, query: { distance: e.target.value, slug: router.query.slug } },
      `/games/${placeInfo.slug}?distance=${e.target.value}`
    );
  }

  function handleLocationChange(mapboxResults: any) {
    const placeName = slugify(mapboxResults['place_name_en-US']);
    router.push(
      { pathname: appRoutes.gameFinder, query: { distance: distance, slug: placeName } },
      `/games/${placeName}?distance=${distance}`
    );
  }

  const distanceOptions = [10, 20, 30, 40];

  return (
    <>
      <MetaTags title={'game finder'} description={'place to find courts'} />
      <div className="mb-5">
        <h2 className="text-lg leading-6 font-semibold text-gray-900">Searching within</h2>
        <div className="flex flex-col lg:flex-row lg:items-center ">
          <div className="lg:mr-4">
            <label htmlFor="distance" className="block text-sm leading-5 font-medium text-gray-700 hidden">
              Distance
            </label>
            <select
              id="distance"
              className="my-2 form-select block w-full pl-3 pr-10 py-2 text-base leading-6 border-gray-300 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5"
              onChange={handleDistanceChange}
              value={distance}
            >
              {distanceOptions.map(distance => (
                <option value={distance} key={distance}>
                  {distance} miles from
                </option>
              ))}
            </select>
          </div>
          <GeoCodeAutoComplete id="game-finder-lookup" placeHolder={placeInfo.text} onResult={handleLocationChange} />
        </div>
      </div>
      <div className="flex justify-between w-full items-center mb-5">
        <h2 className="text-lg leading-6 font-semibold text-gray-900">Upcoming games</h2>
        <Button onClick={handleCreateGame}>Create game</Button>
      </div>
      {upcomingGames?.length > 0 ? upcomingGames.map(game => <GameCard game={game} key={game._id} />) : <p>no game</p>}
      {pastGames?.length > 0 ? (
        <>
          <h2 className="text-lg leading-6 font-semibold text-gray-900 mb-5">Past games</h2>
          {pastGames.map(game => (
            <GameCard game={game} key={game._id} />
          ))}
        </>
      ) : null}
      <Button className="float-right mb-5" onClick={handleCreateGame}>
        Create game
      </Button>
    </>
  );
};

export async function getServerSideProps({ query }) {
  const placeInfo = stringifyForNext(await getPlaceBySlug(query.slug as string));
  const courts = stringifyForNext(await getCourtsNearLocation(placeInfo.center.coordinates, query.distance));
  const games = stringifyForNext(await getGamesWithCourtInfo(courts));
  return { props: { courts, placeInfo, games } };
}

export default GameFinder;
