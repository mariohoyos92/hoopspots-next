import React, { useState } from 'react';
import { format } from 'date-fns';
import Button from '../Button';
import DatePicker from 'react-datepicker';
import { createCourt, CreateCourtParams } from '../../services/court-service';
import isServer from '../../utils/isServer';
import { checkDateInput } from '../../utils/checkDateInput';

const initialValues = {
  gameName: '',
  date: null,
  startTime: null,
  endTime: null,
  description: '',
};

const NAME_NAME = 'gameName';
const DATE_NAME = 'date';
const START_TIME_NAME = 'startTime';
const END_TIME_NAME = 'endTime';
const DESCRIPTION_NAME = 'description';

const GameForm: React.FC = () => {
  const [form, setForm] = useState(initialValues);
  const { gameName, startTime, date, endTime, description } = form;

  console.log({ form });
  async function handleSubmit(e) {
    e.preventDefault();
    console.log('here');
    // const court = await createCourt(({ ...form, geoLocationData: selectedAddress } as unknown) as CreateCourtParams);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  const supportsDateAndTimePickers = checkDateInput();

  return (
    <form onSubmit={handleSubmit}>
      <div className="shadow overflow-hidden sm:rounded-md">
        <div className="px-4 py-5 bg-white sm:p-6">
          <div className="grid grid-cols-6 gap-6">
            <div className="col-span-6 sm:col-span-4">
              <label htmlFor={NAME_NAME} className="block text-sm font-medium leading-5 text-gray-700">
                Name*
              </label>
              <input
                id={NAME_NAME}
                name={NAME_NAME}
                placeholder="Chill Full-Court 5v5"
                required
                className="mt-1 form-input block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
              />
            </div>

            <div className="col-span-6 sm:col-span-4">
              <label htmlFor={DATE_NAME} className="block text-sm font-medium leading-5 text-gray-700">
                Date*
              </label>
              {
                // TODO: ABSTRACT SOME OF THIS ANNOYING ASS LOGIC AWAY
                // The safari fallback changehandler works differently, so account for that
              }
              {supportsDateAndTimePickers ? (
                <input
                  id={DATE_NAME}
                  name={DATE_NAME}
                  min={format(Date.now(), 'yyyy-MM-dd')}
                  required
                  type="date"
                  className="mt-1 form-input block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                />
              ) : (
                <DatePicker
                  selected={date}
                  onChange={handleChange}
                  className="mt-1 form-input block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                />
              )}
            </div>

            <div className="col-span-6 sm:col-span-3">
              <label htmlFor={START_TIME_NAME} className="block text-sm font-medium leading-5 text-gray-700">
                Start time*
              </label>
              {checkDateInput() ? (
                <input
                  id={START_TIME_NAME}
                  name={START_TIME_NAME}
                  type="time"
                  required
                  onChange={handleChange}
                  className="mt-1 form-input block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                />
              ) : (
                'Does not support datetime'
              )}
            </div>

            <div className="col-span-6 sm:col-span-3">
              <label htmlFor={END_TIME_NAME} className="block text-sm font-medium leading-5 text-gray-700">
                End time*
              </label>
              <input
                id={END_TIME_NAME}
                name={END_TIME_NAME}
                min={startTime}
                type="time"
                required
                onChange={handleChange}
                className="mt-1 block form-select w-full py-2 px-3 py-0 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
              />
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
          <Button>Save</Button>
        </div>
      </div>
    </form>
  );
};

export default GameForm;
