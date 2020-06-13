import React, { useState } from 'react';
import GeoCodeAutoComplete from '../GeoCodeAutoComplete';
import Button from '../Button';
import { createCourt, CreateCourtParams } from '../../services/court-service';
import { CourtRequestedDoc } from '../../pages/api/_models/court-model';
import { getMiles } from '../../utils/distanceConversions';

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
const EXISTING_COURT_NAME = 'existingCourt';

const CourtForm: React.FC<{
  onCourtSelect: (court: CourtRequestedDoc) => void;
  courtsNearUser?: [CourtRequestedDoc];
  selectedCourt?: CourtRequestedDoc;
}> = ({ onCourtSelect, courtsNearUser, selectedCourt }) => {
  console.log({ selectedCourt });
  const [form, setForm] = useState(initialValues);
  const [selectedPremadeCourt, setSelectedPremadeCourt] = useState(selectedCourt);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [submittingCourt, setSubmittingCourt] = useState(false);

  const { courtName, publicPrivate, indoorOutdoor, description } = form;

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmittingCourt(true);
    const court = await createCourt(({ ...form, geoLocationData: selectedAddress } as unknown) as CreateCourtParams);
    setSubmittingCourt(false);
    onCourtSelect(court);
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

  function handlePremadeCourtSelect(e) {
    setSelectedPremadeCourt(courtsNearUser.find(court => court._id === e.target.value));
  }

  function handlePremadeCourtSubmit(e) {
    e.preventDefault();
    onCourtSelect(selectedPremadeCourt);
  }

  return (
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
        {courtsNearUser?.length > 0 && (
          <form onSubmit={handlePremadeCourtSubmit}>
            <div className="shadow sm:rounded-md sm:overflow-hidden">
              <div className="px-4 py-5 bg-white sm:p-6">
                <label htmlFor={EXISTING_COURT_NAME} className="block text-md font-medium leading-6 text-gray-900">
                  Existing court
                </label>

                <select
                  id={EXISTING_COURT_NAME}
                  className="mt-1 block form-select w-full py-2 px-3 py-0 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  name={EXISTING_COURT_NAME}
                  onChange={handlePremadeCourtSelect}
                  value={selectedPremadeCourt?._id}
                >
                  {courtsNearUser.map(court => (
                    <option value={court._id} key={court._id}>
                      {court.courtName} - {`${getMiles(court.distanceInMeters).toFixed(1)} miles away`}
                    </option>
                  ))}
                </select>
              </div>
              <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
                <span className="inline-flex rounded-md shadow-sm">
                  <Button type="submit" disabled={submittingCourt}>
                    Use this court
                  </Button>
                </span>
              </div>
            </div>
          </form>
        )}
        <div className="mt-5 md:col-span-2">
          <form onSubmit={handleSubmit}>
            <div className="shadow sm:rounded-md sm:overflow-hidden">
              <div className="px-4 py-5 bg-white sm:p-6">
                <h3 className="text-md font-medium leading-6 text-gray-900 mb-2">New Court</h3>
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
                  <Button type="submit" disabled={submittingCourt}>
                    Save
                  </Button>
                </span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CourtForm;
