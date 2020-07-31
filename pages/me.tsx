import React, { useEffect } from 'react';
import { NextPage } from 'next';
import MetaTags from '../components/MetaTags';
import { UserRequestedDoc } from './api/_models/user-model';
import { useRouter } from 'next/router';

const Profile: NextPage<{ user?: UserRequestedDoc }> = ({ user }) => {
  const router = useRouter();
  useEffect(() => {
    if (!user) {
      router.push('/api/auth/login');
    }
  }, []);
  return (
    <>
      <MetaTags title={'home title'} description={'this is a description'} />
      <div className="container" data-testid="home-container">
        This is the user profile from {user && user.name}
      </div>
    </>
  );
};

export default Profile;
