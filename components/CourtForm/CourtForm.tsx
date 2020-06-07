import React, { useState } from 'react';
import GeoCodeAutoComplete from '../GeoCodeAutoComplete';
import Button from '../Button';
import { createCourt, CreateCourtParams } from '../../services/court-service';

const initialValues = {
  courtName: '',
  geoLocationData: null,
  indoorOutdoor: 'outdoor',
  publicPrivate: 'public',
  description: '',
};

const NAME_NAME = 'courtName';
const INDOOR_OUTDOOR_NAME = 'indoorOutdoor';
const PUBLIC_PRIVATE_NAME = 'publicPrivate';
const DESCRIPTION_NAME = 'description';

const CourtForm: React.FC<{ onCourtSelect: (courtId: string) => void }> = ({ onCourtSelect }) => {
  const [form, setForm] = useState(initialValues);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const { courtName, publicPrivate, indoorOutdoor, description } = form;

  async function handleSubmit(e) {
    e.preventDefault();

    const court = await createCourt(({ ...form, geoLocationData: selectedAddress } as unknown) as CreateCourtParams);
    console.log({ court });
    onCourtSelect(court.id);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleAddressSelect(mapboxResult) {
    setSelectedAddress({
      id: mapboxResult.id,
      center: mapboxResult.center,
      text: mapboxResult.text,
      placeName: mapboxResult['place_name_en-US'],
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="shadow sm:rounded-md sm:overflow-hidden">
        <div className="px-4 py-5 bg-white sm:p-6">
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-3 sm:col-span-2">
              <label htmlFor={NAME_NAME} className="block text-sm font-medium leading-5 text-gray-700">
                Name*
              </label>
              <input
                id={NAME_NAME}
                name={NAME_NAME}
                className="mt-1 form-input block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                placeholder="Hawthorne Elementary Playground"
                required
                value={courtName}
                onChange={handleChange}
                minLength={5}
              />
            </div>
            <div className="col-span-3 sm:col-span-2">
              <label htmlFor="court_address" className="block text-sm font-medium leading-5 text-gray-700">
                Address*
              </label>
              <div className="mt-1 flex shadow-sm">
                <GeoCodeAutoComplete
                  id="court_address"
                  placeHolder="1234 W. Cleveland Ave, Elkhart, IN 46516"
                  className="w-full"
                  name="court_address"
                  types={['address']}
                  onResult={handleAddressSelect}
                />
              </div>
            </div>
            <div className="col-span-3 sm:col-span-2">
              <label htmlFor={INDOOR_OUTDOOR_NAME} className="block text-sm font-medium leading-5 text-gray-700">
                Indoor / Outdoor*
              </label>
              <select
                id={INDOOR_OUTDOOR_NAME}
                className="mt-1 block form-select w-full py-2 px-3 py-0 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                required
                name={INDOOR_OUTDOOR_NAME}
                onChange={handleChange}
                value={indoorOutdoor}
              >
                <option value="indoor">Indoor</option>
                <option value="outdoor">Outdoor</option>
                <option value="both_or_multiple">Both/Multiple Courts</option>
              </select>
            </div>
            <div className="col-span-3 sm:col-span-2">
              <label htmlFor={PUBLIC_PRIVATE_NAME} className="block text-sm font-medium leading-5 text-gray-700">
                Public / Private*
              </label>
              <select
                id={PUBLIC_PRIVATE_NAME}
                name={PUBLIC_PRIVATE_NAME}
                value={publicPrivate}
                onChange={handleChange}
                className="mt-1 block form-select w-full py-2 px-3 py-0 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>
          </div>

          <div className="mt-6">
            <label htmlFor={DESCRIPTION_NAME} className="block text-sm leading-5 font-medium text-gray-700">
              Description
            </label>
            <div className="rounded-md shadow-sm">
              <textarea
                id={DESCRIPTION_NAME}
                name={DESCRIPTION_NAME}
                rows={3}
                value={description}
                className="form-textarea mt-1 block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                placeholder="Add anything else hoopers might care about like 'This is an elementary school so only available after-school'"
                onChange={handleChange}
              ></textarea>
            </div>
          </div>
        </div>
        <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
          <span className="inline-flex rounded-md shadow-sm">
            <Button type="submit">Save</Button>
          </span>
        </div>
      </div>
    </form>
  );
};

export default CourtForm;
