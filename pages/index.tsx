import React, { SyntheticEvent, useState } from 'react';
import axios from 'axios';
import { NextPage } from 'next';

import MetaTags from '../components/MetaTags';
import { useRouter } from 'next/router';

const Home: NextPage = () => {
  const router = useRouter();
  const [zipCode, setZipCode] = useState('');

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;
    if (value.length < 6) {
      setZipCode(value);
    }
  }

  async function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();
    if (zipCode.length === 5) {
      const { data } = await axios.get(
        `https://public.opendatasoft.com/api/records/1.0/search/?dataset=us-zip-code-latitude-and-longitude&q=${zipCode}`
      );

      if (data.nhits >= 1 && data.records.length >= 1) {
        const location = data.records[0];
        const { city, state } = location.fields;

        router.push(`/gamefinder/[placeName]`, `/gamefinder/${city}-${state}`);
      }
    }
  }
  return (
    <>
      <MetaTags title={'home title'} description={'this is a description'} />
      <a href="/api/auth/login">Login</a>
      <div className="container text-purple-500 leading-normal" data-testid="home-container">
        <h1>Welcome to HoopSpots!</h1>
        <h2>Pickup basketball at your fingertips.</h2>
        <form>
          <label htmlFor="homepage-zip">Enter your zip code</label>
          <input type="number" name="zip-code" id="homepage-zip" onChange={handleChange} value={zipCode} />
          <button onClick={handleSubmit}>Find Games</button>
        </form>
      </div>
    </>
  );
};

export default Home;
