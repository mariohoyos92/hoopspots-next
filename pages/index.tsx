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
  // TODO: pick it up from here!

  async function handleEmailSignup(e: SyntheticEvent) {
    e.preventDefault();
  }
  return (
    <>
      <MetaTags title={'HoopSpots'} description={'Find pickup basketball games near you.'} />
      <main className="max-w-screen-xl px-4 mx-auto mt-10 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 xl:mt-28">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold leading-10 tracking-tight text-gray-900 sm:text-5xl sm:leading-none md:text-6xl">
            Hoop<span className="text-red-600">Spots</span>
          </h1>
          {/* <p className="max-w-md mx-auto mt-3 text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Pickup basketball at your fingertips.
          </p> */}
          <p className="max-w-md mx-auto mt-3 text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            🚧👷 Under Construction 👷🚧
            <br />
            Drop your email below to get alerted when it's ready
          </p>
          <div className="mt-4 sm:flex sm:items-center sm:justify-center">
            <div className="w-full max-w-sm">
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <div className="relative rounded-md shadow-sm">
                <input
                  id="email"
                  type="email"
                  className="block w-full form-input sm:text-sm sm:leading-5"
                  placeholder="you@example.com"
                />
              </div>
            </div>
            <span className="inline-flex mt-3 rounded-md shadow-sm sm:mt-0 sm:ml-3 sm:w-auto">
              <Button onClick={handleEmailSignup}>Sign Up</Button>
            </span>
          </div>
          <div className="max-w-md mx-auto mt-5 sm:flex sm:justify-center md:mt-8">
            {/* {isServer() ? (
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
            </Button> */}
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
