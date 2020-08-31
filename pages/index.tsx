import React, { SyntheticEvent, useState } from 'react';
import { NextPage } from 'next';

import MetaTags from '../components/MetaTags';
import { useRouter } from 'next/router';
import GeoCodeAutoComplete from '../components/GeoCodeAutoComplete';
import slugify from '../utils/slugify';
import Button from '../components/Button';
import isServer from '../utils/isServer';
import Axios from 'axios';

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
  const [signedUp, setSignedUp] = useState(false);
  const [signupForm, setSignupForm] = useState({ email: '', hooperName: '' });

  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  async function handleEmailSignup(e: SyntheticEvent) {
    e.preventDefault();
    try {
      const res = await Axios.post('/api/launch-signup', signupForm);
      setResponse(res.data);
      setSignedUp(true);
    } catch (error) {
      console.log('error signing up');
      setError(error);
    }
  }

  function handleChange(e: SyntheticEvent<HTMLInputElement>) {
    // @ts-ignore
    setSignupForm({ ...signupForm, [e.target.name]: e.target.value });
  }

  return (
    <>
      <MetaTags
        title={'HoopSpots | Pickup basketball at your fingertips'}
        description={
          'Find or create pickup basketball games in your area. Built by hoopers, for hoopers, Hoopspots is the place to find your next ball session.'
        }
      />
      <main className="max-w-screen-xl px-4 mx-auto mt-10 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 xl:mt-28">
        <div className="text-center">
          <h1 className="text-5xl font-extrabold leading-10 tracking-tight text-gray-900 sm:text-5xl sm:leading-none md:text-6xl">
            Hoop<span className="text-red-600">Spots</span>
          </h1>
          {/* <p className="max-w-md mx-auto mt-3 text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Pickup basketball at your fingertips.
          </p> */}
          {!response ? (
            <p className="max-w-md mx-auto mt-3 text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Claim your hooper-name now! 🏀
            </p>
          ) : (
            <p className="max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              <br />
              <span className="font-bold">Thank you, {response.hooperName}! 🙌</span>
              <br />
              <br />
              You are hooper #<span className="font-bold">{response.users}!</span>
              <br />
            </p>
          )}

          {!signedUp ? (
            <form className="flex flex-col items-center justify-center mt-4 text-left" onSubmit={handleEmailSignup}>
              <div className="w-full max-w-sm">
                <label htmlFor="email">Email</label>
                <div className="relative mt-1 mb-4 rounded-md shadow-sm">
                  <input
                    id="email"
                    type="email"
                    name="email"
                    className="block w-full form-input sm:text-sm sm:leading-5"
                    placeholder="you@example.com"
                    onChange={handleChange}
                    value={signupForm.email}
                  />
                </div>
              </div>
              <div className="w-full max-w-sm mb-4">
                <label htmlFor="hoopername">Hooper-name</label>
                <div className="relative mt-1 rounded-md shadow-sm">
                  <input
                    id="hoopername"
                    type="text"
                    name="hooperName"
                    required
                    pattern="[a-zA-Z0-9]+"
                    className="block w-full form-input sm:text-sm sm:leading-5"
                    placeholder="LebronJames"
                    onChange={handleChange}
                    value={signupForm.hooperName}
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500" id="email-description">
                  Alphanumeric characters and underscores only
                </p>
              </div>
              {error ? (
                <p className="text-sm text-red-600" id="email-error">
                  Email or hoopername already taken
                </p>
              ) : null}
              <span className="inline-flex mt-4 rounded-md shadow-sm sm:mt-0 sm:ml-3 sm:w-auto">
                <Button type="submit">Sign Up</Button>
              </span>
            </form>
          ) : null}
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
        <footer className="text-center">
          Built by{' '}
          <a className="text-red-700" href="https://twitter.com/marioahoyos" rel="noopener noreferrer" target="_blank">
            @marioahoyos
          </a>
        </footer>
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
