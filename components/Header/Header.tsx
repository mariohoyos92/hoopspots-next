import React from 'react';
import { useRouter } from 'next/router';
import appRoutes from '../../types/Routes';
import { Place } from '../../pages/api/_models/place-model';
import { User } from '../../pages/api/_models/user-model';

const Header: React.FC<{ placeInfo?: Place; user?: User }> = ({ placeInfo, user }) => {
  const router = useRouter();
  const routesWithNoHeader = [appRoutes.home];

  function determineHeaderContent() {
    switch (router.pathname) {
      case appRoutes.gameFinder:
        return placeInfo ? `Games in ${placeInfo.text}` : `Couldn't find this place`;
      case appRoutes.profile:
        return `${user.name}'s profile`;
      default:
        break;
    }
  }

  return !routesWithNoHeader.includes(router.pathname) ? (
    appRoutes.newGame === router.pathname ? (
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-xl leading-6 font-semibold text-gray-900">
            New Game{' '}
            <span role="img" aria-label="basketball">
              🏀
            </span>{' '}
          </h1>
          <p className="mt-1 max-w-2xl text-sm leading-5 text-gray-500">Let's get a hoop session going!</p>
        </div>
      </header>
    ) : (
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-lg leading-6 font-semibold text-gray-900">{determineHeaderContent()}</h1>
        </div>
      </header>
    )
  ) : null;
};

export default Header;
