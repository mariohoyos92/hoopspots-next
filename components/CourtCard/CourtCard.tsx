import React from 'react';
import LocationMarker from '../Icons/LocationMarker';
import { uppercaseFirst } from '../../utils/uppercaseFirst';
import { CourtRequestedDoc } from '../../pages/api/_models/court-model';
import ClickToCopy from '../ClickToCopy';

const CourtCard: React.FC<{ court: CourtRequestedDoc }> = ({
  court: { geoLocationData, courtName, indoorOutdoor, publicPrivate },
}) => {
  const addressPieces = geoLocationData.placeName.split(',');
  return (
    <div className="flex">
      <div className="h-5 w-5 mr-2 mt-1 text-gray-400">
        <LocationMarker />
      </div>
      <div>
        <span className="font-medium">{courtName}</span>
        <br />
        {addressPieces[0]}
        <br />
        <div className="flex">
          <span className="mr-2">
            {addressPieces[1]}, {addressPieces[2]}
          </span>{' '}
          <ClickToCopy textToCopy={geoLocationData.placeName} />
        </div>
        <div className="font-medium mt-2">
          {uppercaseFirst((indoorOutdoor as unknown) as string)}, {uppercaseFirst((publicPrivate as unknown) as string)}
        </div>
      </div>
    </div>
  );
};

export default CourtCard;
