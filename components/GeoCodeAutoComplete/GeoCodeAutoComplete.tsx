import React, { useEffect, useRef, useState } from 'react';
import MapBoxGeocoder from '@mapbox/mapbox-gl-geocoder';

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
}

const GeoCodeAutoComplete: React.FC<Props> = ({ placeHolder, id, onResult, types }) => {
  const geocoderRef = useRef(null);
  const [geoCoderPresent, setGeoCoderPresent] = useState(false);
  useEffect(() => {
    if (geocoderRef && !geoCoderPresent) {
      const GeoCoder = new MapBoxGeocoder({
        accessToken: 'pk.eyJ1IjoiaG9vcHNwb3RzIiwiYSI6ImNrNTh0YjF5aTBzN2UzbXA3bzEwbmE3Z2oifQ.DmSdp-kXFZWW526IpUNhlQ',
        placeholder: placeHolder,
        types: (types && types.join(',')) || 'place,postcode',
      });
      GeoCoder.on('result', ({ result }) => onResult(result));
      GeoCoder.addTo(`#${id}`);
      setGeoCoderPresent(true);
    }
  }, []);
  return <div id={id} ref={geocoderRef}></div>;
};

export default GeoCodeAutoComplete;
