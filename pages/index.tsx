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
      router.push(`/gamefinder/[slug]`, `/gamefinder/${location}`);
    }
  }
  return (
    <>
      <MetaTags title={'home title'} description={'this is a description'} />
      <div data-testid="home-container">
        <h1>Welcome to HoopSpots!</h1>
        <h2>Pickup basketball at your fingertips.</h2>
        <form>
          <p>Enter your city or zip code</p>
          {isServer() ? (
            <SSRPlaceHolder />
          ) : (
            <GeoCodeAutoComplete id="homepage-search" placeHolder="City or Zip Code" onResult={handleLocationSelect} />
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
