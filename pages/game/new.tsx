import React from 'react';
import { NextPage } from 'next';
import MetaTags from '../../components/MetaTags';
import { UserRequestedDoc } from '../api/_models/user-model';

const NewGamePage: NextPage<{ user: UserRequestedDoc }> = ({ user }) => {
  return (
    <>
      <MetaTags title={'home title'} description={'this is a description'} />
      <div className="container" data-testid="home-container">
        create a new game
      </div>
    </>
  );
};

export default NewGamePage;
