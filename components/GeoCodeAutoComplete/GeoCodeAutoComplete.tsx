import React, { useEffect, useRef, useState } from 'react';
import MapBoxGeocoder from '@mapbox/mapbox-gl-geocoder';

import slugify from '../../utils/slugify';
import { createPlace } from '../../services/place-service';
import { setToStorage } from '../../utils/browserStorageHelpers';

type MapBoxDataType =
  | 'country'
  | 'region'
  | 'postcode'
  | 'district'
  | 'place'
  | 'locality'
  | 'neighborhood'
  | 'address'
  | 'poi';

interface Props {
  placeHolder?: string;
  id: string;
  onResult: (result) => void;
  types?: MapBoxDataType[];
  className?: string;
  name?: string;
}

const GeoCodeAutoComplete: React.FC<Props> = ({ placeHolder, id, onResult, types, className }) => {
  const geocoderRef = useRef(null);
  const [geoCoderPresent, setGeoCoderPresent] = useState(false);
  useEffect(() => {
    if (geocoderRef && !geoCoderPresent) {
      const GeoCoder = new MapBoxGeocoder({
        accessToken: 'pk.eyJ1IjoiaG9vcHNwb3RzIiwiYSI6ImNrNTh0YjF5aTBzN2UzbXA3bzEwbmE3Z2oifQ.DmSdp-kXFZWW526IpUNhlQ',
        placeholder: placeHolder,
        types: (types && types.join(',')) || 'place,postcode',
      });
      GeoCoder.on('result', async ({ result }) => {
        const mapboxPlaceName = result['place_name_en-US'] || result['place_name_en-us'];
        const placeName = slugify(mapboxPlaceName);
        await createPlace({
          slug: placeName,
          text: result.id.includes('postcode') ? result.context[0].text : result.text,
          center: { type: 'Point', coordinates: result.center },
          mapboxId: result.id,
          mapboxPlaceName,
        });
        setToStorage({
          type: 'localStorage',
          key: 'lastSearchedLocation',
          value: result,
          expiry: { unit: 'days', value: 365 },
        });
        result.mapboxPlaceName = mapboxPlaceName;
        onResult(result);
      });
      GeoCoder.addTo(`#${id}`);
      setGeoCoderPresent(true);
    }
  }, []);
  return <div id={id} className={className} ref={geocoderRef}></div>;
};

export default GeoCodeAutoComplete;
