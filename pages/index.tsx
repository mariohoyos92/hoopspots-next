import React, { SyntheticEvent, useState } from 'react';
import { NextPage } from 'next';

import MetaTags from '../components/MetaTags';
import { useRouter } from 'next/router';
import GeoCodeAutoComplete from '../components/GeoCodeAutoComplete';
import slugify from '../utils/slugify';
import Button from '../components/Button';
import isServer from '../utils/isServer';

const Home: NextPage = () => {
  const router = useRouter();
  const [location, setLocation] = useState(null);

  async function handleLocationSelect(mapboxResults: any) {
    const placeName = slugify(mapboxResults.mapboxPlaceName);
    setLocation(placeName);
  }

  async function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();
    if (location) {
      router.push(`/games/[slug]`, `/games/${location}`);
    }
  }
  return (
    <>
      <MetaTags title={'home title'} description={'this is a description'} />
      <main className="mt-10 mx-auto max-w-screen-xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 xl:mt-28">
        <div className="text-center">
          <h1 className="text-4xl tracking-tight leading-10 font-extrabold text-gray-900 sm:text-5xl sm:leading-none md:text-6xl">
            Hoop<span className="text-red-600">Spots</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Pickup basketball near you.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            {isServer() ? (
              <SSRPlaceHolder />
            ) : (
              <div>
                <GeoCodeAutoComplete
                  id="homepage-search"
                  placeHolder="City or Zip Code"
                  onResult={handleLocationSelect}
                />
              </div>
            )}
            <Button onClick={handleSubmit} disabled={!location} className="w-full mt-4 sm:mt-0 sm:ml-4">
              Find Games
            </Button>
          </div>
        </div>
      </main>
    </>
  );
};

function SSRPlaceHolder() {
  return (
    <div className="mapboxgl-ctrl-geocoder mapboxgl-ctrl">
      <input type="text" className="mapboxgl-ctrl-geocoder--input"></input>
    </div>
  );
}

export default Home;
