import React, { SyntheticEvent, useState } from 'react';
import { NextPage } from 'next';

import MetaTags from '../components/MetaTags';
import { useRouter } from 'next/router';
import GeoCodeAutoComplete from '../components/GeoCodeAutoComplete';
import placeNameFormatter from '../utils/placeNameFormatter';
import { createPlace } from '../services/place-service';
import Button from '../components/Button';

const Home: NextPage = () => {
  const router = useRouter();
  const [location, setLocation] = useState(null);

  async function handleLocationSelect(mapboxResults: any) {
    const placeName = placeNameFormatter(mapboxResults['place_name_en-US']);
    await createPlace({
      slug: placeName,
      text: mapboxResults.id.includes('postcode') ? mapboxResults.context[0].text : mapboxResults.text,
      center: { type: 'Point', coordinates: mapboxResults.center },
    });
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
          <GeoCodeAutoComplete id="homepage-search" placeHolder="City or Zip Code" onResult={handleLocationSelect} />
          <Button onClick={handleSubmit} disabled={!location}>
            Find Games
          </Button>
        </form>
      </div>
    </>
  );
};

export default Home;
