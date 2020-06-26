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
    const placeName = slugify(mapboxResults['place_name_en-US']);
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
      <div
        data-testid="home-container"
        className="flex flex-col items-center mt-10"
        style={{ height: 'calc(100vh - 64px - 4rem)' }}
      >
        <h1 className="text-5xl text-center">HoopSpots</h1>
        <h2 className="text-center mb-4">Pickup basketball near you</h2>
        <form className="flex flex-col justify-center items-center">
          {isServer() ? (
            <SSRPlaceHolder />
          ) : (
            <div className="mb-4">
              <GeoCodeAutoComplete
                id="homepage-search"
                placeHolder="City or Zip Code"
                onResult={handleLocationSelect}
              />
            </div>
          )}
          <Button onClick={handleSubmit} disabled={!location}>
            Find Games
          </Button>
        </form>
      </div>
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
