import React, { useEffect } from 'react';
import { NextPage } from 'next';
import MetaTags from '../../components/MetaTags';
import { UserRequestedDoc } from '../api/_models/user-model';
import { getUserByUserName } from '../api/_repositories/user-repository';
import { stringifyForNext } from '../../utils/stringifyForNext';

const Profile: NextPage<{ user?: UserRequestedDoc }> = ({ user }) => {
  return (
    <>
      <MetaTags title={'home title'} description={'this is a description'} />
      <div className="container" data-testid="home-container">
        This is the user profile from {user && user.name}
      </div>
    </>
  );
};

export async function getServerSideProps({ query }) {
  const user = stringifyForNext(await getUserByUserName(query.userName));
  return { props: { user } };
}
export default Profile;
