import React, { useState, useEffect } from 'react';
import auth0 from '../lib/auth0';
import { NextPage } from 'next';
import MetaTags from '../components/MetaTags';
import { IClaims } from '@auth0/nextjs-auth0/dist/session/session';
import { getUserProfile } from '../services/user-service';
import { User } from './api/_models/user-model';

const Profile: NextPage<{ user: IClaims }> = ({ user }) => {
  const [userProfile, setUserProfile] = useState<User>(null);

  const fetchUserProfile = async () => {
    const { data: fetchedUserProfile } = await getUserProfile();
    console.log(fetchedUserProfile);
    // Need to setup mongo stuff!
    setUserProfile(fetchedUserProfile);
  };

  console.log({ user });

  useEffect(() => {
    fetchUserProfile();
  }, []);
  return (
    <>
      <MetaTags title={'home title'} description={'this is a description'} />
      <div className="container" data-testid="home-container">
        This is the user profile from {userProfile && userProfile.name}
      </div>
    </>
  );
};

Profile.getInitialProps = async ({ req, res }) => {
  if (typeof window === 'undefined') {
    const response = await auth0.getSession(req);
    if (!response || !response.user) {
      res.writeHead(302, {
        Location: '/api/auth/login',
      });
      res.end();
      return;
    }

    return { user: response.user };
  }
};

export default Profile;
