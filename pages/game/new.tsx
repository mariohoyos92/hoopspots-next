import React, { useState } from 'react';
import { NextPage } from 'next';
import MetaTags from '../../components/MetaTags';
import { UserRequestedDoc } from '../api/_models/user-model';
import CourtForm from '../../components/CourtForm';
import GameForm from '../../components/GameForm';

const NewGamePage: NextPage<{ user: UserRequestedDoc }> = ({ user }) => {
  const [selectedCourtId, setSelectedCourtId] = useState(null);
  function onCourtSelect(courtId: string) {}
  return (
    <>
      <MetaTags title={'home title'} description={'this is a description'} />
      <div>
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h2 className="text-lg font-medium leading-6 text-gray-900">Court info</h2>
              <p className="mt-1 text-sm leading-5 text-gray-600">
                Are you playing in your driveway, indoor gym, or somewhere else? Find or create your court.
              </p>
            </div>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <CourtForm onCourtSelect={courtId => console.log(courtId)} />
          </div>
        </div>
      </div>

      <div className="hidden sm:block">
        <div className="py-5">
          <div className="border-t border-gray-200"></div>
        </div>
      </div>

      <div className="mt-10 sm:mt-0">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Game info</h3>
              <p className="mt-1 text-sm leading-5 text-gray-600">
                Are you planning on playing 5v5? Full-court? Tell us here!
              </p>
            </div>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <GameForm />
          </div>
        </div>
      </div>

      <div className="hidden sm:block">
        <div className="py-5">
          <div className="border-t border-gray-200"></div>
        </div>
      </div>
    </>
  );
};

export default NewGamePage;
