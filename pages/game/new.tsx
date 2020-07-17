import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import MetaTags from '../../components/MetaTags';
import CourtForm from '../../components/CourtForm';
import GameForm from '../../components/GameForm';
import isServer from '../../utils/isServer';
import { getLastSearchedLocation } from '../../utils/browserStorageHelpers';
import { getCourts } from '../../services/court-service';
import { MapboxAddressFields, CourtRequestedDoc } from '../api/_models/court-model';
import { LeftArrow } from '../../components/Icons/LeftArrow';
import { scrollToTop } from '../../utils/scrollToTop';

const NewGamePage: NextPage<{ courtsNearLocation?: [CourtRequestedDoc] }> = ({ courtsNearLocation }) => {
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [showGameCard, setShowGameCard] = useState(false);
  const [fetchedClientSideCourtsNearLocation, setFetchedClientSideCourtsNearLocation] = useState(null);

  const setCourtsNearUserClientside = async () => {
    const courtsNearUser = await getCourtOptionsNearLastSearchedLocation();
    setFetchedClientSideCourtsNearLocation(courtsNearUser);
  };

  useEffect(() => {
    setCourtsNearUserClientside();
  }, []);

  async function onCourtSelect(court) {
    await setCourtsNearUserClientside();
    setSelectedCourt(court);
    setShowGameCard(true);
  }

  function handleBackToCourt() {
    setShowGameCard(false);
    scrollToTop();
  }

  return (
    <>
      <MetaTags title={'home title'} description={'this is a description'} />
      {!selectedCourt || !showGameCard ? (
        <CourtForm
          onCourtSelect={onCourtSelect}
          courtsNearUser={courtsNearLocation || fetchedClientSideCourtsNearLocation}
          selectedCourt={selectedCourt}
        />
      ) : (
        <>
          <button className="flex items-center mb-6" onClick={handleBackToCourt}>
            <LeftArrow />
            <span className="ml-2"> Back to court selection</span>
          </button>
          <GameForm court={selectedCourt} />
        </>
      )}
    </>
  );
};

async function getCourtOptionsNearLastSearchedLocation(): Promise<
  [CourtRequestedDoc & { distanceInMiles: number }] | undefined
> {
  const lastSearchedLocation = getLastSearchedLocation() as MapboxAddressFields;
  let courtsNearLocation;
  if (lastSearchedLocation) {
    // @ts-ignore
    courtsNearLocation = await getCourts((lastSearchedLocation.center as unknown) as Coordinates);
  }
  return courtsNearLocation;
}

NewGamePage.getInitialProps = async () => {
  let courtsNearLocation;
  if (!isServer()) {
    courtsNearLocation = await getCourtOptionsNearLastSearchedLocation();
  }
  return { courtsNearLocation };
};

export default NewGamePage;
